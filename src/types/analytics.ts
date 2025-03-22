export interface Visit {
  _id: string;
  ip: string;
  userAgent: string;
  timestamp: string;
  language: string;
  url: string;
  referrer: string;
  screenResolution: string;
  timeOnPage: number | null;
  maxScrollDepth?: number;
  path: string;
  browserName: string;
  browserVersion: string;
  deviceType: string;
  os: string;
  osVersion: string;
  viewportWidth: number;
  viewportHeight: number;
  colorDepth: number;
  timezone: string;
  timezoneOffset: number;
  connectionType: string;
  connectionSpeed: number;
  isNewVisitor: boolean;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmContent: string | null;
  utmTerm: string | null;
  pageLoadTime: number;
  doNotTrack: string;
}

export interface Website {
  _id: string;
  name: string;
  url: string;
  userId: string;
  createdAt: string;
}

export interface CountItem {
  _id: string | null;
  count: number;
}

export interface EngagementMetrics {
  avgTimeOnPage: number;
  avgScrollDepth: number;
}

export interface PageView {
  count: number;
  visits: Visit[];
  path: string;
}

export interface AnalyticsData {
  totalVisits: number;
  uniqueVisitors: number;
  pageViews: PageView[];
  deviceTypes: CountItem[];
  browsers: CountItem[];
  operatingSystems: CountItem[];
  referrers: CountItem[];
  visitsOverTime: CountItem[];
  engagement: EngagementMetrics;
  utmSources: CountItem[];
  website?: Website;
}
