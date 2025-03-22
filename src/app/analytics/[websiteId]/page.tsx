"use client";

import { useParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import AnalyticsDashboard from "@/components/analytics/dashboard";
import AnimationContainer from "@/components/global/animation-container";
import Wrapper from "@/components/global/wrapper";
import { AnalyticsData } from "@/types/analytics";
import { fetchAnalytics } from "@/lib/api";

export default function AnalyticsPage() {
    const { websiteId } = useParams();
    const { user } = useUser();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadAnalytics = async () => {
            if (!websiteId || !user?.id) return;

            try {
                setLoading(true);
                const analyticsData = await fetchAnalytics(websiteId as string, user.id);
                setData(analyticsData);
                setError("");
            } catch (error) {
                console.error("Error fetching analytics:", error);
                setError("Failed to load analytics data");
            } finally {
                setLoading(false);
            }
        };

        if (websiteId && user?.id) {
            loadAnalytics();
        }
    }, [websiteId, user?.id]);

    if (loading) {
        return (
            <Wrapper className="py-20">
                <div className="flex flex-col items-center justify-center min-h-[60vh]">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <p className="mt-4 text-muted-foreground">Loading analytics...</p>
                </div>
            </Wrapper>
        );
    }

    if (error) {
        return (
            <Wrapper className="py-20">
                <AnimationContainer animation="fadeUp" delay={0.2}>
                    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 bg-[#191919] rounded-lg">
                        <AlertCircle className="h-12 w-12 text-red-500" />
                        <h3 className="mt-4 text-lg font-medium">Error</h3>
                        <p className="mt-2 text-muted-foreground">{error}</p>
                        <Button
                            onClick={() => window.location.reload()}
                            className="mt-6"
                        >
                            Try Again
                        </Button>
                    </div>
                </AnimationContainer>
            </Wrapper>
        );
    }

    return (
        <Wrapper className="py-10 mt-10">
            {data && <AnalyticsDashboard data={data} />}
        </Wrapper>
    );
} 