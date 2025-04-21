import React, { createContext, useContext, useState } from 'react';

type MessageType = 'bot' | 'user';

interface Message {
  id: string;
  type: MessageType;
  text: string;
  timestamp: Date;
}

interface ChatContextType {
  messages: Message[];
  addMessage: (text: string, type: MessageType) => void;
  clearMessages: () => void;
  isOpen: boolean;
  toggleChat: () => void;
  openChat: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      text: "Hi there! I'm your Course Registration Assistant. How can I help today?",
      timestamp: new Date(),
    },
  ]);
  const [isOpen, setIsOpen] = useState(false);

  const addMessage = (text: string, type: MessageType) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type,
      text,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    // If it's a user message, simulate a bot response after a delay
    if (type === 'user') {
      setTimeout(() => {
        const botResponses = [
          "I can help you with course registration. What specific information do you need?",
          "Registration for Fall 2025 begins on April 1st for seniors and April 3rd for juniors.",
          "You'll need to meet with your advisor before registering. Have you scheduled an appointment yet?",
          "The course catalog for next semester is now available online. Would you like me to send you the link?",
          "You can register for up to 18 credit hours without special permission from your department chair.",
        ];
        
        const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
        
        addMessage(randomResponse, 'bot');
      }, 1000);
    }
  };

  const clearMessages = () => {
    setMessages([
      {
        id: '1',
        type: 'bot',
        text: "Hi there! I'm your Course Registration Assistant. How can I help today?",
        timestamp: new Date(),
      },
    ]);
  };

  const toggleChat = () => {
    setIsOpen(prev => !prev);
  };

  const openChat = () => {
    setIsOpen(true);
  };

  return (
    <ChatContext.Provider value={{ messages, addMessage, clearMessages, isOpen, toggleChat, openChat }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};