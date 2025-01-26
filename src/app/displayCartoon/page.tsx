"use client";

import ACommonCartoonList from "@/components/ACommonCartoonList";
import ADisplayHeader, { urlToSigninFromAlbum } from "@/components/ADisplayHeader";
import { HelpTip } from "@/components/tips";
import { useCopy } from "@/hooks/useCopy";
import backendApi from "@/lib/api";
import { SVGS } from "@/svg";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { FaXTwitter } from "react-icons/fa6";
import { IoShareSocialSharp } from "react-icons/io5";
import { toast } from "sonner";
import { useAuthContext } from "../context/AuthContext";
import { cn } from "@nextui-org/react";


const DispalyCartoon = () => {
  const ac = useAuthContext();
  const user = ac.queryUserInfo?.data;
  const r = useRouter()
  const sp = useSearchParams()
  const uid = sp.get("uid") || ''
  const name = sp.get("name") || ''
  const username = name?.split('@')[0] || ''
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


  const { data: likeStat, refetch: refetchLikeStat, isLoading: isLoadingLikeStat } = useQuery({
    queryKey: ['queryLikeStat', uid, user?.id],
    enabled: Boolean(uid),
    initialData: { liked: false, likeCount: 0 },
    queryFn: async () => {
      const [liked, likeCount] = await Promise.all([backendApi.userIsLiked(uid).catch(_e => false), backendApi.userLikeCount(uid)])
      return { liked, likeCount }
    }
  })
  let clicked = false
  const onLike = async () => {
    if (clicked) return
    clicked = true
    if (user?.id === uid) {
      return
    } else if (!user?.id) {
      r.push(urlToSigninFromAlbum())
      return
    } else if (likeStat?.liked) {
      toast.success("You have liked this album.");
      clicked = false
      return
    }

    backendApi.currentUserLike('like', uid).then((res) => {
      if (res.message === 'success') {
        refetchLikeStat()
      }
    }).catch((e) => {
      toast.error(`You need to update to Teen Berry (Lv.2 User) to unlock 'Like'.`);

    }).finally(() => {
      clicked = false
    })
  }

  return (
    <>
      <ADisplayHeader />
      <div className="  mx-[6.5rem] xsl:mx-[3.75rem]">
        <div className=" flex justify-between ">
          <div className="my-10 font-semibold text-xl leading-10">{`${(uid === user?.id ? 'My Berry Album' : username && (username + '‘s Berry Album') || '')} `}</div>
          <div className="flex items-center gap-6">
            <div className={cn("flex items-center gap-2")}>
              <button className={`${uid === user?.id && 'cursor-not-allowed'}`} onClick={onLike}>
                {likeStat.liked || uid === user?.id ?
                  <SVGS.SvgLiked /> :
                  <SVGS.SvgLike />
                }
              </button>
              <span className="text-xl ">
                {likeStat.likeCount}
              </span>
            </div>
            {user?.id === uid &&
              <>
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
              </>
            }
          </div>
        </div>
        <ACommonCartoonList loadType="uid" />
      </div>
    </>

  );
}


export default DispalyCartoon
