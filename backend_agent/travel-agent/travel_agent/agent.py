from google.adk.agents import Agent
from google.adk.tools import google_search
from pydantic import BaseModel
from .instrunctions import instructions

class TravelItinerary(BaseModel):
    news_source: list[str]
    news_destination: list[str]
    activities: list[str]
    hotels: list[str]
    restaurants: list[str]
    flights: list[str]
    weather_source: list[str]
    weather_destination: list[str]
    day_wise_itinerary: list[str]

root_agent = Agent(
    name="travel_agent",
    model="gemini-2.0-flash",
    description="Travel agent",
    instruction=instructions,
    tools=[google_search],
)