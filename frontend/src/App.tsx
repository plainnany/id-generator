import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastProvider } from './context/ToastContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import IdCardGenerator from './pages/IdCardGenerator'
import PhoneGenerator from './pages/PhoneGenerator'
import CreditCodeGenerator from './pages/CreditCodeGenerator'

function App() {
  return (
    <ToastProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/idcard" element={<IdCardGenerator />} />
            <Route path="/phone" element={<PhoneGenerator />} />
            <Route path="/credit-code" element={<CreditCodeGenerator />} />
          </Routes>
        </Layout>
      </Router>
    </ToastProvider>
  )
}

export default App 