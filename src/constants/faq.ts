export type FAQItem = {
  question: string;
  answer: string;
};

export const FAQS: FAQItem[] = [
  {
    question: "How does the website analytics tracking work?",
    answer:
      "Our platform uses a lightweight JavaScript snippet that you add to your website. Once installed, it automatically collects visitor data including page views, geographic location, device information, referral sources, and user behavior without affecting your site's performance.",
  },
  {
    question: "Is the analytics script easy to install?",
    answer:
      "Absolutely! Simply copy our tracking code and add it to your website's header or before the closing body tag. No technical expertise required. Most users can set it up in less than a minute, and data collection begins immediately.",
  },
  {
    question: "What kind of visitor data do you collect?",
    answer:
      "We track comprehensive visitor information including geographic location, browser type, operating system, device type, screen resolution, referral sources, UTM parameters, page load times, user journeys through your site, time on page, and scroll depth.",
  },
  {
    question: "Is my visitors' privacy protected?",
    answer:
      "Yes, we take privacy seriously. Our analytics platform is designed to be GDPR and CCPA compliant. We don't use cookies by default, don't track personally identifiable information, and provide tools to respect Do Not Track preferences and implement proper consent mechanisms.",
  },
  {
    question: "Can I track multiple websites?",
    answer:
      "Yes! You can add unlimited websites to your account and track them all from a single dashboard. Each website gets its own unique tracking code and separate analytics, making it easy to manage multiple projects.",
  },
  {
    question: "Is there a mobile app available?",
    answer:
      "Yes, we have both iOS and Android apps available. The mobile apps offer all core functionalities of the web platform, allowing you to monitor your website analytics on the go with real-time notifications and updates.",
  },
];
