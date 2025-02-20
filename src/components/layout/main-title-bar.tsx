import React from 'react'

export interface MainTitleBarProps {
  title: string
  description: string
  children?: React.ReactNode
}

export default function MainTitleBar(props: MainTitleBarProps) {
  return (
    <div className='mb-2 flex flex-wrap items-center justify-between space-y-2'>
      <div>
        <h2 className='text-2xl font-bold tracking-tight'>{props.title}</h2>
        <p className='text-muted-foreground'>{props.description}</p>
      </div>

      {props.children}
    </div>
  )
}