export type SuccessResponse<T> = {
  code: 0,
  message: string,
  data: T
}

export type FailureResponse = {
  code: number,
  message: string
}

export type MonoResponse<T> = SuccessResponse<T> | FailureResponse

/**
 * 判断响应数据是否是成功
 * @param res 返回
 */
export const isSuccess = <T>(res: SuccessResponse<T> | FailureResponse): res is SuccessResponse<T> => {
  return res.code === 0
}

export default {
  user: {

  },
  nft: {
    /**
     * NFT 预约
     * TODO: 目前是 mock 逻辑
     */
    reserve: (nftName: string): MonoResponse<null> => {
      const isReserved = localStorage.getItem(`NFTReserved:${nftName}`)
      if (isReserved === 'true') {
        return {
          code: 40901,
          message: '已经预约过了'
        }
      }
      localStorage.setItem(`NFTReserved:${nftName}`, 'true')
      return {
        code: 0,
        message: '预约成功'
      }
    },
    /**
     * 获取 NFT 预约状态
     * @param nftNames NFT 名称
     * TODO: 目前也是 mock 逻辑
     */
    getReservedState: (nftNames: string[]): MonoResponse<{ [p: string]: boolean }> => {
      const dataRes: { [p: string]: boolean } = {}
      for (let name of nftNames) {
        dataRes[name] = localStorage.getItem(`NFTReserved:${name}`) === 'true'
      }
      return {
        code: 0,
        message: '获取完成',
        data: dataRes
      }
    }
  }
}
