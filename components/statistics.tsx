"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardContent } from "@/components/ui/card"

interface StatCardProps {
  title: string
  value: number
  delay: number
}



function StatCard({ title, value, delay }: StatCardProps) {
  return (
    <Card className="bg-white/50 backdrop-blur-sm border-[#B6BBE0]">
      <CardContent className="pt-6">
        <h3 className="text-sm font-medium text-gray-500 text-center mb-2">{title}</h3>
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay }}
          className="text-3xl font-bold text-[#253771] text-center"
        >
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: delay + 0.2 }}
          >
            {value}
          </motion.span>
        </motion.div>
      </CardContent>
    </Card>
  )
}



export function Statistics() {

    const [statistics, setStatistics] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    


    useEffect(() => {
        fetchStatistics()
      }, [])
    
      const fetchStatistics = async () => {
        try {
          const response = await fetch('/api/getStats') // Adjust the endpoint to match the statistics API
          if (!response.ok) {
            throw new Error('Failed to fetch statistics')
          }
          const data = await response.json()
          console.log(data)
          setStatistics(data)
        } catch (error) {
          console.error('Error:', error)
        } finally {
          setIsLoading(false)
        }
      }
    
      if (isLoading || !statistics) {
        return (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#253771]" />
          </div>
        );
      }
      

      const chartData = {
        downloads: [
          { name: 'With practice Code', value: (parseInt(statistics.totalAndroidDownloadWithCode) + parseInt(statistics.totalIosDownloadWithCode)) },
          { name: 'Without practice code', value: (parseInt(statistics.totalAndroidDownloadWithoutCode) + parseInt(statistics.totalIosDownloadWithoutCode))},
        ],
        pageVisits: [
          { name: 'With practice Code', value: statistics.totalPageVisitsWithCode
             },
          { name: 'Without practice code', value: statistics.totalPageVisitsWithoutCode },
        ],
      }
      var totalDownloads = parseInt(statistics.totalAndroidDownload) + parseInt(statistics.totalIosDownloads);

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <StatCard title="Total practices" value={statistics.totalPediatricians} delay={0} />
        {/* <StatCard title="Total QR-Code scans" value={30} delay={0.1} /> */}
        <StatCard title="Total page visits" value={statistics.totalPageVisits} delay={0.2} />
        <StatCard title="Total downloads" value={totalDownloads} delay={0.3} />
      </motion.div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white p-6 rounded-lg border border-[#B6BBE0]"
        >
          <h3 className="text-lg font-semibold text-[#253771] mb-4">Page visits</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData.pageVisits}>
                <CartesianGrid strokeDasharray="3 3" stroke="#B6BBE0" />
                <XAxis dataKey="name" stroke="#253771" />
                <YAxis stroke="#253771" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff',
                    border: '1px solid #B6BBE0'
                  }}
                />
                <Bar
                  dataKey="value"
                  fill="#253771"
                  radius={[4, 4, 0, 0]}
                  animationBegin={800}
                  animationDuration={1000}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white p-6 rounded-lg border border-[#B6BBE0]"
        >
          <h3 className="text-lg font-semibold text-[#253771] mb-4">Downloads</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData.downloads}>
                <CartesianGrid strokeDasharray="3 3" stroke="#B6BBE0" />
                <XAxis dataKey="name" stroke="#253771" />
                <YAxis stroke="#253771" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff',
                    border: '1px solid #B6BBE0'
                  }}
                />
                <Bar
                  dataKey="value"
                  fill="#FC999E"
                  radius={[4, 4, 0, 0]}
                  animationBegin={800}
                  animationDuration={1000}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

