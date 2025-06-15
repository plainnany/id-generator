type Carrier = 'mobile' | 'unicom' | 'telecom';

// 运营商号段
const carrierPrefixes: Record<Carrier, string[]> = {
  mobile: ['134', '135', '136', '137', '138', '139', '150', '151', '152', '157', '158', '159', '178', '182', '183', '184', '187', '188', '198'],
  unicom: ['130', '131', '132', '155', '156', '166', '175', '176', '185', '186'],
  telecom: ['133', '153', '180', '181', '189', '199']
};

export function generatePhoneNumber(carrier: Carrier): string {
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