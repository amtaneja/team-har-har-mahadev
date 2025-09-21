import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface SavedItinerary {
  id: string;
  destination: string;
  duration: string;
  totalCost?: string;
  summary?: string;
  itinerary: any;
  createdAt: Date;
  sourceLocation: string;
  destinationLocation: string;
  startDate: string;
  endDate: string;
  budget: string;
  numberOfPeople: string;
  interests: string[];
}

export interface ItineraryStore {
  // State
  savedItineraries: SavedItinerary[];
  
  // Actions
  saveItinerary: (itinerary: Omit<SavedItinerary, 'id' | 'createdAt'>) => void;
  removeItinerary: (id: string) => void;
  getItineraryById: (id: string) => SavedItinerary | undefined;
  clearAllItineraries: () => void;
}

const initialState = {
  savedItineraries: [],
};

export const useItineraryStore = create<ItineraryStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      saveItinerary: (itineraryData) => {
        const newItinerary: SavedItinerary = {
          ...itineraryData,
          id: `itinerary_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date(),
        };
        
        set((state) => ({
          savedItineraries: [newItinerary, ...state.savedItineraries],
        }));
      },
      
      removeItinerary: (id) => {
        set((state) => ({
          savedItineraries: state.savedItineraries.filter(itinerary => itinerary.id !== id),
        }));
      },
      
      getItineraryById: (id) => {
        const { savedItineraries } = get();
        return savedItineraries.find(itinerary => itinerary.id === id);
      },
      
      clearAllItineraries: () => {
        set({ savedItineraries: [] });
      },
    }),
    {
      name: 'itinerary-storage',
      partialize: (state) => ({
        savedItineraries: state.savedItineraries,
      }),
    }
  )
);
