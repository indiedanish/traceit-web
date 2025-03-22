"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState, useCallback, useRef } from "react";
import AnimationContainer from "@/components/global/animation-container";
import { Button } from "@/components/ui/button";
import Wrapper from "@/components/global/wrapper";
import { WebsiteCard } from "@/app/dashboard/_components/website-card";
import { EmptyState } from "@/app/dashboard/_components/empty-state";
import PageLoader from "@/components/global/page-loader";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorDisplay } from "@/components/ui/error-display";
import { fetchUserWebsites, getWebsiteCounterEmbed } from "@/lib/api";
import { Website } from "@/types/website";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { AddWebsiteForm } from "@/components/forms/add-website.form";
import { CopyButton } from "@/components/ui/copy-button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function DashboardPage() {


    const { user, isLoaded, isSignedIn } = useUser();
    const [websites, setWebsites] = useState<Website[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isAddWebsiteOpen, setIsAddWebsiteOpen] = useState(false);
    const [isEmbedCodeOpen, setIsEmbedCodeOpen] = useState(false);
    const [selectedWebsite, setSelectedWebsite] = useState<Website | null>(null);
    const [embedCode, setEmbedCode] = useState<string>("");
    const [isLoadingEmbed, setIsLoadingEmbed] = useState(false);
    const [embedError, setEmbedError] = useState<string | null>(null);
    const [embedOptions, setEmbedOptions] = useState({
        style: "default" as "default" | "minimal" | "dark" | "badge",
        bgColor: "",
        textColor: "",
        valueColor: "",
        text: "",
        fontSize: "",
        borderRadius: "",
        isUniqueVisitors: false,
        fontWeight: "default",
        customCSS: ""
    });

    console.log("user data:", user, "isLoaded:", isLoaded, "isSignedIn:", isSignedIn);

    // Use a ref to store the latest embedOptions for the debounced function
    const embedOptionsRef = useRef(embedOptions);

    // Update the ref whenever embedOptions changes
    useEffect(() => {
        embedOptionsRef.current = embedOptions;
    }, [embedOptions]);

    // Add a debounce function
    const debounce = (func: Function, delay: number) => {
        let timeoutId: NodeJS.Timeout;
        return (...args: any[]) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func(...args);
            }, delay);
        };
    };

    // Create a debounced version of updateEmbedCode
    const debouncedUpdateEmbedCode = useCallback(
        debounce(() => {
            if (isEmbedCodeOpen && selectedWebsite) {
                updateEmbedCode();
            }
        }, 500), // 500ms delay
        [isEmbedCodeOpen, selectedWebsite]
    );

    // Handle color changes
    const handleColorChange = (field: keyof typeof embedOptions, value: string) => {
        // Update the state immediately for UI
        setEmbedOptions(prev => ({
            ...prev,
            [field]: value
        }));

        // Don't trigger the debounced update on every keystroke
        // Only trigger it when using the color picker or when typing stops
        if (field === 'bgColor' || field === 'textColor' || field === 'valueColor') {
            debouncedUpdateEmbedCode();
        }
    };

    useEffect(() => {
        const loadWebsites = async () => {
            if (!isLoaded) return;

            if (!isSignedIn || !user) {
                setIsLoading(false);
                setError("Please sign in to view your websites.");
                return;
            }

            try {
                setIsLoading(true);
                const data = await fetchUserWebsites(user.id);
                setWebsites(data.websites);
                setError(null);
            } catch (err) {
                setError("Failed to load websites. Please try again later.");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        loadWebsites();
    }, [user, isLoaded, isSignedIn]);

    const handleRetry = async () => {
        if (!user) return;

        setIsLoading(true);
        setError(null);
        try {
            const data = await fetchUserWebsites(user.id);
            setWebsites(data.websites);
        } catch (err) {
            setError("Failed to load websites. Please try again later.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddWebsiteSuccess = async () => {
        // Reload the websites list after successful addition
        if (user) {
            try {
                const data = await fetchUserWebsites(user.id);
                setWebsites(data.websites);
            } catch (err) {
                console.error("Failed to refresh websites list:", err);
            }
        }
    };

    const handleShowEmbedCode = async (website: Website) => {
        setSelectedWebsite(website);
        setIsEmbedCodeOpen(true);
        setIsLoadingEmbed(true);
        setEmbedError(null);

        // Reset options to defaults
        setEmbedOptions({
            style: "default",
            bgColor: "",
            textColor: "",
            valueColor: "",
            text: "",
            fontSize: "",
            borderRadius: "",
            isUniqueVisitors: false,
            fontWeight: "default",
            customCSS: ""
        });

        try {
            const response = await getWebsiteCounterEmbed(website.websiteId, {
                style: "default"
            }, user?.id);
            setEmbedCode(response.embedCode);
        } catch (err) {
            console.error("Failed to get embed code:", err);
            setEmbedError("Failed to load embed code. Please try again.");
        } finally {
            setIsLoadingEmbed(false);
        }
    };

    const updateEmbedCode = async () => {
        if (!selectedWebsite || !user) return;

        setIsLoadingEmbed(true);
        setEmbedError(null);

        try {
            // Create a copy of options to modify
            const optionsToSend = { ...embedOptionsRef.current };

            // Convert "default" fontWeight to empty string for the API
            if (optionsToSend.fontWeight === "default") {
                optionsToSend.fontWeight = "";
            }

            // Only include non-empty options
            const filteredOptions = Object.fromEntries(
                Object.entries(optionsToSend).filter(([_, value]) =>
                    value !== "" && value !== undefined && value !== null
                )
            );

            const response = await getWebsiteCounterEmbed(
                selectedWebsite.websiteId,
                filteredOptions,
                user.id
            );
            setEmbedCode(response.embedCode);
        } catch (err) {
            console.error("Failed to update embed code:", err);
            setEmbedError("Failed to update embed code. Please try again.");
        } finally {
            setIsLoadingEmbed(false);
        }
    };

    // Update embed code when non-color options change immediately
    // But don't trigger on every embedOptions change
    useEffect(() => {
        // Only update for non-color changes
        if (isEmbedCodeOpen && selectedWebsite) {
            // We'll handle color changes separately with debouncing
            updateEmbedCode();
        }
    }, [
        isEmbedCodeOpen,
        selectedWebsite,
        embedOptions.style,
        embedOptions.text,
        embedOptions.fontSize,
        embedOptions.borderRadius,
        embedOptions.isUniqueVisitors,
        embedOptions.fontWeight,
        embedOptions.customCSS
    ]);

    if (!isLoaded) {
        return <LoadingSpinner message="Loading user data..." />;
    }

    if (!isSignedIn) {
        return (
            <Wrapper className="py-20 lg:py-32">
                <ErrorDisplay
                    message="You need to be signed in to view this page."
                    actionText="Sign In"
                    actionHref="/sign-in"
                />
            </Wrapper>
        );
    }

    if (isLoading) {
        return <PageLoader  />;
    }

    if (error) {
        return <ErrorDisplay message={error} onRetry={handleRetry} />;
    }

    const hasWebsites = websites.length > 0;

    return (
        <Wrapper className="py-20 lg:py-32">
            <AnimationContainer animation="fadeUp" delay={0.2}>
                <div className="md:flex md:items-center md:justify-between">
                    <div className="min-w-0 flex-1">
                        <h2 className="text-2xl font-bold leading-7 sm:truncate sm:text-3xl sm:tracking-tight">
                            Welcome back, {user?.firstName}!
                        </h2>
                    </div>
                    <div className="mt-4 flex md:ml-4 md:mt-0">
                        <Button
                            className="inline-flex items-center"
                            onClick={() => setIsAddWebsiteOpen(true)}
                        >
                            Add Website
                        </Button>
                    </div>
                </div>
            </AnimationContainer>

            <AnimationContainer animation="fadeUp" delay={0.3}>
                <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {!hasWebsites ? (
                        <EmptyState />
                    ) : (
                        websites.map((website) => (
                            <WebsiteCard
                                key={website.websiteId}
                                website={website}
                                onShowEmbed={() => handleShowEmbedCode(website)}
                            />
                        ))
                    )}
                </div>
            </AnimationContainer>

            <Dialog open={isAddWebsiteOpen} onOpenChange={setIsAddWebsiteOpen}>
                <DialogContent className="sm:max-w-[600px] p-0">
                    <DialogHeader className="p-6 pb-0">
                        <DialogTitle>Add New Website</DialogTitle>
                    </DialogHeader>
                    <div className="px-6 pb-6">
                        <AddWebsiteForm onSuccess={handleAddWebsiteSuccess} />
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={isEmbedCodeOpen} onOpenChange={setIsEmbedCodeOpen}>
                <DialogContent className="sm:max-w-[700px] p-0">
                    <DialogHeader className="p-6 pb-0">
                        <DialogTitle>
                            {selectedWebsite ? `Embed Code for ${selectedWebsite.name}` : 'Embed Code'}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="px-6 pb-6">
                        {isLoadingEmbed && !embedCode ? (
                            <div className="py-4 text-center">
                                <LoadingSpinner message="Loading embed code..." />
                            </div>
                        ) : embedError ? (
                            <div className="py-4">
                                <ErrorDisplay
                                    message={embedError}
                                    onRetry={() => selectedWebsite && handleShowEmbedCode(selectedWebsite)}
                                />
                            </div>
                        ) : (
                            <Tabs defaultValue="code" className="w-full">
                                <TabsList className="mb-4">
                                    <TabsTrigger value="code">Embed Code</TabsTrigger>
                                    <TabsTrigger value="customize">Customize</TabsTrigger>
                                </TabsList>

                                <TabsContent value="code" className="space-y-4">
                                    <p className="text-sm text-muted-foreground">
                                        Copy and paste this code into your website to display the visitor counter.
                                    </p>
                                    <div className="relative bg-muted p-4 rounded-md">
                                        <pre className="text-xs overflow-x-auto whitespace-pre-wrap break-all">
                                            {embedCode}
                                        </pre>
                                        <div className="absolute top-2 right-2">
                                            <CopyButton text={embedCode} />
                                        </div>
                                    </div>
                                    <div className="pt-2">
                                        <h4 className="font-medium mb-2">Preview:</h4>
                                        <div className="border rounded-md p-4 bg-background max-h-[200px] overflow-auto">
                                            {isLoadingEmbed ? (
                                                <div className="flex justify-center">
                                                    <LoadingSpinner size="sm" />
                                                </div>
                                            ) : (
                                                <div dangerouslySetInnerHTML={{ __html: embedCode }} />
                                            )}
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent value="customize" className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="style">Counter Style</Label>
                                            <Select
                                                value={embedOptions.style}
                                                onValueChange={(value) => setEmbedOptions({
                                                    ...embedOptions,
                                                    style: value as any
                                                })}
                                            >
                                                <SelectTrigger id="style">
                                                    <SelectValue placeholder="Select style" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="default">Default</SelectItem>
                                                    <SelectItem value="minimal">Minimal</SelectItem>
                                                    <SelectItem value="dark">Dark</SelectItem>
                                                    <SelectItem value="badge">Badge</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div>
                                            <Label htmlFor="text">Counter Text</Label>
                                            <Input
                                                id="text"
                                                placeholder="Total Visits:"
                                                value={embedOptions.text}
                                                onChange={(e) => setEmbedOptions({
                                                    ...embedOptions,
                                                    text: e.target.value
                                                })}
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="bgColor">Background Color</Label>
                                            <div className="flex space-x-2">
                                                <Input
                                                    id="bgColor"
                                                    placeholder="#f8f9fa"
                                                    value={embedOptions.bgColor}
                                                    onChange={(e) => setEmbedOptions(prev => ({
                                                        ...prev,
                                                        bgColor: e.target.value
                                                    }))}
                                                    onBlur={() => debouncedUpdateEmbedCode()}
                                                />
                                                <input
                                                    type="color"
                                                    value={embedOptions.bgColor || "#f8f9fa"}
                                                    onChange={(e) => handleColorChange('bgColor', e.target.value)}
                                                    className="w-10 h-10 p-1 rounded border"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <Label htmlFor="textColor">Text Color</Label>
                                            <div className="flex space-x-2">
                                                <Input
                                                    id="textColor"
                                                    placeholder="#000000"
                                                    value={embedOptions.textColor}
                                                    onChange={(e) => setEmbedOptions(prev => ({
                                                        ...prev,
                                                        textColor: e.target.value
                                                    }))}
                                                    onBlur={() => debouncedUpdateEmbedCode()}
                                                />
                                                <input
                                                    type="color"
                                                    value={embedOptions.textColor || "#000000"}
                                                    onChange={(e) => handleColorChange('textColor', e.target.value)}
                                                    className="w-10 h-10 p-1 rounded border"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <Label htmlFor="valueColor">Value Color</Label>
                                            <div className="flex space-x-2">
                                                <Input
                                                    id="valueColor"
                                                    placeholder="#007bff"
                                                    value={embedOptions.valueColor}
                                                    onChange={(e) => setEmbedOptions(prev => ({
                                                        ...prev,
                                                        valueColor: e.target.value
                                                    }))}
                                                    onBlur={() => debouncedUpdateEmbedCode()}
                                                />
                                                <input
                                                    type="color"
                                                    value={embedOptions.valueColor || "#007bff"}
                                                    onChange={(e) => handleColorChange('valueColor', e.target.value)}
                                                    className="w-10 h-10 p-1 rounded border"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <Label htmlFor="fontSize">Font Size</Label>
                                            <Input
                                                id="fontSize"
                                                placeholder="14px"
                                                value={embedOptions.fontSize}
                                                onChange={(e) => setEmbedOptions({
                                                    ...embedOptions,
                                                    fontSize: e.target.value
                                                })}
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="borderRadius">Border Radius</Label>
                                            <Input
                                                id="borderRadius"
                                                placeholder="5px"
                                                value={embedOptions.borderRadius}
                                                onChange={(e) => setEmbedOptions({
                                                    ...embedOptions,
                                                    borderRadius: e.target.value
                                                })}
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="fontWeight">Font Weight</Label>
                                            <Select
                                                value={embedOptions.fontWeight}
                                                onValueChange={(value) => setEmbedOptions({
                                                    ...embedOptions,
                                                    fontWeight: value
                                                })}
                                            >
                                                <SelectTrigger id="fontWeight">
                                                    <SelectValue placeholder="Select weight" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="default">Default</SelectItem>
                                                    <SelectItem value="normal">Normal</SelectItem>
                                                    <SelectItem value="bold">Bold</SelectItem>
                                                    <SelectItem value="400">400</SelectItem>
                                                    <SelectItem value="500">500</SelectItem>
                                                    <SelectItem value="600">600</SelectItem>
                                                    <SelectItem value="700">700</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="isUniqueVisitors"
                                                checked={embedOptions.isUniqueVisitors}
                                                onCheckedChange={(checked) => setEmbedOptions({
                                                    ...embedOptions,
                                                    isUniqueVisitors: checked as boolean
                                                })}
                                            />
                                            <Label htmlFor="isUniqueVisitors">Show unique visitors only</Label>
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="customCSS">Custom CSS</Label>
                                        <Input
                                            id="customCSS"
                                            placeholder="border: 1px solid #ccc; margin: 5px;"
                                            value={embedOptions.customCSS}
                                            onChange={(e) => setEmbedOptions({
                                                ...embedOptions,
                                                customCSS: e.target.value
                                            })}
                                        />
                                    </div>

                                    <div className="pt-2">
                                        <h4 className="font-medium mb-2">Preview:</h4>
                                        <div className="border rounded-md p-4 bg-background max-h-[200px] overflow-auto">
                                            {isLoadingEmbed ? (
                                                <div className="flex justify-center">
                                                    <LoadingSpinner size="sm" />
                                                </div>
                                            ) : (
                                                <div dangerouslySetInnerHTML={{ __html: embedCode }} />
                                            )}
                                        </div>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </Wrapper>
    );
}
