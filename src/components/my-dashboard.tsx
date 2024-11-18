import { SVGS } from "@/svg";
import { cn, Select, SelectItem } from "@nextui-org/react";
import { ReactNode, useMemo, useState } from "react";
import { FaLink } from "react-icons/fa6";
import { IoIosCheckmarkCircle, IoIosMore } from "react-icons/io";
import { BgCard, IconCard, TitCard } from "./cards";

import { useCopy } from "@/hooks/useCopy";
import EChartsReact from "echarts-for-react";
import { useMeasure } from "react-use";
import { HelpTip } from "./tips";
import { IconBtn, TransBtn } from "./btns";
import { useAuthContext } from "@/app/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import backendApi from "@/lib/api";
import { fmtDate } from "@/lib/utils";

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
    <div className={cn("flex flex-col justify-start items-start relative", className)}>
      <p className={cn("self-stretchflex-shrink-0 text-2xl font-medium text-left text-white", titClassName)}>{tit}</p>
      <div className={cn("flex justify-start items-center flex-shrink-0 relative gap-1 text-sm opacity-50 text-white", subClassName)}>
        {sub}
        {subTip && <HelpTip content={subTip} />}
      </div>
    </div>
  );
}

export function Booster({ boost }: { boost: number }) {
  return (
    <div className="flex items-center gap-2 rounded-full px-3 py-[6px] bg-primary">
      <SVGS.SvgRocket className="text-xl" />
      <div className="text-xs font-medium">
        {boost}x <span className="opacity-50">Boosting</span>
      </div>
    </div>
  );
}

const options = ["Total Rewards", "Network Rewards", "Referral Bonus"] as const;
type OptionType = (typeof options)[number];
export function TrendingChart({ className }: { className?: string }) {
  const [rewardType, setRewardType] = useState<OptionType>(options[0]);
  const { data: trendingRewards, isLoading } = useQuery({
    queryKey: ["TrendingChart"],
    queryFn: () => backendApi.trendingRewards(),
  });
  const [ref, { width }] = useMeasure<HTMLDivElement>();
  const chartOpt = useMemo(() => {
    const datas = trendingRewards || [];
    const xData = datas.map((item) => fmtDate(item.date, "MMMD"));
    const yData = datas.map((item) => (rewardType === "Total Rewards" ? item.totalPoint : rewardType === "Network Rewards" ? item.networkPoint : item.referralPoint));
    return {
      animation: true,
      animationDuration: 200,
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      grid: { left: 40, top: 30, bottom: 30, right: 20, show: false },
      // toolbox: { show: false },
      dataZoom: [
        {
          type: "inside",
          start: 0,
          end: Math.round(width / 48),
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
      },
      yAxis: {
        type: "value",
        boundaryGap: [0, "10%"],
        // max: (value: number) => value * 1.2,
        splitLine: { lineStyle: { type: "dashed", color: "#fff", opacity: 0.05 } },
      },
      series: [
        {
          data: yData,
          type: "bar",
          itemStyle: {
            borderRadius: 2,
            color: "#4281FF",
          },
          label: {
            show: true,
            position: "top",
          },
          barWidth: 10,
          barMinWidth: 10,
          barCategoryGap: 38,
        },
      ],
      darkMode: true,
    };
  }, [width, trendingRewards, rewardType]);
  return (
    <TitCard
      tit="Trending"
      className={cn("col-span-1 lg:col-span-2", className)}
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
      <div className="w-full" ref={ref}>
        <EChartsReact style={{ height: 200 }} className="w-full" option={chartOpt} />
      </div>
    </TitCard>
  );
}

export default function MyDashboard() {
  const copy = useCopy();
  const { queryUserInfo } = useAuthContext();
  const connectedNodes = queryUserInfo?.data?.node.connected || 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
      {/*  */}
      <IconCard icon={SVGS.SvgBerry}>
        <div className="flex flex-col gap-[45px] flex-1">
          <div className="flex justify-between items-center">
            <span>BERRY</span>
            <Booster boost={queryUserInfo?.data?.stat.extraBoost || 0} />
          </div>
          <div className="flex items-center gap-[10%]">
            <DupleInfo tit={`${queryUserInfo?.data?.point.currentPoint || 0}`} sub="Today" />
            <div className="bg-white opacity-30 w-[1px] h-6" />
            <DupleInfo tit={`${queryUserInfo?.data?.point.total || 0}`} sub="Season 1" subTip="Season 1" />
          </div>
        </div>
      </IconCard>
      {/*  */}
      <IconCard icon={SVGS.SvgReferral}>
        <div className="flex flex-col gap-[45px] flex-1">
          <div className="flex justify-between items-center">
            <span>My Referrals</span>
            <IconBtn tip="Copy Referral Link" onClick={() => copy("")}>
              <FaLink />
            </IconBtn>
          </div>
          <div className="flex items-center gap-[10%]">
            <DupleInfo
              tit={`${queryUserInfo?.data?.referral.valid || 0}`}
              subClassName="text-green-400 opacity-100"
              sub={
                <>
                  <IoIosCheckmarkCircle /> Referred
                </>
              }
            />
            <div className="bg-white opacity-30 w-[1px] h-6" />
            <DupleInfo
              tit={`${queryUserInfo?.data?.referral.pending || 0}`}
              sub={
                <>
                  <IoIosMore /> Pending
                </>
              }
              subTip="...Pending"
            />
          </div>
        </div>
      </IconCard>
      {/*  */}
      <IconCard icon={SVGS.SvgNodes}>
        <div className="flex flex-col flex-1">
          <span>My Nodes</span>
          <div className="flex justify-start items-center relative gap-1 mt-3 mb-8">
            {[0, 1, 2, 3, 4].map((_n, i) => {
              return <div key={i} className={cn("flex-grow-0 flex-shrink-0 w-3 h-3 relative overflow-hidden rounded", i < connectedNodes ? "bg-emerald-600" : "bg-gray-600")} />;
            })}
          </div>

          <div className="flex items-center gap-[10%] mt-auto">
            <DupleInfo
              tit={`${connectedNodes}`}
              subClassName="text-green-400 opacity-100"
              sub={
                <>
                  <IoIosCheckmarkCircle /> Connected
                </>
              }
            />
            <div className="bg-white opacity-30 w-[1px] h-6" />
            <DupleInfo tit={`${queryUserInfo?.data?.node.offline || 0}`} sub="Offline" subTip="Offline" />
          </div>
        </div>
      </IconCard>
      <TrendingChart />
      <BgCard className="justify-between px-5 py-7">
        <div className="flex items-center justify-center mt-6">
          <div className="bg-white rounded-full flex justify-center items-center w-12 h-12 text-[30px] shadow-2">
            <SVGS.SvgExt className="" />
          </div>
          <div className="bg-white rounded-full flex justify-center items-center w-12 h-12 text-[30px] shadow-2 -ml-3">
            <SVGS.SvgBerry />
          </div>
        </div>
        <div className="flex flex-col justify-start items-center relative gap-1">
          <p className="flex-grow-0 flex-shrink-0 text-4xl font-bold text-center uppercase text-white">Get 50 Berry</p>
          <p className="flex-grow-0 flex-shrink-0 h-7 opacity-60 text-sm text-center text-white">Initiate your first EnReach Node and win 50 Berry</p>
        </div>
        <TransBtn className="flex-grow-0 flex-shrink-0 w-full text-xs font-medium">Download Chrome Extension</TransBtn>
      </BgCard>
    </div>
  );
}
