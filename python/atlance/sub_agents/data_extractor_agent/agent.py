from google.adk.agents.llm_agent import Agent
from pydantic import BaseModel
from typing import List, Optional

class Location(BaseModel):
    """Geographic location with latitude and longitude."""

    lat: float
    lng: float


class ImageAnalysis(BaseModel):
    """Analysis result for a single image."""

    path: str
    timestamp: str
    location: Optional[Location]
    subjects: List[str]


class DataExtractionResponse(BaseModel):
    """Schema for the agent's response when extracting data from images."""

    images: List[ImageAnalysis]
    preliminary_story: str


data_extractor_agent = Agent(
    model="gemini-2.5-flash",
    name="data_extractor_agent",
    description="An agent that extracts metadata and identifies subjects in travel photos.",
    instruction="""
    You are an agent that analyzes travel photos to extract meaningful data.
    You will receive verified landmark information from the previous landmark search agent
    which you should incorporate into your analysis.

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

    Guidelines:
    - Use the landmark information from the previous search agent to enhance your analysis
    - Be specific when identifying landmarks or locations
    - Include general subjects like "sunset", "food", "architecture" when appropriate
    - If location data is not available, set location to null
    - Use ISO 8601 format for timestamps (e.g., "2024-10-20T18:45:00Z")
    - Make the preliminary story engaging but factual, incorporating verified landmark details
    """,
    output_schema=DataExtractionResponse,
    disallow_transfer_to_parent=True,
    disallow_transfer_to_peers=True,
)
