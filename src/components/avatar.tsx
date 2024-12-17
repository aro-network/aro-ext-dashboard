import { cn } from "@nextui-org/react";
import Avatar from "boring-avatars";
import { upperCase } from "lodash";

export function MAvatar({ name, className, size, showFirst }: { name?: string; className?: string; size?: number; showFirst?: boolean }) {
  return (
    <div className={cn("relative flex", className)} style={{ fontSize: Math.floor((size || 24) * 0.4) }}>
      <Avatar name={name} size={size} variant="marble" />
      {name && showFirst && (
        <div className="absolute left-0 top-0 h-full w-full flex justify-center items-center text-white font-medium">{upperCase(name[0])}</div>
      )}
    </div>
  );
}
