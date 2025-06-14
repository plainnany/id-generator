import React, { useState } from 'react'
import { Copy, RefreshCw } from 'lucide-react'
import { generateCreditCodeAPI } from '../services/api'
import { useToastContext } from '../context/ToastContext'
import { useThrottle } from '../hooks/useDebounce'

const CreditCodeGenerator: React.FC = () => {
  const { success, error } = useToastContext()
  const [result, setResult] = useState('')
  const [results, setResults] = useState<string[]>([])
  const [orgType, setOrgType] = useState('1')
  const [count, setCount] = useState(1)
  const [isGenerating, setIsGenerating] = useState(false)

  const orgTypes = [
    { value: '1', label: '机关' },
    { value: '2', label: '事业单位' },
    { value: '3', label: '社会团体' },
    { value: '4', label: '其他组织' },
    { value: '5', label: '企业' },
    { value: '9', label: '其他' },
  ]

  const handleGenerateInternal = async () => {
    if (isGenerating) {
      return
    }
    
    setIsGenerating(true)
    try {
      const response = await generateCreditCodeAPI({
        orgType,
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
        <h1 className="text-3xl font-bold text-gray-900">社会信用代码生成器</h1>
        <p className="mt-2 text-sm text-gray-600">
          生成18位统一社会信用代码，符合国家标准GB32100-2015
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 参数设置 */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">生成参数</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                机构类型
              </label>
              <select
                value={orgType}
                onChange={(e) => setOrgType(e.target.value)}
                className="input-field"
              >
                {orgTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
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
                  <span>生成社会信用代码</span>
                </>
              )}
            </button>
          </div>

          {/* 机构类型说明 */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-2">机构类型说明</h3>
            <div className="space-y-1 text-xs text-gray-600">
              <p><span className="font-medium">1 - 机关：</span>党政机关、人大、政协等</p>
              <p><span className="font-medium">2 - 事业单位：</span>学校、医院、科研院所等</p>
              <p><span className="font-medium">3 - 社会团体：</span>协会、学会、商会等</p>
              <p><span className="font-medium">4 - 其他组织：</span>基金会、民办非企业等</p>
              <p><span className="font-medium">5 - 企业：</span>各类企业法人</p>
              <p><span className="font-medium">9 - 其他：</span>其他法人组织</p>
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
              {results.map((code, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-lg p-3 font-mono text-sm flex items-center justify-between"
                >
                  <span>{code}</span>
                  <button
                    onClick={() => copyToClipboard(code)}
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
              点击"生成社会信用代码"开始生成
            </div>
          )}
        </div>
      </div>

      {/* 说明 */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">使用说明</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <p>• 统一社会信用代码由18位数字和字母组成</p>
          <p>• 第1位为登记管理部门代码（固定为9）</p>
          <p>• 第2位为机构类别代码（1-机关、2-事业单位、3-社会团体等）</p>
          <p>• 第3-8位为登记管理机关行政区划码</p>
          <p>• 第9-17位为主体标识码</p>
          <p>• 第18位为校验码</p>
          <p>• 符合国家标准GB32100-2015</p>
          <p>• 仅供测试使用，请勿用于任何违法用途</p>
        </div>
      </div>
    </div>
  )
}

export default CreditCodeGenerator 