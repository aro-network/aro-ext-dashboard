import { useAuthContext } from "@/app/context/AuthContext";
import { MAvatar } from "./avatar";
import { useRouter } from "next/navigation";

const ADisplayHeader = () => {
  const ac = useAuthContext();
  const user = ac.queryUserInfo?.data;
  const r = useRouter()

  const onSwitchToHome = () => {
    const params = new URLSearchParams(window.location.search);
    const referral = params.get("referral");
    const uid = params.get("uid");
    const name = params.get("name");
    r.push(`signin/?referral=${referral}&uid=${uid}&name=${name}&redirect=${encodeURIComponent(location.pathname + location.search)}`)
  }

  return <div className=" flex h-[3.75rem] flex-row w-full justify-between items-center py-5 bg-[#404040]  px-[50px]  ">
    <div className="flex items-center  gap-5 ">
      <img src="/logo.svg" className={`shrink-0  smd:w-full smd:max-w-fulllg:ml-0 max-w-[9.375rem] h-[2.375rem] lg:rotate-0 `} alt="Logo" />
    </div>
    {user?.email ?
      <div className="flex  items-center gap-5">
        <label className=" font-medium text-base leading-5">
          {user.email}
        </label>
        <button className="w-8">
          <MAvatar name={user?.email} />
        </button>
      </div>
      :
      <button onClick={onSwitchToHome}>
        Sign In
      </button>
    }
  </div>

}

export default ADisplayHeader