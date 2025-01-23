import { toast } from "sonner";
import dayjs from "dayjs";
import plugDur from "dayjs/plugin/duration";
import { AxiosError } from "axios";
import _ from "lodash";
import { cartoonType } from "@/components/ACommonCartoonList";
dayjs.extend(plugDur);

export function strToSearchParams(str: string) {
  return str.toLowerCase().replaceAll(" ", "_");
}

export function getErrorMsg(error: any) {
  // msg
  let msg = "Unkown";
  if (typeof error == "string") msg = error;
  else if (error instanceof AxiosError)
    msg = error.response?.data?.message || error.message;
  else if (typeof error?.msg == "string") msg = error?.msg;
  else if (typeof error?.message == "string") msg = error?.message;
  // replace
  //   if (msg.includes("User denied") || msg.includes("user rejected transaction")) return "You declined the action in your wallet.";
  //   if (msg.includes("transaction failed")) return "Transaction failed";
  return msg;
}

export function handlerError(err: any) {
  toast.error(_.upperFirst(getErrorMsg(err).trim()));
}

export function sleep(time: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, time));
}

export function fmtDate(date: number, fmt: string) {
  return dayjs(date).format(fmt);
}

export function fmtDuration(time: number, fmt: string) {
  return dayjs.duration(time).format(fmt);
}

export function pxToRem(px: number, base: number = 16) {
  return _.round(px / base, 4) + "rem";
}

export function truncateEmail(email: string = "", maxLength = 25) {
  if (email.length <= maxLength) return email || "-";

  const [localPart, domainPart] = email.split("@");
  const localPartLength = localPart.length;

  if (localPartLength <= 4) {
    return `${localPart}@${domainPart.slice(0, 3)}...`;
  }
  return `${localPart.slice(0, 7)}...@${domainPart}`;
}

export const convertNumber = (num?: string) => {
  if (!num) return;

  return num
    .toString()
    .split("")
    .map((digit) => ((parseInt(digit) % 3) + 1).toString())
    .join("");
};

export const convertToNew = (hexString?: string | undefined) => {
  if (!hexString) return;

  const cleanedHex = hexString.split("-").slice(1).join("");

  return BigInt(`0x${cleanedHex}`).toString().slice(0, 9);
};
export const createEmptyAttributes = () => ({
  hat: null,
  head: null,
  eyes: null,
  clothes: null,
  hand: null,
  pants: null,
  shoes: null,
  logo: null,
});

export const mapDigitsToAttributes = (
  obj: { [key: string]: number | number[] | null },
  digits?: string
) => {
  const keys = [
    "hat",
    "head",
    "eyes",
    "clothes",
    "hand",
    "pants",
    "shoes",
    "logo",
  ];
  if (!digits) return;

  digits.split("").forEach((digit, index) => {
    if (keys[index]) {
      obj[keys[index]] =
        keys[index] === "hand" ? [Number(digit), Number(digit)] : Number(digit);
    }
  });
};

export const cartoonList: cartoonType[] = [
  {
    one: {
      hat: 0,
      head: 1,
      eyes: 0,
      clothes: 1,
      hand: [0, 0],
      pants: 0,
      shoes: 1,
      logo: 1,
    },
    two: {
      hat: 3,
      head: 3,
      eyes: 2,
      clothes: 4,
      hand: [0, 0],
      pants: 1,
      shoes: 2,
      logo: 0,
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
      logo: 0,
    },
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
      logo: 0,
    },
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
      logo: 0,
    },
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
      logo: 0,
    },
  },
];
