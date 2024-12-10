'use client'

import { useState, useEffect } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
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

export function TrackDownloads() {
  const [pediatricians, setPediatricians] = useState<Pediatrician[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [sortBy, setSortBy] = useState<keyof Pediatrician>('numberOfDownloads')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [filter, setFilter] = useState('')
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

  const handleSort = (column: keyof Pediatrician) => {
    if (column === sortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(column)
      setSortOrder('desc')
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="h-screen overflow-scroll">
      <h1 className="text-2xl font-bold mb-4">Track Downloads</h1>
      <Input
        placeholder="Filter by name or city"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="max-w-sm mb-4"
      />
      <Table className="">
        <TableHeader>
          <TableRow>
            <TableHead onClick={() => handleSort('code')} className="cursor-pointer">Code</TableHead>
            <TableHead onClick={() => handleSort('praxisname1Namen')} className="cursor-pointer">Name</TableHead>
            <TableHead onClick={() => handleSort('straße')} className="cursor-pointer">Address</TableHead>
            <TableHead onClick={() => handleSort('stadt')} className="cursor-pointer">City</TableHead>
            <TableHead onClick={() => handleSort('numberOfDownloads')} className="cursor-pointer">Downloads</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedAndFilteredPediatricians.map((pediatrician) => (
            <TableRow key={pediatrician.code}>
              <TableCell>{pediatrician.code}</TableCell>
              <TableCell>{pediatrician.praxisname1Namen}</TableCell>
              <TableCell>{`${pediatrician.straße}, ${pediatrician.plz}`}</TableCell>
              <TableCell>{pediatrician.stadt}</TableCell>
              <TableCell>{pediatrician.numberOfDownloads}</TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size='sm'>View QR Code</Button>
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

