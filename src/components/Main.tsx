import { strToSearchParams } from "@/lib/utils";
import { SVGS } from "@/svg";
import { cn } from "@nextui-org/react";
import Avatar from "boring-avatars";
import { useRouter, useSearchParams } from "next/navigation";
import React, { SVGProps } from "react";
import MyDashboard from "./my-dashboard";
import MyNodes from "./my-nodes";
import MyProfile from "./my-profile";
import MyReferral from "./my-referral";
import MyRewards from "./my-rewards";
import { useAuthContext } from "@/app/context/AuthContext";
import { levels } from "./level";

function Header() {
  const ac = useAuthContext();
  const user = ac.queryUserInfo?.data;
  const levelName = levels.find((_l, i) => user?.stat.level === i)?.name || levels[0].name;
  return (
    <div className="flex justify-between items-center flex-grow-0 flex-shrink-0 h-16 overflow-hidden px-4 border border-black gap-4">
      <img className="" src="/logo.svg" alt="Logo" />
      <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 w-[127px] h-8 relative overflow-hidden gap-2 p-1 rounded-3xl backdrop-blur-[20px] ml-auto bg-l2">
        <img src="/berry.png" className="flex-grow-0 flex-shrink-0 w-6 h-6 object-cover" alt="Berry" />
        <p className="flex-grow-0 flex-shrink-0 text-sm font-medium text-left">
          <span className="flex-grow-0 flex-shrink-0 text-sm font-medium text-left text-white">{user?.point.total || 0} </span>
          <span className="flex-grow-0 flex-shrink-0 text-sm font-medium text-left text-white/50">BERRIES</span>
        </p>
      </div>
      <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 w-[127px] h-8 relative overflow-hidden gap-2 p-1 rounded-3xl backdrop-blur-[20px] bg-l2">
        <div className="flex-grow-0 flex-shrink-0 w-6 h-6 opacity-50 rounded-[1000px] border-2 border-white border-dashed" />
        <p className="flex-grow-0 flex-shrink-0 text-sm font-medium text-left text-white">{levelName}</p>
      </div>
      <div className="flex justify-center items-center flex-grow-0 flex-shrink-0 w-8 h-8 relative overflow-hidden gap-2.5 p-2 rounded-3xl bg-white/10">
        <Avatar name={user?.email} className="" size={24} variant="marble" />
      </div>
    </div>
  );
}

const menus = [
  {
    name: "Overview",
    icon: SVGS.SvgOverview,
    content: MyDashboard,
  },
  {
    name: "My Nodes",
    icon: SVGS.SvgNodes,
    content: MyNodes,
  },
  {
    name: "My Rewards",
    icon: SVGS.SvgRewards,
    content: MyRewards,
  },
  {
    name: "My Referral",
    icon: SVGS.SvgReferral,
    content: MyReferral,
  },
  {
    name: "My Profile",
    icon: SVGS.SvgProfile,
    content: MyProfile,
  },
];
function Menus({ tab }: { tab?: string }) {
  const mtab = menus.find((item) => strToSearchParams(item.name) === tab)?.name || menus[0].name;
  const r = useRouter();
  return (
    <div className="flex flex-col justify-start items-center flex-grow-0 flex-shrink-0 w-[4.5rem] lg:w-60 p-3 transition-width">
      {menus.map((m) => {
        const Micon: React.FC<SVGProps<SVGElement>> = m.icon as any;
        const selected = m.name === mtab;
        return (
          <div
            key={m.name}
            className={cn("flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 h-12 gap-2.5 px-3 rounded-md cursor-pointer select-none", {
              "bg-primary text-white": selected,
              "text-white/50": !selected,
            })}
            onClick={() => r.push(`?tab=${strToSearchParams(m.name)}`)}
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
  const tab = sp.get("tab");
  const menu = menus.find((item) => strToSearchParams(item.name) === tab) || menus[0];
  const Content = menu.content;

  return (
    <div className="flex flex-col">
      <Header />
      <div className="flex-1 flex">
        <Menus tab={tab as any} />
        <div className="flex-1 p-6 flex flex-col w-0 gap-4">
          <h2 className="text-[2rem] font-medium">{menu.name == "Overview" ? "Dashboard" : menu.name}</h2>
          <Content />
        </div>
      </div>
    </div>
  );
};

export default Main;
