import { useMemo, useState } from "react";
import { FiEdit } from "react-icons/fi";
import { IconBtn } from "./btns";
import { TitCard } from "./cards";
import { AddNodeDialog } from "./dialogimpls";
import { STable } from "./tables";
import { HelpTip } from "./tips";

import backendApi from "@/lib/api";
import { fmtDuration, handlerError } from "@/lib/utils";
import { cn, Input, InputSlots, Pagination, SlotsToClasses, Spinner } from "@nextui-org/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import _ from "lodash";
import { IoIosCheckmarkCircle, IoIosCloseCircle } from "react-icons/io";
import { RiRefreshLine } from "react-icons/ri";
import { useToggle } from "react-use";
import { fmtBerry, fmtNetqulity } from "./fmtData";
import { NodeItem } from "@/types/node";
import { PaginationClassNames } from "./pagination";

const inputNameClassNames: SlotsToClasses<InputSlots> = {
  inputWrapper: "h-5 min-h-5 w-[7.5rem]  h-[.875rem] outline-none rounded-lg border-1 !border-white/20 bg-transparent text-xs",
  label: "text-xs",
  input: "text-xs !text-white/80",
};
function NodeName({ node }: { node: NodeItem }) {
  const [edit, toggleEdit] = useToggle(false);
  const [inputName, setInputName] = useState(node.name || "");
  const { mutate, isPending } = useMutation({
    onError: handlerError,
    mutationFn: async () => {
      await backendApi.updateNodeName(node, inputName);
      node.name = inputName;
      toggleEdit(false);
      return true;
    },
  });
  const name = node.name || "Untitled Device";
  const onSubmit = () => {
    if (inputName && inputName !== name) {
      mutate();
    } else {
      toggleEdit(false);
    }
  };
  return (
    <div className="flex min-w-[10rem] gap-2.5 items-center ">
      {edit ? (
        <Input
          className="w-fit"
          autoFocus
          classNames={inputNameClassNames}
          value={inputName}
          maxLength={20}
          onChange={(e) => setInputName(e.target.value)}
          variant="bordered"
          type="text"
          placeholder={name}
          onKeyDown={(e) => {
            if (e.code === "Enter") {
              onSubmit();
            }
          }}
          onBlur={onSubmit}
        />
      ) : (
        <div className="whitespace-nowrap">{name}</div>
      )}
      {isPending && <Spinner size="sm" />}
      {!edit && (
        <div className="flex justify-center items-center rounded-full bg-white/80 hover:bg-white text-black text-[.5rem] w-3 h-3 cursor-pointer" onClick={() => toggleEdit()}>
          <FiEdit />
        </div>
      )}
    </div>
  );
}

function CountryIP({ ip, country }: { ip: string; country: string }) {
  return (
    <div className="flex gap-1 items-center ">
      <span className={cn(`text-base fi fi-${(country || "").toLowerCase()}`)}></span>
      <span>{ip}</span>
    </div>
  );
}
function Status({ isConnected }: { isConnected?: boolean }) {
  return (
    <div className={cn(" flex items-center gap-1", isConnected ? "text-green-400" : "text-white/60")}>
      {isConnected ? <IoIosCheckmarkCircle className="text-[.9375rem]" /> : <IoIosCloseCircle className="text-[.9375rem]" />}
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
      .sort((a, b) => (a.isConnected !== b.isConnected ? b.isConnected - a.isConnected : b.lastConnectedAt - a.lastConnectedAt))
      .map((item, i) => [
        <NodeName node={item} key={`nodeName_${i}`} />,
        "Extension",
        <CountryIP country={item.countryCode} ip={item.ipAddress} key={"CountryIp"} />,
        <Status isConnected={Boolean(item.isConnected)} key={"status"} />,
        fmtDuration(_.toNumber(item.totalUptime) * 1000, "D[d] H[h] m[m]"),
        fmtNetqulity(item.lastPoint),
        fmtBerry(item.todayPoints, "-"),
        fmtBerry(item.totalPoints, "-"),
      ]);
  }, [data]);
  const pageChunks = useMemo(() => _.chunk(datas, 10), [datas]);
  const [page, setPage] = useState(1);
  return (
    <TitCard
      tit="My Nodes"
      className="flip_item w-full"
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
        loadingContent={<Spinner />}
        empty="You currently have no running nodes. Click 'Add New Node' button, download and set up your node ready for the Season 1!"
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
        data={pageChunks[page - 1] || []}
      />
      {pageChunks.length > 1 && (
        <div className="flex items-center">
          <Pagination className="mx-auto" classNames={PaginationClassNames} total={pageChunks.length} page={page} onChange={setPage} />
        </div>
      )}
    </TitCard>
  );
}
