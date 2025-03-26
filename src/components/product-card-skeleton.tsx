import React from "react";
import { Skeleton } from "./ui/skeleton";

export function ProductCardSkeleton() {
  return (
    <div className="relative">
      {/* Image Skeleton */}
      <Skeleton className="aspect-square bg-gray-200" />

      <div className="p-4">
        {/* Title Skeleton */}
        <Skeleton className="h-4 w-3/4 bg-gray-200 rounded" />

        {/* Description Skeleton */}
        <Skeleton className="h-3 w-full bg-gray-200 rounded mt-2" />
        <Skeleton className="h-3 w-5/6 bg-gray-200 rounded mt-1" />

        {/* Price Skeleton */}
        <Skeleton className="h-4 w-1/4 bg-gray-200 rounded mt-4" />
        <Skeleton className="h-3 w-1/6 bg-gray-200 rounded mt-1" />

        {/* Button Skeleton */}
        <Skeleton className="absolute bottom-0 left-0 right-0 h-10 bg-gray-200" />
      </div>
    </div>
  );
}
