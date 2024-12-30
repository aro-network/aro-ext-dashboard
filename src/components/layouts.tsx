import { SVGS } from "@/svg";
import { PropsWithChildren } from "react";

export function PageUnlogin(p: PropsWithChildren) {
    return <div className="w-full h-full flex">
        <div className="flex-[4] min-h-full basis-0 flex flex-col justify-center items-center overflow-auto gap-16 lg:gap-32 bg-[#535252] text-base">
            <SVGS.SvgLogin />
            <SVGS.SvgLogo colors={['white', 'white']} />
        </div>
        <div className="flex-[6] min-h-full basis-0 overflow-y-auto bg-[#272727]">{p.children}</div>
    </div>
}