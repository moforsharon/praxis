import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Upload, BarChart2 } from 'lucide-react'

interface SidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div className={`bg-[#242873] text-white transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-[24%]'}`}>
      <div className="flex justify-end p-4">
        <Button variant="ghost" size="icon" onClick={() => setIsCollapsed(!isCollapsed)}>
          {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
        </Button>
      </div>
      <nav className="space-y-2 p-4">
        <Button
          variant={activeTab === 'upload' ? 'secondary' : 'ghost'}
          className="w-full justify-start"
          onClick={() => setActiveTab('upload')}
        >
          <Upload className="mr-2" />
          {!isCollapsed && 'Upload Excel File'}
        </Button>
        <Button
          variant={activeTab === 'track' ? 'secondary' : 'ghost'}
          className="w-full justify-start"
          onClick={() => setActiveTab('track')}
        >
          <BarChart2 className="mr-2" />
          {!isCollapsed && 'Track landing page visits'}
        </Button>
      </nav>
    </div>
  )
}

