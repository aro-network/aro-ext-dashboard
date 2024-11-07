import { Opt } from "./type";

export function getBrowserInstance(): typeof chrome {
  // Get extension api Chrome or Firefox
  const browserInstance = window.chrome || (window as any)["browser"];
  return browserInstance;
}

export function getInjectEnReachAI() {
  return (window as any)["EnReachAI"] as Opt<{
    name: string;
    request: (msg: { name: string; body?: any }) => Promise<any>;
  }>;
}
