import { SiTwitch } from 'react-icons/si';
import { ExternalLink } from 'lucide-react';

export default function TwitchButton() {
  return (
    <a
      href="https://www.twitch.tv/auroramoonveil"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-rebel-500 to-moonlight-500 hover:from-rebel-600 hover:to-moonlight-600 text-white font-bold text-lg rounded-full shadow-2xl shadow-rebel-500/30 hover:shadow-rebel-500/50 transition-all transform hover:scale-105"
    >
      <SiTwitch className="h-6 w-6" />
      <span>Follow on Twitch</span>
      <ExternalLink className="h-5 w-5" />
    </a>
  );
}
