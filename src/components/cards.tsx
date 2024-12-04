import { Card, cn } from "@nextui-org/react";
import React, { PropsWithChildren, ReactNode } from "react";

export function IconCard({ icon, className, iconSize = 30, tit, content }: { icon: React.FC; className?: string; iconSize?: number; tit: ReactNode; content: ReactNode }) {
  const Micon = icon;
  return (
    <Card className={cn("bg-iconcard bg-no-repeat shadow-1 backdrop-blur-lg flex flex-col p-[28px] gap-[45px]", className)}>
      <div className="flex items-center whitespace-nowrap" style={{ height: 30 }}>
        <div
          className="shrink-0"
          style={{
            height: iconSize,
            width: 120 - iconSize,
            fontSize: iconSize,
            paddingLeft: (30 - iconSize) / 2,
          }}
        >
          <Micon />
        </div>
        {tit}
      </div>
      <div className="w-full flex flex-row">
        <div style={{ maxWidth: 120 - iconSize }} className="flex-1" />
        <div className="flex-1 basis-32">{content}</div>
      </div>
    </Card>
  );
}

export function InnerIconCard({ icon, className, iconSize = 30, children }: PropsWithChildren & { icon: React.FC; className?: string; iconSize?: number }) {
  const Micon = icon;
  return (
    <Card className={cn("bg-iconcardin bg-no-repeat flex flex-row p-[30px]", className)}>
      <div
        className=""
        style={{
          height: iconSize,
          width: 120 - iconSize,
          fontSize: iconSize,
          paddingLeft: (30 - iconSize) / 2,
          paddingTop: (30 - iconSize) / 2,
        }}
      >
        <Micon />
      </div>
      {children}
    </Card>
  );
}

export function TitCard(p: PropsWithChildren & { tit?: string; right?: ReactNode; className?: string }) {
  return (
    <Card className={cn("bg-l1 shadow-1 backdrop-blur-lg flex p-6 gap-6", p.className)}>
      {p.tit && (
        <div className="flex items-center justify-between">
          <span className="text-base font-bold">{p.tit}</span>
          {p.right}
        </div>
      )}
      {p.children}
    </Card>
  );
}

export function BgCard(p: PropsWithChildren & { className?: string }) {
  return <Card className={cn("bg-i1 flex flex-col justify-start items-center p-6 gap-6", p.className)}>{p.children}</Card>;
}
