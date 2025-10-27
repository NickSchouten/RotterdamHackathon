# Atlance - Your Personal Atlas at a Glance

**Atlance** is an AI travel companion that turns your adventures into beautiful short blogs automatically. Instead of manually journaling, Atlance asks you just **three quick questions** about your trip and crafts a personal story in your tone, complete with location insights and emotional highlights.

But Atlance doesn’t just create memories for you — it keeps your friends and family effortlessly up to date. With every story, you can:

- 🌍 **Share location highlights** without posting constant updates
- ✍️ **Send personalized travel blogs** via email, social media, or a private link
- 🧭 **Let loved ones follow your journey** through an interactive map of your trips
- 💌 **Save meaningful moments** for those who care, keeping them close to your experiences in real time

---

## Agent Journey

The **Atlance workflow** is handled by a chain of specialized agents. Here’s how your photos become a curated story:

1. **Duplicate Remover Agent (`duplicate_remover_agent`)**
   - Removes duplicate photos as people often take multiple shots of the same scene
   - Output: a clean set of unique images

2. **Feature Extractor Agent (`feature_extractor_agent`)**
   - Analyzes each image to extract:
     - Metadata: location, time
     - Recognizable subjects (e.g., Eiffel Tower, a park, etc.)
   - Produces a **preliminary story_description**

3. **Enricher Agent (`enricher_agent`)**
   - Asks 1–3 questions to clarify and enrich the story
     - Example: “I see you are in a park. Assuming this is Central Park, are you here for a special occasion like a birthday? If not, which park is it?”
   - Uses Google tools for additional context:
     - Google Maps for landmark locations
     - Google Search for historic facts or local insights
   - Produces a **final story_description** and a **Google Maps pin**

4. **Story Teller Agent (`story_teller_agent`)**
   - Crafts the **final travel blog**:
     - Displays text behind the location and images
     - Captures the tone, emotional highlights, and context of the trip

---

With this agent-driven workflow, Atlance transforms your photos and brief inputs into **a complete, sharable travel story** in just a few steps.
