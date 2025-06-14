// 身份证生成器
export function generateIdCard(
  region: string = '110000',
  gender: string = 'random',
  minAge: number = 18,
  maxAge: number = 65
): string {
  // 地区代码映射
  const regionCodes: { [key: string]: string } = {
    '110000': '110101', '120000': '120101', '130000': '130100', '140000': '140100',
    '150000': '150100', '210000': '210100', '220000': '220100', '230000': '230100',
    '310000': '310101', '320000': '320100', '330000': '330100', '340000': '340100',
    '350000': '350100', '360000': '360100', '370000': '370100', '410000': '410100',
    '420000': '420100', '430000': '430100', '440000': '440100', '450000': '450100',
    '460000': '460100', '500000': '500101', '510000': '510100', '520000': '520100',
    '530000': '530100', '540000': '540100', '610000': '610100', '620000': '620100',
    '630000': '630100', '640000': '640100', '650000': '650100',
  }

  const areaCode = regionCodes[region] || '110101'
  const currentYear = new Date().getFullYear()
  const age = Math.floor(Math.random() * (maxAge - minAge + 1)) + minAge
  const birthYear = currentYear - age
  const birthMonth = Math.floor(Math.random() * 12) + 1
  const birthDay = Math.floor(Math.random() * 28) + 1
  
  const birthDate = 
    birthYear.toString() +
    birthMonth.toString().padStart(2, '0') +
    birthDay.toString().padStart(2, '0')

  let sequenceCode = Math.floor(Math.random() * 999) + 1
  
  if (gender === 'male' && sequenceCode % 2 === 0) {
    sequenceCode += 1
  } else if (gender === 'female' && sequenceCode % 2 === 1) {
    sequenceCode += 1
  }
  
  const sequence = sequenceCode.toString().padStart(3, '0')
  const idWithoutCheck = areaCode + birthDate + sequence
  const checkCode = calculateIdCardCheckCode(idWithoutCheck)

  return idWithoutCheck + checkCode
}

function calculateIdCardCheckCode(id17: string): string {
  const weights = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
  const checkCodes = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2']
  
  let sum = 0
  for (let i = 0; i < 17; i++) {
    sum += parseInt(id17[i]) * weights[i]
  }
  
  return checkCodes[sum % 11]
}

// 手机号生成器
export function generatePhone(operator: string = 'all'): string {
  const prefixes = {
    mobile: ['134', '135', '136', '137', '138', '139', '147', '150', '151', '152', '157', '158', '159', '178', '182', '183', '184', '187', '188', '198'],
    unicom: ['130', '131', '132', '145', '146', '155', '156', '166', '175', '176', '185', '186', '196'],
    telecom: ['133', '149', '153', '173', '174', '177', '180', '181', '189', '191', '193', '199'],
  }

  let availablePrefixes: string[] = []
  
  if (operator === 'all') {
    availablePrefixes = [...prefixes.mobile, ...prefixes.unicom, ...prefixes.telecom]
  } else if (operator in prefixes) {
    availablePrefixes = prefixes[operator as keyof typeof prefixes]
  } else {
    availablePrefixes = prefixes.mobile
  }

  const prefix = availablePrefixes[Math.floor(Math.random() * availablePrefixes.length)]
  const suffix = Math.floor(Math.random() * 100000000).toString().padStart(8, '0')
  
  return prefix + suffix
}

// 社会信用代码生成器
export function generateCreditCode(orgType: string = '5'): string {
  const regCode = '9'
  const orgTypeCode = orgType
  const areaCodes = ['110000', '120000', '310000', '440000', '500000', '320000', '330000', '350000']
  const areaCode = areaCodes[Math.floor(Math.random() * areaCodes.length)]
  
  const chars = '0123456789ABCDEFGHJKLMNPQRTUWXY'
  let mainCode = ''
  for (let i = 0; i < 9; i++) {
    mainCode += chars[Math.floor(Math.random() * chars.length)]
  }
  
  const codeWithoutCheck = regCode + orgTypeCode + areaCode + mainCode
  const checkCode = calculateCreditCodeCheckCode(codeWithoutCheck)
  
  return codeWithoutCheck + checkCode
}

function calculateCreditCodeCheckCode(code17: string): string {
  const chars = '0123456789ABCDEFGHJKLMNPQRTUWXY'
  const weights = [1, 3, 9, 27, 19, 26, 16, 17, 20, 29, 25, 13, 8, 24, 10, 30, 28]
  
  let sum = 0
  for (let i = 0; i < 17; i++) {
    const index = chars.indexOf(code17[i])
    sum += index * weights[i]
  }
  
  const remainder = sum % 31
  const checkIndex = remainder === 0 ? 0 : 31 - remainder
  
  return chars[checkIndex]
} 