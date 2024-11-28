import { useAuthContext } from "@/app/context/AuthContext";
import { cn } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { CircularProgressbar } from "react-circular-progressbar";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { Btn } from "./btns";
import { TitCard } from "./cards";

export const TASKS = [
  { tit: "Connect X", sub: "Connect and verify X account", reward: "+30 EXP" },
  { tit: "Connect Discord", sub: "Connect and verify Discord account", reward: "+30 EXP" },
  { tit: "Connect Telegram", sub: "Connect and verify Telegram account", reward: "+30 EXP" },
  { tit: "Chrome Extension Node", sub: "Initiate your first EnReach Node and win 40 EXP", reward: "+40 EXP" },
];

const connectEXP = 30;
const extensionEXP = 40;

function TaskCard({
  tit,
  sub,
  reward,
  isProgress,
  progress = 0,
  complete,
  onClickCarry,
}: {
  tit?: string;
  sub?: string;
  reward?: string;
  isProgress?: boolean;
  progress?: number;
  complete?: boolean;
  onClickCarry?: () => void;
}) {
  return (
    <div className="bg-white/10 rounded-lg p-4 flex items-center justify-between">
      <div className="flex flex-col items-start gap-1 text-sm">
        <span className="text-white">{tit}</span>
        <span className="text-white/50">{sub}</span>
        <span className="text-primary">{reward}</span>
      </div>
      {isProgress ? (
        <CircularProgressbar
          className="!w-14 !h-14"
          styles={{
            // Customize the path, i.e. the "completed progress"
            path: {
              // Path color
              stroke: `#fff`,
              // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
              strokeLinecap: "butt",
              // Customize transition animation
              transition: "stroke-dashoffset 0.5s ease 0s",
              // Rotate the path
              transform: "rotate(180deg)",
              transformOrigin: "center center",
            },
            // Customize the circle behind the path, i.e. the "total progress"
            trail: {
              // Trail color
              stroke: "rgba(255,255,255,0.1)",
              // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
              strokeLinecap: "butt",
              // Rotate the trail
              transformOrigin: "center center",
            },
            // Customize the text
            text: {
              // Text color
              fill: "#fff",
              // Text size
              fontSize: "18px",
            },
          }}
          text={`${progress}%`}
          value={progress}
        />
      ) : (
        <Btn className={cn("flex items-center gap-2 ", { "bg-white/80 text-primary hover:bg-white": complete })} onClick={() => !complete && onClickCarry?.()}>
          {complete ? "Done" : "Go"}
          {complete && <IoIosCheckmarkCircle className="text-base " />}
        </Btn>
      )}
    </div>
  );
}

export function TaskList() {
  const ac = useAuthContext();
  const user = ac.queryUserInfo?.data;
  const r = useRouter();
  const connectRward = `+${connectEXP} EXP`;
  const extensionRward = `+${extensionEXP} EXP`;
  return (
    <TitCard tit="Task & Achievements" className="col-span-10">
      <div className="grid xl:grid-cols-2 gap-5">
        <TaskCard tit="Connect X" sub="Connect and verify X account" reward={connectRward} complete={Boolean(user?.social.x)} onClickCarry={() => r.push("/?tab=my_profile")} />
        <TaskCard
          tit="Connect Discord"
          sub="Connect and verify Discord account"
          reward={connectRward}
          complete={Boolean(user?.social.discord)}
          onClickCarry={() => r.push("/?tab=my_profile")}
        />
        <TaskCard
          tit="Connect Telegram"
          sub="Connect and verify Telegram account"
          reward={connectRward}
          complete={Boolean(user?.social.tg)}
          onClickCarry={() => r.push("/?tab=my_profile")}
        />
        <TaskCard
          tit="Chrome Extension Node"
          sub={`Initiate your first EnReach Node and win ${extensionEXP} EXP`}
          reward={extensionRward}
          complete={Boolean(user?.task.extension)}
          onClickCarry={() => window.open(`https://chromewebstore.google.com/detail/${"extid"}`, "_blank")}
        />
        {/* <TaskCard
        tit="Up and steady"
        sub="Achieved 12 hours of daily uptime for the first time."
        reward="+50 EXP"
        isProgress
        progress={_.floor(((user?.task.uptime || 0) * 100) / (12 * 60 * 60))}
      /> */}
        {/* <TaskCard tit="Referral maniac" sub="Having 10 qualified referrals." reward="+50 EXP" isProgress progress={_.floor(((user?.referral.valid || 0) * 100) / 10)} /> */}
      </div>
    </TitCard>
  );
}

export function CurrentTask() {}
