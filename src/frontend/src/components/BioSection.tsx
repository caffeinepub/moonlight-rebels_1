import { Sparkles, Heart, Mic } from 'lucide-react';

export default function BioSection() {
  return (
    <section className="py-16 px-4">
      <div className="container max-w-4xl">
        <div className="bg-card/50 backdrop-blur border border-border/40 rounded-2xl p-8 md:p-12 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="h-6 w-6 text-moonlight-400" />
            <h2 className="text-3xl font-bold bg-gradient-to-r from-moonlight-400 to-rebel-400 bg-clip-text text-transparent">
              Meet Aurora
            </h2>
          </div>

          <div className="space-y-6 text-foreground/90 leading-relaxed">
            <p className="text-lg">
              Welcome to the world of <span className="font-semibold text-moonlight-400">Moonlight Rebels</span>, 
              where gaming transcends words. Aurora is a passionate gamer who proves that communication goes 
              far beyond voice—it's about connection, skill, and the pure joy of gaming.
            </p>

            <div className="flex items-start gap-4 p-4 bg-moonlight-500/10 border border-moonlight-500/20 rounded-lg">
              <Mic className="h-6 w-6 text-moonlight-400 flex-shrink-0 mt-1" />
              <p>
                As a <span className="font-semibold">medical mute gamer</span>, Aurora has turned what some 
                might see as a challenge into a unique strength. Through incredible gameplay, expressive 
                emotes, and creative communication, she's built a community that celebrates diversity and 
                proves that gaming is truly for everyone.
              </p>
            </div>

            <p>
              Every stream is an adventure filled with epic moments, genuine reactions, and a community 
              that supports each other. Whether it's conquering challenging raids, exploring new worlds, 
              or just having fun with friends, Aurora brings authenticity and heart to every session.
            </p>

            <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-moonlight-500/20 to-rebel-500/20 border border-moonlight-500/30 rounded-xl mt-8">
              <Heart className="h-8 w-8 text-rebel-400 flex-shrink-0" />
              <p className="text-lg font-medium">
                Join the Moonlight Rebels community and be part of something special. 
                Follow Aurora's journey and discover that the best stories are told through action, 
                not just words.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
