import { MessageSquare } from 'lucide-react';
import { useChat } from '../contexts/ChatContext';
import { motion } from 'framer-motion';

const ChatButton = () => {
  const { toggleChat, isOpen } = useChat();

  return (
    <motion.button
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleChat}
      className={`fixed bottom-6 right-6 z-20 p-4 rounded-full shadow-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors duration-200 ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      aria-label="Open chat assistant"
    >
      <MessageSquare size={24} />
    </motion.button>
  );
};

export default ChatButton;