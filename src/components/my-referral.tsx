import { IoTerminal } from "react-icons/io5";
import { IconCard, InnerIconCard, TitCard } from "./cards";
import { SVGS } from "@/svg";
import { Btn, IconBtn } from "./btns";
import { FaLink, FaXTwitter } from "react-icons/fa6";
import { DupleInfo } from "./my-dashboard";
import { IoIosCheckmarkCircle, IoIosMore } from "react-icons/io";
import { HelpTip } from "./tips";

export default function MyReferral() {
  return (
    <div className="grid xl:grid-cols-3 gap-4">
      <IconCard icon={IoTerminal} iconSize={20}>
        <div className="flex flex-col gap-8">
          <div className="text-xl">My Referral Code</div>
          <div className="flex items-center gap-4">
            <div className="uppercase text-4xl leading-8 font-bold font-HelveticaNeue">A5RD3P</div>
            <IconBtn tip="Copy Referral Link">
              <FaLink />
            </IconBtn>
            <IconBtn tip="Follow X">
              <FaXTwitter />
            </IconBtn>
          </div>
        </div>
      </IconCard>
      <IconCard icon={SVGS.SvgReferral} iconSize={20}>
        <div className="flex flex-col gap-8">
          <div className="text-xl">My Referrals</div>
          <div className="flex items-center gap-[10%]">
            <DupleInfo
              tit="35"
              subClassName="text-green-400 opacity-100"
              sub={
                <>
                  <IoIosCheckmarkCircle /> Referred
                </>
              }
            />
            <div className="bg-white opacity-30 w-[1px] h-6" />
            <DupleInfo
              tit="129"
              sub={
                <>
                  <IoIosMore /> Pending
                </>
              }
              subTip="...Pending"
            />
          </div>
        </div>
      </IconCard>
      <IconCard icon={SVGS.SvgRewards} iconSize={20}>
        <div className="flex flex-col gap-8">
          <div className="text-xl flex items-center gap-2">
            Referral Bonus <HelpTip content="Referral Bonus" />
          </div>
          <div className="flex items-center gap-[10%]">
            <DupleInfo tit="35" sub="BERRY" />
          </div>
        </div>
      </IconCard>
      <TitCard className="col-span-full flex-row gap-[50px] flex-wrap">
        <div className="flex flex-col gap-4 items-center shrink-0">
          <SVGS.SvgMedal className="text-[5rem] shrink-0" />
          <div className="uppercase text-[2rem] whitespace-nowrap font-HelveticaNeue leading-8">Get Referral Rewards</div>
          <Btn className="w-full">Copy Referral Link</Btn>
        </div>
        <InnerIconCard icon={SVGS.SvgRewards} iconSize={20} className="flex-1 min-w-[500px]">
          <div className="text-base">
            <p>
              For every qualified referral (Referee’s Uptime {">"} 72 hours), both parties get one-time <strong className="text-primary">50 Berry</strong> bonus.
            </p>
            <br />
            <p>
              You (the Referer) get a perpetual <strong className="text-primary">15%</strong> bonus from your direct referee’s total rewards, and a perpetual{" "}
              <strong className="text-primary">5%</strong> bonus from your next-tier referee. No up limits!
            </p>
          </div>
        </InnerIconCard>
      </TitCard>
    </div>
  );
}
