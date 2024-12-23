"use client"

import { UploadCloud, BarChart3, PieChart } from 'lucide-react'
import { cn } from "@/lib/utils"
import Image from "next/image"

interface LayoutProps {
  children: React.ReactNode
  activeTab: 'upload' | 'track' | 'statistics'
  onTabChange: (tab: 'upload' | 'track' | 'statistics') => void
}

export function Layout({ children, activeTab, onTabChange }: LayoutProps) {
  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-64 bg-[#253771] text-white">
        <div className="p-4">
          <div className="flex items-center justify-center mb-8">
            <Image
              src="/fever_app_logo.png"
              alt="Logo"
              width={50}
              height={50}
            />
          </div>
          <nav className="space-y-2">
          <button
              onClick={() => onTabChange('statistics')}
              className={cn(
                "flex items-center space-x-3 w-full p-3 rounded-lg transition-colors",
                activeTab === 'statistics' 
                  ? "bg-[#B6BBE0]/20" 
                  : "hover:bg-[#B6BBE0]/20"
              )}
            >
              <PieChart  size={20} />
              <span>View statistics</span>
            </button>
            <button
              onClick={() => onTabChange('track')}
              className={cn(
                "flex items-center space-x-3 w-full p-3 rounded-lg transition-colors",
                activeTab === 'track' 
                  ? "bg-[#B6BBE0]/20" 
                  : "hover:bg-[#B6BBE0]/20"
              )}
            >
              <BarChart3 size={20} />
              <span>Track Visits</span>
            </button>

            <button
              onClick={() => onTabChange('upload')}
              className={cn(
                "flex items-center space-x-3 w-full p-3 rounded-lg transition-colors",
                activeTab === 'upload' 
                  ? "bg-[#B6BBE0]/20" 
                  : "hover:bg-[#B6BBE0]/20"
              )}
            >
              <UploadCloud size={20} />
              <span>Upload pediatrician practices</span>
            </button>
          </nav>
        </div>
      </div>
      <main className="flex-1 overflow-hidden">
        <div className="h-full p-8">
          {children}
        </div>
      </main>
    </div>
  )
}

