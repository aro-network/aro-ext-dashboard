import { cn } from "@nextui-org/react";
import Link, { LinkProps } from "next/link";
import { PropsWithChildren } from "react";

export function MLink(p: Partial<LinkProps> & PropsWithChildren & React.RefAttributes<HTMLAnchorElement> & { className?: string; isDisable?: boolean }) {
  const { children, className, onClick, isDisable, href = "javascript:void(0);", ...props } = p;

  return (
    <Link
      href={href}
      onClick={(e) => {
        !isDisable && onClick?.(e);
      }}
      className={cn("underline text-white/60 hover:text-primary cursor-pointer", { "cursor-not-allowed hover:text-white/60": isDisable }, className)}
      {...props}
    >
      {children}
    </Link>
  );
}
