import { VercelRequest, VercelResponse } from '@vercel/node';
import { generatePhoneNumber } from './utils/phone';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // 只允许 POST 请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { carrier } = req.body;

    // 验证必填参数
    if (!carrier) {
      return res.status(400).json({
        error: 'Missing required parameters',
        required: ['carrier']
      });
    }

    // 生成手机号
    const phoneNumber = generatePhoneNumber(carrier);

    return res.status(200).json({ phoneNumber });
  } catch (error) {
    console.error('Error generating phone number:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 