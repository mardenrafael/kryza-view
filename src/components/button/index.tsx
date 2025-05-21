import { Button as CNButton } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ComponentProps } from "react";

type ButtonProps = {
  label: string;
  isLoading: boolean;
  className?: string;
} & ComponentProps<"button">;

export function Button({ label, isLoading, className, ...props }: ButtonProps) {
  return (
    <CNButton
      type="submit"
      className={cn("w-full", className)}
      disabled={isLoading}
      {...props}
    >
      {isLoading && (
        <div className="flex justify-center">
          <span className="animate-spin rounded-full h-6 w-6 border-2 border-t-transparent border-foreground" />
        </div>
      )}
      {label}
    </CNButton>
  );
}
