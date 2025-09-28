import { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface StatCardProps {
  title: string;
  description: string;
}

const StatCard = ({ title, description }: StatCardProps) => (
  <div className='w-full h-full p-3.5 rounded-xl border border-border hover:border-border/80 transition-all duration-700 ease-in-out flex-col justify-start items-start gap-2.5 inline-flex bg-card hover:bg-accent/50'>
    <h4 className='text-foreground text-2xl font-bold leading-9'>{title}</h4>
    <p className='text-muted-foreground text-base font-normal leading-relaxed'>
      {description}
    </p>
  </div>
);

export default function Aboutus() {
  const stats = [
    {
      title: '33+ Years',
      description: 'Influencing Digital Landscapes Together',
    },
    {
      title: '125+ Projects',
      description: 'Excellence Achieved Through Success',
    },
    {
      title: '26+ Awards',
      description: 'Our Dedication to Innovation Wins Understanding',
    },
    {
      title: '99% Happy Clients',
      description: 'Mirrors our Focus on Client Satisfaction.',
    },
  ];

  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <section className="py-24 relative xl:mr-0 lg:mr-5 mr-0 lg:bg-[url('/svg/bg.svg')] lg:bg-no-repeat lg:bg-top bg-cover">
      <div className='w-full max-w-7xl px-4 md:px-5 lg:px-5 mx-auto'>
        <div className='w-full justify-start items-center xl:gap-12 gap-10 grid lg:grid-cols-2 grid-cols-1'>
          {/* LEFT CONTENT */}
          <div className='w-full flex-col justify-center lg:items-start items-center gap-6 inline-flex'>
            <div className='w-full flex-col justify-center items-start gap-8 flex'>
              <div className='flex-col justify-start lg:items-start items-center gap-2 flex'>
                <h6 className='text-muted-foreground text-2xl font-bold leading-relaxed'>
                  About Us
                </h6>
                <div className='w-full flex-col justify-start lg:items-start items-center gap-2 flex'>
                  <h2 className='text-primary text-4xl font-bold leading-normal lg:text-start text-center'>
                    The Tale of Our Achievement Story
                  </h2>
                  <p className='text-muted-foreground text-base font-normal leading-relaxed lg:text-start text-center'>
                    Our achievement story is a testament to teamwork and
                    perseverance. Together, we've overcome challenges,
                    celebrated victories, and created a narrative of progress
                    and success.
                  </p>
                </div>
              </div>

              {/* STATS */}
              <div className='w-full flex-col justify-center items-start gap-6 flex'>
                <div className='w-full justify-start items-center gap-8 grid md:grid-cols-2 grid-cols-1'>
                  <StatCard {...stats[0]} />
                  <StatCard {...stats[1]} />
                </div>
                <div className='w-full h-full justify-start items-center gap-8 grid md:grid-cols-2 grid-cols-1'>
                  <StatCard {...stats[2]} />
                  <StatCard {...stats[3]} />
                </div>
              </div>
            </div>
          </div>

          <div className='w-full lg:justify-start justify-center items-start flex'>
            <div className='sm:w-[564px] w-full sm:h-[646px] h-full sm:bg-muted rounded-3xl sm:border border-border relative overflow-hidden'>
              {!imageLoaded && (
                <Skeleton className='absolute inset-0 w-full h-full rounded-3xl' />
              )}

              <img
                className={`sm:mt-5 sm:ml-5 w-full h-full rounded-3xl object-cover transition-opacity duration-700 ${
                  imageLoaded ? 'opacity-100' : 'opacity-20'
                }`}
                src='https://pagedone.io/asset/uploads/1717742431.png'
                alt='About Us - Our team working together'
                width={564}
                height={646}
                loading='lazy'
                onLoad={() => setImageLoaded(true)}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
