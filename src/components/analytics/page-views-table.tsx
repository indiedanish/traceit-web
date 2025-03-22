"use client";

import { useState } from "react";
import React from "react";
import { Clock, Link2, Globe, Zap, ChevronDown, ChevronRight, Monitor, Smartphone, Laptop, ArrowUpDown } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { PageView } from "@/types/analytics";
import AnalyticsCard from "./analytics-card";

interface PageViewsTableProps {
    data: PageView[];
}

type SortField = "path" | "count" | "lastVisit" | "avgTime";
type SortDirection = "asc" | "desc";

export default function PageViewsTable({ data }: PageViewsTableProps) {
    // Add sort state
    const [sortField, setSortField] = useState<SortField>("lastVisit");
    const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
    const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

    // Sort data based on current sort field and direction
    const sortedData = [...data].sort((a, b) => {
        // Get the most recent timestamps for comparison
        const aTimestamps = a.visits.map(visit => new Date(visit.timestamp).getTime());
        const bTimestamps = b.visits.map(visit => new Date(visit.timestamp).getTime());
        const aLatest = Math.max(...aTimestamps);
        const bLatest = Math.max(...bTimestamps);

        // Calculate average time on page for comparison
        const aVisitsWithTime = a.visits.filter(visit => visit.timeOnPage !== null);
        const bVisitsWithTime = b.visits.filter(visit => visit.timeOnPage !== null);

        const aAvgTime = aVisitsWithTime.length > 0
            ? aVisitsWithTime.reduce((sum, visit) => sum + (visit.timeOnPage || 0), 0) / aVisitsWithTime.length
            : 0;

        const bAvgTime = bVisitsWithTime.length > 0
            ? bVisitsWithTime.reduce((sum, visit) => sum + (visit.timeOnPage || 0), 0) / bVisitsWithTime.length
            : 0;

        // Sort based on selected field
        let comparison = 0;
        switch (sortField) {
            case "path":
                comparison = a.path.localeCompare(b.path);
                break;
            case "count":
                comparison = a.count - b.count;
                break;
            case "lastVisit":
                comparison = aLatest - bLatest;
                break;
            case "avgTime":
                comparison = aAvgTime - bAvgTime;
                break;
            default:
                comparison = 0;
        }

        // Apply sort direction
        return sortDirection === "asc" ? comparison : -comparison;
    });

    const toggleSort = (field: SortField) => {
        if (sortField === field) {
            // Toggle direction if clicking the same field
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            // Set new field and default to descending
            setSortField(field);
            setSortDirection("desc");
        }
    };

    const toggleRow = (path: string) => {
        setExpandedRows(prev => ({
            ...prev,
            [path]: !prev[path]
        }));
    };

    const getDeviceIcon = (deviceType: string) => {
        switch (deviceType.toLowerCase()) {
            case 'desktop':
                return <Monitor className="h-3 w-3" />;
            case 'mobile':
                return <Smartphone className="h-3 w-3" />;
            case 'tablet':
                return <Laptop className="h-3 w-3" />;
            default:
                return <Monitor className="h-3 w-3" />;
        }
    };

    return (
        <AnalyticsCard
            icon={<Link2 className="h-6 w-6 text-primary" />}
            title="Page Views Details"
            content={
                data.length > 0 ? (
                    <div className="mt-4 max-h-[600px] overflow-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead></TableHead>
                                    <TableHead
                                        className="cursor-pointer hover:text-primary"
                                        onClick={() => toggleSort("path")}
                                    >
                                        <div className="flex items-center">
                                            Path
                                            {sortField === "path" && (
                                                <ArrowUpDown className={`ml-1 h-3 w-3 ${sortDirection === "asc" ? "rotate-180" : ""}`} />
                                            )}
                                        </div>
                                    </TableHead>
                                    <TableHead>IP Address</TableHead>
                                    <TableHead>Device</TableHead>
                                    <TableHead>Browser</TableHead>
                                    <TableHead
                                        className="text-right cursor-pointer hover:text-primary"
                                        onClick={() => toggleSort("avgTime")}
                                    >
                                        <div className="flex items-center justify-end">
                                            Avg. Time
                                            {sortField === "avgTime" && (
                                                <ArrowUpDown className={`ml-1 h-3 w-3 ${sortDirection === "asc" ? "rotate-180" : ""}`} />
                                            )}
                                        </div>
                                    </TableHead>
                                    <TableHead
                                        className="text-right cursor-pointer hover:text-primary"
                                        onClick={() => toggleSort("lastVisit")}
                                    >
                                        <div className="flex items-center justify-end">
                                            Last Visit
                                            {sortField === "lastVisit" && (
                                                <ArrowUpDown className={`ml-1 h-3 w-3 ${sortDirection === "asc" ? "rotate-180" : ""}`} />
                                            )}
                                        </div>
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {sortedData.map((page) => {
                                    // Calculate average time on page
                                    const visitsWithTime = page.visits.filter(
                                        (visit) => visit.timeOnPage !== null
                                    );
                                    const avgTimeOnPage =
                                        visitsWithTime.length > 0
                                            ? visitsWithTime.reduce(
                                                (sum, visit) => sum + (visit.timeOnPage || 0),
                                                0
                                            ) / visitsWithTime.length
                                            : 0;

                                    // Get the most recent visit timestamp
                                    const timestamps = page.visits.map((visit) =>
                                        new Date(visit.timestamp).getTime()
                                    );
                                    const mostRecentTimestamp = Math.max(...timestamps);
                                    const mostRecentDate = new Date(mostRecentTimestamp);

                                    // Get the most recent visit
                                    const mostRecentVisit = page.visits.find(
                                        (visit) => new Date(visit.timestamp).getTime() === mostRecentTimestamp
                                    );

                                    const ipAddress = mostRecentVisit?.ip || "Unknown";
                                    const deviceType = mostRecentVisit?.deviceType || "Unknown";
                                    const browser = mostRecentVisit ?
                                        `${mostRecentVisit.browserName} ${mostRecentVisit.browserVersion}` :
                                        "Unknown";

                                    const isExpanded = expandedRows[page.path] || false;

                                    return (
                                        <React.Fragment key={page.path}>
                                            <TableRow
                                                className="cursor-pointer hover:bg-muted/50"
                                                onClick={() => toggleRow(page.path)}
                                            >
                                                <TableCell>
                                                    {isExpanded ?
                                                        <ChevronDown className="h-4 w-4 text-muted-foreground" /> :
                                                        <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                                                </TableCell>
                                                <TableCell className="font-medium truncate max-w-[200px]">
                                                    {page.path}
                                                </TableCell>
                                                <TableCell>
                                                    {ipAddress}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-1">
                                                        {getDeviceIcon(deviceType)}
                                                        <span>{deviceType}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {browser}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <Clock className="h-3 w-3 text-muted-foreground" />
                                                        {avgTimeOnPage.toFixed(1)}s
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right text-sm text-muted-foreground">
                                                    {formatDistanceToNow(mostRecentDate, {
                                                        addSuffix: true,
                                                    })}
                                                </TableCell>
                                            </TableRow>

                                            {isExpanded && mostRecentVisit && (
                                                <TableRow className="bg-muted/30">
                                                    <TableCell colSpan={7} className="p-4">
                                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                                            <div>
                                                                <h4 className="text-sm font-medium mb-1">Connection</h4>
                                                                <p className="text-xs text-muted-foreground">
                                                                    Type: {mostRecentVisit.connectionType}<br />
                                                                    Speed: {mostRecentVisit.connectionSpeed.toFixed(2)} Mbps
                                                                </p>
                                                            </div>

                                                            <div>
                                                                <h4 className="text-sm font-medium mb-1">Viewport</h4>
                                                                <p className="text-xs text-muted-foreground">
                                                                    {mostRecentVisit.viewportWidth} × {mostRecentVisit.viewportHeight}<br />
                                                                    Color Depth: {mostRecentVisit.colorDepth}-bit
                                                                </p>
                                                            </div>

                                                            <div>
                                                                <h4 className="text-sm font-medium mb-1">Engagement</h4>
                                                                <p className="text-xs text-muted-foreground">
                                                                    Time on Page: {mostRecentVisit.timeOnPage?.toFixed(1) || 'N/A'} seconds<br />
                                                                    Max Scroll: {mostRecentVisit.maxScrollDepth || 'N/A'}%
                                                                </p>
                                                            </div>

                                                            <div>
                                                                <h4 className="text-sm font-medium mb-1">System</h4>
                                                                <p className="text-xs text-muted-foreground">
                                                                    OS: {mostRecentVisit.os} {mostRecentVisit.osVersion}<br />
                                                                    Language: {mostRecentVisit.language}
                                                                </p>
                                                            </div>

                                                            <div>
                                                                <h4 className="text-sm font-medium mb-1">Performance</h4>
                                                                <p className="text-xs text-muted-foreground">
                                                                    Page Load: {mostRecentVisit.pageLoadTime} ms<br />
                                                                    New Visitor: {mostRecentVisit.isNewVisitor ? 'Yes' : 'No'}
                                                                </p>
                                                            </div>

                                                            <div>
                                                                <h4 className="text-sm font-medium mb-1">Referrer</h4>
                                                                <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                                                                    {mostRecentVisit.referrer || 'Direct'}
                                                                </p>
                                                            </div>

                                                            {/* Location section */}
                                                            {mostRecentVisit.country && (
                                                                <div>
                                                                    <h4 className="text-sm font-medium mb-1">Location</h4>
                                                                    <p className="text-xs text-muted-foreground">
                                                                        {mostRecentVisit.city && `${mostRecentVisit.city}, `}
                                                                        {mostRecentVisit.regionName && `${mostRecentVisit.regionName}, `}
                                                                        {mostRecentVisit.country} {mostRecentVisit.countryCode && `(${mostRecentVisit.countryCode})`}<br />
                                                                        {mostRecentVisit.zip && `ZIP: ${mostRecentVisit.zip}`}
                                                                    </p>
                                                                </div>
                                                            )}

                                                            {/* ISP section */}
                                                            {mostRecentVisit.isp && (
                                                                <div>
                                                                    <h4 className="text-sm font-medium mb-1">Network</h4>
                                                                    <p className="text-xs text-muted-foreground">
                                                                        ISP: {mostRecentVisit.isp}<br />
                                                                        {mostRecentVisit.org && mostRecentVisit.org !== mostRecentVisit.isp && `Org: ${mostRecentVisit.org}`}
                                                                    </p>
                                                                </div>
                                                            )}

                                                            {/* Coordinates section */}
                                                            {mostRecentVisit.latitude && mostRecentVisit.longitude && (
                                                                <div>
                                                                    <h4 className="text-sm font-medium mb-1">Coordinates</h4>
                                                                    <p className="text-xs text-muted-foreground">
                                                                        Lat: {mostRecentVisit.latitude.toFixed(4)}<br />
                                                                        Long: {mostRecentVisit.longitude.toFixed(4)}
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </React.Fragment>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground mt-2">
                        No page views data available
                    </p>
                )
            }
        />
    );
} 