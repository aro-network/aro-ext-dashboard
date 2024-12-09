import _ from "lodash";
import numbro from "numbro";

export function fmtBerry(berry?: string | number | null, def: "-" | number = 0) {
  const total = _.toNumber(berry);
  return total
    ? numbro(total)
        .format({
          mantissa: 2,
          trimMantissa: true,
          average: total >= 1000,
        })
        .toUpperCase()
    : def;
}

export function fmtNetqulity(last?: string | number | number, def: "-" | `${number}%` = "-") {
  const lastNum = _.toNumber(last);
  return lastNum ? `${Math.min(_.round((lastNum * 100) / 10), 100)}%` : def;
}

export function fmtBoost(boost?: string | number | number) {
  return Math.max(_.round(_.toNumber(boost || "1"), 1), 1);
}
