import { Button } from '@/components/ui/button';
import { ArrowRight, Play, Sparkles, Star, Users, Zap } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className='flex items-center justify-center overflow-hidden py-6 relative'>
      <div className='container mx-auto px-6 text-center relative z-10'>
        <div className='group relative inline-flex items-center gap-3 px-6 py-3 rounded-full backdrop-blur-xl bg-card/80 border border-border/50 text-sm font-medium shadow-2xl shadow-primary/10 hover:shadow-primary/20 transition-all duration-500 mb-8 hover:scale-105'>
          <div className='relative flex items-center gap-3 cursor-pointer'>
            <div className='relative'>
              <Sparkles className='w-4 h-4 text-yellow-500' />
              <div className='absolute inset-0 animate-ping'>
                <Sparkles className='w-4 h-4 text-yellow-500/50' />
              </div>
            </div>
            <span className='text-primary font-semibold'>
              New: AI-Powered Content Generation
            </span>
            <ArrowRight className='w-4 h-4 transition-transform group-hover:translate-x-1 text-primary' />
          </div>
        </div>

        <div className='relative mb-8 pointer-events-none'>
          <h1 className='text-5xl sm:text-6xl md:text-6xl lg:text-8xl font-bold tracking-tight mb-6 relative'>
            <span className='text-foreground'>Automate Your</span>
            <br />
            <span className='text-neon font-bold'>Social Media Success</span>
          </h1>
        </div>

        <p className='text-xl sm:text-2xl lg:text-3xl text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-12 font-light pointer-events-none'>
          Schedule posts, generate AI content, track performance, and grow your
          audience across all platforms. The complete social media automation
          platform for{' '}
          <span className='font-medium text-foreground'>modern businesses</span>
          .
        </p>

        <div className='flex flex-wrap justify-center gap-8 mb-12'>
          <div className='flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm border border-pr bg-primary-foreground/30 pointer-events-none'>
            <Star className='w-5 h-5 fill-yellow-500 text-yellow-500' />
            <span className='text-sm font-medium'>4.9/5 Rating</span>
          </div>
          <div className='flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm border border-pr bg-primary-foreground/30 pointer-events-none'>
            <Users className='w-5 h-5 text-blue-500' />
            <span className='text-sm font-medium'>50K+ Users</span>
          </div>
          <div className='flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm border border-pr bg-primary-foreground/30 pointer-events-none'>
            <Zap className='w-5 h-5 text-blue-600' />
            <span className='text-sm font-medium'>99.9% Uptime</span>
          </div>
        </div>

        <div className='flex flex-col sm:flex-row items-center justify-center gap-6'>
          <Button variant='outline' size='lg' className='cursor-pointer group'>
            <span className='flex items-center font-semibold'>
              Get Started Free
              <ArrowRight className='w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1' />
            </span>
          </Button>

          <Button variant='outline' size='lg' className='cursor-pointer'>
            <Play className='w-4 h-4 mr-2' />
            <span className='flex items-center font-semibold'>Watch Demo</span>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
