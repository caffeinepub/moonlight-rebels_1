import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetPartners, useGetCallerSubscription } from '../hooks/useQueries';
import PartnerCard from '../components/PartnerCard';
import SubscriptionCheckout from '../components/SubscriptionCheckout';
import LoginButton from '../components/LoginButton';
import { Loader2, Lock, Award } from 'lucide-react';

export default function PartnersPage() {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: partners, isLoading: partnersLoading } = useGetPartners();
  const { data: subscription, isLoading: subscriptionLoading } = useGetCallerSubscription();

  const isAuthenticated = !!identity;
  const hasActiveSubscription = subscription?.status === 'active';
  const isLoading = isInitializing || partnersLoading || subscriptionLoading;

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-moonlight-400 mx-auto mb-4" />
          <p className="text-muted-foreground">Loading partners...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 px-4">
      <div className="container max-w-6xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Award className="h-10 w-10 text-moonlight-400" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-moonlight-400 to-rebel-400 bg-clip-text text-transparent">
              Partners & Sponsors
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our amazing partners, sponsors, and affiliates who support the Moonlight Rebels community
          </p>
        </div>

        {!isAuthenticated && (
          <div className="mb-12 bg-card/50 backdrop-blur border border-border/40 rounded-xl p-8 text-center">
            <Lock className="h-12 w-12 text-moonlight-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Login to Access Premium Content</h2>
            <p className="text-muted-foreground mb-6">
              Some partners require a subscription to view full details
            </p>
            <LoginButton />
          </div>
        )}

        {isAuthenticated && !hasActiveSubscription && (
          <div className="mb-12">
            <SubscriptionCheckout />
          </div>
        )}

        {hasActiveSubscription && (
          <div className="mb-8 bg-gradient-to-r from-moonlight-500/20 to-rebel-500/20 border border-moonlight-500/30 rounded-xl p-6 text-center">
            <p className="text-lg font-semibold text-moonlight-400">
              ✨ Premium Member - Full Access Unlocked
            </p>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {partners && partners.length > 0 ? (
            partners.map((partner) => (
              <PartnerCard
                key={partner.id.toString()}
                partner={partner}
                hasSubscription={hasActiveSubscription}
              />
            ))
          ) : (
            <div className="col-span-2 text-center py-12 bg-card/50 backdrop-blur border border-border/40 rounded-xl">
              <p className="text-muted-foreground">No partners available yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
