import { SVGS } from "@/svg";
import { cn, Select, SelectItem } from "@nextui-org/react";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { FaLink } from "react-icons/fa6";
import { IoIosCheckmarkCircle, IoIosMore } from "react-icons/io";
import { IconCard, TitCard } from "./cards";

import { useAuthContext } from "@/app/context/AuthContext";
import { useCopy } from "@/hooks/useCopy";
import backendApi from "@/lib/api";
import { fmtDate } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import EChartsReact from "echarts-for-react";
import _ from "lodash";
import numbro from "numbro";
import { useDebounce, useMeasure } from "react-use";
import { UseMeasureRef } from "react-use/lib/useMeasure";
import { IconBtn } from "./btns";
import { fmtBerry, fmtBoost } from "./fmtData";
import { levels } from "./level";
import { CurrentTask } from "./tasks";
import { HelpTip } from "./tips";

export function DupleInfo({
  tit,
  sub,
  subTip,
  className,
  titClassName,
  subClassName,
}: {
  tit: ReactNode;
  sub: ReactNode;
  subTip?: string;
  titClassName?: string;
  subClassName?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col justify-start items-start relative shrink-0", className)}>
      <p className={cn("self-stretchflex-shrink-0 text-2xl font-medium text-left text-white", titClassName)}>{tit}</p>
      <div className={cn("font-AlbertSans flex justify-start items-center flex-shrink-0 relative gap-1 text-sm opacity-50 text-white", subClassName)}>
        {sub}
        {subTip && <HelpTip content={subTip} />}
      </div>
    </div>
  );
}

export function DupleSplit() {
  return <div className="bg-white opacity-30 w-[1px] h-6 shrink-0" />;
}

export function Booster() {
  const ac = useAuthContext();
  const boost = fmtBoost(ac.queryUserInfo?.data?.stat?.extraBoost);
  return (
    <div className="flex items-center rounded-full px-3 py-[.375rem] bg-primary ml-auto">
      <span className="font-sans text-xl">
        <SVGS.SvgRocket />
      </span>
      <div className="text-xs font-medium">
        {boost}x <span className="opacity-50">Boosting</span>
      </div>
    </div>
  );
}

function useDebounceMeasureWidth<T extends Element>() {
  const [dWidth, setWidth] = useState(0);
  const [ref, { width }] = useMeasure<T>();
  useDebounce(
    () => {
      setWidth(width);
    },
    300,
    [width]
  );
  return useMemo(() => [ref, dWidth] as [UseMeasureRef<T>, number], [ref, dWidth]);
}

