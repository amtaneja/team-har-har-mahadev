'use client'
import React, { useEffect } from 'react'
import { FlightTakeoff, Logout } from '@mui/icons-material'
import { StyledAppBar, StyledToolbar, StyledBox, StyledIconButton, StyledTypography, StyledLogoutButton } from './styles'
import { useThemeStore } from '@/store/zustand/themeStore'
import { useRouter } from 'next/navigation'

interface NavbarProps {
  title?: string
  className?: string
  showLogout?: boolean
}

const Navbar: React.FC<NavbarProps> = ({
  title = "SafarPlan",
  className = "",
  showLogout = false
}) => {
  const { themeMode, initializeTheme } = useThemeStore()
  const router = useRouter()

  useEffect(() => {
    initializeTheme()
  }, [initializeTheme])

  const handleLogout = () => {
    // Clear any stored authentication data
    localStorage.removeItem('auth-token')
    localStorage.removeItem('user-data')
    // Redirect to login page
    router.push('/')
  }

  return (
    <StyledAppBar 
      position="sticky" 
      elevation={4}
      className={className}
      data-theme={themeMode}
    >
      <StyledToolbar>
        {/* Logo and Title */}
        <StyledBox>
          <StyledIconButton size="small" data-theme={themeMode}>
            <FlightTakeoff />
          </StyledIconButton>
          <StyledTypography data-theme={themeMode}>
            {title}
          </StyledTypography>
        </StyledBox>
        
        {/* Logout Button */}
        {showLogout && (
          <StyledLogoutButton
            variant="outlined"
            startIcon={<Logout />}
            onClick={handleLogout}
            data-theme={themeMode}
          >
            Logout
          </StyledLogoutButton>
        )}
      </StyledToolbar>
    </StyledAppBar>
  )
}

export default Navbar
