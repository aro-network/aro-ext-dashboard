import { useAuthContext } from "@/app/context/AuthContext";
import { SVGS } from "@/svg";
import { IconCard } from "./cards";
import { Booster, DupleInfo, DupleSplit, TrendingChart } from "./my-dashboard";
import { TaskList } from "./tasks";
import { fmtBerry } from "./fmtData";

export default function MyRewards() {
  const ac = useAuthContext();
  const user = ac.queryUserInfo?.data;
  return (
    <div className="grid grid-cols-10 gap-4">
      <IconCard
        icon={SVGS.SvgBerry}
        className="flip_item col-span-10  xl:col-span-4 justify-between gap-8"
        tit={
          <div className="flex justify-between items-center w-full">
            <span className="text-xl font-Alexandria">BERRY</span>
            <Booster />
          </div>
        }
        content={
          <div className="flex flex-col gap-10 pb-[.375rem] min-w-[17.5rem]">
            <DupleInfo
              tit={
                <div className="flex items-center gap-1">
                  {fmtBerry(user?.point.total)}
                </div>
              }
              sub="Total Rewards"
              subTip="Total Network Rewards for this season in BERRY amount."
              titClassName="text-[2rem]"
              subClassName="text-lg"
            />
            <div className="flex items-center gap-[10%]">
              <DupleInfo tit={fmtBerry(user?.point.network)} sub="Network Rewards" />
              <DupleSplit />
              <DupleInfo tit={fmtBerry(user?.point.referral)} sub="Referral Bonus" />
            </div>
          </div>
        }
      />
      <div className="flip_item col-span-10 xl:col-span-6">
        <TrendingChart className="h-full" />
      </div>
      <TaskList />
    </div>
  );
}
