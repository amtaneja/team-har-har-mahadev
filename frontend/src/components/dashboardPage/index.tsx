'use client'
import React, { useState } from 'react'
import { Box } from '@mui/material'
import { Sidebar } from '@/components/common'
import PlanningModule from '@/modules/planning'
import ItineraryDetails from '@/modules/iteneraies'



const DashboardPageComponent = () => {
  const [activeSection, setActiveSection] = useState<'planning' | 'itineraries'>('planning')

  const handleSidebarItemClick = (section: 'planning' | 'itineraries') => {
    setActiveSection(section)
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'planning':
        return <PlanningModule />
      case 'itineraries':
        return <ItineraryDetails />
      default:
        return <PlanningModule />
    }
  }

  return (
    <Box sx={{ display: 'flex', minHeight: 'calc(100vh - 64px)' }}>
      {/* Sidebar */}
      <Sidebar onItemClick={handleSidebarItemClick} activeSection={activeSection} />
      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minHeight: 'calc(100vh - 64px)',
        }}
      >
        {renderContent()}
      </Box>
    </Box>
  )
}

export default DashboardPageComponent