import { Loader2Icon } from "lucide-react";

interface LoadingSpinnerProps {
    message?: string;
    size?: "default" | "sm" | "lg";
}

export function LoadingSpinner({ message, size = "default" }: LoadingSpinnerProps) {
    const sizeClasses = {
        sm: "h-4 w-4",
        default: "h-8 w-8",
        lg: "h-12 w-12"
    };

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full border-t-2 border-primary"
                className={`animate-spin rounded-full border-t-2 border-primary ${sizeClasses[size]}`}>
            </div>
            {message && <p className="mt-2 text-sm text-muted-foreground">{message}</p>}
        </div>
    );
} 