import { VercelRequest, VercelResponse } from '@vercel/node'
import { generateIdCard } from './utils/index'

// API参数类型定义
interface IdCardRequest {
  region?: string;
  gender?: string;
  minAge?: number;
  maxAge?: number;
  count?: number;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 只允许 POST 请求
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false,
      error: 'Method not allowed' 
    })
  }

  try {
    const { 
      region = '110000', 
      gender = 'random', 
      minAge = 18, 
      maxAge = 65, 
      count = 1 
    }: IdCardRequest = req.body

    // 验证参数
    if (count < 1 || count > 100) {
      return res.status(400).json({
        success: false,
        error: 'Count must be between 1 and 100'
      })
    }

    if (minAge < 0 || maxAge < minAge || maxAge > 120) {
      return res.status(400).json({
        success: false,
        error: 'Invalid age range. minAge must be >= 0, maxAge must be >= minAge and <= 120'
      })
    }

    // 生成身份证号
    if (count === 1) {
      const idCard = generateIdCard(region, gender, minAge, maxAge)
      return res.status(200).json({
        success: true,
        data: idCard
      })
    } else {
      const idCards = []
      for (let i = 0; i < count; i++) {
        idCards.push(generateIdCard(region, gender, minAge, maxAge))
      }
      return res.status(200).json({
        success: true,
        data: idCards
      })
    }
  } catch (error) {
    console.error('Error generating ID card:', error)
    return res.status(500).json({ 
      success: false,
      error: 'Internal server error' 
    })
  }
}
