import MyDashboard from "@/components/my-dashboard";
import MyNodes from "@/components/my-nodes";
import MyProfile from "@/components/my-profile";
import MyReferral from "@/components/my-referral";
import MyRewards from "@/components/my-rewards";
import { strToSearchParams } from "@/lib/utils";
import { SVGS } from "@/svg";
import { useRouter, useSearchParams } from "next/navigation";
import { createContext, PropsWithChildren, useContext, useState } from "react";
export const menus = [
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
export const MenusContext = createContext({ toMenu: (name: string) => {}, current: menus[0] });

export function MenusProvider({ children }: PropsWithChildren) {
  const sp = useSearchParams();
  const spTab = sp.get("tab");
  const [mName, setMName] = useState("");
  const menu = menus.find((item) => strToSearchParams(item.name) === mName) || menus.find((item) => strToSearchParams(item.name) === spTab) || menus[0];
  const r = useRouter();
  const toMenu = (name: string) => {
    if (menus.find((item) => item.name === name)) {
      setMName(name);
      r.push(`?tab=${strToSearchParams(name)}`);
    }
  };

  return <MenusContext.Provider value={{ toMenu, current: menu }}>{children}</MenusContext.Provider>;
}

export function useMenusCtx() {
  return useContext(MenusContext);
}
