"use client";

import backendApi from "@/lib/api";
import ACommonCartoonList from "@/components/ACommonCartoonList";
import ADisplayHeader from "@/components/ADisplayHeader";
import { useAuthContext } from "../context/AuthContext";
import { SVGS } from "@/svg";
import { useEffect, useMemo, useState } from "react";
import { TapData } from "@/components/aibum";
import { convertNumber, convertToNew, mapDigitsToAttributes } from "@/lib/utils";
import { toast } from "sonner";

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
  const params = new URLSearchParams(window.location.search);
  const uid = params.get("uid") || ''
  const name = params.get("name") || ''
  const username = name?.split('@')[0] || ''

  const [cartoonList, setCartoonList] = useState<{ cartoonList?: TapData, loading: boolean, current?: { liked: boolean } }>({ cartoonList: TapList, loading: true, current: { liked: false } })

  const gerCartoonList = async () => {

    try {
      const [current, list] = await Promise.all([
        backendApi.userIsLiked(uid),
        backendApi.getShareUserList(uid)
      ]);

      setCartoonList({ cartoonList: list, loading: false, current })
    } catch (error) {
      setCartoonList({ ...cartoonList, loading: false })
      console.error("Error fetching data:", error);
    }

  }

  useEffect(() => {
    gerCartoonList()
  }, [])

  const onLike = async () => {
    if (user?.id === uid) {
      return
    } else if (cartoonList.current?.liked) {
      toast.success("You have liked this album.");
    }


    backendApi.currentUserLike('like', uid).then((res) => {
      if (res.message === 'success') {
        gerCartoonList()
      }
    }).catch((e) => {
      toast.error(`You need to update to Teen Berry (Lv.2 User) to unlock 'Like'.`);

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
          <div className="my-10 font-semibold text-xl leading-10">{username || ''}‘s Berry Album</div>
          <div className="flex items-center gap-2">
            <button onClick={onLike}>
              {cartoonList.current?.liked ?
                <SVGS.SvgLiked /> :
                <SVGS.SvgLike />
              }
            </button>
            <span className="text-xl ">
              {cartoonList.cartoonList?.like}
            </span>
          </div>
        </div>
        {template[0].name && <ACommonCartoonList cartoonList={template} loading={cartoonList.loading} />}
      </div>
    </>

  );
}


export default DispalyCartoon
