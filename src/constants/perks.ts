export interface PerkItem {
  title: string;
  description: string;
  icon: string;
}

export const PERKS: PerkItem[] = [
  {
    title: "Real-time Tracking",
    description:
      "Monitor visitor activity as it happens with live dashboard updates.",
    icon: "/icons/perk-one.svg",
  },
  {
    title: "User Behavior",
    description:
      "Analyze click patterns, page views, and user journeys through your site.",
    icon: "/icons/perk-two.svg",
  },
  {
    title: "Traffic Sources",
    description:
      "Identify where your visitors come from - search engines, social media, or referrals.",
    icon: "/icons/perk-three.svg",
  },
  {
    title: "Simple Integration",
    description:
      "Just add one script tag to your website and start collecting data instantly.",
    icon: "/icons/perk-four.svg",
  },
];
