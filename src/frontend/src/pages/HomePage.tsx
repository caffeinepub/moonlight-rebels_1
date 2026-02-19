import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import ProfileSetupModal from '../components/ProfileSetupModal';
import BioSection from '../components/BioSection';
import TwitchButton from '../components/TwitchButton';
import { Sparkles, Users, Award } from 'lucide-react';
import { Link } from '@tanstack/react-router';

export default function HomePage() {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  return (
    <div className="relative">
      {showProfileSetup && <ProfileSetupModal onComplete={() => {}} />}

      {/* Hero Section */}
      <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(/assets/generated/hero-bg.dim_1920x600.png)' }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
        </div>

        <div className="relative z-10 container text-center px-4 py-20">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8 flex justify-center">
              <img 
                src="/assets/generated/logo.dim_400x400.png" 
                alt="Moonlight Rebels" 
                className="h-32 w-32 rounded-full ring-4 ring-moonlight-500/50 shadow-2xl shadow-moonlight-500/30"
              />
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-moonlight-400 via-rebel-400 to-moonlight-400 bg-clip-text text-transparent animate-pulse">
              Moonlight Rebels
            </h1>

            <p className="text-xl md:text-2xl text-foreground/80 mb-8 max-w-2xl mx-auto">
              Where gaming transcends words and community celebrates diversity
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <TwitchButton />
              <Link
                to="/partners"
                className="inline-flex items-center gap-2 px-8 py-4 bg-card/80 backdrop-blur border border-border hover:border-moonlight-500/50 text-foreground font-semibold text-lg rounded-full shadow-lg transition-all transform hover:scale-105"
              >
                <Award className="h-5 w-5 text-moonlight-400" />
                <span>View Partners</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Bio Section */}
      <BioSection />

      {/* Features Section */}
      <section className="py-16 px-4 bg-card/30">
        <div className="container max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-moonlight-400 to-rebel-400 bg-clip-text text-transparent">
            Join the Community
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card/50 backdrop-blur border border-border/40 rounded-xl p-6 text-center hover:border-moonlight-500/30 transition-all">
              <Sparkles className="h-12 w-12 text-moonlight-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Authentic Gaming</h3>
              <p className="text-muted-foreground">
                Experience genuine gameplay and real moments without barriers
              </p>
            </div>

            <div className="bg-card/50 backdrop-blur border border-border/40 rounded-xl p-6 text-center hover:border-rebel-500/30 transition-all">
              <Users className="h-12 w-12 text-rebel-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Inclusive Community</h3>
              <p className="text-muted-foreground">
                A welcoming space where everyone belongs and thrives together
              </p>
            </div>

            <div className="bg-card/50 backdrop-blur border border-border/40 rounded-xl p-6 text-center hover:border-moonlight-500/30 transition-all">
              <Award className="h-12 w-12 text-moonlight-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Premium Content</h3>
              <p className="text-muted-foreground">
                Access exclusive partnerships and support the community
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
