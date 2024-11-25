import { useAuthContext } from "@/app/context/AuthContext";
import { SVGS } from "@/svg";
import { IconCard } from "./cards";
import { Booster, DupleInfo, TrendingChart } from "./my-dashboard";
import { TaskList } from "./tasks";
import { fmtBerry } from "./fmtData";

export default function MyRewards() {
  const ac = useAuthContext();
  const user = ac.queryUserInfo?.data;
  return (
    <div className="grid grid-cols-10 gap-4">
      <IconCard icon={SVGS.SvgBerry} className="col-span-10 xl:col-span-4 justify-between">
        <div className="w-0 flex-1 flex flex-col gap-10">
          <div className="flex justify-between items-center w-full">
            <span>BERRY</span>
            <Booster />
          </div>
          <DupleInfo
            tit={fmtBerry(user?.point.total)}
            sub="Total Rewards"
            subTip="Total Network Rewards for this season in BERRY amount."
            titClassName="text-[2rem]"
            subClassName="text-lg"
          />
          <div className="flex items-center gap-4 justify-between">
            <DupleInfo tit={fmtBerry(user?.point.network)} sub="Network Rewards" />
            <div className="w-[1px] bg-white/30 h-6" />
            <DupleInfo tit={fmtBerry(user?.point.referral)} sub="Referral Bonus" />
          </div>
        </div>
      </IconCard>
      <div className="col-span-10 xl:col-span-6">
        <TrendingChart />
      </div>
      <TaskList />
    </div>
  );
}
