"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe } from "lucide-react";
import { Bar } from "react-chartjs-2";
import { Visit } from "@/types/analytics";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

interface GeographicDistributionChartProps {
    visits: Visit[];
}

export default function GeographicDistributionChart({ visits }: GeographicDistributionChartProps) {
    const chartData = {
        labels: ["United States", "United Kingdom", "Germany", "India", "Canada"],
        datasets: [{
            label: "Visitors by Country",
            data: [42, 23, 15, 8, 12],
            backgroundColor: "rgba(124, 58, 237, 0.7)",
        }]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "top" as const,
                labels: {
                    color: "#e5e7eb",
                },
            },
            tooltip: {
                backgroundColor: "#191919",
                titleColor: "#e5e7eb",
                bodyColor: "#e5e7eb",
                borderColor: "#374151",
                borderWidth: 1,
            },
        },
        scales: {
            x: {
                grid: {
                    color: "rgba(75, 85, 99, 0.2)",
                },
                ticks: {
                    color: "#9ca3af",
                },
            },
            y: {
                grid: {
                    color: "rgba(75, 85, 99, 0.2)",
                },
                ticks: {
                    color: "#9ca3af",
                },
            },
        },
    };

    return (
        <Card className="bg-[#191919] shadow overflow-hidden">
            <CardHeader className="border-b border-border/40">
                <CardTitle className="flex items-center text-lg">
                    <Globe className="h-5 w-5 mr-2 text-purple-500" />
                    Geographic Distribution
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
                <div className="h-80">
                    {visits.length > 0 ? (
                        <Bar data={chartData} options={chartOptions} />
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full">
                            <Globe className="h-16 w-16 text-muted-foreground/30" />
                            <p className="mt-4 text-muted-foreground">No geographic data available</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
} 