import { useAuthContext } from "@/app/context/AuthContext";
import { menus, MenusProvider, useMenusCtx } from "@/app/context/MenusContext";
import { SVGS } from "@/svg";
import { cn } from "@nextui-org/react";
import React, { Fragment, SVGProps } from "react";
import { AutoFlip } from "./auto-flip";
import { fmtBerry } from "./fmtData";
import { levels } from "./level";
import { SocialButtons } from "./social-buttons";

function Menus() {
  const mc = useMenusCtx();
  const ac = useAuthContext();
  const user = ac.queryUserInfo?.data;
  const exp = user?.stat.exp || 0;
  const list = [
    {
      onClick: () => mc.toMenu("My Rewards"),
      svg: <SVGS.SvgBerry />,
      label: fmtBerry(user?.point.total),
    },
    {
      onClick: () => mc.toMenu("My Profile"),
      svg: <SVGS.SvgExp />,
      label: exp,
    }
  ]
  return (
    <>
      <AutoFlip className="flex bg-[#404040] flex-col justify-between sticky top-0 h-screen overflow-y-auto">
        <div className="flex-col justify-start items-center flex-grow-0 flex-shrink-0 w-[3.75rem] lg:w-60 py-3 lg:px-3 transition-width">
          <div className="flex items-center justify-center h-36">
            <img src="/logo.svg" className={`h-12 min-w-36 shrink-0 rotate-90 lg:ml-0 lg:rotate-0 lg:h-[7.375rem] lg:w-[9.375rem]`} alt="Logo" />
          </div>
          <div className="flex pb-8 gap-3 w-full justify-start flex-wrap">
            {list.map((item, index) => {
              return <div key={`list_${index}`} onClick={item.onClick} className="flex-1 basis-0 mx-1.5 lg:mx-0 cursor-pointer h-[4.4375rem] gap-1 bg-white/10 hover:bg-white/20 rounded-[.9375rem] flex flex-col  justify-center items-center">
                <div className=" mt-1 text-xl lg:text-2xl" >
                  {item.svg}
                </div>
                <label className=" font-medium text-xs lg:text-base">
                  {item.label}
                </label>
              </div>
            })}


          </div>
          <div className=" flex flex-col gap-3 px-1.5 lg:px-0">
            {menus.map((m) => {
              const Micon: React.FC<SVGProps<SVGElement>> = m.icon as any;
              const selected = m.name === mc.current.name;
              return (
                <div
                  key={m.name}
                  className={cn("flip_item flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 h-12 gap-2.5 lg:px-5 px-3 rounded-[1.875rem] cursor-pointer select-none", {
                    "bg-primary text-white ": selected,
                    "text-white/50 hover:bg-default": !selected,
                  })}
                  onClick={() => {
                    mc.toMenu(m.name);
                  }}
                >
                  <div className={cn("flex justify-center items-center flex-grow-0 flex-shrink-0 w-6 h-6 relative gap-2.5 rounded-full", { "bg-blue-400": selected })}>
                    <Micon className={cn("text-base")} />
                  </div>
                  <div className="text-xs font-medium text-left whitespace-nowrap hidden lg:block">{m.name}</div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex  pb-[1.875rem] flex-col items-center gap-5">
          <SocialButtons />
          <div className=" font-normal text-xs leading-[.9rem] text-[#999999] flex flex-col items-center lg:flex-row gap-6 ">
            <a href="https://enreach.network/" target="_blank" className="underline-offset-4 hover:text-[#4281FF] underline ">WebSite</a>
            <a href="https://docs.enreach.network/user-guide" target="_blank" className="underline-offset-4 hover:text-[#4281FF] underline">Guide</a>
          </div>
        </div>

      </AutoFlip>


    </>
  );
}

const Main = () => {
  const mc = useMenusCtx();
  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 flex ">
        <Menus />
        {menus.map((item) => (
          <Fragment key={item.name}>
            {mc.current.name === item.name && (
              <AutoFlip className="flex-1 p-5 flex flex-col w-full gap-[2.125rem]  min-h-full  overflow-y-auto">
                {/* <h2 className="flip_item text-[2rem] font-medium">{mc.current.name}</h2> */}
                {mc.current.name !== 'Overview' && <div className=" relative pl-5 pt-28">
                  <div className="bg-tit absolute z-0 right-0 top-[.3125rem] h-[14.5rem] w-[31.25rem] bg-cover" />
                  <div className="text-3xl font-medium z-10 relative">
                    {mc.current.contentName}
                  </div>
                </div>}
                {mc.current.content}
              </AutoFlip>
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
