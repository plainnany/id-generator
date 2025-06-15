import { VercelRequest, VercelResponse } from '@vercel/node';
import { generateIdCard } from './utils/id-card';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // 只允许 POST 请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { province, city, district, gender, birthDate } = req.body;

    // 验证必填参数
    if (!province || !city || !district || !gender || !birthDate) {
      return res.status(400).json({
        error: 'Missing required parameters',
        required: ['province', 'city', 'district', 'gender', 'birthDate']
      });
    }

    // 生成身份证号
    const idCard = generateIdCard({
      province,
      city,
      district,
      gender,
      birthDate
    });

    return res.status(200).json({ idCard });
  } catch (error) {
    console.error('Error generating ID card:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 