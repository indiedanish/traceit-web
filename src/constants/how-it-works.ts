export interface HowItWorksItem {
  title: string;
  description: string;
  image: string;
}

export const HOW_IT_WORKS: HowItWorksItem[] = [
  {
    title: "Add Our Script",
    description:
      "Simply copy our lightweight tracking script and add it to your website's header or before the closing body tag.",
    image: "/images/hiw-one.svg",
  },
  {
    title: "Collect Data",
    description:
      "Our script automatically begins tracking visitor behavior, page views, traffic sources, and user journeys in real-time.",
    image: "/images/hiw-two.svg",
  },
  {
    title: "Gain Insights",
    description:
      "Access your comprehensive analytics dashboard to visualize data, identify trends, and make informed decisions to optimize your website.",
    image: "/images/hiw-three.svg",
  },
];
