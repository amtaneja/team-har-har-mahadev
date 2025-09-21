'use client'
import React from 'react'
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Divider
} from '@mui/material'
import {
  Dashboard,
  Bookmark,
  Settings,
  Person
} from '@mui/icons-material'

interface SidebarProps {
  onItemClick: (section: 'planning' | 'itineraries') => void
  activeSection: 'planning' | 'itineraries'
}

const Sidebar: React.FC<SidebarProps> = ({ onItemClick, activeSection }) => {
  const menuItems = [
    { text: 'Planning', icon: <Dashboard />, section: 'planning' as const },
    { text: 'Itineraries', icon: <Bookmark />, section: 'itineraries' as const },
  ]

  const bottomMenuItems = [
    { text: 'Profile', icon: <Person />, path: '/profile' },
    { text: 'Settings', icon: <Settings />, path: '/settings' },
  ]

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Sidebar Header */}
      <Box sx={{ p: 2, borderBottom: '1px solid rgba(139, 92, 246, 0.2)' }}>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 50%, #f97316 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: '1.25rem'
          }}
        >
          SafarPlan
        </Typography>
      </Box>

      {/* Main Navigation */}
      <List sx={{ flexGrow: 1, pt: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              onClick={() => onItemClick(item.section)}
              selected={activeSection === item.section}
              sx={{
                mx: 1,
                mt: 1,
                borderRadius: 2,
                color: '#6b7280',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  backgroundColor: 'rgba(139, 92, 246, 0.1)',
                  color: '#8b5cf6',
                  transform: 'translateX(4px)',
                },
                '&.Mui-selected': {
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                  color: 'white',
                  boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #7c3aed 0%, #db2777 100%)',
                    color: 'white',
                    transform: 'translateX(4px)',
                  },
                },
              }}
            >
              <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
                primaryTypographyProps={{
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  color: 'inherit'
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ borderColor: 'rgba(139, 92, 246, 0.2)', mx: 2 }} />

      {/* Bottom Navigation */}
      <List sx={{ pb: 1 }}>
        {bottomMenuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              sx={{
                mx: 1,
                borderRadius: 2,
                color: '#6b7280',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  backgroundColor: 'rgba(139, 92, 246, 0.1)',
                  color: '#8b5cf6',
                  transform: 'translateX(4px)',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
                primaryTypographyProps={{
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  color: 'inherit'
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  )

  return (
    <Box
      sx={{
        width: 240,
        height: 'calc(100vh - 64px)', // Full height minus navbar height
        background: 'linear-gradient(180deg, rgba(139, 92, 246, 0.05) 0%, rgba(236, 72, 153, 0.05) 50%, rgba(249, 115, 22, 0.05) 100%)',
        backdropFilter: 'blur(10px)',
        borderRight: '1px solid rgba(139, 92, 246, 0.2)',
        position: 'sticky',
        top: 64, // Height of the navbar to avoid overlap
        left: 0,
        zIndex: 1,
        overflowY: 'auto',
        boxShadow: '4px 0 20px -5px rgba(139, 92, 246, 0.1)'
      }}
    >
      {drawerContent}
    </Box>
  )
}

export default Sidebar
