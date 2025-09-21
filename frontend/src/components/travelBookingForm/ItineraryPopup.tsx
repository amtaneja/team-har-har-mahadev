'use client'
import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  Box,
  IconButton,
  Typography,
  CircularProgress,
  Fade,
  useTheme,
  Tabs,
  Tab,
  Chip,
  Card,
  CardContent,
  Grid,
  Divider,
} from '@mui/material'
import { Close, FlightTakeoff, Hotel, Restaurant, Attractions, WbSunny, Cloud, Article, Flight, LocalDining, Star, Place, LocalHotel, RestaurantMenu, DirectionsWalk, Save, BookmarkAdd, CalendarToday, AccessTime, LocationOn, Thermostat, Newspaper, Event, Schedule } from '@mui/icons-material'
import { styled } from '@mui/material/styles'

// Custom Rupee Icon Component
const RupeeIcon = ({ sx, ...props }: any) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '16px',
      fontWeight: 'bold',
      color: '#059669',
      ...sx
    }}
    {...props}
  >
    ₹
  </Box>
)

interface ItineraryItem {
  day: number
  date: string
  activities: {
    time: string
    title: string
    description: string
    type: 'flight' | 'hotel' | 'restaurant' | 'attraction'
    location?: string
  }[]
}

interface ItineraryData {
  destination: string
  duration: string
  totalCost?: string
  itinerary: ItineraryItem[] | string | any[] | { parts: any[] } // Can be structured data, raw markdown text, or parts array
  summary?: string
}

interface ItineraryPopupProps {
  open: boolean
  onClose: () => void
  isLoading: boolean
  itineraryData?: ItineraryData
  error?: string
  isReadOnly?: boolean
  onSaveItinerary?: (itineraryData: ItineraryData) => void
}

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    margin: 0,
    maxHeight: '100vh',
    maxWidth: '100vw',
    width: '100%',
    height: '100%',
    borderRadius: 0,
    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    overflow: 'hidden', // Prevent scrolling on the dialog itself
  },
}))

const LoadingContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: 'calc(100vh - 80px)', // Full height minus header
  marginTop: '80px', // Space for fixed header
  gap: theme.spacing(3),
}))

const LoadingText = styled(Typography)(({ theme }) => ({
  fontSize: '1.5rem',
  fontWeight: 600,
  color: theme.palette.text.primary,
  textAlign: 'center',
  background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
}))

const SaveButton = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '8px 16px',
  background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)',
  backdropFilter: 'blur(15px)',
  WebkitBackdropFilter: 'blur(15px)',
  border: '1px solid rgba(34, 197, 94, 0.2)',
  borderRadius: '12px',
  cursor: 'pointer',
  marginRight: '12px',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(16, 185, 129, 0.2) 100%)',
    transform: 'scale(1.05)',
    boxShadow: '0 8px 25px rgba(34, 197, 94, 0.3)',
  },
}))

const BookmarkButton = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '8px 16px',
  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)',
  backdropFilter: 'blur(15px)',
  WebkitBackdropFilter: 'blur(15px)',
  border: '1px solid rgba(139, 92, 246, 0.2)',
  borderRadius: '12px',
  cursor: 'pointer',
  marginRight: '12px',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(236, 72, 153, 0.2) 100%)',
    transform: 'scale(1.05)',
    boxShadow: '0 8px 25px rgba(139, 92, 246, 0.3)',
  },
}))

const SaveButtonText = styled(Typography)(({ theme }) => ({
  fontSize: '14px',
  fontWeight: 600,
  color: '#10b981',
  whiteSpace: 'nowrap',
}))

const BookmarkButtonText = styled(Typography)(({ theme }) => ({
  fontSize: '14px',
  fontWeight: 600,
  color: '#8b5cf6',
  whiteSpace: 'nowrap',
}))

const CloseButton = styled(IconButton)(({ theme }) => ({
  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)',
  backdropFilter: 'blur(15px)',
  WebkitBackdropFilter: 'blur(15px)',
  border: '1px solid rgba(139, 92, 246, 0.2)',
  color: '#8b5cf6',
  width: 44,
  height: 44,
  '&:hover': {
    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(236, 72, 153, 0.2) 100%)',
    transform: 'scale(1.05)',
    boxShadow: '0 8px 25px rgba(139, 92, 246, 0.3)',
  },
  transition: 'all 0.3s ease',
}))

const DialogContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  height: '100vh',
  overflow: 'hidden',
}))

const FixedHeader = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  zIndex: 1000,
  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  borderBottom: '1px solid rgba(139, 92, 246, 0.15)',
  padding: theme.spacing(2, 3),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  boxShadow: '0 4px 20px rgba(139, 92, 246, 0.1)',
  height: '80px',
}))

const HeaderTitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.5rem',
  fontWeight: 700,
  background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
}))

const ContentContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  paddingTop: '100px', // Space for fixed header
  maxWidth: '1400px',
  margin: '0 auto',
  height: 'calc(100vh - 80px)', // Full height minus header
  overflowY: 'auto', // Enable scrolling on content only
  overflowX: 'hidden',
  // Custom scrollbar styling
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: 'rgba(139, 92, 246, 0.1)',
    borderRadius: '4px',
  },
  '&::-webkit-scrollbar-thumb': {
    background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
    borderRadius: '4px',
    '&:hover': {
      background: 'linear-gradient(135deg, #7c3aed 0%, #db2777 100%)',
    },
  },
}))

const HeaderSection = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  marginBottom: theme.spacing(4),
  padding: theme.spacing(4),
  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.9) 100%)',
  borderRadius: '20px',
  border: '1px solid rgba(139, 92, 246, 0.15)',
  boxShadow: '0 20px 40px rgba(139, 92, 246, 0.1), 0 8px 16px rgba(0, 0, 0, 0.05)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
}))

