import React from 'react'
import type { ReactNode } from 'react'
import './BOLayout.css'

interface Props {
  children: ReactNode
}

const BOLayout: React.FC<Props> = ({ children }) => {
  return (
    <div className="bo-layout">
      <main className="bo-layout__main">
        {children}
      </main>
    </div>
  )
}

export default BOLayout
