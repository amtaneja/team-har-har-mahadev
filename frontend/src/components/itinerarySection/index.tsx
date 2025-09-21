import React, { useState } from "react"
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  CardActions, 
  Button, 
  Chip, 
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Avatar,
  Divider
} from "@mui/material"
import { 
  FlightTakeoff, 
  Hotel, 
  Restaurant, 
  Attractions, 
  Delete, 
  Visibility,
  CalendarToday,
  People,
  AttachMoney,
  LocationOn
} from "@mui/icons-material"
import { useItineraryStore, SavedItinerary } from "@/store/zustand"
import ItineraryPopup from "../travelBookingForm/ItineraryPopup"

// Bookings component for displaying user's travel bookings
const ItineraryDetails = () => {
  const { savedItineraries, removeItinerary } = useItineraryStore()
  const [selectedItinerary, setSelectedItinerary] = useState<SavedItinerary | null>(null)
  const [showItineraryPopup, setShowItineraryPopup] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [itineraryToDelete, setItineraryToDelete] = useState<string | null>(null)

  const handleViewItinerary = (itinerary: SavedItinerary) => {
    setSelectedItinerary(itinerary)
    setShowItineraryPopup(true)
  }

  const handleCloseItineraryPopup = () => {
    setShowItineraryPopup(false)
    setSelectedItinerary(null)
  }

  const handleDeleteClick = (itineraryId: string) => {
    setItineraryToDelete(itineraryId)
    setShowDeleteDialog(true)
  }

  const handleDeleteConfirm = () => {
    if (itineraryToDelete) {
      removeItinerary(itineraryToDelete)
      setShowDeleteDialog(false)
      setItineraryToDelete(null)
    }
  }

  const handleDeleteCancel = () => {
    setShowDeleteDialog(false)
    setItineraryToDelete(null)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'flight':
        return <FlightTakeoff sx={{ color: '#8b5cf6', fontSize: '20px' }} />
      case 'hotel':
        return <Hotel sx={{ color: '#ec4899', fontSize: '20px' }} />
      case 'restaurant':
        return <Restaurant sx={{ color: '#f59e0b', fontSize: '20px' }} />
      case 'attraction':
        return <Attractions sx={{ color: '#10b981', fontSize: '20px' }} />
      default:
        return <Attractions sx={{ color: '#8b5cf6', fontSize: '20px' }} />
    }
  }

  return (
    <Box sx={{ maxWidth: 1200, p: 2}}>
      <Box sx={{ p: 4 }}>
        <Typography 
          variant="h4" 
          gutterBottom 
          sx={{ 
            mb: 4,
            background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 700,
            textAlign: 'center'
          }}
        >
          Your Saved Itineraries
        </Typography>
        
        {savedItineraries.length === 0 ? (
          /* Empty state */
          <Box sx={{ 
            textAlign: 'center', 
            py: 6, 
            px: 4,
            border: '2px dashed #e0e0e0',
            borderRadius: 3,
            backgroundColor: '#fafafa',
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(236, 72, 153, 0.05) 100%)',
            borderColor: 'rgba(139, 92, 246, 0.2)'
          }}>
            <Typography variant="h5" sx={{ color: '#666', marginBottom: '16px', fontWeight: 600 }}>
              No saved itineraries yet
            </Typography>
            <Typography variant="body1" sx={{ color: '#888', marginBottom: '24px', maxWidth: '500px', mx: 'auto' }}>
              Start planning your trip to see your saved itineraries here. Your travel plans will appear in this section once you save them from the itinerary popup.
            </Typography>
            <Box sx={{ 
              display: 'inline-block',
              p: 3,
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)',
              borderRadius: 2,
              border: '1px solid rgba(139, 92, 246, 0.2)'
            }}>
              <Typography sx={{ margin: 0, color: '#8b5cf6', fontSize: '16px', fontWeight: 500 }}>
                💡 Tip: Go to the Planning section to create your first travel itinerary!
              </Typography>
            </Box>
          </Box>
        ) : (
          /* Itineraries list */
          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: 3
          }}>
            {savedItineraries.map((itinerary) => (
              <Box key={itinerary.id}>
                <Card 
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(139, 92, 246, 0.15)',
                    borderRadius: 3,
                    boxShadow: '0 10px 30px rgba(139, 92, 246, 0.1)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 20px 40px rgba(139, 92, 246, 0.2)',
                      border: '1px solid rgba(139, 92, 246, 0.3)',
                    }
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    {/* Header */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar 
                        sx={{ 
                          bgcolor: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                          mr: 2,
                          width: 48,
                          height: 48
                        }}
                      >
                        <LocationOn sx={{ color: 'white' }} />
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: '#1f2937' }}>
                          {itinerary.destination}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#6b7280' }}>
                          {itinerary.sourceLocation} → {itinerary.destinationLocation}
                        </Typography>
                      </Box>
                    </Box>

                    <Divider sx={{ my: 2, borderColor: 'rgba(139, 92, 246, 0.1)' }} />

                    {/* Trip Details */}
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <CalendarToday sx={{ fontSize: '16px', color: '#8b5cf6', mr: 1 }} />
                        <Typography variant="body2" sx={{ color: '#374151' }}>
                          {formatDate(itinerary.startDate)} - {formatDate(itinerary.endDate)}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <People sx={{ fontSize: '16px', color: '#ec4899', mr: 1 }} />
                        <Typography variant="body2" sx={{ color: '#374151' }}>
                          {itinerary.numberOfPeople} {itinerary.numberOfPeople === '1' ? 'person' : 'people'}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <AttachMoney sx={{ fontSize: '16px', color: '#10b981', mr: 1 }} />
                        <Typography variant="body2" sx={{ color: '#374151' }}>
                          Budget: ₹{itinerary.budget}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Interests */}
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" sx={{ color: '#6b7280', mb: 1, fontWeight: 500 }}>
                        Interests:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {itinerary.interests.slice(0, 3).map((interest, index) => (
                          <Chip
                            key={index}
                            label={interest}
                            size="small"
                            sx={{
                              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)',
                              color: '#8b5cf6',
                              border: '1px solid rgba(139, 92, 246, 0.2)',
                              fontSize: '0.75rem',
                              height: '24px'
                            }}
                          />
                        ))}
                        {itinerary.interests.length > 3 && (
                          <Chip
                            label={`+${itinerary.interests.length - 3} more`}
                            size="small"
                            sx={{
                              background: 'rgba(107, 114, 128, 0.1)',
                              color: '#6b7280',
                              border: '1px solid rgba(107, 114, 128, 0.2)',
                              fontSize: '0.75rem',
                              height: '24px'
                            }}
                          />
                        )}
                      </Box>
                    </Box>

                    {/* Summary */}
                    {itinerary.summary && (
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: '#6b7280',
                          fontStyle: 'italic',
                          lineHeight: 1.4,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      >
                        {itinerary.summary}
                      </Typography>
                    )}
                  </CardContent>

                  <CardActions sx={{ p: 3, pt: 0 }}>
                    <Button
                      variant="contained"
                      startIcon={<Visibility />}
                      onClick={() => handleViewItinerary(itinerary)}
                      sx={{
                        flexGrow: 1,
                        background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600,
                        '&:hover': {
                          background: 'linear-gradient(135deg, #7c3aed 0%, #db2777 100%)',
                          transform: 'translateY(-1px)',
                          boxShadow: '0 8px 20px rgba(139, 92, 246, 0.3)',
                        }
                      }}
                    >
                      View Itinerary
                    </Button>
                    <IconButton
                      onClick={() => handleDeleteClick(itinerary.id)}
                      sx={{
                        color: '#ef4444',
                        '&:hover': {
                          backgroundColor: 'rgba(239, 68, 68, 0.1)',
                          transform: 'scale(1.1)',
                        }
                      }}
                    >
                      <Delete />
                    </IconButton>
                  </CardActions>
                </Card>
              </Box>
            ))}
          </Box>
        )}
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onClose={handleDeleteCancel}>
        <DialogTitle>Delete Itinerary</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this itinerary? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Itinerary Popup */}
      {selectedItinerary && (
        <ItineraryPopup
          open={showItineraryPopup}
          onClose={handleCloseItineraryPopup}
          isLoading={false}
          itineraryData={{
            destination: selectedItinerary.destination,
            duration: selectedItinerary.duration,
            totalCost: selectedItinerary.totalCost,
            summary: selectedItinerary.summary,
            itinerary: selectedItinerary.itinerary
          }}
          isReadOnly={true}
        />
      )}
    </Box>
  )
}

export default ItineraryDetails