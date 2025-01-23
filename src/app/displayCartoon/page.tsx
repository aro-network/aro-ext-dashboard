"use client";

import backendApi from "@/lib/api";
import ACommonCartoonList, { cartoonType, singleCartoon } from "@/components/ACommonCartoonList";
import ADisplayHeader from "@/components/ADisplayHeader";
import { useAuthContext } from "../context/AuthContext";
import { SVGS } from "@/svg";
import { useEffect, useMemo, useState } from "react";
import { TapData } from "@/components/aibum";
import { convertNumber, convertToNew, mapDigitsToAttributes } from "@/lib/utils";


const Tap = {

};

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
  const [cartoonList, setCartoonList] = useState<{ cartoonList?: TapData, loading: boolean }>({ cartoonList: TapList, loading: true })
  const [loading, setLoading] = useState(true)

  const gerCartoonList = async () => {
    console.log('useruser', user);

    // if (!user?.id) return

    try {
      const [liked, list] = await Promise.all([
        backendApi.userIsLiked(user?.id),
        backendApi.getShareUserList(uid)
      ]);
      setCartoonList({ cartoonList: list, loading: false })


      console.log("User liked:", liked);
      console.log("Shared user list:", list);
    } catch (error) {
      setCartoonList({ ...cartoonList, loading: false })

      console.error("Error fetching data:", error);
    }

  }

  useEffect(() => {
    gerCartoonList()
  }, [])


  const onLike = async () => {
    // const res = await backendApi.currentUserLike(user?.id, 'like')
    // console.log('ressss', res);

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


  console.log('cartoonListcartoonList', cartoonList);



  return (
    <>
      <ADisplayHeader />
      <div className="  mx-[6.5rem]">
        <div className=" flex justify-between ">
          <div className="my-10 font-semibold text-xl leading-10">{name || ''}‘s Berry Album</div>
          <div className="flex items-center gap-2">
            <button onClick={onLike}>
              <SVGS.SvgLike />
            </button>
            <span className="text-xl ">
              {cartoonList.cartoonList?.like}
            </span>
          </div>
        </div>

        <ACommonCartoonList cartoonList={template} loading={cartoonList.loading} />

      </div>
    </>

  );
}


export default DispalyCartoon