const DataSection = styled(Box)(({ theme }) => ({
  margin: '24px 0',
  padding: '20px',
  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)',
  borderRadius: '16px',
  border: '1px solid rgba(139, 92, 246, 0.15)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  boxShadow: '0 10px 30px rgba(139, 92, 246, 0.08), 0 4px 12px rgba(0, 0, 0, 0.05)',
}))

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: '18px',
  fontWeight: 600,
  marginBottom: '16px',
  background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
}))

const TabContainer = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)',
  borderRadius: '16px',
  border: '1px solid rgba(139, 92, 246, 0.15)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  marginBottom: '24px',
  overflow: 'hidden',
}))

const StyledTabs = styled(Tabs)(({ theme }) => ({
  '& .MuiTab-root': {
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '14px',
    minHeight: '48px',
    color: '#6b7280',
    '&.Mui-selected': {
      color: '#8b5cf6',
    },
  },
  '& .MuiTabs-indicator': {
    background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
    height: '3px',
    borderRadius: '2px',
  },
}))

const DayCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.98) 100%)',
  borderRadius: '24px',
  border: '1px solid rgba(139, 92, 246, 0.2)',
  boxShadow: '0 20px 60px rgba(139, 92, 246, 0.1), 0 8px 25px rgba(0, 0, 0, 0.06)',
  backdropFilter: 'blur(25px)',
  WebkitBackdropFilter: 'blur(25px)',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  marginBottom: '32px',
  overflow: 'hidden',
  position: 'relative',
  '&:hover': {
    transform: 'translateY(-4px) scale(1.01)',
    boxShadow: '0 25px 80px rgba(139, 92, 246, 0.15), 0 12px 35px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(139, 92, 246, 0.3)',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 50%, #f59e0b 100%)',
    borderRadius: '24px 24px 0 0',
  },
}))

const InfoCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.9) 100%)',
  borderRadius: '16px',
  border: '1px solid rgba(139, 92, 246, 0.12)',
  boxShadow: '0 8px 25px rgba(139, 92, 246, 0.06), 0 4px 10px rgba(0, 0, 0, 0.04)',
  backdropFilter: 'blur(15px)',
  WebkitBackdropFilter: 'blur(15px)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-1px)',
    boxShadow: '0 12px 35px rgba(139, 92, 246, 0.1), 0 6px 15px rgba(0, 0, 0, 0.06)',
  },
}))

const BudgetChip = styled(Chip)(({ theme }) => ({
  background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)',
  color: '#059669',
  border: '1px solid rgba(34, 197, 94, 0.2)',
  fontWeight: 600,
  fontSize: '14px',
  height: '32px',
  borderRadius: '16px',
  '& .MuiChip-icon': {
    color: '#059669',
  },
}))

const DayNumberBadge = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '56px',
  height: '56px',
  borderRadius: '50%',
  background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
  color: 'white',
  fontWeight: 700,
  fontSize: '20px',
  boxShadow: '0 8px 25px rgba(139, 92, 246, 0.3)',
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    inset: '-2px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
    zIndex: -1,
    opacity: 0.3,
    filter: 'blur(8px)',
  },
}))

const ActivityItem = styled(Box)(({ theme }) => ({
  padding: '16px',
  margin: '12px 0',
  background: 'rgba(248, 250, 252, 0.8)',
  borderRadius: '12px',
  border: '1px solid rgba(139, 92, 246, 0.1)',
  transition: 'all 0.2s ease',
  '&:hover': {
    background: 'rgba(139, 92, 246, 0.05)',
    border: '1px solid rgba(139, 92, 246, 0.2)',
  },
}))

const HotelItem = styled(Box)(({ theme }) => ({
  padding: '16px',
  margin: '12px 0',
  background: 'rgba(248, 250, 252, 0.8)',
  borderRadius: '12px',
  border: '1px solid rgba(236, 72, 153, 0.1)',
  transition: 'all 0.2s ease',
  '&:hover': {
    background: 'rgba(236, 72, 153, 0.05)',
    border: '1px solid rgba(236, 72, 153, 0.2)',
  },
}))

const RestaurantItem = styled(Box)(({ theme }) => ({
  padding: '16px',
  margin: '12px 0',
  background: 'rgba(248, 250, 252, 0.8)',
  borderRadius: '12px',
  border: '1px solid rgba(245, 158, 11, 0.1)',
  transition: 'all 0.2s ease',
  '&:hover': {
    background: 'rgba(245, 158, 11, 0.05)',
    border: '1px solid rgba(245, 158, 11, 0.2)',
  },
}))

const WeatherItem = styled(Box)(({ theme }) => ({
  padding: '16px',
  margin: '12px 0',
  background: 'rgba(248, 250, 252, 0.8)',
  borderRadius: '12px',
  border: '1px solid rgba(59, 130, 246, 0.1)',
  transition: 'all 0.2s ease',
  '&:hover': {
    background: 'rgba(59, 130, 246, 0.05)',
    border: '1px solid rgba(59, 130, 246, 0.2)',
  },
}))

const SectionHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  marginBottom: '20px',
  padding: '12px 16px',
  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(236, 72, 153, 0.05) 100%)',
  borderRadius: '12px',
  border: '1px solid rgba(139, 92, 246, 0.1)',
}))


const VerticalListContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  gap: '16px',
  marginTop: '16px',
}))


const NewsCard = styled(Box)(({ theme }) => ({
  width: '100%',
  padding: '20px',
  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(147, 51, 234, 0.08) 100%)',
  borderRadius: '16px',
  border: '1px solid rgba(59, 130, 246, 0.15)',
  boxShadow: '0 4px 20px rgba(59, 130, 246, 0.1)',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 30px rgba(59, 130, 246, 0.2)',
    border: '1px solid rgba(59, 130, 246, 0.3)',
  },
}))

const WeatherCard = styled(Box)(({ theme }) => ({
  width: '100%',
  padding: '24px',
  background: 'rgba(255, 255, 255, 0.9)',
  borderRadius: '16px',
  border: '1px solid rgba(59, 130, 246, 0.15)',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
  transition: 'all 0.2s ease',
  '&:hover': {
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(59, 130, 246, 0.25)',
  },
}))



