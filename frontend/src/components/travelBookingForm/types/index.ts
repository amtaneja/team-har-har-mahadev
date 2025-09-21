import { Moment } from "moment"

interface InterestOptionType {
  id: string
  value: string
}

interface TravelFormDataType {
  sourceLocation: string
  destinationLocation: string
  startDate: Moment | null
  endDate: Moment | null
  budget: string
  numberOfPeople: string
  interests: InterestOptionType[]
}

export type { InterestOptionType, TravelFormDataType }