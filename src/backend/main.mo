import Text "mo:core/Text";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Stripe "stripe/stripe";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import OutCall "http-outcalls/outcall";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";

actor {
  // Authorization system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile Management
  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Partner, Sponsor, and Affiliate Management
  public type PartnerType = {
    #partner;
    #sponsor;
    #affiliate;
  };

  public type PartnerData = {
    id : Nat;
    name : Text;
    partnerType : PartnerType;
    details : Text;
    requiresSubscription : Bool;
    category : Text;
  };

  module PartnerData {
    public func compareById(x : PartnerData, y : PartnerData) : Order.Order {
      Nat.compare(x.id, y.id);
    };
  };

  var nextPartnerId = 0;
  let partners = Map.empty<Nat, PartnerData>();

  // Subscription Management
  public type SubscriptionStatus = {
    #active;
    #inactive;
    #expired;
  };

  public type UserSubscription = {
    userId : Principal;
    status : SubscriptionStatus;
    stripeSessionId : ?Text;
  };

  let userSubscriptions = Map.empty<Principal, UserSubscription>();

  // Stripe Configuration
  var stripeConfig : ?Stripe.StripeConfiguration = null;

  public shared ({ caller }) func addPartner(partner : PartnerData) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add partners/sponsors/affiliates");
    };

    let newPartner = {
      partner with
      id = nextPartnerId;
    };

    partners.add(newPartner.id, newPartner);
    nextPartnerId += 1;
    newPartner.id;
  };

  public query ({ caller }) func getPartners() : async [PartnerData] {
    let allPartners = partners.values().toArray().sort(PartnerData.compareById);
    
    // Check if user has active subscription
    let hasSubscription = switch (userSubscriptions.get(caller)) {
      case (?sub) { sub.status == #active };
      case (null) { false };
    };

    // Filter partners based on subscription requirement
    if (hasSubscription or AccessControl.isAdmin(accessControlState, caller)) {
      // Show all partners if user has subscription or is admin
      allPartners;
    } else {
      // Show only partners that don't require subscription
      allPartners.filter<PartnerData>(func(p) { not p.requiresSubscription });
    };
  };

  public shared ({ caller }) func updatePartner(id : Nat, updatedPartner : PartnerData) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update partners/sponsors/affiliates");
    };

    if (not partners.containsKey(id)) {
      Runtime.trap("Partner does not exist");
    };

    partners.add(id, { updatedPartner with id });
  };

  public shared ({ caller }) func deletePartner(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete partners/sponsors/affiliates");
    };

    if (not partners.containsKey(id)) {
      Runtime.trap("Partner does not exist");
    };

    partners.remove(id);
  };

  public shared ({ caller }) func createSubscription(partnerId : Nat, stripeSessionId : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can create subscriptions");
    };

    switch (partners.get(partnerId)) {
      case (null) { Runtime.trap("Partner does not exist") };
      case (?partner) {
        if (not partner.requiresSubscription) {
          Runtime.trap("This partner does not require a subscription");
        };

        let newSubscription : UserSubscription = {
          userId = caller;
          status = #active;
          stripeSessionId = ?stripeSessionId;
        };

        userSubscriptions.add(caller, newSubscription);
      };
    };
    "SubscriptionCreated";
  };

  public query ({ caller }) func getUserSubscription(user : Principal) : async ?UserSubscription {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own subscription");
    };
    userSubscriptions.get(user);
  };

  public query ({ caller }) func getCallerSubscription() : async ?UserSubscription {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view subscriptions");
    };
    userSubscriptions.get(caller);
  };

  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can configure Stripe");
    };
    stripeConfig := ?config;
  };

  func getStripeConfiguration() : Stripe.StripeConfiguration {
    switch (stripeConfig) {
      case (null) { Runtime.trap("Stripe needs to be first configured") };
      case (?value) { value };
    };
  };

  public query func isStripeConfigured() : async Bool {
    stripeConfig != null;
  };

  public shared ({ caller }) func createCheckoutSession(items : [Stripe.ShoppingItem], successUrl : Text, cancelUrl : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can create checkout sessions");
    };
    await Stripe.createCheckoutSession(getStripeConfiguration(), caller, items, successUrl, cancelUrl, transform);
  };

  public shared ({ caller }) func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can check session status");
    };
    
    // Verify the session belongs to the caller
    switch (userSubscriptions.get(caller)) {
      case (?sub) {
        switch (sub.stripeSessionId) {
          case (?id) {
            if (id != sessionId and not AccessControl.isAdmin(accessControlState, caller)) {
              Runtime.trap("Unauthorized: Can only check your own session status");
            };
          };
          case (null) {
            if (not AccessControl.isAdmin(accessControlState, caller)) {
              Runtime.trap("Unauthorized: Session not found for user");
            };
          };
        };
      };
      case (null) {
        if (not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: No subscription found");
        };
      };
    };
    
    await Stripe.getSessionStatus(getStripeConfiguration(), sessionId, transform);
  };

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };
};
