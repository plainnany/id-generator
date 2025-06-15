import React, { useState } from 'react'
import { Copy, RefreshCw } from 'lucide-react'
import { generateIdCard } from '../utils/generators'
import { useToastContext } from '../context/ToastContext'
import { useThrottle } from '../hooks/useDebounce'

const IdCardGenerator: React.FC = () => {
  const { success, error } = useToastContext()
  const [result, setResult] = useState('')
  const [results, setResults] = useState<string[]>([])
  const [region, setRegion] = useState('110000')
  const [gender, setGender] = useState('random')
  const [minAge, setMinAge] = useState(18)
  const [maxAge, setMaxAge] = useState(65)
  const [count, setCount] = useState(1)
  const [isGenerating, setIsGenerating] = useState(false)

  const regions = [
    { value: '110000', label: '北京市' },
    { value: '120000', label: '天津市' },
    { value: '130000', label: '河北省' },
    { value: '140000', label: '山西省' },
    { value: '150000', label: '内蒙古自治区' },
    { value: '210000', label: '辽宁省' },
    { value: '220000', label: '吉林省' },
    { value: '230000', label: '黑龙江省' },
    { value: '310000', label: '上海市' },
    { value: '320000', label: '江苏省' },
    { value: '330000', label: '浙江省' },
    { value: '340000', label: '安徽省' },
    { value: '350000', label: '福建省' },
    { value: '360000', label: '江西省' },
    { value: '370000', label: '山东省' },
    { value: '410000', label: '河南省' },
    { value: '420000', label: '湖北省' },
    { value: '430000', label: '湖南省' },
    { value: '440000', label: '广东省' },
    { value: '450000', label: '广西壮族自治区' },
    { value: '460000', label: '海南省' },
    { value: '500000', label: '重庆市' },
    { value: '510000', label: '四川省' },
    { value: '520000', label: '贵州省' },
    { value: '530000', label: '云南省' },
    { value: '540000', label: '西藏自治区' },
    { value: '610000', label: '陕西省' },
    { value: '620000', label: '甘肃省' },
    { value: '630000', label: '青海省' },
    { value: '640000', label: '宁夏回族自治区' },
    { value: '650000', label: '新疆维吾尔自治区' },
  ]

  const handleGenerateInternal = () => {
    // 如果正在生成，直接返回
    if (isGenerating) {
      return
    }
    
    setIsGenerating(true)
    try {
      if (count === 1) {
        const idCard = generateIdCard(region, gender, minAge, maxAge)
        setResult(idCard)
        setResults([])
      } else {
        const newResults = Array.from({ length: Math.min(count, 100) }, () => 
          generateIdCard(region, gender, minAge, maxAge)
        )
        setResults(newResults)
        setResult('')
      }
    } catch (err) {
      console.error('生成失败:', err)
      error('生成失败，请检查输入参数')
    } finally {
      setIsGenerating(false)
    }
  }

  // 使用防重点击Hook，1秒内只能点击一次
  const handleGenerate = useThrottle(handleGenerateInternal, 1000)

  const copyToClipboardInternal = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      success('复制成功！')
    }).catch(() => {
      error('复制失败，请手动复制')
    })
  }

  // 防重点击的复制函数，500ms内只能点击一次
  const copyToClipboard = useThrottle(copyToClipboardInternal, 500)

  const copyAllResults = () => {
    const text = results.join('\n')
    copyToClipboard(text)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">身份证号生成器</h1>
        <p className="mt-2 text-sm text-gray-600">
          生成符合国家标准的身份证号码，支持指定地区和年龄范围
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 参数设置 */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">生成参数</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                地区
              </label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="input-field"
              >
                {regions.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                性别
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="input-field"
              >
                <option value="random">随机</option>
                <option value="male">男</option>
                <option value="female">女</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  最小年龄
                </label>
                <input
                  type="number"
                  min="0"
                  max="120"
                  value={minAge}
                  onChange={(e) => setMinAge(Number(e.target.value))}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  最大年龄
                </label>
                <input
                  type="number"
                  min="0"
                  max="120"
                  value={maxAge}
                  onChange={(e) => setMaxAge(Number(e.target.value))}
                  className="input-field"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                生成数量
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                className="input-field"
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full btn-primary flex items-center justify-center space-x-2"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>生成中...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  <span>生成身份证号</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 结果展示 */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">生成结果</h2>
            {(result || results.length > 0) && (
              <button
                onClick={() => result ? copyToClipboard(result) : copyAllResults()}
                className="btn-secondary flex items-center space-x-1"
              >
                <Copy className="w-4 h-4" />
                <span>复制</span>
              </button>
            )}
          </div>

          {result && (
            <div className="bg-gray-50 rounded-lg p-4 font-mono text-lg">
              {result}
            </div>
          )}

          {results.length > 0 && (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {results.map((id, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-lg p-3 font-mono text-sm flex items-center justify-between"
                >
                  <span>{id}</span>
                  <button
                    onClick={() => copyToClipboard(id)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {!result && results.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              点击"生成身份证号"开始生成
            </div>
          )}
        </div>
      </div>

      {/* 说明 */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">使用说明</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <p>• 身份证号码由18位数字组成，最后一位可能是X</p>
          <p>• 前6位为地区代码，第7-14位为出生日期，第15-17位为顺序码，第18位为校验码</p>
          <p>• 第17位奇数表示男性，偶数表示女性</p>
          <p>• 生成的身份证号码符合国家标准GB11643-1999</p>
          <p>• 仅供测试使用，请勿用于任何违法用途</p>
        </div>
      </div>
    </div>
  )
}

export default IdCardGenerator 