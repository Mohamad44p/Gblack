"use client";

import React from "react";

export default function SkeletonLoader() {
  return (
    <>
      <section className="hero section md:my-44">
        <div className="w-full h-screen bg-black" />
      </section>

      <div className="hidden md:block">
        <section
          className="main section overflow-y-hidden"
          aria-label="Product Showcase"
        >
          <div className="main-content">
            <div className="logo">
              <div className="w-[100px] h-[100px] bg-gray-800 rounded-full animate-pulse" />
            </div>
            <div className="copy" aria-label="Product Description">
              <div className="line">
                <div className="w-48 h-6 bg-gray-800 rounded animate-pulse" />
              </div>
              <div className="mt-2 space-y-2">
                <div className="w-64 h-4 bg-gray-800 rounded animate-pulse" />
                <div className="w-56 h-4 bg-gray-800 rounded animate-pulse" />
                <div className="w-60 h-4 bg-gray-800 rounded animate-pulse" />
              </div>
            </div>
            <div className="btn">
              <div className="w-32 h-10 bg-gray-800 rounded animate-pulse" />
            </div>
          </div>

          {[...Array(3)].map((_, i) => (
            <div className="row" key={i}>
              <div className="card card-left">
                <div className="w-full h-full bg-gray-800 rounded-lg animate-pulse" />
              </div>
              <div className="card card-right">
                <div className="w-full h-full bg-gray-800 rounded-lg animate-pulse" />
              </div>
            </div>
          ))}
        </section>
      </div>
    </>
  );
}