const NewsItem = styled(Box)(({ theme }) => ({
  padding: '12px',
  margin: '8px 0',
  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%)',
  borderRadius: '10px',
  border: '1px solid rgba(59, 130, 246, 0.2)',
  fontSize: '13px',
  lineHeight: 1.4,
  color: theme.palette.mode === 'dark' ? '#d1d5db' : '#4b5563',
}))


const getActivityIcon = (type: string) => {
  switch (type) {
    case 'flight':
      return <FlightTakeoff sx={{ color: '#8b5cf6' }} />
    case 'hotel':
      return <Hotel sx={{ color: '#ec4899' }} />
    case 'restaurant':
      return <Restaurant sx={{ color: '#f59e0b' }} />
    case 'attraction':
      return <Attractions sx={{ color: '#10b981' }} />
    default:
      return <Attractions sx={{ color: '#8b5cf6' }} />
  }
}

// Helper function to get relevant icon for activity content
const getActivityContentIcon = (content: string) => {
  const lowerContent = content.toLowerCase();
  if (lowerContent.includes('gate') || lowerContent.includes('monument') || lowerContent.includes('tomb')) {
    return <Attractions sx={{ color: '#8b5cf6', fontSize: '20px' }} />;
  }
  if (lowerContent.includes('place') || lowerContent.includes('market') || lowerContent.includes('chowk')) {
    return <Place sx={{ color: '#10b981', fontSize: '20px' }} />;
  }
  if (lowerContent.includes('village') || lowerContent.includes('park') || lowerContent.includes('garden')) {
    return <DirectionsWalk sx={{ color: '#f59e0b', fontSize: '20px' }} />;
  }
  return <Attractions sx={{ color: '#8b5cf6', fontSize: '20px' }} />;
}

// Helper function to get relevant icon for hotel content
const getHotelContentIcon = (content: string) => {
  const lowerContent = content.toLowerCase();
  if (lowerContent.includes('palace') || lowerContent.includes('imperial') || lowerContent.includes('taj')) {
    return <Star sx={{ color: '#f59e0b', fontSize: '20px' }} />;
  }
  if (lowerContent.includes('holiday') || lowerContent.includes('inn') || lowerContent.includes('express')) {
    return <LocalHotel sx={{ color: '#3b82f6', fontSize: '20px' }} />;
  }
  return <Hotel sx={{ color: '#ec4899', fontSize: '20px' }} />;
}

// Helper function to get relevant icon for restaurant content
const getRestaurantContentIcon = (content: string) => {
  const lowerContent = content.toLowerCase();
  if (lowerContent.includes('accent') || lowerContent.includes('fine') || lowerContent.includes('premium')) {
    return <Star sx={{ color: '#f59e0b', fontSize: '20px' }} />;
  }
  if (lowerContent.includes('cafe') || lowerContent.includes('coffee') || lowerContent.includes('bar')) {
    return <RestaurantMenu sx={{ color: '#8b5cf6', fontSize: '20px' }} />;
  }
  return <LocalDining sx={{ color: '#10b981', fontSize: '20px' }} />;
}

// Helper function to get relevant icon for flight content
const getFlightContentIcon = (content: string) => {
  const lowerContent = content.toLowerCase();
  if (lowerContent.includes('air india') || lowerContent.includes('vistara')) {
    return <Flight sx={{ color: '#3b82f6', fontSize: '20px' }} />;
  }
  if (lowerContent.includes('indigo') || lowerContent.includes('spicejet')) {
    return <FlightTakeoff sx={{ color: '#10b981', fontSize: '20px' }} />;
  }
  return <Flight sx={{ color: '#8b5cf6', fontSize: '20px' }} />;
}

// Helper function to get weather icon based on weather condition
const getWeatherIcon = (weatherText: string) => {
  const lowerText = weatherText.toLowerCase();
  if (lowerText.includes('sunny') || lowerText.includes('clear')) {
    return <WbSunny sx={{ color: '#f59e0b', fontSize: '24px' }} />;
  }
  if (lowerText.includes('cloud') || lowerText.includes('overcast')) {
    return <Cloud sx={{ color: '#6b7280', fontSize: '24px' }} />;
  }
  if (lowerText.includes('rain') || lowerText.includes('drizzle') || lowerText.includes('shower')) {
    return <Cloud sx={{ color: '#3b82f6', fontSize: '24px' }} />;
  }
  if (lowerText.includes('storm') || lowerText.includes('thunder')) {
    return <Cloud sx={{ color: '#7c3aed', fontSize: '24px' }} />;
  }
  if (lowerText.includes('snow') || lowerText.includes('cold')) {
    return <Cloud sx={{ color: '#e5e7eb', fontSize: '24px' }} />;
  }
  return <WbSunny sx={{ color: '#f59e0b', fontSize: '24px' }} />;
}

// Helper function to extract temperature from weather text
const extractTemperature = (weatherText: string) => {
  const tempMatch = weatherText.match(/(\d+)\s*°?[CF]/i);
  return tempMatch ? tempMatch[1] : null;
}

// Helper function to parse JSON from markdown text
const parseItineraryData = (textContent: string) => {
  try {
    // First try to extract JSON from markdown code blocks
    const jsonMatch = textContent.match(/```json\n([\s\S]*?)\n```/);
    if (jsonMatch) {
      const jsonString = jsonMatch[1];
      return JSON.parse(jsonString);
    }
    
    // If no markdown blocks, try to find JSON object directly
    const jsonObjectMatch = textContent.match(/\{[\s\S]*\}/);
    if (jsonObjectMatch) {
      const jsonString = jsonObjectMatch[0];
      return JSON.parse(jsonString);
    }
    
    return null;
  } catch (error) {
    console.error('Error parsing itinerary JSON:', error);
    return null;
  }
}

