# Specification

## Summary
**Goal:** Build a Moonlight Rebels streamer website with dual authentication (owner/admin and regular users via Internet Identity), subscription management with Stripe, and a partner/sponsor/affiliate tracking system with pink and purple Twitch-themed design.

**Planned changes:**
- Implement owner/admin authentication using Internet Identity with protected admin routes
- Implement separate user authentication using Internet Identity for regular users
- Create partner/sponsor/affiliate tracking page with subscription-based access control
- Integrate Stripe payment processing in admin interface for subscription management
- Design pink and purple Twitch-themed interface matching Moonlight Rebels brand
- Add bio section explaining the story of a medical mute gamer girl with call-to-action
- Add button linking to Twitch channel (https://www.twitch.tv/auroramoonveil)
- Build backend to store partner/sponsor/affiliate data with categorization
- Implement subscription management system to track user subscription status and control access

**User-visible outcome:** Users can visit the Moonlight Rebels website to read the bio, follow the Twitch channel, and authenticate to view the partner/sponsor/affiliate tracking page (if subscribed). The owner can authenticate separately to access admin features including Stripe subscription management.
