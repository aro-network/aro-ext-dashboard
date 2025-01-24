import { cartoonType, singleCartoon } from "@/components/ACommonCartoonList";
import { TapData } from "@/components/aibum";
import { convertNumber, convertToNew, mapDigitsToAttributes } from "@/lib/utils";
import { useMemo } from "react";

export function useCartoonList(data?: TapData) {
  return useMemo(() => {
    if (!data?.list) return [];
    const updatedList = data.list.map((item) => ({
      ...item,
      tapFromUserId2: convertNumber(convertToNew(item.tapFromUserId)),
      tapToUserId2: convertNumber(convertToNew(item.tapToUserId)),
    }));
    const createEmptyAttributes = (): singleCartoon => ({
      hat: 0,
      head: 0,
      eyes: 0,
      clothes: 0,
      hand: [0, 0],
      pants: 0,
      shoes: 0,
      logo: 0,
    });
    return updatedList.map((item, index) => {
      const carton: cartoonType = {
        one: createEmptyAttributes(),
        two: createEmptyAttributes(),
        name: item.content,
      };
      mapDigitsToAttributes(carton.one!, item.tapFromUserId2);
      mapDigitsToAttributes(carton.two!, item.tapToUserId2);
      return carton;
    });
  }, [data]);
}
