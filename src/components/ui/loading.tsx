"use client";
import { Loader2 } from "lucide-react";

export const Loading = ({ className }: { className?: string }) => {
  return <Loader2 className={`animate-spin ${className}`} />;
};
