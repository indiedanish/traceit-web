export interface Website {
  websiteId: string;
  name: string;
  websiteUrl: string;
  totalVisits: number;
}

export interface WebsiteResponse extends Website {
  _id: string;
  userId: string;
  createdAt: string;
  url: string;
}

export interface WebsitesResponse {
  websites: Website[];
}
