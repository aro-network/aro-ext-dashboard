import { SVGS } from "@/svg";
import { IoDesktopOutline } from "react-icons/io5";
import { useToggle } from "react-use";
import { Btn } from "./btns";
import { TitModal } from "./dialogs";
import { ReactNode } from "react";
import { EXT_ID } from "@/lib/env";

export function AddNodeDialog() {
  const [isOpen, toggleOpen] = useToggle(false);
  return (
    <>
      <Btn onClick={() => toggleOpen()}>Add New Node</Btn>
      <TitModal isOpen={isOpen} onClose={() => toggleOpen(false)} tit="Add New Node">
        <div className="flex flex-col justify-start items-center self-stretch flex-grow-0 flex-shrink-0 gap-2.5">
          <div className="flex flex-col justify-center items-center self-stretch flex-grow-0 flex-shrink-0 relative gap-5">
            <SVGS.SvgExt className="text-[60px]" />
            <p className="self-stretch flex-grow-0 flex-shrink-0 text-sm text-center text-white">
              <span className="self-stretch flex-grow-0 flex-shrink-0 text-sm font-bold text-center text-white">Chrome Extension Node</span>
              <br />
              <span className="self-stretch flex-grow-0 flex-shrink-0 text-sm text-center text-white">
                The super light-weight node that helps EnReach’s Distributed Acceleration Network (DAN) to gain perception to the network’s capability and potential to serve the
                network.
              </span>
            </p>
          </div>
          <Btn className="w-full" onClick={() => window.open(`https://chromewebstore.google.com/detail/${EXT_ID}`, "_blank")}>
            Download
          </Btn>
        </div>
        <div className="flex flex-col justify-center items-center self-stretch flex-grow-0 flex-shrink-0 relative gap-5">
          <IoDesktopOutline className="text-[60px] text-white" />
          <p className="self-stretch flex-grow-0 flex-shrink-0  text-sm text-center text-white/50">
            <span className="self-stretch flex-grow-0 flex-shrink-0 text-sm font-bold text-center text-white/40">Desktop Node (Coming Soon)</span>
            <br />
            <span className="self-stretch flex-grow-0 flex-shrink-0 text-sm text-center text-white/40">
              The working nodes in EnReach’s Distributed Acceleration Network (DAN) that provides qualified capabilities for content acceleration and AI acceleration.
            </span>
          </p>
        </div>
      </TitModal>
    </>
  );
}

export function ConfirmDialog(p: { onCancel?: () => void; onConfirm?: () => void; tit: string; msg: ReactNode; isOpen: boolean }) {
  return (
    <TitModal isOpen={p.isOpen} tit={p.tit} onClose={p.onCancel}>
      <div className="flex flex-col gap-6 w-full">
        <div className="text-center text-sm whitespace-pre-wrap">{p.msg}</div>
        <div className="grid grid-cols-2 gap-2.5">
          <Btn color="default" onClick={p.onConfirm}>
            Confirm
          </Btn>
          <Btn onClick={p.onCancel}>Cancel</Btn>
        </div>
      </div>
    </TitModal>
  );
}
