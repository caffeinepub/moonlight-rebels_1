import { useState } from 'react';
import { useCreateCheckoutSession } from '../hooks/useQueries';
import { toast } from 'sonner';
import { CreditCard, Loader2 } from 'lucide-react';
import type { ShoppingItem } from '../backend';

export default function SubscriptionCheckout() {
  const [isProcessing, setIsProcessing] = useState(false);
  const createCheckout = useCreateCheckoutSession();

  const handleSubscribe = async () => {
    setIsProcessing(true);
    
    const subscriptionItem: ShoppingItem = {
      productName: 'Moonlight Rebels Premium Subscription',
      productDescription: 'Access to exclusive partner, sponsor, and affiliate content',
      priceInCents: BigInt(999), // $9.99
      currency: 'usd',
      quantity: BigInt(1),
    };

    try {
      const session = await createCheckout.mutateAsync([subscriptionItem]);
      
      if (!session?.url) {
        throw new Error('Stripe session missing url');
      }

      // Redirect to Stripe checkout
      window.location.href = session.url;
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to create checkout session');
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-moonlight-500/10 to-rebel-500/10 border border-moonlight-500/30 rounded-xl p-8 shadow-xl">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold mb-2">Premium Subscription</h3>
        <p className="text-muted-foreground">
          Get exclusive access to partner and sponsor content
        </p>
      </div>

      <div className="bg-card/50 backdrop-blur rounded-lg p-6 mb-6">
        <div className="flex items-baseline justify-center gap-2 mb-4">
          <span className="text-4xl font-bold">$9.99</span>
          <span className="text-muted-foreground">/month</span>
        </div>
        
        <ul className="space-y-2 text-sm text-foreground/80">
          <li className="flex items-center gap-2">
            <span className="text-moonlight-400">✓</span>
            Access to all partner content
          </li>
          <li className="flex items-center gap-2">
            <span className="text-moonlight-400">✓</span>
            Exclusive sponsor information
          </li>
          <li className="flex items-center gap-2">
            <span className="text-moonlight-400">✓</span>
            Affiliate program details
          </li>
          <li className="flex items-center gap-2">
            <span className="text-moonlight-400">✓</span>
            Support the community
          </li>
        </ul>
      </div>

      <button
        onClick={handleSubscribe}
        disabled={isProcessing}
        className="w-full px-6 py-4 rounded-lg font-bold text-lg bg-gradient-to-r from-moonlight-500 to-rebel-500 hover:from-moonlight-600 hover:to-rebel-600 text-white shadow-lg shadow-moonlight-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
      >
        {isProcessing ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Processing...</span>
          </>
        ) : (
          <>
            <CreditCard className="h-5 w-5" />
            <span>Subscribe Now</span>
          </>
        )}
      </button>
    </div>
  );
}
