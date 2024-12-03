import { useAuthContext } from "@/app/context/AuthContext";
import backendApi, { BASE_API } from "@/lib/api";
import { cn, Progress } from "@nextui-org/react";
import { telegramAuth } from "@use-telegram-auth/hook";
import axios from "axios";
import _ from "lodash";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { FaTelegramPlane } from "react-icons/fa";
import { FaDiscord, FaXTwitter } from "react-icons/fa6";
import { FiLock, FiLogOut } from "react-icons/fi";
import { IoIosCheckmarkCircle, IoIosCloseCircle } from "react-icons/io";
import { useToggle } from "react-use";
import { MAvatar } from "./avatar";
import { Btn, IconBtn } from "./btns";
import { TitCard } from "./cards";
import { ConfirmDialog } from "./dialogimpls";
import { levels } from "./level";
import { Booster, DupleInfo } from "./my-dashboard";
import { handlerErrForBind } from "@/hooks/useShowParamsError";

function ConnectItem({ type }: { type: "x" | "telegram" | "discord" }) {
  const ac = useAuthContext();
  const social = ac.queryUserInfo?.data?.social;
  const [tit, isConnected]: [string, boolean] = useMemo(() => {
    switch (type) {
      case "x":
        return social?.x ? [`@${social.x.name}`, true] : [`Connect My X Account`, false];
      case "telegram":
        return social?.tg ? [`@${social.tg.username}`, true] : [`Connect My Telegram Account`, false];
      case "discord":
        return social?.discord ? [`@${social.discord.username}`, true] : [`Connect My Discord Account`, false];
    }
  }, [social, type]);
  const Micon = type == "x" ? FaXTwitter : type == "telegram" ? FaTelegramPlane : FaDiscord;
  const onConnect = async () => {
    const token = await backendApi.getAccessToken();
    const redirectUrl = encodeURIComponent(`${BASE_API}/user/auth/handler/${type}`);
    let url: string = "";
    switch (type) {
      case "x":
        url = `https://x.com/i/oauth2/authorize?response_type=code&client_id=M0hkaVBZaUZITHo2RmprZ19obEs6MTpjaQ&redirect_uri=${redirectUrl}&scope=users.read%20tweet.read&code_challenge=challenge&code_challenge_method=plain&state=${token}`;
        break;
      case "telegram":
        const result = await telegramAuth("7324509153", { windowFeatures: { popup: true, width: 600, height: 800 } });
        const res = await axios.get(`${BASE_API}/user/auth/handler/telegram`, { params: { ...result, state: token } });
        if(res.request?.res?.responseUrl && typeof res.request?.res?.responseUrl === 'string'){
          const err = new URL(res.request?.res?.responseUrl).searchParams.get("err")
          handlerErrForBind(err)
        }
        ac.queryUserInfo?.refetch();
        return;
      case "discord":
        url = `https://discord.com/oauth2/authorize?client_id=1303958338488238090&response_type=code&redirect_uri=${redirectUrl}&scope=identify+email&state=${token}`;
        break;
    }
    window.open(url, "_blank");
  };
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
      {!isConnected && (
        <Btn className="ml-auto w-[6.25rem]" onClick={onConnect}>
          {isConnected ? "Disconnect" : "Connect"}
        </Btn>
      )}
    </div>
  );
}

export default function MyProfile() {
  const ac = useAuthContext();
  const user = ac.queryUserInfo?.data;
  const exp = user?.stat.exp || 0;
  const currentLevel = levels.find((_l, i) => user?.stat.level === i) || levels[0];
  const levelName = currentLevel.name;
  const [showConfirmLogout, toggleShowConfirmLogout] = useToggle(false);
  const [showConfirmReset, toggleShowConfirmReset] = useToggle(false);
  const processValue = useMemo(() => {
    const cLevel = levels.find((l) => l.exp >= exp);
    if (!cLevel) return 100;
    if (cLevel.level == 0) return 0;
    const cStartExp = levels[cLevel.level - 1].exp;
    const oneLevelValue = 100 / (levels.length - 1);
    return _.round(oneLevelValue * (cLevel.level - 1) + (oneLevelValue * (exp - cStartExp)) / (cLevel.exp - cStartExp), 1);
  }, [exp]);
  const r = useRouter();
  return (
    <div className="grid xl:grid-cols-2 gap-4">
      <TitCard tit="Berry-Up Program">
        <div className="flex gap-7">
          <currentLevel.icon className="text-[7.5rem]" />
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-4">
              <span className="text-2xl font-medium">{levelName} </span>
              <Booster />
            </div>
            <DupleInfo tit={user?.stat.exp} sub="EXP" />
          </div>
        </div>
        <p className="text-sm">
          Earn <strong className="text-primary">EXP</strong> and <strong className="text-primary">Berry-up</strong>!<br />
          You account will level-up when you have earned certain EXP by finishing the required tasks.
          <br />
          Higher level helps you gain “BERRY” with extra % boost.
        </p>
        <div className="flex justify-between items-start flex-nowrap relative">
          {levels.map((level, _li) => (
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
          <Progress className="absolute left-0 top-[88px] h-[10px] w-full " color="primary" value={processValue} maxValue={100} />
        </div>
      </TitCard>
      <TitCard tit="My Profile">
        <div className="flex items-center gap-4">
          <MAvatar name={user?.email} size={60} />
          <span className="text-xl font-medium">{user?.email || ""}</span>
          <IconBtn tip="Reset Password" className="ml-auto" onClick={() => toggleShowConfirmReset()}>
            <FiLock />
          </IconBtn>
          <IconBtn tip="Log Out" onClick={() => toggleShowConfirmLogout()}>
            <FiLogOut />
          </IconBtn>
          <ConfirmDialog
            tit="Log Out"
            msg={
              <>
                You are going to log out your account.
                <br />
                Are you sure?
              </>
            }
            isOpen={showConfirmLogout}
            onCancel={toggleShowConfirmLogout}
            onConfirm={ac.logout}
          />
          <ConfirmDialog
            tit="Reset Password"
            msg={
              <>
                Are you sure you want to reset your password?
                <br />
                You will leave current page and redirect to the Reset Password page.
              </>
            }
            isOpen={showConfirmReset}
            onCancel={toggleShowConfirmReset}
            onConfirm={() => r.push(`/reset?email=${user?.email}`)}
          />
        </div>
        <div className="flex flex-col gap-4">
          <ConnectItem type="x" />
          <ConnectItem type="discord" />
          <ConnectItem type="telegram" />
        </div>
      </TitCard>
    </div>
  );
}
