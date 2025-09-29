import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PricingSection = () => {
  const tiers = [
    {
      name: 'Starter',
      priceMonthly: '$19',
      description:
        'Perfect for individuals and small businesses getting started with social media automation.',
      features: [
        '3 social media accounts',
        '50 scheduled posts per month',
        'Basic analytics dashboard',
        'AI content suggestions',
        'Email support',
      ],
      featured: false,
      buttonText: 'Get Started',
    },
    {
      name: 'Professional',
      priceMonthly: '$49',
      description:
        'Advanced features for growing businesses and marketing teams.',
      features: [
        '10 social media accounts',
        'Unlimited scheduled posts',
        'Advanced analytics & reporting',
        'AI content generation',
        'Team collaboration (5 members)',
        'Priority support',
        'Custom brand kit',
      ],
      featured: true,
      buttonText: 'Start Free Trial',
    },
    {
      name: 'Enterprise',
      priceMonthly: 'Custom',
      description:
        'Tailored solutions for large organizations with custom needs.',
      features: [
        'Unlimited social accounts',
        'Unlimited posts & content',
        'White-label solution',
        'Advanced API access',
        'Unlimited team members',
        'Dedicated account manager',
        'Custom integrations',
        '24/7 phone support',
      ],
      featured: false,
      buttonText: 'Contact Sales',
    },
  ];

  return (
    <section className='py-12 relative'>
      <div className='container mx-auto px-6'>
        <div className='mx-auto max-w-4xl text-center mb-20'>
          <div className='inline-flex items-center px-6 py-3 rounded-full bg-card/60 backdrop-blur-sm border border-border/50 mb-8 shadow-lg'>
            <span className='text-sm font-semibold text-primary tracking-wide uppercase'>
              Pricing
            </span>
          </div>

          <h2 className='text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6'>
            Choose Your <span className='text-primary'>Growth Plan</span>
          </h2>

          <p className='text-xl text-muted-foreground max-w-2xl mx-auto'>
            Start free and scale as you grow. All plans include our core
            automation features with no setup fees or hidden costs.
          </p>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto'>
          {tiers.map(tier => (
            <div
              key={tier.name}
              className={`relative flex flex-col rounded-3xl p-8 transition-all duration-500 hover:scale-105 min-h-[600px] ${
                tier.featured
                  ? 'bg-gradient-to-b from-primary/10 via-primary/10 to-accent/20 border-2 border-primary/30 shadow-2xl shadow-primary/20 lg:-translate-y-4'
                  : 'bg-card/60 backdrop-blur-md border border-border/50 hover:border-border/80 hover:bg-card/80'
              }`}
            >
              {tier.featured && (
                <div className='absolute -top-6 left-1/2 -translate-x-1/2'>
                  <div className='rounded-full bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground shadow-lg'>
                    Most Popular
                  </div>
                </div>
              )}

              <div className='flex flex-col flex-1'>
                <div className='text-center mb-8'>
                  <h3 className='text-2xl font-bold mb-4 text-foreground'>
                    {tier.name}
                  </h3>
                  <div className='mb-4'>
                    <span className='text-5xl font-bold text-foreground'>
                      {tier.priceMonthly}
                    </span>
                    {tier.priceMonthly !== 'Custom' && (
                      <span className='text-muted-foreground text-lg'>
                        /month
                      </span>
                    )}
                  </div>
                  <p className='text-muted-foreground leading-relaxed'>
                    {tier.description}
                  </p>
                </div>

                <ul className='space-y-4 flex-1 mb-8'>
                  {tier.features.map(feature => (
                    <li key={feature} className='flex items-start gap-3'>
                      <Check className='h-5 w-5 flex-shrink-0 text-primary mt-0.5' />
                      <span className='text-muted-foreground'>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  variant='outline'
                  size='lg'
                  className={`w-full rounded-2xl font-semibold transition-all duration-300 cursor-pointer ${
                    tier.featured
                      ? 'bg-primary hover:shadow-xl hover:shadow-primary/25 text-white'
                      : 'border border-border hover:bg-accent'
                  }`}
                >
                  {tier.buttonText}
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className='text-center mt-16 space-y-6'>
          <p className='text-muted-foreground text-lg'>
            All plans include a 14-day free trial. No credit card required.
            Cancel anytime.
          </p>
          <div className='flex flex-wrap justify-center gap-8 text-sm'>
            {['No setup fees', 'Cancel anytime', '24/7 support'].map(item => (
              <span
                key={item}
                className='flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 backdrop-blur-sm border border-border/30'
              >
                <Check className='h-4 w-4 text-primary' />
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
