import _ from "lodash";
import numbro from "numbro";

export function fmtBerry(berry?: string | number | null, def: "-" | number = 0) {
  const total = _.toNumber(berry);
  return total
    ? numbro(total)
        .format({
          mantissa: 2,
          trimMantissa: false,
          average: total >= 1000,
        })
        .toUpperCase()
    : def;
}

export function fmtNetqulity(last?: string | number | number, def: "-" | `${number}%` = "-") {
  const lastNum = _.toNumber(last);
  const percent = lastNum ? Math.min(_.round((lastNum * 100) / 10), 100) : 0;
  return lastNum ? (percent < 33.33 ? "Poor" : percent < 66.66 ? "Good" : "Superb") : def;
}

export function fmtBoost(boost?: string | number | number) {
  return numbro(Math.max(_.toNumber(boost || "1"), 1)).format({ mantissa: 1, trimMantissa: false });
}