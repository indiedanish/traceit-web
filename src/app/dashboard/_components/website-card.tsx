import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import AnimationContainer from "@/components/global/animation-container";
import { Website } from "@/types/website";
import { generateTrackingScript } from "@/lib/helpers";
import { Button } from "@/components/ui/button";

export interface WebsiteCardProps {
    website: Website;
    onShowEmbed?: () => void;
}

export function WebsiteCard({ website, onShowEmbed }: WebsiteCardProps) {
    const [showScript, setShowScript] = useState(false);

    return (
        <AnimationContainer animation="fadeUp" delay={0.4}>
            <div className="bg-[#191919] shadow rounded-lg p-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium truncate">{website?.name || "-"}</h3>
                    <a
                        href={website?.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <ExternalLink className="h-5 w-5" />
                    </a>
                </div>
                <div className="mt-4">
                    <p className="text-3xl font-semibold">{website?.totalVisits.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Total Visitors</p>
                </div>
                <div className="mt-4 flex justify-between items-center">
                    <Link
                        href={`/analytics/${website.websiteId}`}
                        className="text-primary hover:text-primary/80 text-sm font-medium transition-colors"
                    >
                        View Analytics →
                    </Link>
                    <button
                        onClick={() => setShowScript(!showScript)}
                        className="text-primary hover:text-primary/80 text-sm font-medium transition-colors"
                    >
                        {showScript ? "Hide Script" : "Show Script"}
                    </button>
                </div>

                {showScript && (
                    <div className="mt-4 p-3 bg-black/50 rounded-md overflow-auto">
                        <pre className="text-xs text-gray-300 whitespace-pre-wrap">
                            {generateTrackingScript(website.websiteId)}
                        </pre>
                    </div>
                )}

                <div className="py-2 flex space-x-2">
                    <Button variant="outline" size="sm" onClick={onShowEmbed}>
                        Get Embed Code
                    </Button>
                </div>
            </div>
        </AnimationContainer>
    );
} 