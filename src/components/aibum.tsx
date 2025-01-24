import { useQuery } from "@tanstack/react-query";
import backendApi from "@/lib/api";
import ACommonCartoonList from "./ACommonCartoonList";
import { useMemo } from "react";
import { useMenusCtx } from "@/app/context/MenusContext";
import { useAuthContext } from "@/app/context/AuthContext";
import { useCopy } from "@/hooks/useCopy";
import { SVGS } from "@/svg";
import { FaXTwitter } from "react-icons/fa6";
import { convertNumber, convertToNew, mapDigitsToAttributes } from "@/lib/utils";
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
  const mc = useMenusCtx();
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
            {data?.like ? <SVGS.SvgLiked /> : <SVGS.SvgLike />}
            <span className="text-xl ">
              {data?.like || 0}
            </span>
          </div>
          <HelpTip content={'Copy Album Link'}>
            <button onClick={() => copy(shareLink)}>
              <SVGS.SvgShare />
            </button>
          </HelpTip>
          <HelpTip content={'Share to Twitter'}>
            <button onClick={onShareToX} className="text-2xl">
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
