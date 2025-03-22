export type PlanFeature = {
  text: string;
  included: boolean;
};

export type Plan = {
  name: string;
  description: string;
  price: {
    monthly: number;
    yearly: number;
  };
  features: PlanFeature[];
  popular?: boolean;
};

export const PRICING_PLANS: Plan[] = [
  {
    name: "Open Source",
    description: "Free for everyone, forever",
    price: {
      monthly: 0,
      yearly: 0,
    },
    popular: true,
    features: [
      { text: "Unlimited websites", included: true },
      { text: "Unlimited pageviews", included: true },
      { text: "Real-time visitor tracking", included: true },
      { text: "Geographic location data", included: true },
      { text: "Browser & device analytics", included: true },
      { text: "Referrer & UTM tracking", included: true },
      { text: "Session recording", included: true },
      { text: "User journey mapping", included: true },
      { text: "Page performance metrics", included: true },
      { text: "Engagement analytics", included: true },
      { text: "Custom events", included: true },
      { text: "API access", included: true },
      { text: "Self-hostable", included: true },
      { text: "Privacy-focused", included: true },
      { text: "No data limits", included: true },
      { text: "Community support", included: true },
    ],
  },
];
