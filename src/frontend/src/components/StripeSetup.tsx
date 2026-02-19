import { useState } from 'react';
import { useSetStripeConfiguration } from '../hooks/useQueries';
import { toast } from 'sonner';
import { CreditCard, Loader2, CheckCircle } from 'lucide-react';

export default function StripeSetup() {
  const [secretKey, setSecretKey] = useState('');
  const [countries, setCountries] = useState('US,CA,GB');
  const setConfig = useSetStripeConfiguration();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!secretKey.trim()) {
      toast.error('Please enter your Stripe secret key');
      return;
    }

    const allowedCountries = countries.split(',').map(c => c.trim()).filter(c => c);
    if (allowedCountries.length === 0) {
      toast.error('Please enter at least one country code');
      return;
    }

    try {
      await setConfig.mutateAsync({
        secretKey: secretKey.trim(),
        allowedCountries,
      });
      toast.success('Stripe configured successfully!');
      setSecretKey('');
    } catch (error) {
      toast.error('Failed to configure Stripe');
      console.error(error);
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <CreditCard className="h-6 w-6 text-moonlight-400" />
        <h3 className="text-xl font-bold">Stripe Configuration</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="secretKey" className="block text-sm font-medium mb-2">
            Stripe Secret Key
          </label>
          <input
            id="secretKey"
            type="password"
            value={secretKey}
            onChange={(e) => setSecretKey(e.target.value)}
            placeholder="sk_test_..."
            className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-moonlight-500"
            disabled={setConfig.isPending}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Your Stripe secret key (starts with sk_test_ or sk_live_)
          </p>
        </div>

        <div>
          <label htmlFor="countries" className="block text-sm font-medium mb-2">
            Allowed Countries
          </label>
          <input
            id="countries"
            type="text"
            value={countries}
            onChange={(e) => setCountries(e.target.value)}
            placeholder="US,CA,GB"
            className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-moonlight-500"
            disabled={setConfig.isPending}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Comma-separated country codes (e.g., US,CA,GB,AU)
          </p>
        </div>

        <button
          type="submit"
          disabled={setConfig.isPending}
          className="w-full px-6 py-3 rounded-lg font-medium bg-gradient-to-r from-moonlight-500 to-rebel-500 hover:from-moonlight-600 hover:to-rebel-600 text-white shadow-lg shadow-moonlight-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          {setConfig.isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Configuring...</span>
            </>
          ) : (
            <>
              <CheckCircle className="h-4 w-4" />
              <span>Save Configuration</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
