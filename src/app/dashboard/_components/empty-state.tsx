import { LineChart } from "lucide-react";
import AnimationContainer from "@/components/global/animation-container";

export function EmptyState() {
    return (
        <div className="col-span-full bg-[#191919] shadow rounded-lg p-6 text-center">
            <AnimationContainer animation="scaleUp" delay={0.4}>
                <LineChart className="mx-auto h-12 w-12 text-muted-foreground" />
            </AnimationContainer>
            <AnimationContainer animation="fadeUp" delay={0.5}>
                <h3 className="mt-2 text-sm font-medium">No websites yet</h3>
            </AnimationContainer>
            <AnimationContainer animation="fadeUp" delay={0.6}>
                <p className="mt-1 text-sm text-muted-foreground">
                    Get started by adding your first website.
                </p>
            </AnimationContainer>
        </div>
    );
} 