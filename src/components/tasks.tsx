import { useAuthContext } from "@/app/context/AuthContext";
import { useMenusCtx } from "@/app/context/MenusContext";
import { SVGS } from "@/svg";
import { cn } from "@nextui-org/react";
import { ReactNode, useMemo } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import { IoIosCheckmarkCircle, IoMdHeart } from "react-icons/io";
import { GoArrowUpRight } from "react-icons/go";
import { Btn } from "./btns";
import { BgCard, TitCard } from "./cards";
import { FcLike } from "react-icons/fc";
import { BsImage } from "react-icons/bs";
import { useQuery } from "@tanstack/react-query";
import backendApi from "@/lib/api";


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
  {
    sort: 1,
    btn: "Popular Album",
    tit: "Popular Album",
    sub: "Get more Likes for your album",
    icon: <SVGS.SvgTg />,
    rewardIcon: <SVGS.SvgExp />,
  },
  {
    sort: 1,
    btn: "Berry Friends",
    tit: "Berry Friends",
    sub: "Find Berry Friends and get selfie photos",
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
  const { data } = useQuery({
    queryKey: [""],
    queryFn: () => backendApi.userRecordCount(),
  });
  const mc = useMenusCtx();
  const TasksStat = useMemo(
    () =>
      !user
        ? []
        : [
          { complete: Boolean(user?.task.extension), onGoTo: onToDownExtension },
          { complete: Boolean(user?.social.x), onGoTo: () => mc.toMenu("Profile") },
          { complete: Boolean(user?.social.discord), onGoTo: () => mc.toMenu("Profile") },
          { complete: Boolean(user?.social.tg), onGoTo: () => mc.toMenu("Profile") },
          {
            tips: data?.likes ? (
              <div className="flex items-center gap-1  text-xs justify-center mt-1">
                {data?.likes} <FcLike className="h-3 w-3" /> x {data?.tapExp}<div className="text-xs"><SVGS.SvgExp /></div>
              </div>
            ) : null,
            expCount: Number((data?.likes ?? 0) * (data?.tapExp ?? 0)) || '0',
            record: data,
            show: data?.likes,
            reward: (
              <>
                {data?.tapExp} <SVGS.SvgExp className="inline-block fix-v-center" />
              </>
            ),
          },
          {
            tips: data?.berryFriends ? (
              <div className="flex items-center gap-1  flex-row text-xs justify-center mt-1 ">
                {data?.berryFriends} <BsImage className=" text-[#4281FF]" />x {data?.tapExp}<div className="text-xs"><SVGS.SvgExp /></div>
              </div>
            ) : null,
            expCount: Number((data?.berryFriends ?? 0) * (data?.tapExp ?? 0)) || '0',
            record: data,
            show: data?.berryFriends,
            reward: (
              <>
                {data?.tapExp} <SVGS.SvgExp className="inline-block fix-v-center" />
              </>
            ),
          },
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
  tips,
  expCount,
  record,
  show,
}: {
  tit?: string;
  sub?: ReactNode;
  reward?: ReactNode;
  isProgress?: boolean;
  progress?: number;
  complete?: boolean;
  onClickCarry?: () => void;
  tips?: ReactNode;
  expCount?: ReactNode,
  record?: { berryFriends: number; likes: number; tapExp: number },
  show: boolean
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
        <div>

          <Btn isDisabled={complete || !!record?.berryFriends || !!record?.likes} className={cn("flex items-center  w-[5.0625rem] px-1 justify-center h-[2.125rem]", { " text-primary bg-white/80 !opacity-100": complete || expCount, 'gap-1': expCount })} onClick={() => !complete && onClickCarry?.()}>
            {complete ? 'Done' : (expCount || expCount === 0) ? expCount : 'Go'}
            {complete && <IoIosCheckmarkCircle className="text-[1.0769rem] " />}
            {show ? <SVGS.SvgExp /> : null}
          </Btn>
          <div>
            {tips}
          </div>
        </div>

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
          <TaskCard key={task.tit} tit={task.tit} sub={task.sub} reward={task.reward} complete={task.complete} onClickCarry={task.onGoTo} tips={task.tips} record={task.record} expCount={task.expCount} show={task.show} />
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
        <BgCard wrapClassName={p.wrapClassName} >
          <div className={`justify-between  h-20 flex-row items-center gap-[.625rem] flex`}>
            <div className="flex items-center justify-center text-[3rem]">
              <div className="shadow-2 rounded-full">{cTask.icon}</div>
              <div className="shadow-2 rounded-full w-12 h-12 flex justify-center items-center -ml-3 bg-white text-2xl">{cTask.rewardIcon}</div>
            </div>
            <div className="flex flex-col justify-start items-center relative gap-[.625rem]">
              <p className="flex-grow-0 flex-shrink-0 text-sm font-normal text-center uppercase text-white gap-2">Get {cTask.reward}</p>
              <p className="flex-grow-0 flex-shrink-0 opacity-60  text-sm  text-center text-white">{cTask.sub}</p>
            </div>
            <button className=" bg-[#4281FF]  hover:bg-default rounded-full flex items-center justify-center w-8 h-8 text-base" onClick={cTask.onGoTo}>
              <GoArrowUpRight />
            </button>
          </div>
        </BgCard>
      ) : (
        <BgCard className="justify-between px-5 py-7 min-h-[6.875rem] relative flex items-center" >
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
