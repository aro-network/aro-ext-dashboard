import { useQuery } from "@tanstack/react-query";
import backendApi from "@/lib/api";
import ACommonCartoonList from "./ACommonCartoonList";
import { useMemo } from "react";
import { useAuthContext } from "@/app/context/AuthContext";
import { useCopy } from "@/hooks/useCopy";
import { SVGS } from "@/svg";
import { FaXTwitter } from "react-icons/fa6";
import { convertNumber, convertToNew, mapDigitsToAttributes } from "@/lib/utils";
import { HelpTip } from "./tips";
import { IoShareSocialSharp } from "react-icons/io5";


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
  const { data, isFetching: loading, refetch } = useQuery({
    queryKey: ["cartoonList"],
    queryFn: backendApi.getCartoonList,
  });



  const createEmptyAttributes = () => ({
    hat: 0,
    head: 0,
    eyes: 0,
    clothes: 0,
    hand: 0,
    pants: 0,
    shoes: 0,
    logo: 0,
  });

  const template = useMemo(
    () =>
      Array.from({ length: data?.list.length || 1 }, () => ({
        one: createEmptyAttributes(),
        two: createEmptyAttributes(),
        name: ''
      })),
    [data]
  );


  useMemo(() => {
    if (!data?.list) return;

    const updatedList = data.list.map((item) => ({
      ...item,
      tapFromUserId2: convertNumber(convertToNew(item.tapFromUserId)),
      tapToUserId2: convertNumber(convertToNew(item.tapToUserId)),
    }));

    updatedList.forEach((item, index) => {
      if (template[index]) {
        mapDigitsToAttributes(template[index].one, item.tapFromUserId2);
        mapDigitsToAttributes(template[index].two, item.tapToUserId2);
      }
      template[index].name = item.content
    });
  }, [data, template]);


  return <div>
    <div className=" relative pl-5 mb-10 flex items-center justify-between ">
      <div className="text-xl font-semibold z-10 relative">
        {/* {mc.current.contentName} */}
      </div>
      {template[0]?.name &&
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="text-2xl text-[#fff]">
              {data?.like ? <SVGS.SvgLiked /> : <SVGS.SvgLike />}
            </div>

            <span className="text-xl ">
              {data?.like || 0}
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
      }
    </div>

    <ACommonCartoonList cartoonList={template} loading={loading} />
    {!template || !template[0].name && !loading && <div className=" text-xl w-full text-center flex justify-center ">Oops! Nothing here yet.</div>}




  </div>;
};

export default AIBum;
