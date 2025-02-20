import React from 'react'

export default function MainContent({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
      {children}
    </div>
  )
}