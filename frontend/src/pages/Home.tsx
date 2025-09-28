import React from 'react';
import FeaturesSection from '@/components/home/FeaturesSection';
import HeroSection from '@/components/home/HeroSection';
import PricingSection from '@/components/home/PricingSection';

type Section = {
  id: string;
  component: React.ReactNode;
};

export default function Page() {
  const sections: Section[] = [
    {
      id: 'hero',
      component: <HeroSection />,
    },
    {
      id: 'features',
      component: <FeaturesSection />,
    },
    {
      id: 'pricing',
      component: <PricingSection />,
    },
  ];

  return (
    <div className='relative isolate py-24'>
      {sections.map(section => (
        <div id={section.id} key={section.id}>
          {section.component}
        </div>
      ))}
    </div>
  );
}
