import { getServerSession } from 'next-auth'
import { FC, ReactNode } from 'react'
import { authOptions } from '../lib/auth'
import { LayoutProps } from '@/.next/types/app/layout'
import { notFound } from 'next/navigation'

interface layoutProps {
  children: ReactNode
}

const layout = async ({children}: LayoutProps) => {
  const session = await getServerSession(authOptions)

  if(!session) notFound()

  return <div className='w-full flex h-screen'>
    
    {children}</div>
}

export default layout