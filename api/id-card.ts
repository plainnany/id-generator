import { VercelRequest, VercelResponse } from '@vercel/node'
import { generateIdCard } from './utils/index.ts'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 只允许 POST 请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { region, minAge, gender, maxAge } = req.body

    // 验证必填参数
    if (!region || !minAge || !gender || !maxAge) {
      return res.status(400).json({
        error: 'Missing required parameters',
      })
    }

    // 生成身份证号
    const idCard = generateIdCard({
      region,
      minAge,
      gender,
      maxAge,
    })

    return res.status(200).json({ data: idCard, success: true })
  } catch (error) {
    console.error('Error generating ID card:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
