"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Check, Copy, Globe } from "lucide-react";
import AnimationContainer from "@/components/global/animation-container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { createWebsite } from "@/lib/api";
import { generateTrackingScript } from "@/lib/helpers";
import { WebsiteResponse } from "@/types/website";

interface AddWebsiteFormProps {
    onSuccess?: () => void;
}

export function AddWebsiteForm({ onSuccess }: AddWebsiteFormProps) {
    const router = useRouter();
    const { user } = useUser();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [website, setWebsite] = useState<WebsiteResponse | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!user) return;

        const formData = new FormData(e.currentTarget);
        const name = formData.get("name") as string;
        const websiteUrl = formData.get("url") as string;

        try {
            setIsSubmitting(true);
            setError(null);

            const newWebsite = await createWebsite({ name, websiteUrl }, user.id);
            setWebsite(newWebsite);
            setSuccess(true);
            if (onSuccess) onSuccess();
        } catch (err) {
            setError("Failed to add website. Please try again.");
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const copyTrackingScript = () => {
        if (!website) return;

        const script = generateTrackingScript(website._id);
        navigator.clipboard.writeText(script);
    };

    return (
        <AnimationContainer animation="fadeUp" delay={0.3}>
            <form onSubmit={handleSubmit} className="space-y-6 bg-[#191919] shadow rounded-lg p-6">
                {success && website ? (
                    <div className="space-y-4">
                        <Alert className="border-green-500 bg-green-500/10">
                            <Check className="h-5 w-5 text-green-500" />
                            <AlertTitle>Success!</AlertTitle>
                            <AlertDescription>
                                Website added successfully! Add this tracking script to your website:
                            </AlertDescription>
                        </Alert>

                        <div className="relative mt-4">
                            <pre className="bg-[#111] text-white p-4 rounded-md text-sm overflow-x-auto whitespace-pre-wrap break-all">
                                {generateTrackingScript(website._id)}
                            </pre>
                            <button
                                type="button"
                                onClick={copyTrackingScript}
                                className="absolute top-2 right-2 p-2 text-muted-foreground hover:text-foreground transition-colors"
                                aria-label="Copy to clipboard"
                            >
                                <Copy className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="mt-4 flex justify-end">
                            <Button
                                type="button"
                                onClick={() => router.push("/dashboard")}
                                variant="link"
                                className="text-primary hover:text-primary/80"
                            >
                                Go to Dashboard →
                            </Button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="space-y-2">
                            <Label htmlFor="name">Website Name</Label>
                            <Input
                                type="text"
                                id="name"
                                name="name"
                                placeholder="My Awesome Website"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="url">Website URL</Label>
                            <Input
                                type="url"
                                id="url"
                                name="url"
                                placeholder="https://example.com"
                                required
                            />
                        </div>

                        {error && (
                            <Alert variant="destructive">
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        <Alert className="bg-[#222] border-[#333]">
                            <Globe className="h-5 w-5 text-muted-foreground" />
                            <AlertTitle>Tracking Script</AlertTitle>
                            <AlertDescription>
                                After adding your website, you&apos;ll receive a tracking script to add to your website&apos;s
                                HTML. Add it just before the closing <code>&lt;/body&gt;</code> tag.
                            </AlertDescription>
                        </Alert>

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Adding..." : "Add Website"}
                        </Button>
                    </>
                )}
            </form>
        </AnimationContainer>
    );
} 