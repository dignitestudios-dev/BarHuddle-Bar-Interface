import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-xl bg-[rgba(124,58,237,0.15)] border border-[rgba(124,58,237,0.2)]", className)}
      {...props}
    />
  );
}

export { Skeleton };
