interface IdCardParams {
  province: string;
  city: string;
  district: string;
  gender: 'male' | 'female';
  birthDate: string;
}

// 省份编码映射
const provinceCodes: Record<string, string> = {
  '北京': '110000',
  '天津': '120000',
  '河北': '130000',
  '山西': '140000',
  '内蒙古': '150000',
  '辽宁': '210000',
  '吉林': '220000',
  '黑龙江': '230000',
  '上海': '310000',
  '江苏': '320000',
  '浙江': '330000',
  '安徽': '340000',
  '福建': '350000',
  '江西': '360000',
  '山东': '370000',
  '河南': '410000',
  '湖北': '420000',
  '湖南': '430000',
  '广东': '440000',
  '广西': '450000',
  '海南': '460000',
  '重庆': '500000',
  '四川': '510000',
  '贵州': '520000',
  '云南': '530000',
  '西藏': '540000',
  '陕西': '610000',
  '甘肃': '620000',
  '青海': '630000',
  '宁夏': '640000',
  '新疆': '650000',
  '台湾': '710000',
  '香港': '810000',
  '澳门': '820000'
};

// 城市编码映射（示例数据，实际使用时需要补充完整）
const cityCodes: Record<string, Record<string, string>> = {
  '北京': {
    '东城区': '110101',
    '西城区': '110102',
    '朝阳区': '110105',
    '丰台区': '110106',
    '石景山区': '110107',
    '海淀区': '110108',
    '门头沟区': '110109',
    '房山区': '110111',
    '通州区': '110112',
    '顺义区': '110113',
    '昌平区': '110114',
    '大兴区': '110115',
    '怀柔区': '110116',
    '平谷区': '110117',
    '密云区': '110118',
    '延庆区': '110119'
  }
  // 其他省份的城市编码需要补充
};

export function generateIdCard(params: IdCardParams): string {
  const { province, city, gender, birthDate } = params;

  // 获取省份编码
  const provinceCode = provinceCodes[province];
  if (!provinceCode) {
    throw new Error(`Invalid province: ${province}`);
  }

  // 获取城市编码
  const cityCode = cityCodes[province]?.[city];
  if (!cityCode) {
    throw new Error(`Invalid city: ${city}`);
  }

  // 生成前6位（地区码）
  const areaCode = cityCode;

  // 生成中间8位（出生日期）
  const birthDateStr = birthDate.replace(/-/g, '');

  // 生成后4位（顺序码）
  const sequenceCode = Math.floor(Math.random() * 999).toString().padStart(3, '0');
  const genderCode = gender === 'male' ? '1' : '2';
  const lastFour = sequenceCode + genderCode;

  // 计算校验码
  const idCard17 = areaCode + birthDateStr + lastFour;
  const checkCode = calculateCheckCode(idCard17);

  return idCard17 + checkCode;
}

// 计算校验码
function calculateCheckCode(idCard17: string): string {
  const weights = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
  const checkCodes = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
  
  let sum = 0;
  for (let i = 0; i < 17; i++) {
    sum += parseInt(idCard17[i]) * weights[i];
  }
  
  return checkCodes[sum % 11];
} 