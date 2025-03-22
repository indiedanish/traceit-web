"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CountItem } from '@/types/analytics';

interface VisitorTrendsChartProps {
    data: CountItem[];
}

export default function VisitorTrendsChart({ data }: VisitorTrendsChartProps) {
    const chartData = data.map(item => ({
        date: item._id,
        visits: item.count
    }));

    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Visitor Trends</CardTitle>
            </CardHeader>
            <CardContent>
                {chartData.length > 0 ? (
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={chartData}
                                margin={{ top: 5, right: 5, left: 5, bottom: 20 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                                <XAxis
                                    dataKey="date"
                                    angle={-45}
                                    textAnchor="end"
                                    tick={{ fontSize: 12 }}
                                    tickFormatter={(value) => {
                                        try {
                                            return new Date(value).toLocaleDateString();
                                        } catch (e) {
                                            return value;
                                        }
                                    }}
                                />
                                <YAxis tick={{ fontSize: 12 }} />
                                <Tooltip
                                    formatter={(value) => [`${value} visits`, 'Visits']}
                                    labelFormatter={(label) => {
                                        try {
                                            return new Date(label).toLocaleDateString();
                                        } catch (e) {
                                            return label;
                                        }
                                    }}
                                />
                                <Bar dataKey="visits" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <div className="h-[300px] flex items-center justify-center">
                        <p className="text-muted-foreground">No visitor data available</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
} 