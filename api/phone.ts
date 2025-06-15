import { VercelRequest, VercelResponse } from '@vercel/node';

type Carrier = 'mobile' | 'unicom' | 'telecom';

// 运营商号段
const carrierPrefixes: Record<Carrier, string[]> = {
  mobile: ['134', '135', '136', '137', '138', '139', '150', '151', '152', '157', '158', '159', '178', '182', '183', '184', '187', '188', '198'],
  unicom: ['130', '131', '132', '155', '156', '166', '175', '176', '185', '186'],
  telecom: ['133', '153', '180', '181', '189', '199']
};

function generatePhoneNumber(carrier: Carrier): string {
  // 获取对应运营商的号段
  const prefixes = carrierPrefixes[carrier];
  if (!prefixes) {
    throw new Error(`Invalid carrier: ${carrier}`);
  }

  // 随机选择一个号段
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];

  // 生成后8位随机数
  const suffix = Array.from({ length: 8 }, () => Math.floor(Math.random() * 10)).join('');

  return prefix + suffix;
}

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