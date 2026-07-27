export interface PricingPlan {
  name: string;
  price: number;
  period: string;
  features: string[];
  highlighted: boolean;
}

export interface FAQItem {
  question: string;
  answer: string;
}
