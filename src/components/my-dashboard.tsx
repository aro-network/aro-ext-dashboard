import { SVGS } from "@/svg";
import { cn, Select, SelectItem } from "@nextui-org/react";
import { ReactNode, useMemo, useState } from "react";
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
    <div className="flex items-center gap-2 rounded-full px-3 py-[.375rem] bg-primary ml-auto">
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
    const showCount = Math.floor(width / 48);
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
            borderRadius: 10,
            color: "#4281FF",
          },
          label: {
            show: true,
            formatter: (d: any) => fmtBerry(d.value),
            position: "top",
            color: "rgba(255,255,255,0.5)",
          },
          barWidth: 20,
          barMinWidth: 20,
          barCategoryGap: 38,
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

export default function MyDashboard() {
  const copy = useCopy();
  const ac = useAuthContext();
  const user = ac.queryUserInfo?.data;
  const connectedNodes = user?.node.connected || 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
      {/*  */}
      <IconCard
        icon={SVGS.SvgBerry}
        tit={
          <div className="flex justify-between items-center flex-1">
            <span>BERRY</span>
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

      {/*  */}
      <IconCard
        icon={SVGS.SvgReferral}
        tit={
          <div className="flex justify-between items-center flex-1">
            <span>My Referrals</span>
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
      {/*  */}
      <IconCard
        icon={SVGS.SvgNodes}
        tit={<span>My Nodes</span>}
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
      <CurrentTask />
      <TrendingChart />
    </div>
  );
}
