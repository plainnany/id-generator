import { VercelRequest, VercelResponse } from '@vercel/node';
import { generateCreditCard } from './utils/credit-card';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // 只允许 POST 请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { bank } = req.body;

    // 验证必填参数
    if (!bank) {
      return res.status(400).json({
        error: 'Missing required parameters',
        required: ['bank']
      });
    }

    // 生成信用卡号
    const creditCard = generateCreditCard(bank);

    return res.status(200).json({ creditCard });
  } catch (error) {
    console.error('Error generating credit card:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 