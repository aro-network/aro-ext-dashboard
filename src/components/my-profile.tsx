import { SVGS } from "@/svg";
import { cn, Progress } from "@nextui-org/react";
import Avatar from "boring-avatars";
import { useMemo, useState } from "react";
import { FaTelegramPlane } from "react-icons/fa";
import { FaDiscord, FaXTwitter } from "react-icons/fa6";
import { FiLock, FiLogOut } from "react-icons/fi";
import { IoIosCheckmarkCircle, IoIosCloseCircle } from "react-icons/io";
import { Btn, IconBtn } from "./btns";
import { TitCard } from "./cards";
import { levels } from "./level";
import { Booster, DupleInfo } from "./my-dashboard";
import { useAuthContext } from "@/app/context/AuthContext";
import { useToggle } from "react-use";
import { ConfirmDialog } from "./dialogimpls";

function ConnectItem({ type }: { type: "x" | "telegram" | "discord" }) {
  const [isConnected, setConnected] = useState(false);
  const tit = useMemo(() => {
    switch (type) {
      case "x":
        return isConnected ? "@user" : `Connect My X Account`;
      case "telegram":
        return isConnected ? "@user" : `Connect My Telegram Account`;
      case "discord":
        return isConnected ? "@user" : `Connect My Discord Account`;
    }
  }, [isConnected, type]);
  const Micon = type == "x" ? FaXTwitter : type == "telegram" ? FaTelegramPlane : FaDiscord;
  return (
    <div className="rounded-lg p-4 flex items-center gap-5 bg-white/10">
      <Micon className="text-[2rem]" />
      <div className="flex flex-col gap-2">
        <span className="text-sm font-semibold">{tit}</span>
        <div className={cn("flex items-center gap-1 text-xs", isConnected ? "text-green-400" : "text-white/60")}>
          {isConnected ? <IoIosCheckmarkCircle className="text-[15px]" /> : <IoIosCloseCircle className="text-[15px]" />}
          {isConnected ? "Connected" : "Not Connected"}
        </div>
      </div>
      <Btn className="ml-auto w-[6.25rem]">{isConnected ? "Disconnect" : "Connect"}</Btn>
    </div>
  );
}

export default function MyProfile() {
  const ac = useAuthContext();
  const [showConfirmLogout, toggleShowConfirmLogout] = useToggle(false);
  return (
    <div className="grid xl:grid-cols-2 gap-4">
      <TitCard tit="Berry-Up Program">
        <div className="flex gap-7">
          <div className="flex justify-center items-center p-5 rounded-full bg-white shrink-0">
            <SVGS.SvgBerry2 className="text-[5rem]" />
          </div>
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-4">
              <span className="text-2xl font-medium">Berry Body</span>
              <Booster boost={1.5} />
            </div>
            <DupleInfo tit="78" sub="EXP" />
          </div>
        </div>
        <p className="text-sm">
          Earn <strong className="text-primary">EXP</strong> and <strong className="text-primary">Berry up</strong>!<br />
          You account will level-up when you have earned certain EXP by finishing the required tasks.
          <br />
          Higher level helps you gain “Berry” with extra % boost.
        </p>
        <div className="flex justify-between items-start flex-nowrap relative">
          {levels.map((level, li) => (
            <div key={level.name} className="flex flex-col items-center">
              <level.icon className={`text-[50px]`} />
              <span className="mt-[5px] text-center h-[23px] text-sm font-medium">{level.exp} EXP</span>
              <span className="mt-[30px] text-white/50 text-left text-xs">
                {level.name}
                <br />
                {level.boost}
              </span>
            </div>
          ))}
          <Progress className="absolute left-0 top-[88px] h-[10px] w-full " color="primary" value={10} maxValue={100} />
        </div>
      </TitCard>
      <TitCard tit="My Profile">
        <div className="flex items-center gap-4">
          <Avatar name="Eericxu" size={60} variant="beam" />
          <span className="text-xl font-medium">{"momoliaoliao@gmail.com"}</span>
          <IconBtn tip="Reset Password" className="ml-auto">
            <FiLock />
          </IconBtn>
          <IconBtn tip="Log Out" onClick={() => toggleShowConfirmLogout()}>
            <FiLogOut />
          </IconBtn>
          <ConfirmDialog
            tit="Log Out"
            msg="You are going to log out your account. Are you sure?"
            isOpen={showConfirmLogout}
            onCancel={toggleShowConfirmLogout}
            onConfirm={ac.logout}
          />
        </div>
        <div className="flex flex-col gap-4">
          <ConnectItem type="x" />
          <ConnectItem type="telegram" />
          <ConnectItem type="discord" />
        </div>
      </TitCard>
    </div>
  );
}
