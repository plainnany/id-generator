import React from 'react'
import { Link } from 'react-router-dom'
import { CreditCard, Phone, FileText, ArrowRight } from 'lucide-react'

const Home: React.FC = () => {
  const features = [
    {
      title: '身份证号生成',
      description: '生成符合规范的身份证号码，支持指定地区和年龄范围',
      icon: CreditCard,
      link: '/idcard',
      color: 'bg-blue-500'
    },
    {
      title: '手机号生成',
      description: '生成各大运营商的手机号码，支持不同号段选择',
      icon: Phone,
      link: '/phone',
      color: 'bg-green-500'
    },
    {
      title: '社会信用代码',
      description: '生成18位统一社会信用代码，符合国家标准',
      icon: FileText,
      link: '/credit-code',
      color: 'bg-purple-500'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
          ID生成器
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          专业的身份信息生成工具，支持身份证号、手机号、社会信用代码等多种格式
        </p>
        <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
          <div className="rounded-md shadow">
            <Link
              to="/idcard"
              className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 md:py-4 md:text-lg md:px-10"
            >
              开始使用
            </Link>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="mt-16">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <Link
                key={feature.title}
                to={feature.link}
                className="group card hover:shadow-lg transition-shadow duration-200"
              >
                <div className="flex items-center">
                  <div className={`flex-shrink-0 w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-lg font-medium text-gray-900 group-hover:text-primary-600 transition-colors">
                      {feature.title}
                    </h3>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary-600 transition-colors" />
                </div>
                <p className="mt-3 text-sm text-gray-500">
                  {feature.description}
                </p>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Info Section */}
      <div className="mt-16 card">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">使用说明</h2>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900">选择生成类型</h3>
              <p className="mt-2 text-sm text-gray-500">
                选择需要生成的ID类型，支持身份证、手机号、社会信用代码
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 font-bold">2</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900">设置参数</h3>
              <p className="mt-2 text-sm text-gray-500">
                根据需要设置生成参数，如地区、年龄范围、运营商等
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <span className="text-purple-600 font-bold">3</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900">生成与复制</h3>
              <p className="mt-2 text-sm text-gray-500">
                点击生成按钮获取结果，支持一键复制和批量生成
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Warning */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              免责声明
            </h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>
                本工具生成的所有信息仅供学习、测试和开发使用。请勿将生成的信息用于任何非法用途或实际身份验证场景。
                使用本工具产生的任何后果由用户自行承担。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home 