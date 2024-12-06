"use client";

import { useEffect } from "react";
import { MdComputer, MdDarkMode, MdLightMode } from "react-icons/md";
import { create } from "zustand";

import { cn } from "@nextui-org/react";
import { TitModal } from "./dialogs";
import { useToggle } from "react-use";

export type ThemeType = "light" | "dark";
export type ThemeModeType = ThemeType | "system";

const getThemeState = () => {
  let themeMode: ThemeModeType = "dark";
  let theme: ThemeType = "dark";
  if (typeof window === "undefined") {
    return { themeMode, theme };
  }
  if (localStorage.theme === "light" || (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: light)").matches)) {
    // document.documentElement.classList.remove("dark");
    themeMode = "light";
    theme = "light";
  } else {
    document.documentElement.classList.add("dark");
    themeMode = "dark";
    theme = "dark";
  }
  if (!("theme" in localStorage)) themeMode = "system";
  return { themeMode, theme };
};

export const useThemeState = create<{
  themeMode: ThemeModeType;
  theme: ThemeType;
  setThemeMode: (themeMode: ThemeModeType) => void;
  setTheme: (theme: ThemeType) => void;
}>((set) => ({
  ...getThemeState(),
  setThemeMode: (themeMode: ThemeModeType) => set(() => ({ themeMode })),
  setTheme: (theme: ThemeType) => set(() => ({ theme })),
}));

const Icons = {
  light: <MdLightMode />,
  dark: <MdDarkMode />,
  system: <MdComputer />,
};

export function ThemeMode() {
  const ts = useThemeState();
  const onChangeTheme = () => {
    const { theme, themeMode } = getThemeState();
    ts.setTheme(theme);
    ts.setThemeMode(themeMode);
  };
  useEffect(() => {
    onChangeTheme();
  }, []);
  const onClick = (item: string) => {
    if (item == "System") {
      localStorage.removeItem("theme");
    } else {
      localStorage.theme = item.toLocaleLowerCase();
    }
    onChangeTheme();
  };
  const [isOpen, toggleOpen] = useToggle(false);
  return (
    <>
      <div className="text-xl cursor-pointer" onClick={() => toggleOpen()}>
        {Icons[ts.theme as "light" | "dark" | "system"]}
      </div>
      <TitModal tit={"Switch Theme Mode"} isOpen={isOpen} className="max-w-[12.5rem] py-10 flex flex-col text-base text-stone-500 dark:text-white">
        {["Light", "Dark", "System"].map((item) => (
          <div
            key={"theme_mode_" + item}
            className={cn("flex px-5 items-center py-2 gap-3 cursor-pointer", {
              "bg-stone-100 dark:bg-zinc-700": item.toLowerCase() == ts.themeMode,
            })}
            onClick={() => onClick(item)}
          >
            <div className="text-2xl">{Icons[item.toLowerCase() as "light" | "dark" | "system"]}</div>
            <span className="">{item}</span>
          </div>
        ))}
      </TitModal>
    </>
  );
}
