import { Tooltip } from "@nextui-org/react";
import { ReactNode } from "react";
import { IoIosHelpCircle } from "react-icons/io";

export function HelpTip({ content, children }: { content: ReactNode; children?: ReactNode }) {
  const contentClassname = "bg-[#585858] border border-solid border-white/10 min-h-9 min-w-[4.5rem] text-xs text-white/60"
  return (
    <Tooltip
      showArrow={false}
      content={content}
      color="default"
      className=" min-h-9 min-w-[4.5rem] max-w-[12.5rem]"
      classNames={{ content: contentClassname }}
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
