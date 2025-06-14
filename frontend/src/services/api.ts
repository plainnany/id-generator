import axios from 'axios'

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// API响应类型
interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
}

// 响应拦截器
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error)
    return Promise.reject(error)
  }
)

// 身份证生成接口
export interface IdCardParams {
  region?: string
  gender?: string
  minAge?: number
  maxAge?: number
  count?: number
}

export const generateIdCardAPI = async (params: IdCardParams = {}): Promise<ApiResponse> => {
  const response = await api.post('/generate/idcard', params)
  return response.data
}

// 手机号生成接口
export interface PhoneParams {
  operator?: string
  count?: number
}

export const generatePhoneAPI = async (params: PhoneParams = {}): Promise<ApiResponse> => {
  const response = await api.post('/generate/phone', params)
  return response.data
}

// 社会信用代码生成接口
export interface CreditCodeParams {
  orgType?: string
  count?: number
}

export const generateCreditCodeAPI = async (params: CreditCodeParams = {}): Promise<ApiResponse> => {
  const response = await api.post('/generate/credit-code', params)
  return response.data
}

// 健康检查
export const healthCheck = async (): Promise<ApiResponse> => {
  const response = await api.get('/health')
  return response.data
} 