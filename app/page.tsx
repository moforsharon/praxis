// import Dashboard from '@/components/Dashboard'

// export default function Home() {
//   return (
//     <main className="min-h-screen bg-white">
//       <Dashboard />
//     </main>
//   )
// }
"use client"

import { useState } from "react"
import { LoginModal } from "@/components/login-modal"
import { Layout } from "@/components/layout"
import { UploadFile } from "@/components/upload-file"
import { TrackVisits } from "@/components/track-visits"
import { Statistics } from "@/components/statistics"

export default function Dashboard() {
  // const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser !== null;
  });
  const [activeTab, setActiveTab] = useState<'upload' | 'track' | 'statistics'>('statistics')

  if (!isLoggedIn) {
    return <LoginModal onLogin={() => setIsLoggedIn(true)} />
  }

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === 'upload' ? (
        <UploadFile />
      ) : activeTab === 'track' ? (
        <TrackVisits />
      ) : (
        <Statistics />
      )}
    </Layout>
  )
}

