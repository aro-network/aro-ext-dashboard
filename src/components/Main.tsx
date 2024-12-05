import { useAuthContext } from "@/app/context/AuthContext";
import { menus, MenusProvider, useMenusCtx } from "@/app/context/MenusContext";
import { cn } from "@nextui-org/react";
import React, { Fragment, SVGProps } from "react";
import { MAvatar } from "./avatar";
import { fmtBerry } from "./fmtData";
import { levels } from "./level";
import { SVGS } from "@/svg";

function Header() {
  const ac = useAuthContext();
  const user = ac.queryUserInfo?.data;
  const levelName = levels.find((_l, i) => user?.stat.level === i)?.name || levels[0].name;
  const exp = user?.stat.exp || 0;
  const mc = useMenusCtx();
  return (
    <div className="flex justify-between items-center flex-grow-0 flex-shrink-0 h-16 overflow-hidden px-4 border border-black gap-4">
      <img className="h-12" src="/logo.svg" alt="Logo" />
      <div
        className="flex justify-start items-center flex-grow-0 flex-shrink-0 h-8 relative overflow-hidden gap-2 p-1 rounded-3xl backdrop-blur-[20px] ml-auto bg-l2 cursor-pointer"
        onClick={() => mc.toMenu("My Rewards")}
      >
        {/* <img src="/berry.png" className="flex-grow-0 flex-shrink-0 w-6 h-6 object-cover" alt="Berry" /> */}
        <span className="relative text-2xl">
          <SVGS.SvgBerry />
        </span>
        <p className="flex-grow-0 flex-shrink-0 text-sm font-medium text-left">
          <span className="flex-grow-0 flex-shrink-0 text-sm font-medium text-left text-white">{fmtBerry(user?.point.total)} </span>
          <span className="flex-grow-0 flex-shrink-0 text-sm font-medium text-left text-white/50">BERRY</span>
        </p>
      </div>
      <div
        className="flex justify-start items-center flex-grow-0 flex-shrink-0 h-8 relative overflow-hidden gap-2 p-1 rounded-3xl backdrop-blur-[20px] bg-l2 cursor-pointer"
        onClick={() => mc.toMenu("My Profile")}
      >
        <div className="flex-grow-0 flex-shrink-0 px-2 h-6 rounded-full text-white flex justify-center items-center font-medium text-sm bg-primary">
          {exp} <SVGS.SvgExp />
        </div>
        <p className="flex-grow-0 flex-shrink-0 text-sm font-medium text-left text-white">{levelName}</p>
      </div>
      <div
        className="flex justify-center items-center flex-grow-0 flex-shrink-0 w-8 h-8 relative overflow-hidden gap-2.5 p-2 rounded-3xl bg-white/10 cursor-pointer"
        onClick={() => mc.toMenu("My Profile")}
      >
        <MAvatar name={user?.email} size={24} />
      </div>
    </div>
  );
}

function Menus() {
  const mc = useMenusCtx();
  return (
    <div className="flex flex-col justify-start items-center flex-grow-0 flex-shrink-0 w-[60px] lg:w-60 py-3 pl-3 lg:px-3 transition-width">
      {menus.map((m) => {
        const Micon: React.FC<SVGProps<SVGElement>> = m.icon as any;
        const selected = m.name === mc.current.name;
        return (
          <div
            key={m.name}
            className={cn("flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 h-12 gap-2.5 px-3 rounded-2xl cursor-pointer select-none", {
              "bg-primary text-white": selected,
              "text-white/50 hover:bg-default": !selected,
            })}
            onClick={() => {
              mc.toMenu(m.name);
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
  const mc = useMenusCtx();
  return (
    <div className="flex flex-col">
      <Header />
      <div className="flex-1 flex">
        <Menus />
        {menus.map((item) => (
          <Fragment key={item.name}>
            {mc.current.name === item.name && (
              <div className="flex-1 px-4 py-4 md:px-6 flex flex-col w-0 gap-4">
                <h2 className="text-[2rem] font-medium">{mc.current.name}</h2>
                {mc.current.content}
              </div>
            )}
          </Fragment>
        ))}
      </div>
    </div>
  );
};

const MainWrap = () => {
  return (
    <MenusProvider>
      <Main />
    </MenusProvider>
  );
};
export default MainWrap;
