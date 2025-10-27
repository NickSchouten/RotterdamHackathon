from google.adk.agents.llm_agent import Agent

root_agent = Agent(
    model='gemini-2.5-flash',
    name='root_agent',
    description='A helpful assistant for user questions.',
    instruction="""
    You are an agent that receives pictures from the user.
    Your task is to identify the 3 most interesting distinct images in the pictures provided.
    You return like this [1, 2, 6].
    """,
)