const options = ["Total Rewards", "Network Rewards", "Referral Bonus"] as const;
type OptionType = (typeof options)[number];
export function TrendingChart({ className }: { className?: string }) {
  const [rewardType, setRewardType] = useState<OptionType>(options[0]);
  const { data: trendingRewards, isLoading } = useQuery({
    queryKey: ["TrendingChart"],
    queryFn: () => backendApi.trendingRewards(),
  });
  const [ref, width] = useDebounceMeasureWidth<HTMLDivElement>();

  const chartOpt = useMemo(() => {
    if (!width) return {};
    const datas = trendingRewards || [];
    const xData = datas.map((item) => fmtDate(item.date * 1000, "MMMD"));
    const yData = datas.map((item) => _.toNumber(rewardType === "Total Rewards" ? item.totalPoint : rewardType === "Network Rewards" ? item.networkPoint : item.referralPoint));
    console.info("width:", width);
    const showCount = Math.floor(width / 60);
    const endValue = xData.length - 1;
    const startValue = Math.max(0, endValue - showCount);
    return {
      animation: true,
      animationDuration: 200,
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
        formatter: (params: any) => {
          // console.info("params:", params)
          // <span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:rgba(0,0,0,0);"></span>
          return `<div>${params[0].marker.replace('background-color:rgba(0,0,0,0)', 'background-color:#4281FF')}${fmtBerry(params[0].data)}</div>`
        }
      },
      grid: { left: 40, top: 10, bottom: 30, right: 20, show: false },
      // toolbox: { show: false },
      dataZoom: [
        {
          type: "inside",
          // start: 0,
          startValue,
          endValue,
          zoomOnMouseWheel: false,
          moveOnMouseWheel: true,
          preventDefaultMouseMove: false,
        },
        {
          show: false,
        },
      ],
      xAxis: {
        type: "category",
        data: xData,
        axisLabel: { fontSize: 10, color: "rgba(255,255,255,0.5)" },
      },
      yAxis: {
        type: "value",
        boundaryGap: [0, "10%"],
        // max: (value: number) => value * 1.2,

        axisLabel: {
          color: "rgba(255,255,255,0.5)", formatter: (value: number) => numbro(value)
            .format({
              mantissa: 2,
              trimMantissa: true,
              average: value >= 1000,
            })
            .toUpperCase(),
        },
        splitLine: { lineStyle: { type: "dashed", color: "#fff", opacity: 0.05 } },
      },
      series: [
        {
          data: yData,
          type: "bar",
          itemStyle: {
            borderRadius: 15,
            color: "rgba(0,0,0,0)",
            decal: {
              color: "rgba(256,256,256,0.2)",
              dashArrayY: 3,
              dashArrayX: 1000,
              rotation: Math.PI / 4,
            },
          },

          label: {
            show: true,
            formatter: (d: any) => fmtBerry(d.value),
            position: "top",
            color: "rgba(255,255,255,0.5)",
          },
          emphasis: {
            itemStyle: {
              color: "#4281FF",
              decal: "none"
            },
          },
          barWidth: 30,
          barMinWidth: 30,
          barCategoryGap: 30,
        },
      ],
      darkMode: true,
    };
  }, [width, trendingRewards, rewardType]);
  return (
    <TitCard
      tit="Trending"
      className={cn("col-span-1 h-full   lg:col-span-2  gap-4", className)}
      right={
        <Select
          className="w-[9.375rem]"
          classNames={{
            mainWrapper: "rounded-full bg-transparent",
            trigger: "rounded-full text-xs bg-white/10 hover:!bg-white/20",
            value: "text-xs !text-white/80 ",
            popoverContent: "bg-[#585858] border border-solid border-white/10 p-0"
          }}
          selectionMode="single"
          selectedKeys={[rewardType]}
          disallowEmptySelection
          onSelectionChange={(k) => {
            console.info("k:", k);
            setRewardType(k.currentKey as any);
          }}
        >
          {options.map((opt) => (
            <SelectItem
              className="!rounded-full"
              key={opt}
              classNames={{
                wrapper: "text-xs !rounded-full data-[hover=true]:bg-white/20",
                title: "text-xs whitespace-nowrap",
              }}
            >
              {opt}
            </SelectItem>
          ))}
        </Select>
      }
    >
      <div className="w-full" style={{ height: '14.125rem' }} ref={ref}>
        <EChartsReact style={{ height: '14.125rem' }} className="w-full" option={chartOpt} />
      </div>
    </TitCard>
  );
}


export function ExpProgress() {
  const ac = useAuthContext();
  const user = ac.queryUserInfo?.data;
  const exp = user?.stat.exp || 0;
  const nextLevel = levels.find((_l) => exp < _l.exp) || levels[levels.length - 1];
  const leftLevel = levels[nextLevel.level - 1]
  // const percent = (exp - leftLevel.exp)/(nextLevel.exp - leftLevel.exp)
  const [percent, setPercent] = useState(0)
  useEffect(() => {
    const task = setTimeout(() => setPercent((exp) / (nextLevel.exp)), 500)
    return () => clearTimeout(task)
  }, [exp, nextLevel.exp])
  const offset = 346 - _.round(percent * 346)
  console.info('percent:', _.round(percent, 4))
  const expRotate = Math.min(_.round(percent * 180), 180)
  const transition = `all 0.8s ease`
  return <div className="flip_item p-5 flex flex-col items-center gap-2 relative h-[13.75rem]">
    <div className="w-full max-w-[15.625rem] relative">
      <svg width="100%" height="auto" viewBox="0 0 250 140" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 125A110 110 0,0,1,235 125" strokeLinecap="round" strokeWidth="30" stroke="#616161" />
        <path d="M15 125A110 110 0,0,1,235 125" strokeLinecap="round" strokeWidth="30" stroke="#D7D7D7" strokeDasharray="346" strokeDashoffset={offset} style={{ transition }} />
        <text fontSize="40" fill="white" textAnchor="middle" x="125" y="120">{exp}</text>
      </svg>
      <div style={{ transform: `rotate(${expRotate}deg)`, transformOrigin: '100% 50%', transition }} className="w-1/2 flex items-center h-[1.875rem] overflow-visible absolute bottom-0 px-[6%] left-0">
        <SVGS.SvgExp className="text-[2.5rem] -translate-x-1/2" />
      </div>
    </div>
    <div className="flex w-full max-w-[15.625rem] justify-between overflow-visible px-[5%]">
      <div className="flex flex-col justify-center -translate-x-1/2 text-xs font-medium text-white text-center">
        <span className="text-[#8a8a8a]">{leftLevel.exp}</span>
        <div className="flex gap-0.5 items-center pl-1">
          <span>{fmtBoost(leftLevel.boostNum)}x</span>
          <SVGS.SvgRocket className="text-base" />
        </div>
      </div>
      <div className="flex flex-col justify-center translate-x-1/2 text-xs font-medium text-white text-center">
        <span className="text-[#8a8a8a]">{nextLevel.exp}</span>
        <div className="flex gap-0.5 items-center pl-1">
          <span>{fmtBoost(nextLevel.boostNum)}x</span>
          <SVGS.SvgRocket className="text-base" />
        </div>
      </div>
    </div>
  </div>
}

