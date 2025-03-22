import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface AnalyticsCardProps {
    icon: ReactNode;
    title: string;
    value?: string;
    content?: ReactNode;
}

export default function AnalyticsCard({ icon, title, value, content }: AnalyticsCardProps) {
    return (
        <Card className="bg-[#191919] shadow">
            <CardContent className="p-6">
                <div className="flex items-center">
                    {icon}
                    <h3 className="ml-2 text-sm font-medium">{title}</h3>
                </div>
                {value && <p className="mt-2 text-2xl font-medium">{value}</p>}
                {content}
            </CardContent>
        </Card>
    );
} 