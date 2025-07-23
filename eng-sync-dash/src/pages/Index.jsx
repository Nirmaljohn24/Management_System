import React, { useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import Login from "../components/Login"
import Layout from "../components/Layout"
import Dashboard from "../components/Dashboard"
import Engineers from "../components/Engineers"
import Projects from "../components/Projects"
import Assignments from "../components/Assignments"
import Capacity from "../components/Capacity"
import AITools from "../components/AITools"

const Index = () => {
  const { user, loading } = useAuth()
  const [currentPage, setCurrentPage] = useState("dashboard")

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Login />
  }

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard />
      case "engineers":
        return <Engineers />
      case "projects":
        return <Projects />
      case "assignments":
        return <Assignments />
      case "capacity":
        return <Capacity />
      case "ai-tools":
        return <AITools />
      case "settings":
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Settings</h2>
            <p className="text-muted-foreground">
              Settings page coming soon...
            </p>
          </div>
        )
      default:
        return <Dashboard />
    }
  }

  return (
    <Layout currentPage={currentPage} setCurrentPage={setCurrentPage}>
      {renderPage()}
    </Layout>
  )
}

export default Index
