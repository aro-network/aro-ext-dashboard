import { useAuthContext } from "@/app/context/AuthContext";
import { strToSearchParams } from "@/lib/utils";
import { SVGS } from "@/svg";
import { cn } from "@nextui-org/react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { SVGProps, useState } from "react";
import { MAvatar } from "./avatar";
import { levels } from "./level";
import MyDashboard from "./my-dashboard";
import MyNodes from "./my-nodes";
import MyProfile from "./my-profile";
import MyReferral from "./my-referral";
import MyRewards from "./my-rewards";
import { fmtBerry } from "./fmtData";

function Header() {
  const ac = useAuthContext();
  const user = ac.queryUserInfo?.data;
  const levelName = levels.find((_l, i) => user?.stat.level === i)?.name || levels[0].name;
  const exp = user?.stat.exp || 0;
  const r = useRouter();
  return (
    <div className="flex justify-between items-center flex-grow-0 flex-shrink-0 h-16 overflow-hidden px-4 border border-black gap-4">
      <img className="h-12" src="/logo.svg" alt="Logo" />
      <div
        className="flex justify-start items-center flex-grow-0 flex-shrink-0 h-8 relative overflow-hidden gap-2 p-1 rounded-3xl backdrop-blur-[20px] ml-auto bg-l2 cursor-pointer"
        onClick={() => r.push("/?tab=my_rewards")}
      >
        <img src="/berry.png" className="flex-grow-0 flex-shrink-0 w-6 h-6 object-cover" alt="Berry" />
        <p className="flex-grow-0 flex-shrink-0 text-sm font-medium text-left">
          <span className="flex-grow-0 flex-shrink-0 text-sm font-medium text-left text-white">{fmtBerry(user?.point.total)} </span>
          <span className="flex-grow-0 flex-shrink-0 text-sm font-medium text-left text-white/50">BERRY</span>
        </p>
      </div>
      <div
        className="flex justify-start items-center flex-grow-0 flex-shrink-0 h-8 relative overflow-hidden gap-2 p-1 rounded-3xl backdrop-blur-[20px] bg-l2 cursor-pointer"
        onClick={() => r.push("/?tab=my_profile")}
      >
        <div className="flex-grow-0 flex-shrink-0 px-2 h-6 rounded-full text-white flex justify-center items-center font-medium text-sm bg-primary">{exp} EXP</div>
        <p className="flex-grow-0 flex-shrink-0 text-sm font-medium text-left text-white">{levelName}</p>
      </div>
      <div
        className="flex justify-center items-center flex-grow-0 flex-shrink-0 w-8 h-8 relative overflow-hidden gap-2.5 p-2 rounded-3xl bg-white/10 cursor-pointer"
        onClick={() => r.push("/?tab=my_profile")}
      >
        <MAvatar name={user?.email} size={24} />
      </div>
    </div>
  );
}

const menus = [
  {
    name: "Overview",
    icon: SVGS.SvgOverview,
    content: <MyDashboard />,
  },
  {
    name: "My Nodes",
    icon: SVGS.SvgNodes,
    content: <MyNodes />,
  },
  {
    name: "My Rewards",
    icon: SVGS.SvgRewards,
    content: <MyRewards />,
  },
  {
    name: "My Referral",
    icon: SVGS.SvgReferral,
    content: <MyReferral />,
  },
  {
    name: "My Profile",
    icon: SVGS.SvgProfile,
    content: <MyProfile />,
  },
];
function Menus({ tab, onClickTab }: { tab: string; onClickTab: (tab: string) => void }) {
  const r = useRouter();
  return (
    <div className="flex flex-col justify-start items-center flex-grow-0 flex-shrink-0 w-[60px] lg:w-60 py-3 pl-3 lg:px-3 transition-width">
      {menus.map((m) => {
        const Micon: React.FC<SVGProps<SVGElement>> = m.icon as any;
        const selected = m.name === tab;
        return (
          <div
            key={m.name}
            className={cn("flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 h-12 gap-2.5 px-3 rounded-2xl cursor-pointer select-none", {
              "bg-primary text-white": selected,
              "text-white/50 hover:bg-default": !selected,
            })}
            onClick={() => {
              onClickTab(m.name);
              r.push(`?tab=${strToSearchParams(m.name)}`);
            }}
          >
            <div className={cn("flex justify-center items-center flex-grow-0 flex-shrink-0 w-6 h-6 relative gap-2.5 rounded-[1000px]", { "bg-blue-400": selected })}>
              <Micon className={cn("text-base")} />
            </div>
            <div className="text-xs font-medium text-left whitespace-nowrap hidden lg:block">{m.name}</div>
          </div>
        );
      })}
    </div>
  );
}

const Main = () => {
  const sp = useSearchParams();
  const menu = menus.find((item) => strToSearchParams(item.name) === sp.get("tab")) || menus[0];
  const [tab, setTab] = useState(menu.name);
  return (
    <div className="flex flex-col">
      <Header />
      <div className="flex-1 flex">
        <Menus tab={tab} onClickTab={setTab} />
        <div className="flex-1 px-4 py-4 md:px-6 flex flex-col w-0 gap-4">
          <h2 className="text-[2rem] font-medium">{menu.name}</h2>
          {menu.content}
        </div>
      </div>
    </div>
  );
};

export default Main;
