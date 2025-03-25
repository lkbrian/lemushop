import React from "react";

export function ProductCardSkeleton() {
  return (
    <div className="group relative rounded-lg border bg-white overflow-hidden transition-all hover:shadow-md animate-pulse">
      {/* Image Skeleton */}
      <div className="aspect-square bg-gray-200" />

      <div className="p-4">
        {/* Title Skeleton */}
        <div className="h-4 w-3/4 bg-gray-200 rounded" />

        {/* Description Skeleton */}
        <div className="h-3 w-full bg-gray-200 rounded mt-2" />
        <div className="h-3 w-5/6 bg-gray-200 rounded mt-1" />

        {/* Price Skeleton */}
        <div className="h-4 w-1/4 bg-gray-200 rounded mt-4" />
        <div className="h-3 w-1/6 bg-gray-200 rounded mt-1" />

        {/* Button Skeleton */}
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-gray-200" />
      </div>
    </div>
  );
}
