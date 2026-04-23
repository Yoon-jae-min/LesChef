import React from "react";

type SkeletonProps = {
  className?: string;
  "aria-label"?: string;
};

export default function Skeleton({ className = "", ...props }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-gray-100 ${className}`}
      aria-hidden={props["aria-label"] ? undefined : true}
      {...props}
    />
  );
}