// Helper function to extract JSON from parts array
const extractJsonFromParts = (parts: any[]) => {
  if (!parts || !Array.isArray(parts)) return null;
  
  // Join all text parts and look for JSON
  const fullText = parts.map(part => part.text || '').join('\n');
  return parseItineraryData(fullText);
}

// Helper function to clean text by removing reference numbers
const cleanText = (text: any) => {
  if (typeof text !== 'string') {
    return String(text || '');
  }
  return text.replace(/\s*\[.*?\]\.?$/, '').trim();
}

// Helper function to convert parsed data to structured itinerary
const convertToStructuredItinerary = (parsedData: any, destination: string, duration: string) => {
  if (!parsedData) return parsedData; // Return the raw data if it's not structured

  // If it's already structured data, return as-is
  if (Array.isArray(parsedData)) return parsedData;

  // Return the raw parsed data for custom UI rendering
  return parsedData;
}

// Array of dynamic loading messages
const loadingMessages = [
  {
    title: "Preparing Your Itinerary...",
    subtitle: "Our AI is crafting the perfect travel experience for you"
  },
  {
    title: "Finding the Best Flights...",
    subtitle: "Searching for optimal routes and best rates"
  },
  {
    title: "Discovering Amazing Hotels...",
    subtitle: "Curating the perfect accommodations for your stay"
  },
  {
    title: "Exploring Local Attractions...",
    subtitle: "Uncovering hidden gems and must-see destinations"
  },
  {
    title: "Selecting Top Restaurants...",
    subtitle: "Finding the best local cuisine and dining experiences"
  },
  {
    title: "Checking Weather Forecasts...",
    subtitle: "Ensuring you're prepared for the perfect weather"
  },
  {
    title: "Gathering Local Insights...",
    subtitle: "Collecting the latest news and travel tips"
  },
  {
    title: "Optimizing Your Schedule...",
    subtitle: "Creating the most efficient and enjoyable timeline"
  },
  {
    title: "Calculating Budget Options...",
    subtitle: "Finding the best value for your travel investment in rupees"
  },
  {
    title: "Finalizing Your Adventure...",
    subtitle: "Putting the finishing touches on your perfect trip"
  }
]

