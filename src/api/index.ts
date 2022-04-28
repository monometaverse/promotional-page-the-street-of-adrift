import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios"

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

// 拦截器拦下来的错误的编号
export enum interceptorsErrorCode {
  unknown = -1, // 未知错误
  timeout = 1,  // 请求超时
  network       // 网络错误
}

// 经过处理的 Axios
interface MonoAxios extends AxiosInstance {
  get<T, R = MonoResponse<T>, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R>
}

const monoAxios: MonoAxios = (() => {
  const instance = axios.create({
    baseURL: 'https://uat.mono.fun/api',
    withCredentials: true,
  })
  // 添加错误拦截器
  instance.interceptors.response.use((res) => res.data, (error): FailureResponse => {
    if (!(error instanceof AxiosError)) return {
      code: interceptorsErrorCode.unknown,
      message: '未知的错误'
    }
    // 收到了表示错误的回应
    if (error.response) {
      return {
        code: error.response.data?.code ?? error.response.status,
        message: error.response.data?.message ?? '未知错误信息'
      }
    }
    // 没有收到任何回应，因为超时了
    if (error.message.includes('timeout')) {
      return {
        code: interceptorsErrorCode.timeout,
        message: '请求超时'
      }
    }
    // 没有收到任何回应，因为网络错误
    if (error.message.includes('Network Error')) {
      return {
        code: interceptorsErrorCode.timeout,
        message: '请求超时'
      }
    }
    return {
      code: interceptorsErrorCode.unknown,
      message: '未知的错误'
    }
  })

  return instance
})()

export default {
  user: {
    /**
     * 获取登录状态
     * 如果已经登录了，会返回账号信息
     */
    getLoginInfo: () => {
      return monoAxios.get<LoginInfo>('/v1/user/info')
    },
  },
  nft: {
    /**
     * NFT 预约
     */
    reserve: (nftName: string) => {
      return monoAxios.get<string>('/v1/project/reserve')
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
