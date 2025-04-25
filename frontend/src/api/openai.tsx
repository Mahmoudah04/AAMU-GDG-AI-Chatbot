import OpenAI from "openai"

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY, // Using Vite's environment variable format
  dangerouslyAllowBrowser: true, // Only for development - in production use server-side API calls
})

// Define the system prompt to provide context about AAMU
const SYSTEM_PROMPT = `You are a helpful course and career assistant for Alabama A&M University students.
You provide accurate information about course registration, academic requirements, career paths, and university resources.
Be friendly, concise, and helpful. If you don't know something specific about AAMU, acknowledge that and provide general guidance.
Some key information about AAMU:
- Located in Normal, Alabama
- A historically black university founded in 1875
- Known for programs in STEM, agriculture, education, and business
- Semester-based academic calendar with Fall, Spring, and Summer terms
- Registration typically opens several months before the semester starts
- Students need to meet with academic advisors before registration
`

// Function to get streaming chat completion from OpenAI
export async function getStreamingChatCompletion(
  messages: { role: string; content: string }[],
  onChunk: (chunk: string) => void,
) {
  try {
    const stream = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages.map((msg) => ({
          role: msg.role as "user" | "assistant" | "system",
          content: msg.content,
        })),
      ],
      temperature: 0.7,
      max_tokens: 1000,
      stream: true,
    })

    let fullResponse = ""

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || ""
      if (content) {
        fullResponse += content
        onChunk(content)
      }
    }

    return fullResponse
  } catch (error) {
    console.error("Error getting streaming chat completion:", error)
    throw error
  }
}
