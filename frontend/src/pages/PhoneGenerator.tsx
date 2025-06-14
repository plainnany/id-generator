import React, { useState } from 'react'
import { Copy, RefreshCw } from 'lucide-react'
import { generatePhoneAPI } from '../services/api'
import { useToastContext } from '../context/ToastContext'
import { useThrottle } from '../hooks/useDebounce'

const PhoneGenerator: React.FC = () => {
  const { success, error } = useToastContext()
  const [result, setResult] = useState('')
  const [results, setResults] = useState<string[]>([])
  const [operator, setOperator] = useState('all')
  const [count, setCount] = useState(1)
  const [isGenerating, setIsGenerating] = useState(false)

  const operators = [
    { value: 'all', label: '全部运营商' },
    { value: 'mobile', label: '中国移动' },
    { value: 'unicom', label: '中国联通' },
    { value: 'telecom', label: '中国电信' },
  ]

  const operatorPrefixes = {
    mobile: ['134', '135', '136', '137', '138', '139', '147', '150', '151', '152', '157', '158', '159', '178', '182', '183', '184', '187', '188', '198'],
    unicom: ['130', '131', '132', '145', '146', '155', '156', '166', '175', '176', '185', '186', '196'],
    telecom: ['133', '149', '153', '173', '174', '177', '180', '181', '189', '191', '193', '199'],
  }

  const handleGenerateInternal = async () => {
    if (isGenerating) {
      return
    }
    
    setIsGenerating(true)
    try {
      const response = await generatePhoneAPI({
        operator,
        count
      })
      
      if (response.success) {
        if (count === 1) {
          setResult(response.data)
          setResults([])
        } else {
          setResults(response.data)
          setResult('')
        }
      } else {
        error('生成失败：' + (response.error || '未知错误'))
      }
    } catch (err) {
      console.error('生成失败:', err)
      error('网络请求失败，请检查后端服务是否正常')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleGenerate = useThrottle(handleGenerateInternal, 1000)

  const copyToClipboardInternal = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      success('复制成功！')
    }).catch(() => {
      error('复制失败，请手动复制')
    })
  }

  const copyToClipboard = useThrottle(copyToClipboardInternal, 500)

  const copyAllResults = () => {
    const text = results.join('\n')
    copyToClipboard(text)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">手机号生成器</h1>
        <p className="mt-2 text-sm text-gray-600">
          生成各大运营商的手机号码，支持不同号段选择
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 参数设置 */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">生成参数</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                运营商
              </label>
              <select
                value={operator}
                onChange={(e) => setOperator(e.target.value)}
                className="input-field"
              >
                {operators.map((op) => (
                  <option key={op.value} value={op.value}>
                    {op.label}
                  </option>
                ))}
              </select>
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
                  <span>生成手机号</span>
                </>
              )}
            </button>
          </div>

          {/* 号段说明 */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-2">支持的号段</h3>
            <div className="space-y-2 text-xs text-gray-600">
              <div>
                <span className="font-medium text-red-600">中国移动：</span>
                <span className="break-all">
                  {operatorPrefixes.mobile.join(', ')}
                </span>
              </div>
              <div>
                <span className="font-medium text-blue-600">中国联通：</span>
                <span className="break-all">
                  {operatorPrefixes.unicom.join(', ')}
                </span>
              </div>
              <div>
                <span className="font-medium text-green-600">中国电信：</span>
                <span className="break-all">
                  {operatorPrefixes.telecom.join(', ')}
                </span>
              </div>
            </div>
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
              {results.map((phone, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-lg p-3 font-mono text-sm flex items-center justify-between"
                >
                  <span>{phone}</span>
                  <button
                    onClick={() => copyToClipboard(phone)}
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
              点击"生成手机号"开始生成
            </div>
          )}
        </div>
      </div>

      {/* 说明 */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">使用说明</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <p>• 手机号码由11位数字组成，第1位固定为1</p>
          <p>• 第2-3位为运营商标识码（号段）</p>
          <p>• 第4-11位为用户识别码</p>
          <p>• 生成的手机号码符合中国大陆手机号码格式</p>
          <p>• 支持三大运营商的主要号段</p>
          <p>• 仅供测试使用，请勿用于任何违法用途</p>
        </div>
      </div>
    </div>
  )
}

export default PhoneGenerator 