"use client"

import { useState } from "react"
import { Upload } from 'lucide-react'
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

interface Pediatrician {
  code: number
  praxisname1Namen: string
  straße: string
  plz: string
  stadt: string
  pathToPediatricianQRCodeImage: string
  numberOfDownloads: number
}

export function UploadFile() {
  const [isUploading, setIsUploading] = useState(false)
  const [pediatricians, setPediatricians] = useState<Pediatrician[]>([])
  const [uploadProgress, setUploadProgress] = useState(0)
  const { toast } = useToast()

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setIsUploading(true)
      setUploadProgress(0)
      const formData = new FormData()
      formData.append('file', file)

      try {
        // Simulate upload progress
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => Math.min(prev + 10, 90))
        }, 500)

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        clearInterval(progressInterval)
        setUploadProgress(100)

        if (!uploadResponse.ok) {
          throw new Error('Upload failed')
        }

        const fetchResponse = await fetch('/api/pediatricians')
        if (!fetchResponse.ok) {
          throw new Error('Failed to fetch pediatricians')
        }

        const data = await fetchResponse.json()
        setPediatricians(data)
        toast({
          title: "Upload Successful",
          description: "The Excel file has been processed and data has been updated.",
        })
      } catch (error) {
        console.error('Error:', error)
        toast({
          title: "Upload Failed",
          description: "There was an error uploading and processing the file.",
          variant: "destructive",
        })
      } finally {
        setIsUploading(false)
        setUploadProgress(0)
      }
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-[#253771]">Upload pediatrician practices</h1>
        <p className="text-gray-500">Upload your XLSX file to update pediatrician data</p>
      </div>
      <div className="w-full max-w-md">
        <div className="border-2 border-dashed border-[#B6BBE0] rounded-lg p-8 text-center">
          <input
            type="file"
            accept=".xlsx"
            onChange={handleUpload}
            className="hidden"
            id="file-upload"
            disabled={isUploading}
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer flex flex-col items-center space-y-4"
          >
            <div className="p-4 bg-[#B6BBE0]/20 rounded-full">
              <Upload className="h-8 w-8 text-[#253771]" />
            </div>
            <span className="text-sm text-gray-500">
              {isUploading ? 'Uploading...' : 'Click to upload or drag and drop'}
            </span>
            <span className="text-xs text-gray-400">XLSX files only</span>
          </label>
        </div>
        {isUploading && (
          <div className="mt-4 space-y-2">
            <Progress value={uploadProgress} className="h-2" />
            <p className="text-sm text-center text-gray-500">
              Uploading... {uploadProgress}%
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

