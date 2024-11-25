import { useMemo } from "react";
import { FiEdit } from "react-icons/fi";
import { IconBtn } from "./btns";
import { TitCard } from "./cards";
import { AddNodeDialog } from "./dialogimpls";
import { STable } from "./tables";
import { HelpTip } from "./tips";

import backendApi from "@/lib/api";
import { fmtDuration } from "@/lib/utils";
import { cn, Skeleton } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import { flag } from "country-emoji";
import _ from "lodash";
import { IoIosCheckmarkCircle, IoIosCloseCircle } from "react-icons/io";
import { RiRefreshLine } from "react-icons/ri";
import { fmtBerry, fmtNetqulity } from "./fmtData";
function NodeName({ name }: { name: string }) {
  return (
    <div className="flex gap-[10px] items-center">
      {name}

      <div className="flex justify-center items-center rounded-full bg-white/80 hover:bg-white text-black text-[8px] w-3 h-3 cursor-pointer hidden">
        <FiEdit />
      </div>
    </div>
  );
}

function CountryIP({ ip, country }: { ip: string; country: string }) {
  return (
    <div className="flex gap-2 items-center">
      <span className="text-base">{flag(country == "TW" ? "CN" : country)}</span>
      <span>{ip}</span>
    </div>
  );
}
function Status({ isConnected }: { isConnected?: boolean }) {
  return (
    <div className={cn(" flex items-center gap-1", isConnected ? "text-green-400" : "text-white/60")}>
      {isConnected ? <IoIosCheckmarkCircle className="text-[15px]" /> : <IoIosCloseCircle className="text-[15px]" />}
      {isConnected ? "Connected" : "Offline"}
    </div>
  );
}
export default function MyNodes() {
  const { data, isFetching, refetch, isLoading } = useQuery({
    queryKey: ["NodeList"],
    queryFn: () => backendApi.nodeList(),
  });
  const datas = useMemo(() => {
    const nodes = data || [];
    if (nodes.length) {
      // nodes.push({...nodes[0], isConnected: false})
    }
    return nodes
      .sort((a, b) => (a.isConnected && b.isConnected ? 0 : a.isConnected ? -1 : 1))
      .map((item) => [
        <NodeName name={item.name || "Untitled Device"} key={"Namee"} />,
        "Extension",
        <CountryIP country={item.countryCode} ip={item.ipAddress} key={"CountryIp"} />,
        <Status isConnected={item.isConnected} key={"status"} />,
        fmtDuration(_.toNumber(item.totalUptime) * 1000, "D[d] H[h] m[m]"),
        fmtNetqulity(item.lastPoint),
        fmtBerry(item.todayPoints, "-"),
        fmtBerry(item.totalPoints, "-"),
      ]);
  }, [data]);
  return (
    <TitCard
      tit="My Nodes"
      className="w-full"
      right={
        <div className="flex gap-5 items-center">
          <IconBtn
            tip="Refresh Data"
            onClick={() => {
              if (!isFetching) refetch();
            }}
          >
            <RiRefreshLine className={cn({ "animate-spin": isFetching })} />
          </IconBtn>
          <AddNodeDialog />
        </div>
      }
    >
      <STable
        isLoading={isLoading}
        loadingContent={
          <div className="flex flex-col gap-4 w-full">
            <Skeleton className="rounded-lg h-[50px] bg-white" />
            <Skeleton className="rounded-lg h-[50px] bg-white" />
          </div>
        }
        empty="Empty!"
        head={[
          "Node Name",
          "Node Type",
          "IP",
          "Status",
          <div className="flex items-center gap-1" key={"uptime"}>
            Uptime <HelpTip content="Uptime tells users how long a node has been available." />
          </div>,
          "Network Quality",
          <div className="flex items-center gap-1" key={"today"}>
            Today’s BERRY Rewards <HelpTip content="Today’s Network Rewards in BEERY amount." />
          </div>,
          "S1 Total BERRY",
        ]}
        data={datas}
      />
    </TitCard>
  );
}
