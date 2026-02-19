import { Link } from '@tanstack/react-router';
import { XCircle, ArrowLeft, RefreshCw } from 'lucide-react';

export default function PaymentFailure() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center bg-card/50 backdrop-blur border border-destructive/40 rounded-2xl p-8 shadow-xl">
        <div className="mb-6">
          <XCircle className="h-20 w-20 text-destructive mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Payment Cancelled</h1>
          <p className="text-muted-foreground">
            Your payment was not completed. No charges have been made to your account.
          </p>
        </div>

        <div className="space-y-3">
          <Link
            to="/partners"
            className="block w-full px-6 py-3 bg-gradient-to-r from-moonlight-500 to-rebel-500 hover:from-moonlight-600 hover:to-rebel-600 text-white rounded-lg font-medium transition-all"
          >
            <span className="flex items-center justify-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Try Again
            </span>
          </Link>

          <Link
            to="/"
            className="block w-full px-6 py-3 bg-muted hover:bg-muted/80 text-foreground rounded-lg font-medium transition-all"
          >
            <span className="flex items-center justify-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
