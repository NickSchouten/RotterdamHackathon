from google.adk.agents.llm_agent import Agent
from pydantic import BaseModel
from typing import List


class ImageSelectionResponse(BaseModel):
    """Schema for the agent's response when selecting interesting images."""

    selected_indices: List[int]
    reasons: str


root_agent = Agent(
    model="gemini-2.5-flash",
    name="root_agent",
    description="A helpful assistant for user questions.",
    instruction="""
    You are an agent that receives pictures from the user.
    Your task is to identify the 3 most interesting distinct images in the pictures provided.
<<<<<<< Updated upstream
    You should return the indices of the selected images (where 0 is the first element) along with your reasoning for the selection.
=======
    You return like this [1, 2, 6]. Where 0 is the first element of the list.

    Do not choose images that might not invoke negative emotions or are inappropriate.
>>>>>>> Stashed changes
    """,
    output_schema=ImageSelectionResponse,
)
