/**
 * 登录信息接口返回体
 */
export interface LoginInfo {
  avatar: string
  city: string
  country: string
  disable: number
  displayName: string
  id: string
  intro: string
}

/**
 * 预约状态
 */
export interface ReserveStatus {
  status: 1 | 2
}

/**
 * 订单状态
 * TODO: 暂定
 */
export enum OrderStatus {
  WAIT_FOR_PAYMENT = 'order.wait-for-payment',
  MINTING = 'order.minting', // 如果使用 NFT 技术，并且由我们来进行铸造
  WAIT_FOR_CLAIM = 'order.wait-for-claim', // 如果使用 NFT 技术，并且需要用户自己领取
  // 如果使用 OSS 链，应该可以直接标记为已完成
  COMPLETED = 'order.completed',
  EXPIRED = 'order.expired'
}

/**
 * 订单信息接口返回体
 * TODO: 暂定
 */
export interface Order {
  name: string
  orderID: string
  paymentID?: string
  createdAt: number
  completedAt?: number
  status: OrderStatus
  tokenID?: number
  txID?: string // 可能不存在
  pic: string // 预览图链接
}
