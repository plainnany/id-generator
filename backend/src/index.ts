import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'
import path from 'path'
import { generateIdCard, generatePhone, generateCreditCode } from './utils/generators'

// 加载环境变量
dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// 中间件
app.use(helmet())
app.use(cors())
app.use(morgan('combined'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// 静态文件服务 (生产环境)
if (process.env.NODE_ENV === 'production') {
  const frontendPath = path.join(__dirname, '../../frontend/dist')
  app.use(express.static(frontendPath))
}

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// 身份证生成接口
app.post('/api/generate/idcard', (req, res) => {
  try {
    const { region = '110000', gender = 'random', minAge = 18, maxAge = 65, count = 1 } = req.body
    
    if (count === 1) {
      const idCard = generateIdCard(region, gender, minAge, maxAge)
      res.json({ success: true, data: idCard })
    } else {
      const idCards = Array.from({ length: Math.min(count, 100) }, () => 
        generateIdCard(region, gender, minAge, maxAge)
      )
      res.json({ success: true, data: idCards })
    }
  } catch (error) {
    console.error('身份证生成错误:', error)
    res.status(500).json({ success: false, error: '生成失败' })
  }
})

// 手机号生成接口
app.post('/api/generate/phone', (req, res) => {
  try {
    const { operator = 'all', count = 1 } = req.body
    
    if (count === 1) {
      const phone = generatePhone(operator)
      res.json({ success: true, data: phone })
    } else {
      const phones = Array.from({ length: Math.min(count, 100) }, () => 
        generatePhone(operator)
      )
      res.json({ success: true, data: phones })
    }
  } catch (error) {
    console.error('手机号生成错误:', error)
    res.status(500).json({ success: false, error: '生成失败' })
  }
})

// 社会信用代码生成接口
app.post('/api/generate/credit-code', (req, res) => {
  try {
    const { orgType = '5', count = 1 } = req.body
    
    if (count === 1) {
      const creditCode = generateCreditCode(orgType)
      res.json({ success: true, data: creditCode })
    } else {
      const creditCodes = Array.from({ length: Math.min(count, 100) }, () => 
        generateCreditCode(orgType)
      )
      res.json({ success: true, data: creditCodes })
    }
  } catch (error) {
    console.error('社会信用代码生成错误:', error)
    res.status(500).json({ success: false, error: '生成失败' })
  }
})

// SPA 路由支持 (生产环境)
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    // 如果是API请求，返回404
    if (req.path.startsWith('/api/')) {
      res.status(404).json({ success: false, error: '接口不存在' })
      return
    }
    // 否则返回前端页面
    const frontendPath = path.join(__dirname, '../../frontend/dist/index.html')
    res.sendFile(frontendPath)
  })
} else {
  // 开发环境404处理
  app.use('*', (req, res) => {
    res.status(404).json({ success: false, error: '接口不存在' })
  })
}

// 错误处理中间件
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack)
  res.status(500).json({ success: false, error: '服务器内部错误' })
})

// 启动服务器
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 服务器运行在端口 ${PORT}`)
    console.log(`📚 健康检查: http://localhost:${PORT}/api/health`)
  })
}

// 导出 app 实例供 Vercel 使用
export default app 