import { SiTwitch } from 'react-icons/si';
import { Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const appIdentifier = encodeURIComponent(window.location.hostname || 'moonlight-rebels');

  return (
    <footer className="border-t border-border/40 bg-card/50 backdrop-blur">
      <div className="container py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>© {currentYear} Moonlight Rebels</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Built with</span>
            <Heart className="h-4 w-4 text-rebel-500 fill-rebel-500" />
            <span>using</span>
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appIdentifier}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground hover:text-moonlight-400 transition-colors"
            >
              caffeine.ai
            </a>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://www.twitch.tv/auroramoonveil"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-rebel-400 transition-colors"
            >
              <SiTwitch className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
