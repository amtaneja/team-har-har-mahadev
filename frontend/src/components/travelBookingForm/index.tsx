'use client'
import React, { useState, useCallback, useEffect } from 'react'
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  InputAdornment,
  Chip,
  FormControl,
  FormLabel,
  Autocomplete,
  Checkbox,
  ListItemText,
  IconButton,
  Alert,
  Snackbar
} from '@mui/material'
import SwapHorizIcon from '@mui/icons-material/SwapHoriz'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import moment, { Moment } from 'moment'
import { useAdkApiServer } from '@/hooks/useTravelBooking'
import { v4 as uuidv4 } from 'uuid'
import { useCreateSession } from './hook/useSessionApi'
import { InterestOptionType, TravelFormDataType } from './types'
import { allCities, APP_NAME, interestOptions, USER_ID } from './constant'
import ItineraryPopup from './ItineraryPopup'
import { useItineraryStore } from '@/store/zustand'

const TravelBookingForm = () => {
  const { saveItinerary } = useItineraryStore()
  const [formData, setFormData] = useState<TravelFormDataType>({
    sourceLocation: '',
    destinationLocation: '',
    startDate: null,
    endDate: null,
    budget: '',
    numberOfPeople: '',
    interests: []
  })
  const SESSION_ID = String(uuidv4())
  const createSession = useCreateSession( APP_NAME, USER_ID, SESSION_ID )
  console.log( 'createSession', createSession )
  const [errors, setErrors] = useState<Partial<Record<keyof TravelFormDataType, string>>>({})
  const [sessionCreated, setSessionCreated] = useState(false)
  const [notification, setNotification] = useState<{
    open: boolean
    message: string
    severity: 'success' | 'error'
  }>({
    open: false,
    message: '',
    severity: 'success'
  })

  // Itinerary popup state
  const [showItineraryPopup, setShowItineraryPopup] = useState(false)
  const [itineraryData, setItineraryData] = useState<any>({
    destination: "Paris, France",
    duration: "Dec 15 - Dec 22, 2024",
    totalCost: "₹1,50,000",
    summary: "Your personalized Paris itinerary is ready! Experience the City of Light with our carefully curated 7-day adventure.",
    itinerary: [
      {
        day: 1,
        date: "December 15, 2024",
        activities: [
          {
            time: "10:00 AM",
            title: "Arrival at Charles de Gaulle Airport",
            description: "Welcome to Paris! Transfer to your hotel in the heart of the city.",
            type: "flight",
            location: "CDG Airport"
          },
          {
            time: "2:00 PM",
            title: "Check-in at Hotel Plaza Athénée",
            description: "Luxury accommodation with views of the Eiffel Tower. Time to freshen up and rest.",
            type: "hotel",
            location: "8th Arrondissement"
          },
          {
            time: "6:00 PM",
            title: "Dinner at Le Comptoir du Relais",
            description: "Traditional French bistro experience with authentic Parisian cuisine.",
            type: "restaurant",
            location: "Saint-Germain-des-Prés"
          }
        ]
      },
      {
        day: 2,
        date: "December 16, 2024",
        activities: [
          {
            time: "9:00 AM",
            title: "Eiffel Tower Visit",
            description: "Skip-the-line access to the iconic Eiffel Tower with panoramic city views.",
            type: "attraction",
            location: "7th Arrondissement"
          },
          {
            time: "12:00 PM",
            title: "Lunch at Café de Flore",
            description: "Historic café frequented by famous writers and artists.",
            type: "restaurant",
            location: "Saint-Germain-des-Prés"
          },
          {
            time: "3:00 PM",
            title: "Louvre Museum Tour",
            description: "Guided tour of the world's largest art museum, including the Mona Lisa.",
            type: "attraction",
            location: "1st Arrondissement"
          }
        ]
      }
    ]
  })
  const [itineraryError, setItineraryError] = useState<string | null>(null)

  // React Query mutation
  const adkApiMutation = useAdkApiServer()
  
  // Create session on component mount
  useEffect(() => {
    createSession.mutate(undefined, {
      onSuccess: (sessionData) => {
        console.log('Session created successfully on page load:', sessionData)
        setSessionCreated(true)
      },
      onError: (error: any) => {
        const errorMessage = error.response?.data?.message || 'Failed to create session. Please refresh the page.'
        console.error('Session creation error on page load:', errorMessage)
        setNotification({
          open: true,
          message: errorMessage,
          severity: 'error'
        })
      }
    })
  }, []) // Empty dependency array means this runs once on mount
  
  const cityOptions = [...new Set(allCities)].sort()

  const handleInputChange = (field: keyof TravelFormDataType, value: string | Moment | null | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const handleInterestsChange = (event: any, newValue: InterestOptionType[]) => {
    setFormData(prev => ({
      ...prev,
      interests: newValue
    }))
    
    // Clear error when user selects interests
    if (errors.interests) {
      setErrors(prev => ({
        ...prev,
        interests: ''
      }))
    }
  }

  const handleBudgetChange = (value: string) => {
    // Only allow numbers and decimal point
    const numericValue = value.replace(/[^0-9.]/g, '')
    
    // Prevent multiple decimal points
    const parts = numericValue.split('.')
    const formattedValue = parts.length > 2 
      ? parts[0] + '.' + parts.slice(1).join('')
      : numericValue
    
    handleInputChange('budget', formattedValue)
  }

  const handleNumberOfPeopleChange = (value: string) => {
    // Only allow numbers
    const numericValue = value.replace(/[^0-9]/g, '')
    handleInputChange('numberOfPeople', numericValue)
  }

  const handleSwapLocations = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      sourceLocation: prev.destinationLocation,
      destinationLocation: prev.sourceLocation
    }))
    
    // Clear any existing errors for these fields
    setErrors(prev => ({
      ...prev,
      sourceLocation: '',
      destinationLocation: ''
    }))
  }, [])

  const validateForm = () => {
    const newErrors: Partial<Record<keyof TravelFormDataType, string>> = {}
    
    if (!formData.sourceLocation.trim()) {
      newErrors.sourceLocation = 'Source location is required'
    }
    
    if (!formData.destinationLocation.trim()) {
      newErrors.destinationLocation = 'Destination location is required'
    }
    
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required'
    }
    
    if (!formData.endDate) {
      newErrors.endDate = 'End date is required'
    }
    
    if (!formData.budget.trim()) {
      newErrors.budget = 'Budget is required'
    } else if (isNaN(Number(formData.budget)) || Number(formData.budget) <= 0) {
      newErrors.budget = 'Please enter a valid budget amount'
    }
    
    if (!formData.numberOfPeople.trim()) {
      newErrors.numberOfPeople = 'Number of people is required'
    } else if (isNaN(Number(formData.numberOfPeople)) || Number(formData.numberOfPeople) <= 0) {
      newErrors.numberOfPeople = 'Please enter a valid number of people'
    }
    
    if (formData.interests.length === 0) {
      newErrors.interests = 'Please select at least one interest'
    }
    
    // Check if end date is after start date
    if (formData.startDate && formData.endDate) {
      if (formData.endDate.isSameOrBefore(formData.startDate)) {
        newErrors.endDate = 'End date must be after start date'
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      // Check if session is created before submitting
      if (!sessionCreated) {
        setNotification({
          open: true,
          message: 'Session is still being created. Please wait a moment and try again.',
          severity: 'error'
        })
        return
      }

      // Format the request body according to FastAPI schema
      const requestBody = {
        appName: APP_NAME,
        userId: USER_ID,
        sessionId: createSession.data?.id,
        newMessage: {
          parts: [
            {
              text: `I want to travel from ${formData.sourceLocation} to ${formData.destinationLocation} from ${formData.startDate?.format('YYYY-MM-DD')} to ${formData.endDate?.format('YYYY-MM-DD')} with a budget of ₹${formData.budget} for ${formData.numberOfPeople} people. My interests are: ${formData.interests.map(interest => interest.value).join(', ')}. Please help me plan this trip.`
            }
          ],
          role: 'user'
        },
      }

      // Show popup and start loading
      setShowItineraryPopup(true)
      setItineraryData(null)
      setItineraryError(null)

      // Use React Query mutation (session already exists)
      adkApiMutation.mutate(requestBody, {
        onSuccess: (data) => {
          // Parse the itinerary data from the API response
          try {
            const parsedData = data[0].content;
            setItineraryData({
              destination: formData.destinationLocation,
              duration: `${formData.startDate?.format('MMM DD')} - ${formData.endDate?.format('MMM DD, YYYY')}`,
              totalCost: `₹${formData.budget}`,
              itinerary: parsedData,
              summary: `Your personalized ${formData.destinationLocation} itinerary is ready!`
            })
          } catch (error) {
            console.error('Error parsing itinerary data:', error)
            setItineraryError('Failed to parse itinerary data. Please try again.')
          }
        },
        onError: (error: any) => {
          const errorMessage = error.response?.data?.message || 'Failed to submit form. Please try again.'
          setItineraryError(errorMessage)
          setNotification({
            open: true,
            message: errorMessage,
            severity: 'error'
          })
        }
      })
    }
  }

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }))
  }

  const handleCloseItineraryPopup = () => {
    setShowItineraryPopup(false)
    setItineraryData(null)
    setItineraryError(null)
  }

  const handleSaveItinerary = (itineraryData: any) => {
    if (!itineraryData || !formData.startDate || !formData.endDate) return

    const itineraryToSave = {
      destination: itineraryData.destination,
      duration: itineraryData.duration,
      totalCost: itineraryData.totalCost,
      summary: itineraryData.summary,
      itinerary: itineraryData.itinerary,
      sourceLocation: formData.sourceLocation,
      destinationLocation: formData.destinationLocation,
      startDate: formData.startDate.format('YYYY-MM-DD'),
      endDate: formData.endDate.format('YYYY-MM-DD'),
      budget: formData.budget,
      numberOfPeople: formData.numberOfPeople,
      interests: formData.interests.map(interest => interest.value)
    }

    saveItinerary(itineraryToSave)
    
    setNotification({
      open: true,
      message: 'Itinerary saved successfully! You can view it in the Itineraries section.',
      severity: 'success'
    })
  }
  
  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <div className="min-h-screen relative bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-indigo-500/20 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-40 left-20 w-24 h-24 bg-purple-500/20 rounded-full blur-xl animate-pulse delay-2000"></div>
        <div className="absolute top-60 left-1/2 w-16 h-16 bg-pink-500/20 rounded-full blur-xl animate-pulse delay-500"></div>
        
        <Box sx={{ maxWidth: '100%', p: 2, position: 'relative', zIndex: 10 }}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 4, 
              borderRadius: 4,
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }}
          >
            <Typography 
              variant="h3" 
              component="h2" 
              gutterBottom 
              align="center" 
              sx={{ 
                mb: 3,
                background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 50%, #f97316 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 700,
                fontSize: { xs: '2rem', md: '2.5rem' }
              }}
            >
              Plan Your Perfect Trip
            </Typography>
          
          <Box component="form" onSubmit={handleSubmit}>
            {/* Step 1: Destination Selection */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ 
                mb: 3, 
                color: '#374151',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <Box sx={{ 
                  width: 24, 
                  height: 24, 
                  borderRadius: '50%', 
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '0.875rem',
                  fontWeight: 'bold'
                }}>
                  1
                </Box>
                Where would you like to go?
              </Typography>
              
              <Box sx={{ 
                display: 'flex', 
                gap: 2, 
                flexDirection: { xs: 'column', md: 'row' },
                alignItems: 'center',
                position: 'relative'
              }}>
                {/* From Location */}
                <Box sx={{ flex: 1, minWidth: '150px' }}>
                  <Autocomplete
                    options={cityOptions}
                    value={formData.sourceLocation}
                    onChange={(event, newValue) => {
                      handleInputChange('sourceLocation', newValue || '')
                    }}
                    onInputChange={(event, newInputValue) => {
                      handleInputChange('sourceLocation', newInputValue)
                    }}
                    freeSolo
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Departure City"
                        placeholder="Where are you starting from?"
                        error={!!errors.sourceLocation}
                        helperText={errors.sourceLocation}
                        required
                        size="medium"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            height: '60px',
                            borderRadius: '16px',
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#8b5cf6',
                              borderWidth: '2px',
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#8b5cf6',
                              borderWidth: '2px',
                            },
                          },
                          '& .MuiInputLabel-root': {
                            color: '#6b7280',
                            fontWeight: 500
                          }
                        }}
                      />
                    )}
                    renderOption={(props, option) => (
                      <Box component="li" {...props} sx={{ py: 1.5, px: 2 }} key={option}>
                        {option}
                      </Box>
                    )}
                    sx={{
                      '& .MuiAutocomplete-inputRoot': {
                        paddingTop: 0,
                        paddingBottom: 0,
                        height: '60px',
                      }
                    }}
                  />
                </Box>

                {/* Exchange Button */}
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  mx: 1
                }}>
                  <IconButton
                    onClick={handleSwapLocations}
                    sx={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '2px solid rgba(139, 92, 246, 0.3)',
                      borderRadius: '50%',
                      width: 48,
                      height: 48,
                      boxShadow: '0 4px 12px rgba(139, 92, 246, 0.2)',
                      '&:hover': {
                        backgroundColor: 'rgba(139, 92, 246, 0.1)',
                        borderColor: '#8b5cf6',
                        transform: 'scale(1.1) rotate(180deg)',
                        boxShadow: '0 6px 20px rgba(139, 92, 246, 0.3)',
                      },
                      '&:active': {
                        transform: 'scale(0.95) rotate(180deg)',
                      },
                      transition: 'all 0.3s ease-in-out'
                    }}
                    aria-label="Swap locations"
                  >
                    <SwapHorizIcon sx={{ fontSize: 22, color: '#8b5cf6' }} />
                  </IconButton>
                </Box>

                {/* To Location */}
                <Box sx={{ flex: 1, minWidth: '150px' }}>
                  <Autocomplete
                    options={cityOptions}
                    value={formData.destinationLocation}
                    onChange={(event, newValue) => {
                      handleInputChange('destinationLocation', newValue || '')
                    }}
                    onInputChange={(event, newInputValue) => {
                      handleInputChange('destinationLocation', newInputValue)
                    }}
                    freeSolo
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Destination City"
                        placeholder="Where do you want to go?"
                        error={!!errors.destinationLocation}
                        helperText={errors.destinationLocation}
                        required
                        size="medium"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            height: '60px',
                            borderRadius: '16px',
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#8b5cf6',
                              borderWidth: '2px',
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#8b5cf6',
                              borderWidth: '2px',
                            },
                          },
                          '& .MuiInputLabel-root': {
                            color: '#6b7280',
                            fontWeight: 500
                          }
                        }}
                      />
                    )}
                    renderOption={(props, option) => (
                      <Box component="li" {...props} sx={{ py: 1.5, px: 2 }} key={option}>
                        {option}
                      </Box>
                    )}
                    sx={{
                      '& .MuiAutocomplete-inputRoot': {
                        paddingTop: 0,
                        paddingBottom: 0,
                        height: '60px',
                      }
                    }}
                  />
                </Box>
              </Box>
            </Box>

            {/* Step 2: Travel Dates */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ 
                mb: 3, 
                color: '#374151',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <Box sx={{ 
                  width: 24, 
                  height: 24, 
                  borderRadius: '50%', 
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '0.875rem',
                  fontWeight: 'bold'
                }}>
                  2
                </Box>
                When do you want to travel?
              </Typography>
              
              <Box sx={{ 
                display: 'flex', 
                gap: 3, 
                flexDirection: { xs: 'column', md: 'row' },
                alignItems: 'flex-end'
              }}>
                {/* Departure Date */}
                <Box sx={{ flex: 1, minWidth: '160px' }}>
                  <DatePicker
                    label="Departure Date"
                    value={formData.startDate}
                    onChange={(newValue) => handleInputChange('startDate', newValue)}
                    minDate={moment()}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.startDate,
                        helperText: errors.startDate || "When do you want to leave?",
                        required: true,
                        size: 'medium',
                        sx: {
                          '& .MuiOutlinedInput-root': {
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            height: '60px',
                            borderRadius: '16px',
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#8b5cf6',
                              borderWidth: '2px',
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#8b5cf6',
                              borderWidth: '2px',
                            },
                          },
                          '& .MuiInputLabel-root': {
                            color: '#6b7280',
                            fontWeight: 500
                          }
                        }
                      }
                    }}
                  />
                </Box>

                {/* Return Date */}
                <Box sx={{ flex: 1, minWidth: '160px' }}>
                  <DatePicker
                    label="Return Date"
                    value={formData.endDate}
                    onChange={(newValue) => handleInputChange('endDate', newValue)}
                    minDate={formData.startDate || moment()}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.endDate,
                        helperText: errors.endDate || "When do you want to come back?",
                        required: true,
                        size: 'medium',
                        sx: {
                          '& .MuiOutlinedInput-root': {
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            height: '60px',
                            borderRadius: '16px',
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#8b5cf6',
                              borderWidth: '2px',
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#8b5cf6',
                              borderWidth: '2px',
                            },
                          },
                          '& .MuiInputLabel-root': {
                            color: '#6b7280',
                            fontWeight: 500
                          }
                        }
                      }
                    }}
                  />
                </Box>
              </Box>
            </Box>

            {/* Step 3: Travel Details */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ 
                mb: 3, 
                color: '#374151',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <Box sx={{ 
                  width: 24, 
                  height: 24, 
                  borderRadius: '50%', 
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '0.875rem',
                  fontWeight: 'bold'
                }}>
                  3
                </Box>
                Tell us about your trip
              </Typography>
              
              <Box sx={{ 
                display: 'flex', 
                gap: 3, 
                flexDirection: { xs: 'column', md: 'row' },
                alignItems: 'flex-end'
              }}>
                {/* Number of People */}
                <Box sx={{ flex: 1, minWidth: '140px' }}>
                  <TextField
                    fullWidth
                    label="Number of Travelers"
                    placeholder="How many people?"
                    value={formData.numberOfPeople}
                    onChange={(e) => handleNumberOfPeopleChange(e.target.value)}
                    error={!!errors.numberOfPeople}
                    helperText={errors.numberOfPeople || "Including yourself"}
                    required
                    size="medium"
                    type="number"
                    inputProps={{ min: 1, max: 20 }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        height: '60px',
                        borderRadius: '16px',
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#8b5cf6',
                          borderWidth: '2px',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#8b5cf6',
                          borderWidth: '2px',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: '#6b7280',
                        fontWeight: 500
                      }
                    }}
                  />
                </Box>

                {/* Budget */}
                <Box sx={{ flex: 1, minWidth: '180px' }}>
                  <TextField
                    fullWidth
                    label="Total Budget"
                    placeholder="What's your budget?"
                    value={formData.budget}
                    onChange={(e) => handleBudgetChange(e.target.value)}
                    error={!!errors.budget}
                    helperText={errors.budget || "For the entire trip"}
                    required
                    size="medium"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start" sx={{ color: '#8b5cf6', fontWeight: 600 }}>
                          ₹
                        </InputAdornment>
                      )
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        height: '60px',
                        borderRadius: '16px',
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#8b5cf6',
                          borderWidth: '2px',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#8b5cf6',
                          borderWidth: '2px',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: '#6b7280',
                        fontWeight: 500
                      }
                    }}
                  />
                </Box>
              </Box>
            </Box>

            {/* Step 4: Interests */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ 
                mb: 3, 
                color: '#374151',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <Box sx={{ 
                  width: 24, 
                  height: 24, 
                  borderRadius: '50%', 
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '0.875rem',
                  fontWeight: 'bold'
                }}>
                  4
                </Box>
                What are you interested in?
              </Typography>
              
              <FormControl error={!!errors.interests} required fullWidth>
                <FormLabel component="legend" sx={{ 
                  mb: 1, 
                  fontSize: '1rem', 
                  color: '#6b7280',
                  fontWeight: 500
                }}>
                  Select your interests (choose multiple)
                </FormLabel>
                <Autocomplete
                  multiple
                  options={interestOptions}
                  value={formData.interests}
                  onChange={handleInterestsChange}
                  disableCloseOnSelect
                  getOptionLabel={(option) => option.value.charAt(0).toUpperCase() + option.value.slice(1)}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  renderOption={(props, option, { selected }) => {
                    return (
                    <li {...props} key={`${option.id}-${option.value}`}>
                      <Checkbox
                        style={{ marginRight: 8 }}
                        checked={selected}
                        sx={{
                          color: '#8b5cf6',
                          '&.Mui-checked': {
                            color: '#8b5cf6',
                          },
                          '&.MuiCheckbox-root': {
                            '&:hover': {
                              backgroundColor: 'rgba(139, 92, 246, 0.1)',
                            },
                          },
                        }}
                      />
                      <ListItemText primary={option.value.charAt(0).toUpperCase() + option.value.slice(1)} />
                    </li>
                  )}}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        {...getTagProps({ index })}
                        key={`${option.id}-${option.value}`}
                        label={option.value.charAt(0).toUpperCase() + option.value.slice(1)}
                        variant="filled"
                        size="small"
                        sx={{
                          background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                          color: 'white',
                          fontWeight: 600,
                          fontSize: '0.875rem',
                          height: '32px',
                          borderRadius: '16px',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #7c3aed 0%, #db2777 100%)',
                            transform: 'scale(1.05)',
                            boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
                          },
                          '& .MuiChip-deleteIcon': {
                            color: 'white',
                            '&:hover': {
                              color: 'rgba(255, 255, 255, 0.8)',
                            },
                          },
                          transition: 'all 0.3s ease',
                        }}
                      />
                    ))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Choose activities you enjoy..."
                      error={!!errors.interests}
                      helperText={errors.interests || "This helps us personalize your itinerary"}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          borderRadius: '16px',
                          minHeight: '60px',
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#8b5cf6',
                            borderWidth: '2px',
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#8b5cf6',
                            borderWidth: '2px',
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: '#6b7280',
                          fontWeight: 500
                        }
                      }}
                    />
                  )}
                  sx={{
                    '& .MuiAutocomplete-inputRoot': {
                      paddingTop: 1,
                      paddingBottom: 1,
                    }
                  }}
                />
              </FormControl>
            </Box>

            {/* Submit Button */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center',
            }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={adkApiMutation.isPending}
                sx={{ 
                  minWidth: '150px',
                  height: '64px',
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  borderRadius: '50px',
                  px: 4,
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                  boxShadow: '0 12px 30px -5px rgba(139, 92, 246, 0.4)',
                  textTransform: 'none',
                  position: 'relative',
                  overflow: 'hidden',
                  willChange: 'transform, box-shadow',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #7c3aed 0%, #db2777 100%)',
                    boxShadow: '0 18px 40px -5px rgba(139, 92, 246, 0.6)',
                    transform: 'translateY(-3px)',
                  },
                  '&:disabled': {
                    background: 'rgba(0, 0, 0, 0.12)',
                    color: 'rgba(0, 0, 0, 0.26)',
                    boxShadow: 'none',
                    transform: 'none',
                  },
                }}
              >
                <span className="flex items-center justify-center">
                  <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  {adkApiMutation.isPending ? 'Creating Your Itinerary...' : 'Start Planning Now'}
                </span>
              </Button>
            </Box>
          </Box>
          </Paper>
        </Box>
        
        {/* Notification Snackbar */}
        <Snackbar
          open={notification.open}
          autoHideDuration={6000}
          onClose={handleCloseNotification}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert
            onClose={handleCloseNotification}
            severity={notification.severity}
            sx={{ width: '100%' }}
          >
            {notification.message}
          </Alert>
        </Snackbar>

        {/* Itinerary Popup */}
        <ItineraryPopup
          open={showItineraryPopup}
          onClose={handleCloseItineraryPopup}
          isLoading={adkApiMutation.isPending}
          itineraryData={itineraryData}
          error={itineraryError || undefined}
          isReadOnly={false}
          onSaveItinerary={handleSaveItinerary}
        />
      </div>
    </LocalizationProvider>
  )
}

export default TravelBookingForm