export default function MyDashboard() {
  const copy = useCopy();
  const ac = useAuthContext();
  const user = ac.queryUserInfo?.data;
  const connectedNodes = user?.node.connected || 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5 h-full  ">
      <TrendingChart className="flip_item h-full" />

      {/* <div className="flip_item title lg:col-span-2 px-5 overflow-visible flex flex-col gap-[1.5625rem] text-white relative mt-16 ">
        <div className="absolute -right-5 -bottom-[2.1875rem] bg-overview w-[20.3125rem] h-[16.4375rem] bg-cover z-0 hidden lg:block" />
        <div className="font-medium  text-sm z-10 relative font-Alexandria">Dashboard Overview</div>
        <div className="font-semibold text-3xl mb-20 z-10 relative font-Alexandria">
          Hello,<br /><div title={user?.email}>{truncateEmail(user?.email)} 👋</div>
        </div>
      </div> */}
      <div className="flip_item overflow-visible flex flex-col justify-between xl:flex-col rounded-[1.25rem] bg-[#373737]">
        <ExpProgress />
        <CurrentTask wrapClassName="lg:col-span-2 xl:col-span-1 h-[6.875rem]" />
      </div>
      {/*  */}


      {/*  */}
      <IconCard
        className="flip_item  "
        icon={SVGS.SvgReferral}
        iconSize={24}
        tit={
          <div className="flex justify-between items-center flex-1">
            <span className="text-xl font-Alexandria">My Referrals</span>
            <IconBtn tip="Copy Referral Link" onClick={() => copy(`${origin}/signup?referral=${user?.inviteCode}`)}>
              <FaLink />
            </IconBtn>
          </div>
        }
        content={
          <div className="flex flex-1 items-center gap-[10%] w-full min-w-[13.75rem]">
            <DupleInfo
              tit={`${user?.referral.valid || 0}`}
              subClassName="text-green-400 opacity-100"
              sub={
                <>
                  <IoIosCheckmarkCircle /> Referred
                </>
              }
            />
            <DupleSplit />
            <DupleInfo
              tit={`${user?.referral.pending || 0}`}
              sub={
                <>
                  <IoIosMore /> Pending
                </>
              }
              subTip="The referee needs to achieve more than 72h uptime to make your referral qualified."
            />
          </div>
        }
      />


      <IconCard
        className="flip_item"
        icon={SVGS.SvgNodes}
        iconSize={24}
        tit={<span className="text-xl font-Alexandria">My Nodes</span>}
        content={
          <div className="flex flex-1 items-center gap-[10%] min-w-[12.5rem]">
            <DupleInfo
              tit={`${connectedNodes}`}
              subClassName="text-green-400 opacity-100"
              sub={
                <>
                  <IoIosCheckmarkCircle /> Connected
                </>
              }
            />
            <DupleSplit />
            <DupleInfo tit={`${user?.node.offline || 0}`} sub="Offline" />
          </div>
        }
      />
      <IconCard
        className=""
        icon={SVGS.SvgBerry}
        iconSize={24}
        tit={
          <div className="flex justify-between gap-2 items-center flex-1">
            <span className="text-xl font-Alexandria">BERRY</span>
            <Booster />
          </div>
        }
        content={
          <div className="flex flex-1 items-center gap-[10%] min-w-[11.25rem]">
            <DupleInfo tit={`${fmtBerry(user?.point.today)}`} sub="Today" />
            <DupleSplit />
            <DupleInfo tit={`${fmtBerry(user?.point.total)}`} sub="Season 1" subTip="You are currently on Season 1 stage." />
          </div>
        }
      />

    </div>
  );
}
