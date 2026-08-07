export interface PricingPlan {
  name: string;
  price: number;
  features: string[];
  isPopular?: boolean;
  buttonText: string;
  buttonVariant: 'primary' | 'outline';
}

export interface FAQItem {
  question: string;
  answer: string;
}

export const pricingPlans: PricingPlan[] = [
  {
    name: 'Starter',
    price: 19,
    features: ['Up to 5 projects', 'Basic analytics', '24-hour support response time'],
    buttonText: 'Choose Starter',
    buttonVariant: 'outline',
  },
  {
    name: 'Professional',
    price: 49,
    features: ['Unlimited projects', 'Advanced analytics & reports', '1-hour support response time', 'Custom domain'],
    isPopular: true,
    buttonText: 'Choose Professional',
    buttonVariant: 'primary',
  },
  {
    name: 'Enterprise',
    price: 99,
    features: ['Everything in Professional', 'Dedicated account manager', 'Phone support 24/7', 'Custom integration', 'SLA'],
    buttonText: 'Contact Sales',
    buttonVariant: 'outline',
  },
];

export const faqItems: FAQItem[] = [
  {
    question: 'How does pricing work?',
    answer: 'Our pricing is tier-based depending on the number of projects and features you need. You can start with our $19/mo plan and upgrade at any time. There are no hidden fees or long-term contracts.',
  },
  {
    question: 'Can I cancel my subscription at any time?',
    answer: "Yes, you can cancel your subscription at any time from your account settings. You'll continue to have access to your plan until the end of your billing cycle.",
  },
  {
    question: 'Do you offer a free trial?',
    answer: "We don't offer a free trial, but we do have a 14-day money-back guarantee. If you're not satisfied with AIFlow within the first 14 days, we'll give you a full refund.",
  },
  {
    question: 'What kind of support do you provide?',
    answer: 'All plans include email support. The Professional plan includes faster response times, and our Enterprise plan includes a dedicated account manager and 24/7 phone support.',
  },
];
