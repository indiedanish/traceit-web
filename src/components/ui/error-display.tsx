import { Button } from "@/components/ui/button";

export function ErrorDisplay({ message, onRetry }: { message: string; onRetry: () => void }) {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <div className="text-center">
                <h3 className="text-lg font-medium text-foreground mb-2">Something went wrong</h3>
                <p className="text-muted-foreground mb-4">{message}</p>
                <Button onClick={onRetry} variant="outline">
                    Try Again
                </Button>
            </div>
        </div>
    );
} 