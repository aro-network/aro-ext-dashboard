"use client";

import { useQuery } from "@tanstack/react-query";
import backendApi from "@/lib/api";
import ACommonCartoonList, { cartoonType } from "@/components/ACommonCartoonList";
import ADisplayHeader from "@/components/ADisplayHeader";
import { useAuthContext } from "../context/AuthContext";
import { SVGS } from "@/svg";

const cartoonList: cartoonType[] = [
  {
    one: {
      hat: 0,
      head: 1,
      eyes: 0,
      clothes: 1,
      hand: [0, 0],
      pants: 0,
      shoes: 1,
      logo: 1

    },
    two: {
      hat: 3,
      head: 3,
      eyes: 2,
      clothes: 4,
      hand: [0, 0],
      pants: 1,
      shoes: 2,
      logo: 0
    },
  },
  {
    one: {
      hat: 1,
      head: 0,
      eyes: 2,
      clothes: 0,
      hand: [0, 0],
      pants: 1,
      shoes: 0,
      logo: 0
    }
  },
  {
    one: {
      hat: 2,
      head: 2,
      eyes: 2,
      clothes: 2,
      hand: [0, 0],
      pants: 1,
      shoes: 1,
      logo: 0
    }
  },
  {
    one: {
      hat: 3,
      head: 3,
      eyes: 2,
      clothes: 4,
      hand: [0, 0],
      pants: 1,
      shoes: 2,
      logo: 0
    }
  },
  {
    one: {
      hat: 1,
      head: 0,
      eyes: 3,
      clothes: 3,
      hand: [0, 0],
      pants: 1,
      shoes: 3,
      logo: 0
    }
  },


]

const DispalyCartoon = () => {
  const ac = useAuthContext();
  const user = ac.queryUserInfo?.data;


  const { data, isLoading } = useQuery({
    queryKey: [],
    queryFn: () => backendApi.getCartoonList(),
  });

  const onLike = async () => {

    const res = await backendApi.currentUserLike('123', 'like')
    console.log('ressss', res);


  }

  return (
    <>
      <ADisplayHeader />
      <div className="  mx-[6.5rem]">
        <div className=" flex justify-between ">
          <div className="my-10 font-semibold text-xl leading-10">Example’s Berry Album</div>
          <button onClick={onLike}>
            <SVGS.SvgLike />
          </button>
        </div>

        <ACommonCartoonList
          cartoonList={cartoonList}
        />
      </div>
    </>

  );
}


export default DispalyCartoon
