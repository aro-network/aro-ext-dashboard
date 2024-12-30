import { IoTerminal } from "react-icons/io5";
import { IconCard, InnerIconCard, TitCard } from "./cards";
import { SVGS } from "@/svg";
import { Btn, IconBtn } from "./btns";
import { FaLink, FaXTwitter } from "react-icons/fa6";
import { DupleInfo, DupleSplit } from "./my-dashboard";
import { IoIosCheckmarkCircle, IoIosMore } from "react-icons/io";
import { HelpTip } from "./tips";
import { useAuthContext } from "@/app/context/AuthContext";
import { useCopy } from "@/hooks/useCopy";
import { fmtBerry } from "./fmtData";

export default function MyReferral() {
  const ac = useAuthContext();
  const user = ac.queryUserInfo?.data;
  const referredCount = user?.referral.valid || 0;
  const referringCount = user?.referral.pending || 0;
  const referredPoint = fmtBerry(user?.point.referral);
  const copy = useCopy();
  const onPostX = () => {
    const refferralLink = `${origin}/signup?referral=${user?.inviteCode}`;
    const text = `
Join the magic journey with @EnReachAI – the genesis of open edge cloud, for the AI era.

Get your EnReach Edge Node ready for🫐BerryBurst Season 1🫐

    `;
    const postXUrl = `https://x.com/intent/post?text=${encodeURIComponent(text)}&url=${encodeURIComponent(refferralLink)}`;
    window.open(postXUrl, "_blank");
  };
  return (
    <div className="grid xl:grid-cols-3 gap-4">
      <IconCard
        className="flip_item"
        iconSize={20}
        icon={IoTerminal}
        tit={<div className="text-xl font-Alexandria">My Referral Code</div>}
        content={
          <div className="flex items-center gap-4">
            <div className="uppercase text-4xl leading-8 font-bold">{user?.inviteCode}</div>
            <IconBtn tip="Copy Referral Link" onClick={() => copy(`${origin}/signup?referral=${user?.inviteCode}`)}>
              <FaLink />
            </IconBtn>
            <IconBtn tip="Tweet Your Referral" onClick={onPostX}>
              <FaXTwitter />
            </IconBtn>
          </div>
        }
      />

      <IconCard
        className="flip_item"
        icon={SVGS.SvgReferral}
        iconSize={20}
        tit={<div className="text-xl font-Alexandria">My Referrals</div>}
        content={
          <div className="flex items-center gap-[10%] min-w-[13.75rem]">
            <DupleInfo
              tit={referredCount}
              subClassName="text-green-400 opacity-100"
              sub={
                <>
                  <IoIosCheckmarkCircle /> Referred
                </>
              }
            />
            <DupleSplit />
            <DupleInfo
              tit={referringCount}
              sub={
                <>
                  <IoIosMore /> Pending
                </>
              }
              subTip="The referee needs to achieve more than 72h uptime to make your referral qualified."
            />
          </div>
        }
      />
      <IconCard
        className="flip_item"
        icon={SVGS.SvgRewards}
        iconSize={20}
        tit={
          <div className="text-xl flex items-center gap-2  font-Alexandria">
            Referral Bonus{" "}
            <HelpTip content="Referral Bonus include an one-time bonus for a qualified referral, and a permanent percentage share of your referees’ Network Bonus." />
          </div>
        }
        content={
          <div className="flex items-center gap-[10%]">
            <DupleInfo tit={referredPoint} sub="BERRY" />
          </div>
        }
      />
      <TitCard className="flip_item col-span-full flex-row gap-[3.125rem] flex-wrap justify-center">
        <div className="flex flex-col gap-4 items-center shrink-0">
          <SVGS.SvgMedal className="text-[5rem] shrink-0" />
          <div className="uppercase  font-Alexandria text-[2rem] whitespace-nowrap leading-8">Get Referral Rewards</div>
          <Btn className="w-full h-[2.125rem]" onClick={() => copy(`${origin}/signup?referral=${user?.inviteCode}`)}>
            Copy Referral Link
          </Btn>
        </div>
        <InnerIconCard icon={SVGS.SvgRewards} iconSize={20} className="flex-1 min-w-[31.25rem]">
          <div className="text-base">
            <p>
              For every qualified referral (Referee’s Uptime {">"} 72 hours), both parties get one-time <strong className="text-primary">720 BERRY</strong> bonus.
            </p>
            <br />
            <p>
              You (the Referrer) get a perpetual <strong className="text-primary">15%</strong> bonus from your direct referee’s total rewards, and a perpetual{" "}
              <strong className="text-primary">5%</strong> bonus from your next-tier referee. No up limits!
            </p>
          </div>
        </InnerIconCard>
      </TitCard>
    </div>
  );
}
