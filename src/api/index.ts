import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios"
import { LoginInfo, ReserveStatus } from './types'
export * from './types'

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

// 拦截器拦下来的错误的编号
export enum interceptorsErrorCode {
  unknown = -1, // 未知错误
  timeout = 1,  // 请求超时
  network       // 网络错误
}

// 经过处理的 Axios
interface MonoAxios extends AxiosInstance {
  get<T, R = MonoResponse<T>, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R>
  post<T, R = MonoResponse<T>, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>
}

const monoAxios: MonoAxios = (() => {
  const instance = axios.create({
    baseURL: import.meta.env.VITE_APP_API_URL_BASE + '/api',
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
    logout: () => {
      return monoAxios.post<null>('/v1/user/logout')
    },
    login: (email: string, pwd: string) => {
      return monoAxios.post<string>('/v1/user/login', {
        email,
        password: pwd,
        keepLoggedIn: true
      })
    },
    sendCaptchaCode: (email: string, isPasswordReset: boolean) => {
      return monoAxios.post<null>('/v1/user/email/send-verification-code', { email, type: isPasswordReset ? 1 : 0 })
    },
    submitCaptchaCode: (email: string, code: string, isPasswordReset: boolean) => {
      return monoAxios.post<null>('/v1/user/email/submit-verification-captcha-code', { email, code, type: isPasswordReset ? 1 : 0 })
    },
    register: (email: string, pwd: string, displayName: string) => {
      return monoAxios.post<LoginInfo>('/v1/user/register', {
        email,
        password: pwd,
        displayName: displayName,
        isAdvertisingPush: true,
        useCaptchaCode: true
      })
    },
    passwordReset: (email: string, password: string) => {
      return monoAxios.post<null>('/v1/user/password-reset', { email, password, useCaptchaCode: true })
    },
    checkRecaptcha: (email: string, token: string) => {
      return monoAxios.get<null>(`/v1/user/recaptcha?email=${email}&token=${token}`)
    },
  },
  nft: {
    /**
     * NFT 预约
     */
    reserve: (nftName: string, projectId: string) => {
      return monoAxios.post<string>('/v1/project/reserve', {
        nft_id: nftName,
        project_id: projectId
      })
    },
    /**
     * 获取 NFT 预约状态
     * @param nft 名称（暂时随意）
     * @param projectId 项目 id
     * @param userId 用户 id
     */
    getReservedState: (nftName: string, projectId: string, userId: string) => {
      return monoAxios.get<ReserveStatus>(`/v1/project/reserve_status?nft_id=${encodeURIComponent(nftName)}&project_id=${encodeURIComponent(projectId)}&user_id=${encodeURIComponent(userId)}`)
    },
    /**
     * 接收所有邮件
     */
    receiveAllEmails: (projectId: string) => {
      return monoAxios.post<string>('/v1/project/reserve_check', { project_id: projectId })
    }
  }
}
