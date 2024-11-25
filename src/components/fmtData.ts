import _ from "lodash";

export function fmtBerry(berry?: string | number | null, def: "-" | number = 0) {
  const total = _.toNumber(berry);
  return _.round(total, 2) || def;
}

export function fmtNetqulity(last?: string | number | number, def: "-" | `${number}%` = "-") {
  const lastNum = _.toNumber(last);
  return lastNum ? `${Math.min(_.round((lastNum * 100) / 10), 100)}%` : def;
}

export function fmtBoost(boost?: string | number | number) {
  return Math.max(_.round(_.toNumber(boost), 1), 1);
}
