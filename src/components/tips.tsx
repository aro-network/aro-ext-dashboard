import { Tooltip } from "@nextui-org/react";
import { ReactNode } from "react";
import { IoIosHelpCircle } from "react-icons/io";

export function HelpTip({ content, children }: { content: ReactNode; children?: ReactNode }) {
  // border: 1px solid #FFFFFF1A
  return (
    <Tooltip
      showArrow={false}
      content={content}
      color="default"
      className=" min-h-9 min-w-[4.5rem] max-w-[12.5rem]"
      classNames={{ content: "bg-[#40414F] border border-solid border-[rgba(255,255,255,0.1)] min-h-9 min-w-[4.5rem] text-xs" }}
    >
      {children ? (
        children
      ) : (
        <button className="outline-none border-none">
          <IoIosHelpCircle />
        </button>
      )}
    </Tooltip>
  );
}
