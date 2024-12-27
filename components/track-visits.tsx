"use client"

import { useState, useEffect } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ChevronLeft, ChevronRight, Search } from 'lucide-react'
import Image from 'next/image'
import { useToast } from "@/components/ui/use-toast"

interface Pediatrician {
  code: number
  praxisname1Namen: string
  straße: string
  plz: string
  stadt: string
  pathToPediatricianQRCodeImage: string
  numberOfPageVisits: number,
  numberOfAndroidDownloads: number,
  numberOfIosDownloads: number
}

export function TrackVisits() {
  const [pediatricians, setPediatricians] = useState<Pediatrician[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [sortBy, setSortBy] = useState<keyof Pediatrician>('numberOfPageVisits')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [filter, setFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const { toast } = useToast()

  useEffect(() => {
    fetchPediatricians()
  }, [])

  const fetchPediatricians = async () => {
    try {
      const response = await fetch('/api/pediatricians')
      if (!response.ok) {
        throw new Error('Failed to fetch pediatricians')
      }
      const data = await response.json()
      setPediatricians(data)
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Failed to fetch data",
        description: "There was an error loading the pediatricians data.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const sortedAndFilteredPediatricians = pediatricians
    .filter(p => 
      p.praxisname1Namen.toLowerCase().includes(filter.toLowerCase()) ||
      p.stadt.toLowerCase().includes(filter.toLowerCase())
    )
    .sort((a, b) => {
      if (a[sortBy] < b[sortBy]) return sortOrder === 'asc' ? -1 : 1
      if (a[sortBy] > b[sortBy]) return sortOrder === 'asc' ? 1 : -1
      return 0
    })

  const totalPages = Math.ceil(sortedAndFilteredPediatricians.length / itemsPerPage)
  const paginatedData = sortedAndFilteredPediatricians.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleSort = (column: keyof Pediatrician) => {
    if (column === sortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(column)
      setSortOrder('desc')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#253771]" />
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#253771] mb-4">Track Page Visits</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search by name or city..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="pl-10 max-w-sm border-[#B6BBE0] focus:border-[#253771]"
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-auto border rounded-lg border-[#B6BBE0]">
        <Table>
          <TableHeader className="bg-[#253771]/5">
            <TableRow>
              <TableHead onClick={() => handleSort('code')} className="cursor-pointer hover:text-[#253771]">Code</TableHead>
              <TableHead onClick={() => handleSort('praxisname1Namen')} className="cursor-pointer hover:text-[#253771]">Name</TableHead>
              <TableHead onClick={() => handleSort('straße')} className="cursor-pointer hover:text-[#253771]">Address</TableHead>
              <TableHead onClick={() => handleSort('stadt')} className="cursor-pointer hover:text-[#253771]">City</TableHead>
              <TableHead onClick={() => handleSort('numberOfPageVisits')} className="cursor-pointer hover:text-[#253771]">Visits</TableHead>
              <TableHead onClick={() => handleSort('numberOfAndroidDownloads')} className="cursor-pointer hover:text-[#253771]">Android downloads</TableHead>
              <TableHead onClick={() => handleSort('numberOfIosDownloads')} className="cursor-pointer hover:text-[#253771]">IOS Downloads</TableHead>

              {/* <TableHead>Action</TableHead> */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((pediatrician) => (
              <TableRow key={pediatrician.code} className="hover:bg-[#B6BBE0]/5">
                <TableCell>{pediatrician.code.toString().padStart(4, '0')}</TableCell>
                <TableCell className="font-medium">{pediatrician.praxisname1Namen}</TableCell>
                <TableCell>{`${pediatrician.straße}, ${pediatrician.plz}`}</TableCell>
                <TableCell>{pediatrician.stadt}</TableCell>
                <TableCell className="font-semibold text-[#253771]">
                  {pediatrician.numberOfPageVisits}
                </TableCell>
                <TableCell className="font-semibold text-[#253771]">
                  {pediatrician.numberOfAndroidDownloads}
                </TableCell>
                <TableCell className="font-semibold text-[#253771]">
                  {pediatrician.numberOfIosDownloads}
                </TableCell>
                {/* <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-[#B6BBE0] hover:border-[#253771] hover:bg-[#253771] hover:text-white"
                      >
                        View QR Code
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle className="text-[#253771]">
                          QR Code for {pediatrician.praxisname1Namen}
                        </DialogTitle>
                      </DialogHeader>
                      <div className="flex flex-col items-center p-4 bg-[#B6BBE0]/10 rounded-lg">
                        <Image 
                          src={`${pediatrician.pathToPediatricianQRCodeImage}`} 
                          alt="QR Code" 
                          width={200} 
                          height={200}
                          className="rounded-lg shadow-lg"
                        />
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell> */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, sortedAndFilteredPediatricians.length)} of {sortedAndFilteredPediatricians.length} entries
        </p>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="border-[#B6BBE0]"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-sm">
            Page {currentPage} of {totalPages}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="border-[#B6BBE0]"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

