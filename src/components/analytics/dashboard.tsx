"use client";

import { Globe, Clock, Users, LineChart, Monitor, Chrome, Server } from "lucide-react";
import { AnalyticsData } from "@/types/analytics";
import AnimationContainer from "@/components/global/animation-container";
import VisitorTrendsChart from "./charts/visitor-trends";
import PageViewsChart from "./charts/page-views";
import DeviceDistributionChart from "./charts/device-distribution"
import AnalyticsCard from "./analytics-card";
import PageViewsTable from "./page-views-table";
import { formatDuration, intervalToDuration } from "date-fns";

// Add this function to format time using date-fns
const formatTimeOnPage = (seconds: number): string => {
    if (seconds < 60) {
        return `${seconds} sec`;
    }

    const duration = intervalToDuration({ start: 0, end: seconds * 1000 });
    return formatDuration(duration, {
        format: seconds >= 3600 ? ['hours', 'minutes'] : ['minutes', 'seconds'],
        delimiter: ' '
    });
};

interface AnalyticsDashboardProps {
    data: AnalyticsData;
}

export default function AnalyticsDashboard({ data }: AnalyticsDashboardProps) {
    return (
        <div className="space-y-8">
            <AnimationContainer animation="fadeUp" delay={0.2}>
                <div className="flex flex-col">
                    <h2 className="text-2xl md:text-3xl font-medium">
                        Analytics Dashboard
                    </h2>
                    {data.website && (
                        <>
                            <h3 className="text-xl font-medium mt-2">{data.website.name}</h3>
                            <p className="mt-1 text-sm text-muted-foreground">{data.website.url}</p>
                        </>
                    )}
                </div>
            </AnimationContainer>

            <AnimationContainer animation="fadeUp" delay={0.3}>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <AnalyticsCard
                        icon={<Users className="h-6 w-6 text-primary" />}
                        title="Total Visitors"
                        value={data.totalVisits.toString()}
                    />

                    <AnalyticsCard
                        icon={<Users className="h-6 w-6 text-primary" />}
                        title="Unique Visitors"
                        value={data.uniqueVisitors.toString()}
                    />

                    <AnalyticsCard
                        icon={<Clock className="h-6 w-6 text-primary" />}
                        title="Avg. Time on Page"
                        value={formatTimeOnPage(data.engagement?.avgTimeOnPage || 0)}
                    />

                    <AnalyticsCard
                        icon={<LineChart className="h-6 w-6 text-primary" />}
                        title="Avg. Scroll Depth"
                        value={`${data.engagement?.avgScrollDepth || 0}%`}
                    />
                </div>
            </AnimationContainer>

            <AnimationContainer animation="fadeUp" delay={0.4}>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <AnalyticsCard
                        icon={<Monitor className="h-6 w-6 text-primary" />}
                        title="Device Types"
                        content={
                            data.deviceTypes && data.deviceTypes.length > 0 ? (
                                <div className="flex flex-wrap gap-1 mt-2">
                                    {data.deviceTypes.slice(0, 3).map(device => (
                                        <span key={device._id} className="px-2 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">
                                            {device._id} ({device.count})
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground mt-2">No data available</p>
                            )
                        }
                    />

                    <AnalyticsCard
                        icon={<Chrome className="h-6 w-6 text-primary" />}
                        title="Browsers"
                        content={
                            data.browsers && data.browsers.length > 0 ? (
                                <div className="flex flex-wrap gap-1 mt-2">
                                    {data.browsers.slice(0, 3).map(browser => (
                                        <span key={browser._id} className="px-2 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">
                                            {browser._id} ({browser.count})
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground mt-2">No data available</p>
                            )
                        }
                    />

                    <AnalyticsCard
                        icon={<Server className="h-6 w-6 text-primary" />}
                        title="Operating Systems"
                        content={
                            data.operatingSystems && data.operatingSystems.length > 0 ? (
                                <div className="flex flex-wrap gap-1 mt-2">
                                    {data.operatingSystems.slice(0, 3).map(os => (
                                        <span key={os._id} className="px-2 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">
                                            {os._id} ({os.count})
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground mt-2">No data available</p>
                            )
                        }
                    />
                </div>
            </AnimationContainer>

            <AnimationContainer animation="fadeUp" delay={0.5}>
                <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
                    <VisitorTrendsChart data={data.visitsOverTime || []} />
                    <PageViewsChart data={data.pageViews || []} />
                    <DeviceDistributionChart data={data.deviceTypes || []} />
                    <AnalyticsCard
                        icon={<Globe className="h-6 w-6 text-primary" />}
                        title="Top Referrers"
                        content={
                            data.referrers && data.referrers.length > 0 ? (
                                <div className="flex flex-col gap-2 mt-2">
                                    {data.referrers.slice(0, 5).map(referrer => (
                                        <div key={referrer._id} className="flex justify-between items-center">
                                            <span className="text-sm truncate max-w-[70%]">
                                                {referrer._id || 'Direct'}
                                            </span>
                                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">
                                                {referrer.count}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground mt-2">No data available</p>
                            )
                        }
                    />
                </div>
            </AnimationContainer>

            <AnimationContainer animation="fadeUp" delay={0.6}>
                <PageViewsTable data={data.pageViews || []} />
            </AnimationContainer>
        </div>
    );
} 