import React, { useEffect } from 'react'
import { CheckCircle, X, AlertCircle, Info } from 'lucide-react'

export interface ToastProps {
  id: string
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
  duration?: number
  onClose: (id: string) => void
}

const Toast: React.FC<ToastProps> = ({ id, message, type, duration = 3000, onClose }) => {
  const [isExiting, setIsExiting] = React.useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true)
      // 等待退出动画完成后再移除
      setTimeout(() => {
        onClose(id)
      }, 300)
    }, duration)

    return () => clearTimeout(timer)
  }, [id, duration, onClose])

  const handleClose = () => {
    setIsExiting(true)
    setTimeout(() => {
      onClose(id)
    }, 300)
  }

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-6 h-6 text-green-600 drop-shadow-sm" />
      case 'error':
        return <AlertCircle className="w-6 h-6 text-red-600 drop-shadow-sm" />
      case 'warning':
        return <AlertCircle className="w-6 h-6 text-yellow-600 drop-shadow-sm" />
      case 'info':
        return <Info className="w-6 h-6 text-blue-600 drop-shadow-sm" />
      default:
        return <CheckCircle className="w-6 h-6 text-green-600 drop-shadow-sm" />
    }
  }

  const getStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300 text-green-800 shadow-xl'
      case 'error':
        return 'bg-gradient-to-r from-red-50 to-rose-50 border-red-300 text-red-800 shadow-xl'
      case 'warning':
        return 'bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-300 text-yellow-800 shadow-xl'
      case 'info':
        return 'bg-gradient-to-r from-blue-50 to-sky-50 border-blue-300 text-blue-800 shadow-xl'
      default:
        return 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300 text-green-800 shadow-xl'
    }
  }

  return (
    <div className={`
      flex items-center p-3 px-5 rounded-lg border-2 min-w-80 max-w-md
      ${getStyles()}
      ${isExiting ? 'animate-out' : 'animate-in slide-in-from-top'} 
      duration-300 pointer-events-auto backdrop-blur-sm
      hover:scale-105 transform transition-transform
    `}>
      <div className="flex-shrink-0">
        {getIcon()}
      </div>
      <div className="ml-3 flex-1">
        <p className="text-sm font-semibold">{message}</p>
      </div>
      <button
        onClick={handleClose}
        className="ml-3 text-gray-400 hover:text-gray-700 transition-all duration-200 hover:bg-gray-100 rounded-full p-1"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

export default Toast 