from google.adk.agents.llm_agent import LlmAgent, Agent
from google.adk.tools import google_search, agent_tool
from pydantic import BaseModel
from typing import List, Optional


class Location(BaseModel):
    """Geographic location with latitude and longitude."""

    lat: float
    lng: float


class ImageAnalysis(BaseModel):
    """Analysis result for a single image."""

    path: str
    timestamp: Optional[str]
    location: Optional[Location]
    subjects: List[str]


class DataExtractionResponse(BaseModel):
    """Schema for the agent's response when extracting data from images."""

    images: List[ImageAnalysis]
    preliminary_story: str


Agent_Search = Agent(
    model="gemini-2.5-flash",
    name="SearchAgent",
    instruction="""
    You're a specialist in Google Search
    """,
    tools=[google_search],
)

data_extractor_agent = LlmAgent(
    model="gemini-2.5-flash",
    name="data_extractor_agent",
    description="An agent that extracts metadata and identifies subjects in travel photos.",
    instruction="""
    You are an agent that analyzes travel photos to extract meaningful data.

    Your task is to:
    1. Extract metadata from each image:
       - File path
       - Timestamp (when the photo was taken)
       - Location coordinates (latitude, longitude) if available from EXIF data

    2. Identify recognizable subjects in each image:
       - Landmarks (e.g., Eiffel Tower, Statue of Liberty)
       - Natural features (e.g., mountains, beaches, parks)
       - Activities (e.g., dining, hiking, sightseeing)
       - People or groups
       - Architecture or notable buildings

    3. Generate a preliminary story description:
       - Write a brief 1-2 sentence summary of the trip based on the images
       - Focus on the main destinations, activities, and overall theme
       - Keep it concise and engaging

    Tool:
    You can search to flesh out the additional story with additional information about locations, landmarks, or dates from the image metadata to enhance your analysis and provide more context about the places and events captured in the photos.

    Guidelines:
    - Be specific when identifying landmarks or locations
    - Use Google Search to verify landmark names or get additional context about locations from coordinates
    - Search for historical events or significance of dates when relevant
    - Include general subjects like "sunset", "food", "architecture" when appropriate
    - If location data is not available, set location to null
    - If timestamp data is not available, set timestamp to null
    - Use ISO 8601 format for timestamps when available (e.g., "2024-10-20T18:45:00Z")
    - Make the preliminary story engaging but factual based on what you see
    - When you find interesting historical or cultural information through search, incorporate it into your analysis
    """,
    output_schema=DataExtractionResponse,
    tools=[agent_tool.AgentTool(agent=Agent_Search)],
)
