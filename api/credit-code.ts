import { VercelRequest, VercelResponse } from '@vercel/node';
import { generateCreditCode } from './utils/index.ts';

// API参数类型定义
interface CreditCodeRequest {
  orgType?: string;
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
    const { orgType = '5', count = 1 }: CreditCodeRequest = req.body;

    // 验证参数
    if (count < 1 || count > 100) {
      return res.status(400).json({
        success: false,
        error: 'Count must be between 1 and 100'
      });
    }

    // 生成社会信用代码
    if (count === 1) {
      const creditCode = generateCreditCode(orgType);
      return res.status(200).json({
        success: true,
        data: creditCode
      });
    } else {
      const creditCodes = [];
      for (let i = 0; i < count; i++) {
        creditCodes.push(generateCreditCode(orgType));
      }
      return res.status(200).json({
        success: true,
        data: creditCodes
      });
    }
  } catch (error) {
    console.error('Error generating credit code:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Internal server error' 
    });
  }
} 