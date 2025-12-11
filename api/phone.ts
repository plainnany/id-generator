import { VercelRequest, VercelResponse } from '@vercel/node';
import { generatePhone } from './utils/index.js';

// API参数类型定义
interface PhoneRequest {
  operator?: string;
  count?: number;
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // 只允许 POST 请求
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false,
      error: 'Method not allowed' 
    });
  }

  try {
    const { operator = 'all', count = 1 }: PhoneRequest = req.body;

    // 验证参数
    if (count < 1 || count > 100) {
      return res.status(400).json({
        success: false,
        error: 'Count must be between 1 and 100'
      });
    }

    // 生成手机号
    if (count === 1) {
      const phoneNumber = generatePhone(operator);
      return res.status(200).json({
        success: true,
        data: phoneNumber
      });
    } else {
      const phoneNumbers = [];
      for (let i = 0; i < count; i++) {
        phoneNumbers.push(generatePhone(operator));
      }
      return res.status(200).json({
        success: true,
        data: phoneNumbers
      });
    }
  } catch (error) {
    console.error('Error generating phone number:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Internal server error' 
    });
  }
} 