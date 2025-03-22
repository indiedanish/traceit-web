"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Update the interface to match the new data structure
interface Visit {
    timeOnPage: number | null;
    timestamp: string;
    url: string;
    path: string;
    ip?: string;
    referrer?: string;
    userAgent?: string;
    browserName?: string;
    browserVersion?: string;
    deviceType?: string;
    os?: string;
    osVersion?: string;
    maxScrollDepth?: number;
    pageLoadTime?: number;
    // Other fields omitted for brevity
}

interface PageViewItem {
    count: number;
    visits: Visit[];
    path: string;
}

interface PageViewsChartProps {
    data: PageViewItem[];
}

export default function PageViewsChart({ data }: PageViewsChartProps) {
    // Modified to handle null timeOnPage values and show pageLoadTime instead
    const chartData = data
        .slice(0, 10)
        .map(item => ({
            path: item.path,
            timeOnPage: item.visits[0]?.timeOnPage || 0,
            pageLoadTime: item.visits[0]?.pageLoadTime || 0,
            url: item.visits[0]?.url || "",
            referrer: item.visits[0]?.referrer || "Direct",
            deviceType: item.visits[0]?.deviceType || "Unknown",
            maxScrollDepth: item.visits[0]?.maxScrollDepth || 0,
            count: item.count
        }))
        .sort((a, b) => b.pageLoadTime - a.pageLoadTime); // Sort by page load time instead

    // Determine which metric to display based on data availability
    const displayMetric = chartData.some(item => item.timeOnPage > 0) ? "timeOnPage" : "pageLoadTime";
    const metricLabel = displayMetric === "timeOnPage" ? "Time on Page (seconds)" : "Page Load Time (ms)";
    const metricFormatter = displayMetric === "timeOnPage"
        ? (value: number) => `${value.toFixed(1)} seconds`
        : (value: number) => `${value} ms`;

    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">
                    {displayMetric === "timeOnPage" ? "Time Spent on Pages" : "Page Load Times"}
                </CardTitle>
            </CardHeader>
            <CardContent>
                {chartData.length > 0 ? (
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={chartData}
                                layout="vertical"
                                margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                                <XAxis
                                    type="number"
                                    tick={{ fontSize: 12 }}
                                    label={{ value: metricLabel, position: 'insideBottom', offset: -5 }}
                                />
                                <YAxis
                                    dataKey="path"
                                    type="category"
                                    tick={{ fontSize: 12 }}
                                    width={150}
                                    tickFormatter={(value) => {
                                        // Truncate long paths
                                        return value.length > 20 ? value.substring(0, 20) + '...' : value;
                                    }}
                                />
                                <Tooltip
                                    formatter={(value, name) => [metricFormatter(Number(value)), displayMetric === "timeOnPage" ? 'Time on Page' : 'Page Load Time']}
                                    labelFormatter={(label) => `Path: ${label}`}
                                    content={({ active, payload, label }) => {
                                        if (active && payload && payload.length) {
                                            const data = payload[0].payload;
                                            return (
                                                <div className="bg-background border rounded p-2 shadow-sm">
                                                    <p className="font-medium truncate max-w-[200px]">{data.path}</p>
                                                    {displayMetric === "timeOnPage" ? (
                                                        <p className="text-sm">Time on page: {data.timeOnPage.toFixed(1)}s</p>
                                                    ) : (
                                                        <p className="text-sm">Load time: {data.pageLoadTime}ms</p>
                                                    )}
                                                    <p className="text-xs text-muted-foreground truncate max-w-[200px]">{data.url}</p>
                                                    {displayMetric === "timeOnPage" && data.pageLoadTime > 0 && (
                                                        <p className="text-xs">Load time: {data.pageLoadTime}ms</p>
                                                    )}
                                                    {displayMetric === "pageLoadTime" && data.timeOnPage > 0 && (
                                                        <p className="text-xs">Time on page: {data.timeOnPage.toFixed(1)}s</p>
                                                    )}
                                                    {data.maxScrollDepth > 0 && (
                                                        <p className="text-xs">Scroll depth: {data.maxScrollDepth}%</p>
                                                    )}
                                                    <p className="text-xs">Source: {data.referrer}</p>
                                                    <p className="text-xs">Device: {data.deviceType}</p>
                                                    <p className="text-xs">Views: {data.count}</p>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <Bar dataKey={displayMetric} fill="#3b82f6" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <div className="h-[300px] flex items-center justify-center">
                        <p className="text-muted-foreground">No page data available</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
} 