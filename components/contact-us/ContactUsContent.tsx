/* eslint-disable react/no-unescaped-entities */
"use client";

import React from "react";
import { Input } from "./inputCon";
import { Label } from "./labelCon";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Send } from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";

export default function ContactUsContent() {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    };

    return (
        <section className="w-full my-[10vh] flex items-center justify-center">
            <div className="max-w-6xl w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-black">
                <div className="flex flex-col md:flex-row gap-8">
                    <div className="flex-1">
                        <h2 className="font-bold text-3xl text-neutral-200 mb-2">
                            Contact Us
                        </h2>
                        <p className="text-sm max-w-sm mb-8 text-neutral-300">
                            Have a question or want to get in touch? Fill out the form below and we'll get back to you as soon as possible.
                        </p>

                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
                                <LabelInputContainer>
                                    <Label htmlFor="firstname">First name</Label>
                                    <Input id="firstname" placeholder="John" type="text" />
                                </LabelInputContainer>
                                <LabelInputContainer>
                                    <Label htmlFor="lastname">Last name</Label>
                                    <Input id="lastname" placeholder="Doe" type="text" />
                                </LabelInputContainer>
                            </div>
                            <LabelInputContainer>
                                <Label htmlFor="email">Email Address</Label>
                                <Input id="email" placeholder="john.doe@example.com" type="email" />
                            </LabelInputContainer>
                            <LabelInputContainer>
                                <Label htmlFor="message">Message</Label>
                                <Textarea id="message" placeholder="Your message here..." className="h-32" />
                                <BottomGradient />
                            </LabelInputContainer>

                            <Button
                                className="bg-gradient-to-br  max-w-[550px] mx-auto relative group/btn from-zinc-900 to-zinc-900 block bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                                type="submit"
                                size={"sm"}
                            >
                                Send Message
                                <BottomGradient />
                            </Button>
                        </form>
                    </div>
                    <div className="flex-1">
                        <Image
                            src="/images/Rotated/img-1.jpg"
                            alt="Contact Us"
                            width={1800}
                            height={1900}
                            className="w-full h-full object-cover rounded-lg"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}

const BottomGradient = () => {
    return (
        <>
            <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
            <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
        </>
    );
};

const LabelInputContainer = ({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) => {
    return (
        <div className={cn("flex flex-col space-y-2 w-full", className)}>
            {children}
        </div>
    );
};