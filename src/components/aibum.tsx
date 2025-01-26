import { useAuthContext } from "@/app/context/AuthContext";
import { useCopy } from "@/hooks/useCopy";
import backendApi from "@/lib/api";
import { SVGS } from "@/svg";
import { useQuery } from "@tanstack/react-query";
import { FaXTwitter } from "react-icons/fa6";
import { IoShareSocialSharp } from "react-icons/io5";
import ACommonCartoonList from "./ACommonCartoonList";
import { HelpTip } from "./tips";


export type TapItem = {
  uuid: string;
  tapFromUserId: string;
  tapFromcode: string;
  tapToUserId: string;
  tapTocode: string;
  timestamp: number;
  content: string;
};

export type TapData = {
  like: number;
  list: TapItem[];
};

const AIBum = () => {
  const ac = useAuthContext();
  const user = ac.queryUserInfo?.data;
  const copy = useCopy();

  const shareLink = `${origin}/displayCartoon?referral=${user?.inviteCode}&uid=${user?.id}&name=${user?.email}`;

  const onShareToX = () => {
    const text = `
I have a new 🫐Berry Buddy! 

Click this link to visit my EnReach Season 1 Album give me a Like💗.

Join EnReach Season 1 and earn BERRY points by running a super lite node in Chrome Extension.

`;
    const postXUrl = `https://x.com/intent/post?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareLink)}`;
    window.open(postXUrl, "_blank");
  };
  const { data: likeCount, refetch: refetchLikeCount } = useQuery({
    queryKey: ['queryLikeCount', user?.id],
    enabled: Boolean(user),
    initialData: 0,
    queryFn: async () => {
      return backendApi.userLikeCount(user?.id)
    }
  })
  return <div>
    <div className=" relative pl-5 mb-10 flex items-center justify-between ">
      <div className="text-xl font-semibold z-10 relative">
        {/* {mc.current.contentName} */}
      </div>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="text-2xl text-[#fff]">
            {likeCount > 0 ? <SVGS.SvgLiked /> : <SVGS.SvgLike />}
          </div>

          <span className="text-xl ">
            {likeCount}
          </span>
        </div>
        <HelpTip content={'Copy Album Link'}>
          <button className="text-2xl  hover:text-[#4281FF]" onClick={() => copy(shareLink)}>
            <IoShareSocialSharp />
          </button>
        </HelpTip>
        <HelpTip content={'Share to Twitter'}>
          <button onClick={onShareToX} className="text-2xl hover:text-[#4281FF]">
            <FaXTwitter />
          </button>
        </HelpTip>
      </div>
    </div>
    <ACommonCartoonList loadType="auth" showEmpty />
  </div>;
};

export default AIBum;
