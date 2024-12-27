import MyDashboard from "@/components/my-dashboard";
import MyNodes from "@/components/my-nodes";
import MyProfile from "@/components/my-profile";
import MyReferral from "@/components/my-referral";
import MyRewards from "@/components/my-rewards";
import { strToSearchParams } from "@/lib/utils";
import { SVGS } from "@/svg";
import { useRouter, useSearchParams } from "next/navigation";
import { createContext, PropsWithChildren, useContext, useState } from "react";
import { useAuthContext } from "./AuthContext";
export const menus = [
  {
    name: "Highlights",
    icon: SVGS.SvgOverview,
    content: <MyDashboard />,
  },
  {
    name: "My Nodes",
    icon: SVGS.SvgNodes,
    content: <MyNodes />,
    contentName: 'Dashboard - My Nodes'
  },
  {
    name: "My Rewards",
    icon: SVGS.SvgRewards,
    content: <MyRewards />,
    contentName: 'Dashboard - My Rewards'
  },
  {
    name: "My Referral",
    icon: SVGS.SvgReferral,
    content: <MyReferral />,
    contentName: 'Dashboard - My Referral'

  },
  {
    name: "My Account",
    icon: SVGS.SvgProfile,
    content: <MyProfile />,
    contentName: 'Dashboard - My Account'
  },
];
export const MenusContext = createContext({ toMenu: (name: string) => { }, current: menus[0] });

export function MenusProvider({ children }: PropsWithChildren) {
  const [_mName, setMName] = useState("");
  const sp = useSearchParams();
  const spTab = sp.get("tab");
  const menu = menus.find((item) => strToSearchParams(item.name) === spTab) || menus[0];
  const r = useRouter();
  const ac = useAuthContext()
  const toMenu = (name: string) => {

    const to = menus.find((item) => item.name === name);
    if (to) {
      const usp = new URLSearchParams(location.search);
      usp.set("tab", strToSearchParams(to.name));
      r.push(`/?${usp.toString()}`);
      setMName(to.name);
      ac.queryUserInfo?.refetch()
    }
  };

  return <MenusContext.Provider value={{ toMenu, current: menu }}>{children}</MenusContext.Provider>;
}

export function useMenusCtx() {
  return useContext(MenusContext);
}
