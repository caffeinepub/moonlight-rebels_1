import { Badge } from '@/components/ui/badge';
import { Lock } from 'lucide-react';
import type { PartnerData } from '../backend';

interface PartnerCardProps {
  partner: PartnerData;
  hasSubscription: boolean;
}

export default function PartnerCard({ partner, hasSubscription }: PartnerCardProps) {
  const isLocked = partner.requiresSubscription && !hasSubscription;

  // Helper to get partner type string from variant
  const getPartnerTypeString = (partnerType: any): string => {
    if (partnerType.partner !== undefined) return 'partner';
    if (partnerType.sponsor !== undefined) return 'sponsor';
    if (partnerType.affiliate !== undefined) return 'affiliate';
    return 'partner';
  };

  const getTypeColor = (typeString: string) => {
    switch (typeString) {
      case 'partner':
        return 'bg-moonlight-500/20 text-moonlight-400 border-moonlight-500/30';
      case 'sponsor':
        return 'bg-rebel-500/20 text-rebel-400 border-rebel-500/30';
      case 'affiliate':
        return 'bg-chart-3/20 text-chart-3 border-chart-3/30';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const partnerTypeString = getPartnerTypeString(partner.partnerType);

  return (
    <div className={`
      bg-card border border-border rounded-xl p-6 shadow-lg transition-all
      ${isLocked ? 'opacity-60' : 'hover:shadow-xl hover:border-moonlight-500/30'}
    `}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
            {partner.name}
            {isLocked && <Lock className="h-4 w-4 text-muted-foreground" />}
          </h3>
          <div className="flex flex-wrap gap-2">
            <Badge className={getTypeColor(partnerTypeString)}>
              {partnerTypeString}
            </Badge>
            {partner.category && (
              <Badge variant="outline">
                {partner.category}
              </Badge>
            )}
          </div>
        </div>
      </div>

      <p className={`text-foreground/80 ${isLocked ? 'blur-sm select-none' : ''}`}>
        {isLocked ? 'Subscribe to view full details...' : partner.details}
      </p>

      {isLocked && (
        <div className="mt-4 p-3 bg-moonlight-500/10 border border-moonlight-500/20 rounded-lg">
          <p className="text-sm text-moonlight-400 font-medium">
            🔒 Premium content - Subscribe to unlock
          </p>
        </div>
      )}
    </div>
  );
}
