'use client'

import { useState } from 'react'
import { Sidebar } from './Sidebar'
import { UploadExcel } from './UploadExcel'
import { TrackDownloads } from './TrackDownloads'
import { ToastProvider } from '@/components/ui/toast'

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('upload')

  return (
    <ToastProvider>
      <div className="flex h-screen">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="flex-1 p-8">
          {activeTab === 'upload' ? <UploadExcel /> : <TrackDownloads />}
        </div>
      </div>
    </ToastProvider>
  )
}

