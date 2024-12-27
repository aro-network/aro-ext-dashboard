import { useAuthContext } from "@/app/context/AuthContext";
import { useMenusCtx } from "@/app/context/MenusContext";
import { SVGS } from "@/svg";
import { cn } from "@nextui-org/react";
import { ReactNode, useMemo } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { Btn, TransBtn } from "./btns";
import { BgCard, TitCard } from "./cards";

export const TASKS = [
  {
    sort: 0,
    btn: "Download Chrome Extension",
    tit: "Chrome Extension Node",
    sub: (
      <div>
        Initiate your first EnReach Node and win 40 <SVGS.SvgExp className="inline-block fix-v-center" />
      </div>
    ),
    reward: (
      <>
        40 <SVGS.SvgExp className="inline-block fix-v-center" />
      </>
    ),
    icon: <SVGS.SvgExt />,
    rewardIcon: <SVGS.SvgExp />,
  },
  {
    sort: 1,
    btn: "Connect X",
    tit: "Connect X",
    sub: "Connect and verify X account",
    reward: (
      <>
        30 <SVGS.SvgExp className="inline-block fix-v-center" />
      </>
    ),
    icon: <SVGS.SvgX />,
    rewardIcon: <SVGS.SvgExp />,
  },
  {
    sort: 1,
    btn: "Connect Discord",
    tit: "Connect Discord",
    sub: "Connect and verify Discord account",
    reward: (
      <>
        30 <SVGS.SvgExp className="inline-block fix-v-center" />
      </>
    ),
    icon: <SVGS.SvgDiscord />,
    rewardIcon: <SVGS.SvgExp />,
  },
  {
    sort: 1,
    btn: "Connect Telegram",
    tit: "Connect Telegram",
    sub: "Connect and verify Telegram account",
    reward: (
      <>
        30 <SVGS.SvgExp className="inline-block fix-v-center" />
      </>
    ),
    icon: <SVGS.SvgTg />,
    rewardIcon: <SVGS.SvgExp />,
  },
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
          { complete: Boolean(user?.social.x), onGoTo: () => mc.toMenu("My Account") },
          { complete: Boolean(user?.social.discord), onGoTo: () => mc.toMenu("My Account") },
          { complete: Boolean(user?.social.tg), onGoTo: () => mc.toMenu("My Account") },
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
  sub?: ReactNode;
  reward?: ReactNode;
  isProgress?: boolean;
  progress?: number;
  complete?: boolean;
  onClickCarry?: () => void;
}) {
  return (
    <div className="flip_item bg-white/10 rounded-lg p-4 flex items-center justify-between">
      <div className="flex flex-col items-start gap-1 text-sm">
        <span className="text-white">{tit}</span>
        <span className="text-white/50">{sub}</span>
        <span className="text-primary gap-1">+{reward}</span>
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
              fontSize: "1.125rem",
            },
          }}
          text={`${progress}%`}
          value={progress}
        />
      ) : (
        <Btn isDisabled={complete} className={cn("flex items-center gap-1.5 w-[5.0625rem] px-1 justify-center", { " text-primary bg-white/80 !opacity-100": complete })} onClick={() => !complete && onClickCarry?.()}>

          {complete ? "Done" : "Go"}
          {complete && <IoIosCheckmarkCircle className="text-[1.0769rem] " />}
        </Btn>
      )}
    </div>
  );
}

export function TaskList() {
  const tasks = useTasks();
  return (
    <TitCard tit="Task & Achievements" className="flip_item col-span-10">
      <div className="grid xl:grid-cols-2 gap-5">
        {tasks.map((task) => (
          <TaskCard key={task.tit} tit={task.tit} sub={task.sub} reward={task.reward} complete={task.complete} onClickCarry={task.onGoTo} />
        ))}
      </div>
    </TitCard>
  );
}

export function CurrentTask(p: { wrapClassName?: string }) {
  const tasks = useTasks();
  const cTask = tasks.find((item) => !item.complete);
  return (
    <>
      {cTask ? (
        <BgCard className="justify-between px-5 py-7" wrapClassName={p.wrapClassName}>
          <div className="flex items-center justify-center mt-6 text-[3rem]">
            <div className="shadow-2 rounded-full">{cTask.icon}</div>
            <div className="shadow-2 rounded-full w-12 h-12 flex justify-center items-center -ml-3 bg-white text-2xl">{cTask.rewardIcon}</div>
          </div>
          <div className="flex flex-col justify-start items-center relative gap-1">
            <p className="flex-grow-0 flex-shrink-0 text-4xl font-bold text-center uppercase text-white gap-2">Get {cTask.reward}</p>
            <p className="flex-grow-0 flex-shrink-0 h-7 opacity-60 text-sm text-center text-white">{cTask.sub}</p>
          </div>
          <Btn className="flex-grow-0 flex-shrink-0 w-full max-w-[14.125rem]" onClick={cTask.onGoTo}>
            {cTask.btn}
          </Btn>
        </BgCard>
      ) : (
        <BgCard className="justify-between px-5 py-7 min-h-[12.5rem] relative" wrapClassName={p.wrapClassName}>
          {Boolean(tasks.length) && (
            <>
              <img className="object-cover absolute left-0 top-0 w-full h-full" src="bg-coming.svg" alt="bg" />
              <img className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" src="task-coming.svg" alt="comming" />
              <div style={{ top: "calc(50% + 3.125rem)" }} className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap  text-center text-white/70 text-base">
                More tasks coming soon...
              </div>
            </>
          )}
        </BgCard>
      )}
    </>
  );
}
