import { cn } from '@/lib/utils';
import { Marquee } from '@/components/ui/marquee';

const reviews = [
  {
    name: 'Sarah Chen',
    username: '@sarahc',
    body: 'This platform transformed how we handle customer feedback. The insights are incredible and actionable.',
    img: 'https://avatar.vercel.sh/sarah',
  },
  {
    name: 'Marcus Johnson',
    username: '@marcusj',
    body: 'Finally, a solution that actually listens to what our customers are saying. Game-changer for our business.',
    img: 'https://avatar.vercel.sh/marcus',
  },
  {
    name: 'Emily Rodriguez',
    username: '@emilyrod',
    body: 'The AI-powered analysis helped us identify issues we never knew existed. Highly recommend!',
    img: 'https://avatar.vercel.sh/emily',
  },
  {
    name: 'David Kim',
    username: '@davidk',
    body: 'Seamless integration with our existing workflow. The team adoption was surprisingly smooth.',
    img: 'https://avatar.vercel.sh/david',
  },
  {
    name: 'Lisa Thompson',
    username: '@lisat',
    body: 'Customer satisfaction scores improved by 40% after implementing their recommendations.',
    img: 'https://avatar.vercel.sh/lisa',
  },
  {
    name: 'Alex Rivera',
    username: '@alexr',
    body: 'The real-time dashboard gives us insights we can act on immediately. Fantastic product.',
    img: 'https://avatar.vercel.sh/alex',
  },
];

const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

const ReviewCard = ({
  img,
  name,
  username,
  body,
}: {
  img: string;
  name: string;
  username: string;
  body: string;
}) => {
  return (
    <figure
      className={cn(
        'relative h-full w-64 cursor-pointer overflow-hidden rounded-xl border p-4 transition-colors duration-200',
        'border-border bg-card hover:bg-accent/50'
      )}
    >
      <div className='flex flex-row items-center gap-2'>
        <img
          className='rounded-full ring-2 ring-border'
          width='32'
          height='32'
          alt={`${name}'s avatar`}
          src={img}
        />
        <div className='flex flex-col'>
          <figcaption className='text-sm font-medium text-foreground'>
            {name}
          </figcaption>
          <p className='text-xs font-medium text-muted-foreground'>
            {username}
          </p>
        </div>
      </div>
      <blockquote className='mt-2 text-sm text-muted-foreground leading-relaxed'>
        {body}
      </blockquote>
    </figure>
  );
};

export function MarqueeReview() {
  return (
    <div className='relative flex w-full flex-col items-center justify-center overflow-hidden bg-transparent py-10 mt-4'>
      <div className='mb-8 text-center'>
        <h2 className='text-3xl font-bold text-foreground mb-2'>
          What Our Customers Say
        </h2>
        <p className='text-muted-foreground'>
          Trusted by teams worldwide to transform their customer insights
        </p>
      </div>

      <Marquee pauseOnHover className='[--duration:20s] mb-4'>
        {firstRow.map(review => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>

      <Marquee reverse pauseOnHover className='[--duration:20s]'>
        {secondRow.map(review => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>

      <div className='pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background to-transparent'></div>
      <div className='pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background to-transparent'></div>
    </div>
  );
}
