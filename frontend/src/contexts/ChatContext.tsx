"use client"

import type React from "react"
import { createContext, useContext, useState, useRef, useCallback } from "react"
import { getStreamingChatCompletion } from "../api/openai"

type MessageType = "bot" | "user"

interface Message {
  id: string
  type: MessageType
  text: string
  timestamp: Date
}

interface ChatContextType {
  messages: Message[]
  addMessage: (text: string, type: MessageType) => void
  clearMessages: () => void
  isOpen: boolean
  toggleChat: () => void
  openChat: () => void
  isLoading: boolean
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "bot",
      text: "Hi there! I'm your Course Registration Assistant for Alabama A&M University. How can I help today?",
      timestamp: new Date(),
    },
  ])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const messageHistoryRef = useRef<{ role: string; content: string }[]>([
    {
      role: "assistant",
      content: "Hi there! I'm your Course Registration Assistant for Alabama A&M University. How can I help today?",
    },
  ])

  // This function handles sending a user message and getting a bot response
  const addMessage = useCallback(async (text: string, type: MessageType) => {
    // Only proceed if this is a user message
    if (type !== "user") return

    // Create and add the user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: "user",
      text: text,
      timestamp: new Date(),
    }

    // Update the UI with the user message
    setMessages((prev) => [...prev, userMessage])

    // Add the user message to the conversation history
    messageHistoryRef.current.push({ role: "user", content: text })

    // Start the loading state
    setIsLoading(true)

    try {
      // Create an empty bot message that will be filled with the streaming response
      const botMessageId = `bot-${Date.now()}`
      const botMessage: Message = {
        id: botMessageId,
        type: "bot",
        text: "",
        timestamp: new Date(),
      }

      // Add the empty bot message to the UI
      setMessages((prev) => [...prev, botMessage])

      // Get the streaming response from OpenAI
      const fullResponse = await getStreamingChatCompletion(messageHistoryRef.current, (chunk) => {
        // Update only the bot message with each chunk
        setMessages((prev) => prev.map((msg) => (msg.id === botMessageId ? { ...msg, text: msg.text + chunk } : msg)))
      })

      // Add the complete bot response to the conversation history
      messageHistoryRef.current.push({ role: "assistant", content: fullResponse })
    } catch (error) {
      console.error("Error getting response from OpenAI:", error)

      // Add an error message
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        type: "bot",
        text: "I'm having trouble connecting right now. Please try again later.",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }, [])

  const clearMessages = useCallback(() => {
    const initialMessage = {
      id: "1",
      type: "bot" as MessageType,
      text: "Hi there! I'm your Course Registration Assistant for Alabama A&M University. How can I help today?",
      timestamp: new Date(),
    }

    setMessages([initialMessage])
    messageHistoryRef.current = [{ role: "assistant", content: initialMessage.text }]
  }, [])

  const toggleChat = useCallback(() => {
    setIsOpen((prev) => !prev)
  }, [])

  const openChat = useCallback(() => {
    setIsOpen(true)
  }, [])

  return (
    <ChatContext.Provider value={{ messages, addMessage, clearMessages, isOpen, toggleChat, openChat, isLoading }}>
      {children}
    </ChatContext.Provider>
  )
}

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider")
  }
  return context
}
