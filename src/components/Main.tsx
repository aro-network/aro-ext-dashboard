import { getLastLoginUser, useAuthContext } from "@/app/context/AuthContext";
import { menus, MenusProvider, useMenusCtx } from "@/app/context/MenusContext";
import { SVGS } from "@/svg";
import { cn } from "@nextui-org/react";
import React, { Fragment, SVGProps, useEffect } from "react";
import { AutoFlip } from "./auto-flip";
import { fmtBerry } from "./fmtData";
import { levels } from "./level";
import { SocialButtons } from "./social-buttons";
import { MAvatar } from "./avatar";


function Menus() {
  const mc = useMenusCtx();
  const ac = useAuthContext();
  const user = ac.queryUserInfo?.data;
  const exp = user?.stat.exp || 0;


  const list = [
    {
      onClick: () => mc.toMenu("Rewards"),
      svg: <SVGS.SvgBerry />,
      label: fmtBerry(user?.point.total),
    },
    {
      onClick: () => mc.toMenu("Profile"),
      svg: <SVGS.SvgExp />,
      label: exp,
    }
  ]



  return (
    <div className=" sticky top-0">
      <AutoFlip >
        <div className=" flex h-[3.75rem] flex-row w-full justify-between items-center py-5 bg-[#404040]  px-[50px]  ">
          <div className="flex items-center  gap-5 smd:flex-col">
            <img src="/logo.svg" className={`shrink-0 rotate-90 lg:ml-0 max-w-[9.375rem] h-[2.375rem] lg:rotate-0 `} alt="Logo" />
            <div className="rounded-[.625rem] cursor-default border p-[.625rem] border-[#999999] text-[#999999] font-normal text-xs leading-3">
              Season 1
            </div>
          </div>

          <div className="flex gap-[1.875rem] items-center">
            <div className="flex gap-[.625rem] h-8 ">
              {list.map((item, index) => {
                return <div key={`list_${index}`} onClick={item.onClick} className="flex-1 basis-0 mx-1.5 lg:mx-0 cursor-pointer gap-[.625rem] border-[#FFF] border hover:bg-white/20 rounded-[.625rem] flex justify-center items-center py-[.375rem] px-3">
                  <div className="text-xl lg:text-2xl" >
                    {item.svg}
                  </div>
                  <label className=" font-medium  text-base leading-8">
                    {item.label}
                  </label>
                </div>
              })}
            </div>

            <div className="flex items-center gap-5">
              <SocialButtons />
              <div className=" font-normal text-xs leading-[.9rem] text-[#999999] h-8 flex flex-col items-center lg:flex-row gap-6 ">
                <a href="https://enreach.network/" target="_blank" className="underline-offset-4 hover:text-[#4281FF] h-8 rounded-[.625rem] items-center flex border p-[.625rem] border-[#999999]">WebSite</a>
                <a href="https://docs.enreach.network/berry-season-1" target="_blank" className="underline-offset-4 h-8 hover:text-[#4281FF]  items-center flex rounded-[.625rem] border p-[.625rem] border-[#999999]">Guide</a>
              </div>
            </div>
            <MAvatar name={user?.email} size={50} />
          </div>
        </div>

      </AutoFlip>
      <div className=" flex flex-row gap-3 px-[3.125rem] py-[.625rem] border-b border-[#404040]">
        {menus.map((m) => {
          const selected = m.name === mc.current.name;
          return (
            <div
              key={m.name}
              className={cn("flip_item flex justify-start items-center  self-stretch flex-grow-0 flex-shrink-0  gap-2.5 px-[.375rem] rounded-[1.875rem] cursor-pointer select-none", {
                "bg-[#404040] text-white ": selected,
                "text-white/50 hover:bg-default": !selected,
              })}
              onClick={() => {
                mc.toMenu(m.name);
              }}
            >

              <div className="text-sm font-medium text-left whitespace-nowrap hidden lg:block">{m.name}</div>
            </div>
          );
        })}
      </div>


    </div>
  );
}

const Main = () => {
  const mc = useMenusCtx();
  return (
    <div className="h-screen flex-1 flex flex-col ">
      <Menus />
      <div className="h-full overflow-auto">
        {menus.map((item) => (
          <Fragment key={item.name}>
            {mc.current.name === item.name && (
              <AutoFlip className=" p-10  px-[6.5rem] flex flex-col w-full  gap-[2.125rem]">
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
