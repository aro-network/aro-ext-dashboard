import { useAuthContext } from "@/app/context/AuthContext";
import { useMenusCtx } from "@/app/context/MenusContext";
import { SVGS } from "@/svg";
import { cn } from "@nextui-org/react";
import { useMemo } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { Btn, TransBtn } from "./btns";
import { BgCard, TitCard } from "./cards";

export const TASKS = [
  {
    sort: 0,
    btn: "Download Chrome Extension",
    tit: "Chrome Extension Node",
    sub: "Initiate your first EnReach Node and win 40 ☀️",
    reward: "40 ☀️",
    icon: <SVGS.SvgExt />,
    rewardIcon: <SVGS.SvgExp />,
  },
  { sort: 1, btn: "Connect X", tit: "Connect X", sub: "Connect and verify X account", reward: "30 ☀️", icon: <SVGS.SvgX />, rewardIcon: <SVGS.SvgExp /> },
  { sort: 1, btn: "Connect Discord", tit: "Connect Discord", sub: "Connect and verify Discord account", reward: "30 ☀️", icon: <SVGS.SvgDiscord />, rewardIcon: <SVGS.SvgExp /> },
  { sort: 1, btn: "Connect Telegram", tit: "Connect Telegram", sub: "Connect and verify Telegram account", reward: "30 ☀️", icon: <SVGS.SvgTg />, rewardIcon: <SVGS.SvgExp /> },
];

export const onToDownExtension = () => {
  window.open(`https://chromewebstore.google.com/detail/${"extid"}`, "_blank");
};
function useTasks() {
  const ac = useAuthContext();
  const user = ac.queryUserInfo?.data;
  const mc = useMenusCtx();
  const TasksStat = useMemo(
    () =>
      !user
        ? []
        : [
            { complete: Boolean(user?.task.extension), onGoTo: onToDownExtension },
            { complete: Boolean(user?.social.x), onGoTo: () => mc.toMenu("My Profile") },
            { complete: Boolean(user?.social.discord), onGoTo: () => mc.toMenu("My Profile") },
            { complete: Boolean(user?.social.tg), onGoTo: () => mc.toMenu("My Profile") },
          ].map((item, i) => ({ ...item, ...TASKS[i] })),
    [user]
  );
  return TasksStat;
}

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
  const tasks = useTasks();
  return (
    <TitCard tit="Task & Achievements" className="col-span-10">
      <div className="grid xl:grid-cols-2 gap-5">
        {tasks.map((task) => (
          <TaskCard key={task.tit} tit={task.tit} sub={task.sub} reward={`+${task.reward}`} complete={task.complete} onClickCarry={task.onGoTo} />
        ))}
      </div>
    </TitCard>
  );
}

export function CurrentTask() {
  const tasks = useTasks();
  const cTask = tasks.find((item) => !item.complete);
  return (
    <>
      {cTask ? (
        <BgCard className="justify-between px-5 py-7 xl:order-2">
          <div className="flex items-center justify-center mt-6 text-[3rem]">
            <div className="shadow-2 rounded-full">{cTask.icon}</div>
            <div className="shadow-2 rounded-full -ml-3">{cTask.rewardIcon}</div>
          </div>
          <div className="flex flex-col justify-start items-center relative gap-1">
            <p className="flex-grow-0 flex-shrink-0 text-4xl font-bold text-center uppercase text-white">Get {cTask.reward}</p>
            <p className="flex-grow-0 flex-shrink-0 h-7 opacity-60 text-sm text-center text-white">{cTask.sub}</p>
          </div>
          <TransBtn className="flex-grow-0 flex-shrink-0 w-full text-xs font-medium" onClick={cTask.onGoTo}>
            {cTask.btn}
          </TransBtn>
        </BgCard>
      ) : (
        <BgCard className="justify-between px-5 py-7 min-h-[12.5rem] xl:order-2 relative">
          {Boolean(tasks.length) && (
            <>
              <img className="object-cover absolute left-0 top-0 w-full h-full" src="bg-coming.svg" alt="bg" />
              <img className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" src="task-coming.svg" alt="comming" />
            </>
          )}
        </BgCard>
      )}
    </>
  );
}
