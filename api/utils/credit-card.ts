type Bank = 'icbc' | 'ccb' | 'boc' | 'abc' | 'cmb';

// 银行BIN号
const bankBins: Record<Bank, string[]> = {
  icbc: ['622202', '622203', '622208', '622210', '622211', '622212', '622213', '622214', '622215', '622220'],
  ccb: ['622700', '622701', '622702', '622703', '622704', '622705', '622706', '622707', '622708', '622709'],
  boc: ['622760', '622761', '622762', '622763', '622764', '622765', '622766', '622767', '622768', '622769'],
  abc: ['622821', '622822', '622823', '622824', '622825', '622826', '622827', '622828', '622829', '622830'],
  cmb: ['622575', '622576', '622577', '622578', '622579', '622580', '622581', '622582', '622583', '622584']
};

export function generateCreditCard(bank: Bank): string {
  // 获取对应银行的BIN号
  const bins = bankBins[bank];
  if (!bins) {
    throw new Error(`Invalid bank: ${bank}`);
  }

  // 随机选择一个BIN号
  const bin = bins[Math.floor(Math.random() * bins.length)];

  // 生成中间9位随机数
  const middle = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10)).join('');

  // 生成前15位
  const first15 = bin + middle;

  // 计算校验位
  const checkDigit = calculateLuhnCheckDigit(first15);

  return first15 + checkDigit;
}

// 使用Luhn算法计算校验位
function calculateLuhnCheckDigit(number: string): string {
  let sum = 0;
  let isEven = false;

  // 从右向左遍历
  for (let i = number.length - 1; i >= 0; i--) {
    let digit = parseInt(number[i]);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  const checkDigit = (10 - (sum % 10)) % 10;
  return checkDigit.toString();
} 