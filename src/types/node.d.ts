export interface NodeItem {
  /**
   * 连接id
   */
  connectionId: string;
  /**
   * 城市代码
   */
  countryCode: string;
  /**
   * 节点id
   */
  deviceId: string;
  /**
   * 设备类型
   */
  deviceType: number;
  /**
   * 节点版本
   */
  deviceVersion: string;
  /**
   * extensionId
   */
  extensionId: string;
  /**
   * ip
   */
  ipAddress: string;
  /**
   * 连接状态
   */
  isConnected: number;
  /**
   * 最后连接时间
   */
  lastConnectedAt: number;
  /**
   * 总积分
   */
  totalPoints: number;
  /**
   * 连接累计时长
   */
  totalUptime: number;
  /**
   * userAgent
   */
  userAgent: string;

  todayPoints: number;

  [property: string]: any;
}
