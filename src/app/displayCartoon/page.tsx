"use client";

import backendApi from "@/lib/api";
import ACommonCartoonList from "@/components/ACommonCartoonList";
import ADisplayHeader from "@/components/ADisplayHeader";
import { useAuthContext } from "../context/AuthContext";
import { SVGS } from "@/svg";
import { useCallback, useEffect, useMemo, useState } from "react";
import { TapData } from "@/components/aibum";
import { convertNumber, convertToNew, mapDigitsToAttributes } from "@/lib/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { HelpTip } from "@/components/tips";
import { useCopy } from "@/hooks/useCopy";
import { FaXTwitter } from "react-icons/fa6";

const TapList = {
  like: 0,
  list: [{
    uuid: '',
    tapFromUserId: '',
    tapFromcode: '',
    tapToUserId: '',
    tapTocode: '',
    timestamp: 0,
    content: ''
  }],
};

const DispalyCartoon = () => {
  const ac = useAuthContext();
  const user = ac.queryUserInfo?.data;
  const r = useRouter()
  const params = new URLSearchParams(window.location.search);
  const uid = params.get("uid") || ''
  const name = params.get("name") || ''
  const username = name?.split('@')[0] || ''
  const [liked, setLiked] = useState<boolean>(false)
  const [cartoonList, setCartoonList] = useState<{ cartoonList?: TapData, loading?: boolean, }>({ cartoonList: TapList, loading: true })
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

  const gerCartoonList = async () => {
    const params = new URLSearchParams(window.location.search);
    const uid = params.get("uid") || ''

    try {
      if (uid) {

        const sharedList = await backendApi.getShareUserList(uid)
        setCartoonList({ cartoonList: sharedList, loading: false })
        if (ac.user?.userId && uid) {
          const likedRes = await backendApi.userIsLiked(uid)
          setLiked(likedRes.liked)
        }
      }

    } catch (error) {
      setCartoonList({ ...cartoonList, loading: false })
      console.error("Error fetching data:", error);
    }

  }


  useEffect(() => {
    gerCartoonList()
  }, [])

  let clicked = false
  const onLike = async () => {
    if (clicked) return
    clicked = true
    if (user?.id === uid) {
      return
    } else if (!user?.id) {
      const params = new URLSearchParams(window.location.search);
      const referral = params.get("referral");
      const uid = params.get("uid");
      const name = params.get("name");
      r.push(`signin/?page=displayCartoon&referral=${referral}&uid=${uid}&name=${name}`)
      return
    } else if (liked) {
      toast.success("You have liked this album.");
      clicked = false
      return
    }

    backendApi.currentUserLike('like', uid).then((res) => {
      if (res.message === 'success') {
        gerCartoonList()
      }
    }).catch((e) => {
      toast.error(`You need to update to Teen Berry (Lv.2 User) to unlock 'Like'.`);

    }).finally(() => {
      clicked = false
    })
  }

  const createEmptyAttributes = () => ({
    hat: null,
    head: null,
    eyes: null,
    clothes: null,
    hand: null,
    pants: null,
    shoes: null,
    logo: null,
  });

  const template = useMemo(
    () =>
      Array.from({ length: cartoonList.cartoonList?.list.length || 1 }, () => ({
        one: createEmptyAttributes(),
        two: createEmptyAttributes(),
        name: ''
      })),
    [cartoonList]
  );

  useMemo(() => {
    if (!cartoonList.cartoonList?.list) return;

    const updatedList = cartoonList.cartoonList.list.map((item) => ({
      ...item,
      tapFromUserId2: convertNumber(convertToNew(item.tapFromUserId)),
      tapToUserId2: convertNumber(convertToNew(item.tapToUserId)),
    }));

    updatedList.forEach((item, index) => {
      if (template[index]) {
        mapDigitsToAttributes(template[index].one, item.tapFromUserId2,);
        mapDigitsToAttributes(template[index].two, item.tapToUserId2,);
      }
      template[index].name = item.content
    });
  }, [cartoonList, template]);


  return (
    <>
      <ADisplayHeader />
      <div className="  mx-[6.5rem] xsl:mx-[3.75rem]">
        <div className=" flex justify-between ">
          <div className="my-10 font-semibold text-xl leading-10">{`${(uid === user?.id ? 'My Berry Album' : username + '‘s Berry Album' || '')} `}</div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <button className={`${uid === user?.id && 'cursor-not-allowed'}`} onClick={onLike}>
                {liked || uid === user?.id && cartoonList.cartoonList?.like ?
                  <SVGS.SvgLiked /> :
                  <SVGS.SvgLike />
                }
              </button>
              <span className="text-xl ">
                {cartoonList.cartoonList?.like}
              </span>
            </div>
            {user?.id === uid &&
              <>
                <HelpTip content={'Copy Album Link'}>
                  <button onClick={() => copy(shareLink)}>
                    <SVGS.SvgShare />
                  </button>
                </HelpTip><HelpTip content={'Share to Twitter'}>
                  <button onClick={onShareToX} className="text-2xl">
                    <FaXTwitter />
                  </button>
                </HelpTip>
              </>
            }
          </div>
        </div>
        <ACommonCartoonList cartoonList={template} loading={cartoonList.loading} />
      </div>
    </>

  );
}


export default DispalyCartoon
