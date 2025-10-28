# Copyright 2025 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

from google.adk.agents import Agent
from .sub_agents.data_extractor_agent.agent import data_extractor_agent as a2
from .sub_agents.duplicate_remover_agent.agent import duplicate_remover_agent as a1
from .sub_agents.question_asker.agent import question_asker as a3
from google.adk.tools import agent_tool


am = Agent(
    model="gemini-2.5-flash",
    name="root_agent",
    description="You receive pictures. You may use tool agents to select a subsect, extract intesting info and then ask the user questions about the images. All this with the end goals of making a travel blog.",
    tools=[
        agent_tool.AgentTool(agent=a1),
        agent_tool.AgentTool(agent=a2),
        agent_tool.AgentTool(agent=a3),
    ],
)

root_agent = am
