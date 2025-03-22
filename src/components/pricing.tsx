"use client";

import { PRICING_PLANS } from '@/constants';
import { cn } from '@/lib';
import NumberFlow from '@number-flow/react';
import { Check, Link } from 'lucide-react';
import { useState } from 'react';
import AnimationContainer from './global/animation-container';
import Wrapper from "./global/wrapper";
import { Button } from "./ui/button";
import SectionBadge from './ui/section-badge';
import { useRouter } from 'next/navigation';

const Pricing = () => {

    const router = useRouter();

    return (
        <Wrapper className="py-20 lg:py-32">
            <div className="flex flex-col items-center text-center gap-4">
                <AnimationContainer animation="fadeUp" delay={0.2}>
                    <SectionBadge title="Pricing" />
                </AnimationContainer>

                <AnimationContainer animation="fadeUp" delay={0.3}>
                    <h2 className="text-2xl md:text-4xl lg:text-5xl font-medium !leading-tight text-transparent bg-clip-text bg-gradient-to-b from-foreground to-neutral-400">
                        Free and Open Source
                    </h2>
                </AnimationContainer>

                <AnimationContainer animation="fadeUp" delay={0.4}>
                    <p className="text-sm md:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto">
                        Our analytics platform is completely free and open source - no hidden fees, no premium tiers
                    </p>
                </AnimationContainer>
            </div>

            <div className="flex justify-center pt-10 max-w-2xl mx-auto">
                {PRICING_PLANS.map((plan, index) => (
                    <AnimationContainer
                        key={index}
                        animation="fadeUp"
                        delay={0.6 + (index * 0.2)}
                        className="w-full max-w-md"
                    >
                        <div
                            className="relative rounded-3xl backdrop-blur-3xl p-8 flex flex-col overflow-hidden bg-[#181818]"
                        >
                            <div className="absolute inset-x-0 mx-auto -top-1/8 size-40 rounded-full bg-primary -z-10 blur-[5rem]" />
                            <div className="absolute top-0 w-4/5 mx-auto inset-x-0 h-px bg-gradient-to-r from-primary/0 via-primary to-primary/0"></div>

                            <AnimationContainer animation="fadeUp" delay={0.7 + (index * 0.2)}>
                                <div className="mb-8">
                                    <h3 className="text-xl font-medium mb-2">{plan.name}</h3>
                                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                                </div>
                            </AnimationContainer>

                            <AnimationContainer animation="fadeUp" delay={0.8 + (index * 0.2)}>
                                <div className="flex items-baseline justify-center gap-2 mb-8">
                                    <span className="text-4xl font-medium">$</span>
                                    <span className="text-5xl font-medium">
                                        <NumberFlow
                                            value={0}
                                        />
                                    </span>
                                    <span className="text-muted-foreground">/forever</span>
                                </div>
                            </AnimationContainer>

                            <div className="flex-1">
                                <AnimationContainer animation="fadeUp" delay={0.9 + (index * 0.2)}>
                                    <ul className="space-y-4 mb-8">
                                        {plan.features.map((feature, featureIndex) => (
                                            <li key={featureIndex} className="flex items-center gap-3">
                                                <Check className="w-5 h-5 text-primary" />
                                                <span className="text-sm text-foreground">
                                                    {feature.text}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </AnimationContainer>
                            </div>

                            <AnimationContainer animation="fadeUp" delay={1 + (index * 0.2)}>
                                    <Button
                                        variant="default"
                                        className="w-full"
                                        onClick={() => router.push('/signin')}
                                    >
                            
                                        Get Started
                         
                                    </Button>
                            </AnimationContainer>
                        </div>
                    </AnimationContainer>
                ))}
            </div>
        </Wrapper>
    );
};

export default Pricing;
