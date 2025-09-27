import { BarChart3, Bot, Calendar, Palette, Target, Users } from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      title: 'AI Content Generation',
      description:
        'Create engaging posts, captions, and hashtags with our advanced AI that understands your brand voice.',
      icon: <Bot className='w-6 h-6' />,
      gradient: 'from-violet-500 to-purple-600',
      glowColor: 'rgba(139, 92, 246, 0.2)', // violet-500
      shadowColor: 'rgba(139, 92, 246, 0.4)',
    },
    {
      title: 'Smart Scheduling',
      description:
        'Optimal posting times based on your audience activity. Schedule weeks of content in minutes.',
      icon: <Calendar className='w-6 h-6' />,
      gradient: 'from-blue-500 to-cyan-600',
      glowColor: 'rgba(59, 130, 246, 0.2)', // blue-500
      shadowColor: 'rgba(59, 130, 246, 0.4)',
    },
    {
      title: 'Advanced Analytics',
      description:
        'Track engagement, reach, and ROI with detailed insights and actionable recommendations.',
      icon: <BarChart3 className='w-6 h-6' />,
      gradient: 'from-emerald-500 to-teal-600',
      glowColor: 'rgba(16, 185, 129, 0.2)', // emerald-500
      shadowColor: 'rgba(16, 185, 129, 0.4)',
    },
    {
      title: 'Multi-Platform',
      description:
        'Manage Instagram, TikTok, Twitter and Facebook from one powerful dashboard.',
      icon: <Target className='w-6 h-6' />,
      gradient: 'from-orange-500 to-red-600',
      glowColor: 'rgba(249, 115, 22, 0.2)', // orange-500
      shadowColor: 'rgba(249, 115, 22, 0.4)',
    },
    {
      title: 'Team Collaboration',
      description:
        'Invite team members, set permissions, and streamline your content approval workflow.',
      icon: <Users className='w-6 h-6' />,
      gradient: 'from-purple-500 to-pink-600',
      glowColor: 'rgba(139, 92, 246, 0.2)', // purple-500
      shadowColor: 'rgba(139, 92, 246, 0.4)',
    },
    {
      title: 'Brand Kit & Templates',
      description:
        'Maintain consistent branding with custom templates, fonts, colors, and brand assets.',
      icon: <Palette className='w-6 h-6' />,
      gradient: 'from-pink-500 to-rose-600',
      glowColor: 'rgba(236, 72, 153, 0.2)', // pink-500
      shadowColor: 'rgba(236, 72, 153, 0.4)',
    },
  ];

  return (
    <section className='py-12 relative'>
      <div className='container mx-auto px-6'>
        {/* Section Header */}
        <div className='text-center mb-20 py-3'>
          <h2 className='text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-8 tracking-tight'>
            <div className='mb-2'>Everything you need to</div>
            <div className='text-primary'>dominate social media</div>
          </h2>

          <div className='mx-auto max-w-3xl'>
            <p className='text-xl md:text-2xl text-muted-foreground leading-relaxed'>
              From AI-powered content creation to advanced analytics, our
              platform gives you all the tools to build a powerful social media
              presence.
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {features.map((feature, index) => (
            <div
              key={index}
              className='group relative'
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className='relative p-8 rounded-3xl bg-card/60 backdrop-blur-md border border-border transition-all duration-500 h-full overflow-hidden hover:-translate-y-2'>
                {/* Glow overlay on hover */}
                <div
                  className='absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none'
                  style={{
                    background: `linear-gradient(135deg, ${feature.glowColor}, transparent)`,
                  }}
                />

                {/* Subtle dot pattern */}
                <div className='absolute inset-0 opacity-[0.02] dark:opacity-[0.05]'>
                  <div
                    className='absolute inset-0'
                    style={{
                      backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
                      backgroundSize: '24px 24px',
                    }}
                  />
                </div>

                {/* Content */}
                <div className='relative z-10 flex flex-col items-center text-center h-full'>
                  {/* Icon */}
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-6 bg-gradient-to-br ${feature.gradient} group-hover:scale-110 transition-all duration-300 shadow-xl shadow-${feature.glowColor}`}
                  >
                    {feature.icon}
                  </div>

                  {/* Title & Description */}
                  <h3 className='text-xl font-bold mb-4 text-foreground'>
                    {feature.title}
                  </h3>
                  <p className='text-muted-foreground leading-relaxed'>
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
