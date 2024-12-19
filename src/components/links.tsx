import { cn } from "@nextui-org/react";
import Link, { LinkProps } from "next/link";
import { PropsWithChildren } from "react";

export function MLink(p: Partial<LinkProps> & PropsWithChildren & React.RefAttributes<HTMLAnchorElement> & { className?: string; isDisable?: boolean, target?: string }) {
  const { children, target = '_self', className, onClick, isDisable, href = "javascript:void(0);", ...props } = p;

  return (
    <Link
      target={target}
      href={href}
      onClick={(e) => {
        if (!isDisable) {
          onClick?.(e);
        }
      }}
      className={cn("underline text-white/60 hover:text-primary cursor-pointer", { "cursor-not-allowed hover:text-white/60": isDisable }, className)}
      {...props}
    >
      {children}
    </Link>
  );
}
