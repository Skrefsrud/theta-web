"use client";

import { useWaitlist } from "./waitlist-context";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { type VariantProps } from "class-variance-authority";

type JoinWaitlistButtonProps = React.ComponentProps<typeof Button> &
  VariantProps<typeof buttonVariants> & {
    children?: React.ReactNode;
  };

export function JoinWaitlistButton({
  className,
  children,
  ...props
}: JoinWaitlistButtonProps) {
  const { openModal } = useWaitlist();

  return (
    <Button
      onClick={openModal}
      className={cn(
        "bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-medium shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:shadow-cyan-500/30 transition-all duration-300",
        className,
      )}
      {...props}
    >
      {children || "Join Waitlist"}
    </Button>
  );
}
