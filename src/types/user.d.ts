/**
 * 响应数据
 */
export interface User {
  /**
   * 邀请码
   */
  code: string;
  /**
   * 注册时间
   */
  createAt?: number;
  /**
   * 邮箱
   */
  email: string;
  /**
   * 用户id
   */
  id: string;
  /**
   * 邀请码
   */
  inviteCode: string;
  /**
   * 用户名
   */
  name: string;
  /**
   * 节点信息
   */
  node: Node;
  /**
   * 积分简要数据
   */
  point: Point;
  /**
   * 邀请信息
   */
  referral: Referral;
  /**
   * 赛季数
   */
  seasonNo: number;
  /**
   * 社交信息
   */
  social: Social;
  /**
   * 等级状态
   */
  stat: Stat;
  task: Task;
  /**
   * 最后修改时间
   */
  updateAt: number;
  [property: string]: any;
}

/**
 * 节点信息
 */
export interface Node {
  /**
   * 已连接数量
   */
  connected: number;
  /**
   * 下线数量
   */
  offline: number;
  [property: string]: any;
}

/**
 * 积分简要数据
 */
export interface Point {
  /**
   * 当前得分
   */
  currentPoint?: number;
  /**
   * 总得分
   */
  total: number;
  [property: string]: any;
}

/**
 * 邀请信息
 */
export interface Referral {
  /**
   * 待验证邀请
   */
  pending: number;
  /**
   * 总邀请数
   */
  total: number;
  /**
   * 有效邀请数
   */
  valid: number;
  [property: string]: any;
}

/**
 * 社交信息
 */
export interface Social {
  /**
   * discord
   */
  discord: Discord;
  /**
   * google
   */
  google: Google;
  /**
   * telegram
   */
  tg: Tg;
  /**
   * x
   */
  x: X;
  [property: string]: any;
}

/**
 * discord
 */
export interface Discord {
  /**
   * 头像
   */
  avatar: string;
  /**
   * 邮箱
   */
  email: string;
  /**
   * id
   */
  id: string;
  /**
   * 名称
   */
  name: string;
  [property: string]: any;
}

/**
 * google
 */
export interface Google {
  /**
   * 邮箱
   */
  email: string;
  /**
   * id
   */
  id: number;
  /**
   * 名称
   */
  name: string;
  [property: string]: any;
}

/**
 * telegram
 */
export interface Tg {
  /**
   * 头像
   */
  avatar: string;
  /**
   * id
   */
  id: string;
  [property: string]: any;
}

/**
 * x
 */
export interface X {
  /**
   * id
   */
  id: string;
  /**
   * 名称
   */
  name: string;
  [property: string]: any;
}

/**
 * 等级状态
 */
export interface Stat {
  /**
   * 经验值
   */
  exp: number;
  /**
   * 增益倍数
   */
  extraBoost: number;
  /**
   * 等级
   */
  level: number;
  [property: string]: any;
}

export interface Task {
  /**
   * 插件已成功上报
   */
  extension: boolean;
  uptime: Uptime;
  [property: string]: any;
}

export interface Uptime {
  /**
   * 打到上传总时长
   */
  finished: boolean;
  /**
   * 总上报时长
   */
  sum: number;
  [property: string]: any;
}

export interface LoginResult {
  /**
   * 用户id
   */
  userId: string;
  /**
   * BearerToken
   */
  token: string;
  [property: string]: any;
}

export interface SingUpResult {
  /**
   * 时间戳
   */
  createAt: number;
  /**
   * 用户id
   */
  userId: string;
  [property: string]: any;
}

export interface UserReward {
  detail: UserRewardDetail;
  /**
   * 收益增益
   */
  extraBoost: number;
  /**
   * 时间戳
   */
  timestamp: number;
  /**
   * 总得分
   */
  totalPoint: number;
  [property: string]: any;
}

export interface UserRewardDetail {
  /**
   * 网络收益
   */
  network: number;
  /**
   * 引用收益
   */
  referral: number;
  [property: string]: any;
}
