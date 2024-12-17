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
import { useDebounce, useMeasure } from "react-use";
import { UseMeasureRef } from "react-use/lib/useMeasure";
import { IconBtn } from "./btns";
import { fmtBerry, fmtBoost } from "./fmtData";
import { CurrentTask } from "./tasks";
import { HelpTip } from "./tips";
import { levels } from "./level";

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
      <div className={cn("flex justify-start items-center flex-shrink-0 relative gap-1 text-sm opacity-50 text-white", subClassName)}>
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
        axisLabel: { color: "rgba(255,255,255,0.5)" },
        splitLine: { lineStyle: { type: "dashed", color: "#fff", opacity: 0.05 } },
      },
      series: [
        {
          data: yData,
          type: "bar",
          itemStyle: {
            borderRadius: 15,
            color: "#4281FF",
          },
          label: {
            show: true,
            formatter: (d: any) => fmtBerry(d.value),
            position: "top",
            color: "rgba(255,255,255,0.5)",
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
      className={cn("col-span-1 lg:col-span-2 h-full", className)}
      right={
        <Select
          className="w-[10rem]"
          classNames={{
            mainWrapper: "rounded-lg bg-neutral-100/10",
            trigger: "rounded-lg bg-transparent text-xs",
            value: "text-xs",
          }}
          selectionMode="single"
          selectedKeys={[rewardType]}
          onSelectionChange={(k) => {
            console.info("k:", k);
            setRewardType(k.currentKey as any);
          }}
        >
          {options.map((opt) => (
            <SelectItem
              className="text-xs "
              key={opt}
              classNames={{
                title: "text-xs whitespace-nowrap",
              }}
            >
              {opt}
            </SelectItem>
          ))}
        </Select>
      }
    >
      <div className="w-full flex-1" ref={ref}>
        <EChartsReact style={{ minHeight: 200, height: "100%" }} className="w-full" option={chartOpt} />
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
    return setPercent((exp) / (nextLevel.exp))
  }, [exp, nextLevel.exp])
  const offset = 346 - _.round(percent * 346)
  console.info('percent:', _.round(percent, 4))
  const expRotate = Math.min(_.round(percent * 180), 180)

  return <div className="p-[2.875rem] flex flex-col items-center gap-2 relative">
    <div className="w-full max-w-[15.625rem] relative">
      <svg width="100%" height="auto" viewBox="0 0 250 140" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 125A110 110 0,0,1,235 125" strokeLinecap="round" strokeWidth="30" stroke="#616161" />
        <path d="M15 125A110 110 0,0,1,235 125" strokeLinecap="round" strokeWidth="30" stroke="#D7D7D7" strokeDasharray="346" strokeDashoffset={offset} >
          <animate from="346" to={offset} dur="0.5s" attributeName="strokeDashoffset" repeatCount={1} />
        </path>

        <text fontSize="40" fill="white" textAnchor="middle" x="125" y="120">{exp}</text>
      </svg>
      <div style={{ transform: `rotate(${expRotate}deg)`, transformOrigin: '100% 50%', transition: 'all 0.5s' }} className="w-1/2 flex items-center h-[1.875rem] overflow-visible absolute bottom-0 px-[6%] left-0">
        <SVGS.SvgExp className="text-[2.5rem] -translate-x-1/2" />
      </div>
    </div>
    <div className="flex w-full max-w-[15.625rem] justify-between overflow-visible px-[5%]">
      <div className="flex flex-col justify-center -translate-x-1/2 text-xs font-medium text-white text-center">
        <span className="text-[#8a8a8a]">{leftLevel.exp}</span>
        <div className="flex gap-0.5 items-center pl-1">
          <span>{leftLevel.boostNum}x</span>
          <SVGS.SvgRocket className="text-base" />
        </div>
      </div>
      <div className="flex flex-col justify-center translate-x-1/2 text-xs font-medium text-white text-center">
        <span className="text-[#8a8a8a]">{nextLevel.exp}</span>
        <div className="flex gap-0.5 items-center pl-1">
          <span>{nextLevel.boostNum}x</span>
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
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
      <div className="flip_item title lg:col-span-2 p-5 overflow-visible flex flex-col gap-5 text-white relative">
        <div className="absolute -right-5 -bottom-5 bg-overview w-[20.3125rem] h-[16.4375rem] bg-cover z-0" />
        <div className="font-medium mt-16 z-10">Dashboard Overview</div>
        <div className="font-semibold text-3xl mb-20 z-10">
          Hello,<br />{user?.email || '-'}  👋
        </div>
      </div>
      <div className="flip_item flex flex-col justify-between lg:col-span-2 lg:flex-row xl:col-span-1 xl:row-span-2 xl:flex-col rounded-[1.25rem] bg-[#373737]">
        <ExpProgress />
        <IconCard
          className=" min-h-[11.875rem]"
          icon={SVGS.SvgBerry}
          tit={
            <div className="flex justify-between items-center flex-1">
              <span className="text-xl">BERRY</span>
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
      {/*  */}


      {/*  */}
      <IconCard
        className="flip_item h-[11.875rem] self-end"
        icon={SVGS.SvgReferral}
        tit={
          <div className="flex justify-between items-center flex-1">
            <span className="text-xl">My Referrals</span>
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
        className="flip_item h-[11.875rem] self-end"
        icon={SVGS.SvgNodes}
        tit={<span className="text-xl">My Nodes</span>}
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

      <TrendingChart className="flip_item" />
      <CurrentTask />
    </div>
  );
}
