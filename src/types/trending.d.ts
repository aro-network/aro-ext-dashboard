export interface TrendingReward {
  /**
   * 时间
   */
  date: number;
  /**
   * 网络收益
   */
  networkPoint: number;
  /**
   * 邀请收益
   */
  referralPoint: number;
  /**
   * 总分
   */
  totalPoint: number;
  /**
   * 总在线时长
   */
  totalUptime: number;
  [property: string]: any;
}
