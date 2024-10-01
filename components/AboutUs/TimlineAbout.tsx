/* eslint-disable react/no-unescaped-entities */
import React from "react";
import { Timeline } from "@/components/ui/timeline";
import { Facebook, Twitter, Instagram, Linkedin, ShoppingBag, Rocket, Users, Globe, Zap } from "lucide-react";

export function TimlineAbout() {
    const data = [
        {
            title: "GBALACK Story",
            content: (
                <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                        <ShoppingBag className="w-8 h-8 text-yellow-500" />
                        <h3 className="text-xl font-semibold text-white">GBALACK Launches</h3>
                    </div>
                    <p className="text-neutral-200 text-sm md:text-base font-normal">
                        GBALACK e-commerce platform launches, revolutionizing online shopping with cutting-edge technology and user-centric design. Our mission is to provide a seamless and enjoyable shopping experience for customers worldwide.
                    </p>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="bg-neutral-800 p-4 rounded-lg">
                            <Zap className="w-6 h-6 text-yellow-400 mb-2" />
                            <h4 className="text-white font-semibold mb-2">AI-Powered Recommendations</h4>
                            <p className="text-neutral-300 text-sm">Personalized shopping experience using advanced AI algorithms</p>
                        </div>
                        <div className="bg-neutral-800 p-4 rounded-lg">
                            <Users className="w-6 h-6 text-green-400 mb-2" />
                            <h4 className="text-white font-semibold mb-2">Community-Driven</h4>
                            <p className="text-neutral-300 text-sm">Building a strong network of shoppers and sellers</p>
                        </div>
                    </div>
                </div>
            ),
        },
        {
            title: "Inception",
            content: (
                <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                        <Rocket className="w-8 h-8 text-blue-500" />
                        <h3 className="text-xl font-semibold text-white">The Idea is Born</h3>
                    </div>
                    <p className="text-neutral-200 text-sm md:text-base font-normal">
                        The idea for GBALACK is born. Our founders, a team of experienced e-commerce professionals and tech enthusiasts, come together with a shared vision of creating a next-generation online marketplace.
                    </p>
                    <div className="bg-gradient-to-r from-yellow-200 to-yellow-500 p-0.5 rounded-lg">
                        <div className="bg-neutral-900 p-4 rounded-lg">
                            <h4 className="text-white font-semibold mb-2">Our Founding Principles</h4>
                            <ul className="list-disc list-inside text-neutral-300 text-sm space-y-2">
                                <li>User-centric design</li>
                                <li>Cutting-edge technology</li>
                                <li>Sustainable practices</li>
                                <li>Community empowerment</li>
                            </ul>
                        </div>
                    </div>
                </div>
            ),
        },
        {
            title: "Our Vision",
            content: (
                <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                        <Globe className="w-8 h-8 text-green-500" />
                        <h3 className="text-xl font-semibold text-white">Global Impact</h3>
                    </div>
                    <p className="text-neutral-200 text-sm md:text-base font-normal">
                        At GBALACK, we envision a future where online shopping is not just convenient, but also personalized, sustainable, and community-driven.
                    </p>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="bg-neutral-800 p-4 rounded-lg">
                            <h4 className="text-white font-semibold mb-2">Our Goals</h4>
                            <ul className="list-disc list-inside text-neutral-300 text-sm space-y-2">
                                <li>Become the most trusted e-commerce platform globally</li>
                                <li>Implement eco-friendly practices</li>
                                <li>Support small businesses and local artisans</li>
                                <li>Continuously innovate to enhance the shopping experience</li>
                            </ul>
                        </div>
                        <div className="bg-neutral-800 p-4 rounded-lg flex items-center justify-center">
                            <div className="text-center">
                                <div className="text-4xl font-bold text-yellow-500 mb-2">1M+</div>
                                <div className="text-white text-sm">Happy Customers</div>
                            </div>
                        </div>
                    </div>
                </div>
            ),
        },
        {
            title: "Connect with Us",
            content: (
                <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                        <Users className="w-8 h-8 text-blue-500" />
                        <h3 className="text-xl font-semibold text-white">Join Our Community</h3>
                    </div>
                    <p className="text-neutral-200 text-sm md:text-base font-normal">
                        Stay connected with GBALACK and be part of our growing community. Follow us on social media for the latest updates, promotions, and community events.
                    </p>
                    <div className="flex space-x-6 mt-4">
                        <a href="#" className="text-neutral-400 hover:text-white transition-colors transform hover:scale-110" aria-label="Facebook">
                            <Facebook size={32} />
                        </a>
                        <a href="#" className="text-neutral-400 hover:text-white transition-colors transform hover:scale-110" aria-label="Twitter">
                            <Twitter size={32} />
                        </a>
                        <a href="#" className="text-neutral-400 hover:text-white transition-colors transform hover:scale-110" aria-label="Instagram">
                            <Instagram size={32} />
                        </a>
                        <a href="#" className="text-neutral-400 hover:text-white transition-colors transform hover:scale-110" aria-label="LinkedIn">
                            <Linkedin size={32} />
                        </a>
                    </div>
                </div>
            ),
        },
    ];

    return (
        <div className="w-full bg-neutral-950 font-sans">
            <div className="max-w-screen-2xl mx-auto py-20 px-4 md:px-8 lg:px-10">
                <h1 className="text-3xl md:text-5xl mb-4 text-white font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                    About GBALACK
                </h1>
                <p className="text-neutral-300 text-base md:text-lg max-w-2xl mb-12">
                    GBALACK is more than just an e-commerce platform. We're a community of passionate shoppers, sellers, and innovators, working together to redefine the online shopping experience.
                </p>
                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-200 to-yellow-500 blur-3xl opacity-20"></div>
                    <div className="relative z-10">
                        <Timeline data={data} />
                    </div>
                </div>
            </div>
        </div>
    );
}