const ItineraryPopup: React.FC<ItineraryPopupProps> = ({
  open,
  onClose,
  isLoading,
  itineraryData,
  error,
  isReadOnly = false,
  onSaveItinerary,
}) => {
  const theme = useTheme()
  const [activeTab, setActiveTab] = useState(0)
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0)

  // Cycle through loading messages when loading
  useEffect(() => {
    if (!isLoading) {
      setCurrentMessageIndex(0)
      return
    }

    const interval = setInterval(() => {
      setCurrentMessageIndex((prevIndex) => 
        (prevIndex + 1) % loadingMessages.length
      )
    }, 2000) // Change message every 2 seconds

    return () => clearInterval(interval)
  }, [isLoading])

  // Handle save itinerary
  const handleSaveItinerary = () => {
    if (!itineraryData) return
    
    if (onSaveItinerary) {
      // Use the callback to save to store
      onSaveItinerary(itineraryData)
    } else {
      // Fallback to file download
      try {
        const dataStr = JSON.stringify(itineraryData, null, 2)
        const dataBlob = new Blob([dataStr], { type: 'application/json' })
        const url = URL.createObjectURL(dataBlob)
        
        const link = document.createElement('a')
        link.href = url
        link.download = `${itineraryData.destination.replace(/\s+/g, '_')}_itinerary.json`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
        
        console.log('Itinerary saved successfully!')
      } catch (error) {
        console.error('Error saving itinerary:', error)
      }
    }
  }

  // Process the itinerary data
  const processedItinerary = React.useMemo(() => {
    if (!itineraryData?.itinerary) return null;
    
    let parsedData = null;
    
    if (typeof itineraryData.itinerary === 'string') {
      // Handle string format
      parsedData = parseItineraryData(itineraryData.itinerary);
    } else if (Array.isArray(itineraryData.itinerary)) {
      // Handle parts array format
      parsedData = extractJsonFromParts(itineraryData.itinerary);
    } else if (itineraryData.itinerary.parts && Array.isArray(itineraryData.itinerary.parts)) {
      // Handle nested parts structure
      parsedData = extractJsonFromParts(itineraryData.itinerary.parts);
    }
    
    if (parsedData) {
      console.log('Parsed JSON data:', parsedData);
      // Convert to structured format
      return convertToStructuredItinerary(parsedData, itineraryData.destination, itineraryData.duration);
    }
    
    // If it's already structured data, return as-is
    return Array.isArray(itineraryData.itinerary) ? itineraryData.itinerary : null;
  }, [itineraryData]);

   console.log('itineraryData', processedItinerary)

  // Helper function to render flight data
  const renderFlightData = (flights: any[]) => {
    return (
      <Box sx={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px',
        padding: '8px 0',
      }}>
        {flights.map((flight, index) => (
          <InfoCard key={index}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Flight sx={{ color: '#3b82f6' }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1f2937' }}>
                  {flight.flight_number || 'Flight'}
                </Typography>
                {flight.provider && (
                  <Chip
                    label={flight.provider}
                    size="small"
                    sx={{
                      backgroundColor: 'rgba(59, 130, 246, 0.1)',
                      color: '#3b82f6',
                      fontWeight: 600,
                      fontSize: '12px',
                      height: '24px',
                      '& .MuiChip-label': {
                        px: 1.5,
                      },
                    }}
                  />
                )}
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {flight.flight_date && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarToday sx={{ fontSize: '16px', color: '#6b7280' }} />
                    <Typography variant="body2" color="text.secondary">
                      {new Date(flight.flight_date).toLocaleDateString('en-IN', { 
                        weekday: 'short', 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </Typography>
                  </Box>
                )}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AccessTime sx={{ fontSize: '16px', color: '#6b7280' }} />
                  <Typography variant="body2" color="text.secondary">
                    {flight.flight_time} • {flight.flight_duration}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationOn sx={{ fontSize: '16px', color: '#6b7280' }} />
                  <Typography variant="body2" color="text.secondary">
                    {flight.flight_from} → {flight.flight_to}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <RupeeIcon />
                  <Typography variant="body2" sx={{ color: '#059669', fontWeight: 600 }}>
                    {flight.flight_price}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </InfoCard>
        ))}
      </Box>
    );
  };

  // Helper function to render hotel data
  const renderHotelData = (hotels: any[]) => {
    return (
      <Box sx={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px',
        padding: '8px 0',
      }}>
        {hotels.map((hotel, index) => (
          <InfoCard key={index}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Hotel sx={{ color: '#ec4899' }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1f2937' }}>
                  {hotel.hotel_name}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {hotel.hotel_rating && hotel.hotel_rating !== 'N/A' && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Star sx={{ fontSize: '16px', color: '#f59e0b' }} />
                    <Typography variant="body2" color="text.secondary">
                      Rating: {hotel.hotel_rating}
                    </Typography>
                  </Box>
                )}
                {hotel.hotel_price && hotel.hotel_price !== 'N/A' && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <RupeeIcon />
                    <Typography variant="body2" sx={{ color: '#059669', fontWeight: 600 }}>
                      {hotel.hotel_price}
                    </Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </InfoCard>
        ))}
      </Box>
    );
  };

  // Helper function to render restaurant data
  const renderRestaurantData = (restaurants: any[]) => {
    return (
      <Box sx={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px',
        padding: '8px 0',
      }}>
        {restaurants.map((restaurant, index) => (
          <InfoCard key={index}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Restaurant sx={{ color: '#f59e0b' }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1f2937' }}>
                  {restaurant.restaurant_name}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {restaurant.restaurant_rating && restaurant.restaurant_rating !== 'N/A' && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Star sx={{ fontSize: '16px', color: '#f59e0b' }} />
                    <Typography variant="body2" color="text.secondary">
                      Rating: {restaurant.restaurant_rating}
                    </Typography>
                  </Box>
                )}
                {restaurant.restaurant_price && restaurant.restaurant_price !== 'N/A' && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <RupeeIcon />
                    <Typography variant="body2" sx={{ color: '#059669', fontWeight: 600 }}>
                      {restaurant.restaurant_price}
                    </Typography>
                  </Box>
                )}
                {restaurant.restaurant_from && restaurant.restaurant_from !== 'N/A' && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationOn sx={{ fontSize: '16px', color: '#6b7280' }} />
                    <Typography variant="body2" color="text.secondary">
                      {restaurant.restaurant_from}
                    </Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </InfoCard>
        ))}
      </Box>
    );
  };

  // Helper function to render activity data
  const renderActivityData = (activities: any[]) => {
    return (
      <Box sx={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px',
        padding: '8px 0',
      }}>
        {activities.map((activity, index) => (
          <InfoCard key={index}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Attractions sx={{ color: '#8b5cf6' }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1f2937' }}>
                  {activity.activity_name}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {activity.activity_rating && activity.activity_rating !== 'N/A' && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Star sx={{ fontSize: '16px', color: '#f59e0b' }} />
                    <Typography variant="body2" color="text.secondary">
                      Rating: {activity.activity_rating}
                    </Typography>
                  </Box>
                )}
                {activity.activity_price && activity.activity_price !== 'N/A' && activity.activity_price !== 'None' && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <RupeeIcon />
                    <Typography variant="body2" sx={{ color: '#059669', fontWeight: 600 }}>
                      {activity.activity_price}
                    </Typography>
                  </Box>
                )}
                {activity.activity_time && activity.activity_time !== 'N/A' && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AccessTime sx={{ fontSize: '16px', color: '#6b7280' }} />
                    <Typography variant="body2" color="text.secondary">
                      Duration: {activity.activity_time}
                    </Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </InfoCard>
        ))}
      </Box>
    );
  };

  if (isLoading) {
    return (
      <StyledDialog open={open} onClose={onClose} fullScreen>
        <DialogContainer>
          <FixedHeader>
            <HeaderTitle>Travel Itinerary</HeaderTitle>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CloseButton onClick={onClose} size="large">
                <Close />
              </CloseButton>
            </Box>
          </FixedHeader>
          <LoadingContainer>
            <CircularProgress 
              size={80} 
              sx={{ 
                color: '#8b5cf6',
                '& .MuiCircularProgress-circle': {
                  strokeLinecap: 'round',
                }
              }} 
            />
            <Fade in key={currentMessageIndex} timeout={500}>
              <Box sx={{ textAlign: 'center' }}>
                <LoadingText>
                  {loadingMessages[currentMessageIndex].title}
                </LoadingText>
                <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ 
                  maxWidth: '400px',
                  lineHeight: 1.6,
                  fontSize: '1.1rem'
                }}>
                  {loadingMessages[currentMessageIndex].subtitle}
                </Typography>
              </Box>
            </Fade>
          </LoadingContainer>
        </DialogContainer>
      </StyledDialog>
    )
  }

  if (error) {
    return (
      <StyledDialog open={open} onClose={onClose} fullScreen>
        <DialogContainer>
          <FixedHeader>
            <HeaderTitle>Travel Itinerary</HeaderTitle>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CloseButton onClick={onClose} size="large">
                <Close />
              </CloseButton>
            </Box>
          </FixedHeader>
          <LoadingContainer>
            <Typography variant="h4" color="error" gutterBottom>
              Oops! Something went wrong
            </Typography>
            <Typography variant="body1" color="text.secondary" textAlign="center">
              {error}
            </Typography>
          </LoadingContainer>
        </DialogContainer>
      </StyledDialog>
    )
  }

  if (!itineraryData) {
    return null
  }

  return (
    <StyledDialog open={open} onClose={onClose} fullScreen>
      <DialogContainer>
        <FixedHeader>
          <HeaderTitle>
            {isReadOnly ? 'Saved' : 'Your'} {itineraryData.destination} Itinerary
          </HeaderTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {!isReadOnly && (
              <BookmarkButton onClick={handleSaveItinerary} title="Save to My Itineraries">
                <BookmarkAdd sx={{ fontSize: '20px' }} />
                <BookmarkButtonText>Save to My Itineraries</BookmarkButtonText>
              </BookmarkButton>
            )}
            <CloseButton onClick={onClose} size="large">
              <Close />
            </CloseButton>
          </Box>
        </FixedHeader>
        
        <ContentContainer>
          <Fade in timeout={800}>
            <Box sx={{ paddingBottom: 4 }}>
              {/* Header */}
              <HeaderSection>
                <Typography variant="h4" gutterBottom sx={{ 
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: 700,
                }}>
                  {itineraryData.destination} Adventure
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  {itineraryData.duration} • {itineraryData.totalCost && `Budget: Rs ${itineraryData.totalCost}`}
                </Typography>
                {itineraryData.summary && (
                  <Typography variant="body1" sx={{ mt: 2, fontStyle: 'italic' }}>
                    {itineraryData.summary}
                  </Typography>
                )}
              </HeaderSection>

              {/* Itinerary Content */}
              {processedItinerary && Array.isArray(processedItinerary) ? (
                processedItinerary.map((day, index) => (
                  <Box key={index} sx={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)',
                    borderRadius: '16px',
                    padding: 3,
                    marginBottom: 3,
                    border: '1px solid rgba(139, 92, 246, 0.12)',
                    boxShadow: '0 10px 30px rgba(139, 92, 246, 0.08), 0 4px 12px rgba(0, 0, 0, 0.05)',
                    backdropFilter: 'blur(15px)',
                    WebkitBackdropFilter: 'blur(15px)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 15px 40px rgba(139, 92, 246, 0.12), 0 8px 20px rgba(0, 0, 0, 0.08)',
                    },
                  }}>
                    <Typography variant="h5" gutterBottom sx={{ 
                      color: '#8b5cf6',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}>
                      Day {day.day}
                      <Typography variant="body2" color="text.secondary">
                        {day.date}
                      </Typography>
                    </Typography>
                    
                    {day.activities.map((activity: any, activityIndex: number) => (
                      <Box key={activityIndex} sx={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 2,
                        padding: 2,
                        marginBottom: 2,
                        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.03) 0%, rgba(236, 72, 153, 0.03) 100%)',
                        borderRadius: '12px',
                        border: '1px solid rgba(139, 92, 246, 0.08)',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.06) 0%, rgba(236, 72, 153, 0.06) 100%)',
                          border: '1px solid rgba(139, 92, 246, 0.15)',
                        },
                      }}>
                        <Box sx={{ 
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          background: 'rgba(139, 92, 246, 0.1)',
                        }}>
                          {getActivityIcon(activity.type)}
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                              {activity.time}
                            </Typography>
                            {activity.location && (
                              <Typography variant="body2" color="text.secondary">
                                • {activity.location}
                              </Typography>
                            )}
                          </Box>
                          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                            {activity.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {activity.description}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                ))
              ) : processedItinerary && typeof processedItinerary === 'object' && !Array.isArray(processedItinerary) ? (
                // Display structured data from API with new layout
                <Box>
                  {/* Tab Navigation */}
                  <TabContainer>
                    <StyledTabs
                      value={activeTab}
                      onChange={(e, newValue) => setActiveTab(newValue)}
                      variant="scrollable"
                      scrollButtons="auto"
                    >
                      <Tab icon={<Schedule />} label="Day-wise Itinerary" />
                      <Tab icon={<Flight />} label="Flights" />
                      <Tab icon={<Hotel />} label="Hotels" />
                      <Tab icon={<Restaurant />} label="Restaurants" />
                      <Tab icon={<Attractions />} label="Activities" />
                      <Tab icon={<WbSunny />} label="Weather" />
                      <Tab icon={<Newspaper />} label="News" />
                    </StyledTabs>
                  </TabContainer>

                  {/* Tab Content */}
                  {activeTab === 0 && processedItinerary.day_wise_itinerary && (
                    <Box>
                      <SectionTitle>
                        <CalendarToday />
                        Day-wise Itinerary
                      </SectionTitle>
                      {processedItinerary.day_wise_itinerary.map((day: any, index: number) => (
                        <DayCard key={index}>
                          <CardContent sx={{ padding: '32px' }}>
                            {/* Day Header */}
                            <Box sx={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'space-between', 
                              mb: 4,
                              padding: '20px',
                              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.03) 0%, rgba(236, 72, 153, 0.03) 100%)',
                              borderRadius: '16px',
                              border: '1px solid rgba(139, 92, 246, 0.1)',
                            }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                                <DayNumberBadge>
                                  {day.day_number}
                                </DayNumberBadge>
                                <Box>
                                  <Typography variant="h4" sx={{ 
                                    fontWeight: 700, 
                                    color: '#1f2937',
                                    background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    mb: 0.5,
                                  }}>
                                    {day.day_number} - {day.day_name}
                                  </Typography>
                                  <Typography variant="body1" sx={{ 
                                    color: '#6b7280',
                                    fontWeight: 500,
                                    fontSize: '16px',
                                  }}>
                                    {day.day_activities && day.day_activities.length > 0 && typeof day.day_activities[0] === 'string' && day.day_activities[0].includes('2025-09-24') ? 'September 24-27, 2025' : 'Your travel dates'}
                                  </Typography>
                                </Box>
                              </Box>
                              {day.day_budget && (
                                <BudgetChip
                                  // icon={<RupeeIcon />}
                                  label={day.day_budget}
                                />
                              )}
                            </Box>

                            <Box sx={{ 
                              display: 'grid',
                              gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                              gap: '32px',
                            }}>
                              {/* Activities */}
                              {day.day_activities && day.day_activities.length > 0 && (
                                <Box>
                                  <SectionHeader>
                                    <Attractions sx={{ color: '#8b5cf6', fontSize: '24px' }} />
                                    <Typography variant="h5" sx={{ 
                                      fontWeight: 700, 
                                      color: '#8b5cf6',
                                      background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                                      backgroundClip: 'text',
                                      WebkitBackgroundClip: 'text',
                                      WebkitTextFillColor: 'transparent',
                                    }}>
                                      Activities & Sightseeing
                                    </Typography>
                                  </SectionHeader>
                                  {day.day_activities.map((activity: string, activityIndex: number) => (
                                    <ActivityItem key={activityIndex}>
                                      <Typography variant="body1" sx={{ 
                                        lineHeight: 1.7,
                                        fontSize: '15px',
                                        fontWeight: 500,
                                        color: '#374151',
                                      }}>
                                        {cleanText(activity)}
                                      </Typography>
                                    </ActivityItem>
                                  ))}
                                </Box>
                              )}

                              {/* Hotels */}
                              {day.day_hotels && day.day_hotels.length > 0 && (
                                <Box>
                                  <SectionHeader>
                                    <Hotel sx={{ color: '#ec4899', fontSize: '24px' }} />
                                    <Typography variant="h5" sx={{ 
                                      fontWeight: 700, 
                                      color: '#ec4899',
                                      background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
                                      backgroundClip: 'text',
                                      WebkitBackgroundClip: 'text',
                                      WebkitTextFillColor: 'transparent',
                                    }}>
                                      Accommodation
                                    </Typography>
                                  </SectionHeader>
                                  {day.day_hotels.map((hotel: any, hotelIndex: number) => (
                                    <HotelItem key={hotelIndex}>
                                      <Typography variant="body1" sx={{ 
                                        lineHeight: 1.7,
                                        fontSize: '15px',
                                        fontWeight: 500,
                                        color: '#374151',
                                      }}>
                                        {cleanText(`${hotel.hotel_name}`)}
                                      </Typography>
                                    </HotelItem>
                                  ))}
                                </Box>
                              )}

                              {/* Restaurants */}
                              {day.day_restaurants && day.day_restaurants.length > 0 && (
                                <Box>
                                  <SectionHeader>
                                    <Restaurant sx={{ color: '#f59e0b', fontSize: '24px' }} />
                                    <Typography variant="h5" sx={{ 
                                      fontWeight: 700, 
                                      color: '#f59e0b',
                                      background: 'linear-gradient(135deg, #f59e0b 0%, #10b981 100%)',
                                      backgroundClip: 'text',
                                      WebkitBackgroundClip: 'text',
                                      WebkitTextFillColor: 'transparent',
                                    }}>
                                      Dining & Cuisine
                                    </Typography>
                                  </SectionHeader>
                                  {day.day_restaurants.map((restaurant: any, restaurantIndex: number) => (
                                    <RestaurantItem key={restaurantIndex}>
                                      <Typography variant="body1" sx={{ 
                                        lineHeight: 1.7,
                                        fontSize: '15px',
                                        fontWeight: 500,
                                        color: '#374151',
                                      }}>
                                        {cleanText(`${restaurant.restaurant_name} ${restaurant.restaurant_price}`)}
                                      </Typography>
                                    </RestaurantItem>
                                  ))}
                                </Box>
                              )}

                              {/* Weather */}
                              {day.day_weather && day.day_weather.length > 0 && (
                                <Box>
                                  <SectionHeader>
                                    <WbSunny sx={{ color: '#059669', fontSize: '24px' }} />
                                    <Typography variant="h5" sx={{ 
                                      fontWeight: 700, 
                                      color: '#059669',
                                      background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                                      backgroundClip: 'text',
                                      WebkitBackgroundClip: 'text',
                                      WebkitTextFillColor: 'transparent',
                                    }}>
                                      Weather Forecast
                                    </Typography>
                                  </SectionHeader>
                                  {day.day_weather.map((weather: string, weatherIndex: number) => {
                                    const temperature = extractTemperature(weather);
                                    return (
                                      <WeatherItem key={weatherIndex}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                          {getWeatherIcon(weather)}
                                          <Box sx={{ flex: 1 }}>
                                            {temperature && (
                                              <Typography variant="h6" sx={{ 
                                                fontWeight: 600, 
                                                color: '#3b82f6',
                                                mb: 0.5,
                                              }}>
                                                {temperature}°C
                                              </Typography>
                                            )}
                                            <Typography variant="body1" sx={{ 
                                              lineHeight: 1.5,
                                              fontSize: '14px',
                                              color: '#374151',
                                            }}>
                                              {cleanText(weather)}
                                            </Typography>
                                          </Box>
                                        </Box>
                                      </WeatherItem>
                                    );
                                  })}
                                </Box>
                              )}
                            </Box>
                          </CardContent>
                        </DayCard>
                      ))}
                    </Box>
                  )}

                  {/* Flights Tab */}
                  {activeTab === 1 && processedItinerary.flights && (
                    <Box>
                      <SectionTitle>
                        <Flight />
                        Flight Options
                      </SectionTitle>
                      {renderFlightData(processedItinerary.flights)}
                    </Box>
                  )}

                  {/* Hotels Tab */}
                  {activeTab === 2 && processedItinerary.hotels && (
                    <Box>
                      <SectionTitle>
                        <Hotel />
                        Recommended Hotels
                      </SectionTitle>
                      {renderHotelData(processedItinerary.hotels)}
                    </Box>
                  )}

                  {/* Restaurants Tab */}
                  {activeTab === 3 && processedItinerary.restaurants && (
                    <Box>
                      <SectionTitle>
                        <Restaurant />
                        Dining Options
                      </SectionTitle>
                      {renderRestaurantData(processedItinerary.restaurants)}
                    </Box>
                  )}

                  {/* Activities Tab */}
                  {activeTab === 4 && processedItinerary.activities && (
                    <Box>
                      <SectionTitle>
                        <Attractions />
                        Activities & Attractions
                      </SectionTitle>
                      {renderActivityData(processedItinerary.activities)}
                    </Box>
                  )}

                  {/* Weather Tab */}
                  {activeTab === 5 && (processedItinerary.weather_source || processedItinerary.weather_destination) && (
                    <DataSection>
                      <SectionTitle>
                        <WbSunny />
                        Weather Information
                      </SectionTitle>
                      <VerticalListContainer>
                        {processedItinerary.weather_source && (
                          <WeatherCard>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                              <WbSunny sx={{ color: '#f59e0b', fontSize: '24px' }} />
                              <Typography variant="h6" sx={{ 
                                fontWeight: 600, 
                                color: '#1f2937',
                              }}>
                                Source City Weather
                              </Typography>
                            </Box>
                            {processedItinerary.weather_source.map((weather: string, index: number) => {
                              const temperature = extractTemperature(weather);
                              return (
                                <WeatherItem key={index}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    {getWeatherIcon(weather)}
                                    <Box sx={{ flex: 1 }}>
                                      {temperature && (
                                        <Typography variant="h6" sx={{ 
                                          fontWeight: 600, 
                                          color: '#3b82f6',
                                          mb: 0.5,
                                        }}>
                                          {temperature}°C
                                        </Typography>
                                      )}
                                      <Typography variant="body1" sx={{ 
                                        lineHeight: 1.5,
                                        fontSize: '14px',
                                        color: '#374151',
                                      }}>
                                        {cleanText(weather)}
                                      </Typography>
                                    </Box>
                                  </Box>
                                </WeatherItem>
                              );
                            })}
                          </WeatherCard>
                        )}
                        {processedItinerary.weather_destination && (
                          <WeatherCard>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                              <Cloud sx={{ color: '#3b82f6', fontSize: '24px' }} />
                              <Typography variant="h6" sx={{ 
                                fontWeight: 600, 
                                color: '#1f2937',
                              }}>
                                Destination City Weather
                              </Typography>
                            </Box>
                            {processedItinerary.weather_destination.map((weather: string, index: number) => {
                              const temperature = extractTemperature(weather);
                              return (
                                <WeatherItem key={index}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    {getWeatherIcon(weather)}
                                    <Box sx={{ flex: 1 }}>
                                      {temperature && (
                                        <Typography variant="h6" sx={{ 
                                          fontWeight: 600, 
                                          color: '#3b82f6',
                                          mb: 0.5,
                                        }}>
                                          {temperature}°C
                                        </Typography>
                                      )}
                                      <Typography variant="body1" sx={{ 
                                        lineHeight: 1.5,
                                        fontSize: '14px',
                                        color: '#374151',
                                      }}>
                                        {cleanText(weather)}
                                      </Typography>
                                    </Box>
                                  </Box>
                                </WeatherItem>
                              );
                            })}
                          </WeatherCard>
                        )}
                      </VerticalListContainer>
                    </DataSection>
                  )}

                  {/* News Tab */}
                  {activeTab === 6 && (processedItinerary.news_source || processedItinerary.news_destination) && (
                    <DataSection>
                      <SectionTitle>
                        <Newspaper />
                        Latest News
                      </SectionTitle>
                      <VerticalListContainer>
                        {processedItinerary.news_source && (
                          <NewsCard>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                              <Article sx={{ color: '#3b82f6' }} />
                              <Typography variant="h6" sx={{ fontWeight: 600, color: '#3b82f6' }}>
                                Source City News
                              </Typography>
                            </Box>
                            {processedItinerary.news_source.map((news: string, index: number) => (
                              <NewsItem key={index}>
                                {cleanText(news)}
                              </NewsItem>
                            ))}
                          </NewsCard>
                        )}
                        {processedItinerary.news_destination && (
                          <NewsCard>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                              <Article sx={{ color: '#3b82f6' }} />
                              <Typography variant="h6" sx={{ fontWeight: 600, color: '#3b82f6' }}>
                                Destination City News
                              </Typography>
                            </Box>
                            {processedItinerary.news_destination.map((news: string, index: number) => (
                              <NewsItem key={index}>
                                {cleanText(news)}
                              </NewsItem>
                            ))}
                          </NewsCard>
                        )}
                      </VerticalListContainer>
                    </DataSection>
                  )}

                </Box>
              ) : (
                // Fallback: Show raw text if processing fails
                <Box sx={{
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)',
                  borderRadius: '16px',
                  padding: 3,
                  marginBottom: 3,
                  border: '1px solid rgba(139, 92, 246, 0.12)',
                  boxShadow: '0 10px 30px rgba(139, 92, 246, 0.08), 0 4px 12px rgba(0, 0, 0, 0.05)',
                }}>
                  <Typography variant="h5" gutterBottom sx={{ 
                    color: '#8b5cf6',
                    fontWeight: 600,
                    mb: 3,
                  }}>
                    Your Itinerary Details
                  </Typography>
                  <Box sx={{
                    background: 'rgba(139, 92, 246, 0.05)',
                    borderRadius: '12px',
                    padding: 3,
                    border: '1px solid rgba(139, 92, 246, 0.1)',
                    fontFamily: 'monospace',
                    fontSize: '0.9rem',
                    lineHeight: 1.6,
                    whiteSpace: 'pre-wrap',
                    overflow: 'auto',
                    maxHeight: '60vh',
                  }}>
                    {(() => {
                      if (typeof itineraryData?.itinerary === 'string') {
                        return itineraryData.itinerary;
                      } else if (Array.isArray(itineraryData?.itinerary)) {
                        return itineraryData.itinerary.map((part: any) => part.text || '').join('\n');
                      } else if (itineraryData?.itinerary?.parts && Array.isArray(itineraryData.itinerary.parts)) {
                        return itineraryData.itinerary.parts.map((part: any) => part.text || '').join('\n');
                      }
                      return 'No itinerary data available';
                    })()}
                  </Box>
                </Box>
              )}

            </Box>
        </Fade>
      </ContentContainer>
      </DialogContainer>
    </StyledDialog>
  )
}

export default ItineraryPopup
