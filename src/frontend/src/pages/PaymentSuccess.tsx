import { useEffect } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    // Invalidate subscription queries to refresh data
    queryClient.invalidateQueries({ queryKey: ['currentUserSubscription'] });
    queryClient.invalidateQueries({ queryKey: ['partners'] });
  }, [queryClient]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center bg-card/50 backdrop-blur border border-border/40 rounded-2xl p-8 shadow-xl">
        <div className="mb-6">
          <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-moonlight-400 to-rebel-400 bg-clip-text text-transparent">
            Payment Successful!
          </h1>
          <p className="text-muted-foreground">
            Your subscription has been activated. Welcome to the premium community!
          </p>
        </div>

        <div className="space-y-3">
          <Link
            to="/partners"
            className="block w-full px-6 py-3 bg-gradient-to-r from-moonlight-500 to-rebel-500 hover:from-moonlight-600 hover:to-rebel-600 text-white rounded-lg font-medium transition-all"
          >
            <span className="flex items-center justify-center gap-2">
              View Partners
              <ArrowRight className="h-4 w-4" />
            </span>
          </Link>

          <Link
            to="/"
            className="block w-full px-6 py-3 bg-muted hover:bg-muted/80 text-foreground rounded-lg font-medium transition-all"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
