"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CountItem } from '@/types/analytics';

interface DeviceDistributionChartProps {
    data: CountItem[];
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function DeviceDistributionChart({ data }: DeviceDistributionChartProps) {
    const chartData = data.map(item => ({
        name: item._id || 'Unknown',
        value: item.count
    }));

    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Device Distribution</CardTitle>
            </CardHeader>
            <CardContent>
                {chartData.length > 0 ? (
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => [`${value} visits`, 'Visits']} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <div className="h-[300px] flex items-center justify-center">
                        <p className="text-muted-foreground">No device data available</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
} 