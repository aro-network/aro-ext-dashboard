import { SVGS } from "@/svg";
import { IconCard, TitCard } from "./cards";
import { Booster, DupleInfo, TrendingChart } from "./my-dashboard";
import { Btn } from "./btns";
import { CircularProgressbar } from "react-circular-progressbar";
import { cn } from "@nextui-org/react";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { useAuthContext } from "@/app/context/AuthContext";
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
        <Btn className={cn("flex items-center gap-2 ", { "bg-white/80 text-primary": complete })} onClick={() => onClickCarry?.()}>
          {complete ? "Done" : "Carry Out"}
          {complete && <IoIosCheckmarkCircle className="text-base " />}
        </Btn>
      )}
    </div>
  );
}

export default function MyRewards() {
  const { queryUserInfo } = useAuthContext();
  return (
    <div className="grid grid-cols-10 gap-4">
      <IconCard icon={SVGS.SvgBerry} className="col-span-10 xl:col-span-4 justify-between">
        <div className="w-0 flex-1 flex flex-col gap-10">
          <div className="flex justify-between items-center w-full">
            <span>BERRY</span>
            <Booster boost={queryUserInfo?.data?.stat.extraBoost || 0} />
          </div>
          <DupleInfo tit="124" sub="Total Rewards" subTip="Total Rewards" titClassName="text-[2rem]" subClassName="text-lg" />
          <div className="flex items-center gap-4 justify-between">
            <DupleInfo tit="124" sub="Network Rewards" />
            <div className="w-[1px] bg-white/30 h-6" />
            <DupleInfo tit="124" sub="Referral Bonus" />
            <div className="w-[1px] bg-white/30 h-6" />
            <DupleInfo tit="124" sub="Other Bonus" />
          </div>
        </div>
      </IconCard>
      <div className="col-span-10 xl:col-span-6">
        <TrendingChart />
      </div>
      <TitCard tit="Task & Achievements" className="col-span-10">
        <div className="grid xl:grid-cols-2 gap-5">
          <TaskCard tit="Connect X" sub="Connect and verify X acount" reward="+50 EXP" complete />
          <TaskCard tit="Connect Discord" sub="Connect and verify Discord acount" reward="+50 EXP" />
          <TaskCard tit="Connect Telegram" sub="Connect and verify Telegram acount" reward="+50 EXP" />
          <TaskCard tit="Chrome Extension Node" sub="Initiate your first EnReach Node and win 50 Berry" reward="+50 Berry" />
          <TaskCard tit="Up and steady" sub="Achieved 12 hours of daily uptime for the first time." reward="+50 EXP" isProgress progress={34} />
          <TaskCard tit="Referral maniac" sub="Having 10 qualified referrals." reward="+50 EXP" isProgress progress={0} />
        </div>
      </TitCard>
    </div>
  );
}
