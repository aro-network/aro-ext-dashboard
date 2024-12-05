import { cn } from "@nextui-org/react";

const Level0 = ({ className }: { className?: string }) => <img className={cn("w-[1em] h-[1em] object-contain", className)} src="/level0.png" alt="level0" />;
const Level1 = ({ className }: { className?: string }) => <img className={cn("w-[1em] h-[1em] object-contain", className)} src="/level1.png" alt="level1" />;
const Level2 = ({ className }: { className?: string }) => <img className={cn("w-[1em] h-[1em] object-contain", className)} src="/level2.png" alt="level2" />;
const Level3 = ({ className }: { className?: string }) => <img className={cn("w-[1em] h-[1em] object-contain", className)} src="/level3.png" alt="level3" />;

export const levels = [
  { icon: Level0, exp: 0,     level: 0, name: "Baby Berry",   boost: "+ 0%", color: "#DFDFDF" },
  { icon: Level1, exp: 100,   level: 1, name: "Teen Berry",   boost: "+ 50%", color: "#EAE0F0" },
  { icon: Level2, exp: 500,   level: 2, name: "Big Blue",     boost: "+ 100%", color: "#8A9CF1" },
  { icon: Level3, exp: 1000,  level: 3, name: "Berry Captain", boost: "+ 200%", color: "#FFFBB4" },
];

export function UserLevel() {
  const item_gap_rate = 2;
  const gapDeg = 360 / levels.length / (item_gap_rate + 1);
  const itemDeg = gapDeg * item_gap_rate;

  const startDeg = 0
  return <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} xmlns="http://www.w3.org/2000/svg">
    { levels.map(l => <path d=""/>)}
  </svg>;
}
