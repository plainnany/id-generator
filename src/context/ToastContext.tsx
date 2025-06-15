import React, { createContext, useContext, ReactNode } from 'react'
import { useToast } from '../hooks/useToast'
import ToastContainer from '../components/ToastContainer'

interface ToastContextType {
  success: (message: string, duration?: number) => void
  error: (message: string, duration?: number) => void
  info: (message: string, duration?: number) => void
  warning: (message: string, duration?: number) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

interface ToastProviderProps {
  children: ReactNode
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const { toasts, removeToast, success, error, info, warning } = useToast()

  const contextValue: ToastContextType = {
    success,
    error,
    info,
    warning,
  }

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </ToastContext.Provider>
  )
}

export const useToastContext = (): ToastContextType => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToastContext must be used within a ToastProvider')
  }
  return context
} 