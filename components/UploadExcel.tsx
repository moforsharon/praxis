'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import Image from 'next/image'
import { useToast } from "@/components/ui/use-toast"



interface Pediatrician {
  code: number
  praxisname1Namen: string
  straße: string
  plz: string
  stadt: string
  pathToPediatricianQRCodeImage: string
  numberOfDownloads: number
}

export function UploadExcel() {
  const [isUploading, setIsUploading] = useState(false)
  const [pediatricians, setPediatricians] = useState<Pediatrician[]>([])
  const { toast } = useToast()
  

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setIsUploading(true)
      const formData = new FormData()
      formData.append('file', file)

      try {
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

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
      }
    }
  }

  if (pediatricians.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="text-2xl font-bold mb-4">Upload Excel File</h1>
        <Input 
          type="file" 
          accept=".xlsx, .xls" 
          onChange={handleUpload} 
          className="max-w-sm mb-4" 
          disabled={isUploading}
        />
        <Button disabled={isUploading}>
          {isUploading ? 'Uploading...' : 'Upload'}
        </Button>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Uploaded Pediatricians</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>City</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pediatricians.map((pediatrician) => (
            <TableRow key={pediatrician.code}>
              {/* <TableCell>{pediatrician.code}</TableCell> */}
              <TableCell>{pediatrician.code.toString().padStart(4, '0')}</TableCell>
              <TableCell>{pediatrician.praxisname1Namen}</TableCell>
              <TableCell>{`${pediatrician.straße}, ${pediatrician.plz}`}</TableCell>
              <TableCell>{pediatrician.stadt}</TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">View QR Code</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>QR Code for {pediatrician.praxisname1Namen}</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col items-center">
                    <Image src={`${pediatrician.pathToPediatricianQRCodeImage}`} alt="QR Code" width={200} height={200} />
                      {/* <Button className="mt-4" variant="outline">Close</Button> */}
                    </div>
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

