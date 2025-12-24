import { useState, useRef, useEffect } from 'react'
import { FiMessageCircle, FiX, FiSend, FiUser, FiCpu } from 'react-icons/fi'
import { useMutation } from '@tanstack/react-query'
import { sendChatMessage } from '../services/api'

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: 'Xin chào! 👋 Tôi là trợ lý ảo CineBot. Tôi có thể giúp gì cho bạn?',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const chatMutation = useMutation({
    mutationFn: sendChatMessage,
    onSuccess: (data) => {
      setIsTyping(false)
      if (data.reply) {
        const botMessage = {
          id: Date.now(),
          type: 'bot',
          text: data.reply,
          suggestions: data.suggestions || [],
          timestamp: new Date()
        }
        setMessages(prev => [...prev, botMessage])
      }
    },
    onError: () => {
      setIsTyping(false)
      const errorMessage = {
        id: Date.now(),
        type: 'bot',
        text: 'Xin lỗi, tôi đang gặp sự cố. Vui lòng thử lại sau.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    }
  })

  const handleSend = (messageText = input) => {
    if (!messageText.trim()) return

    // Add user message
    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: messageText,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    // Send to backend
    chatMutation.mutate({ message: messageText, userId: localStorage.getItem('userId') })
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const quickActions = [
    { icon: '🎬', text: 'Phim đang chiếu', action: 'Có phim gì đang chiếu?' },
    { icon: '🎟️', text: 'Giá vé', action: 'Giá vé bao nhiêu?' },
    { icon: '📍', text: 'Rạp chiếu', action: 'Có rạp nào gần tôi?' },
    { icon: '⭐', text: 'Phim hot', action: 'Phim nào đáng xem nhất?' }
  ]

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center ${
          isOpen 
            ? 'bg-red-500 hover:bg-red-600' 
            : 'bg-gradient-to-r from-purple to-purple-dark hover:from-purple-dark hover:to-purple'
        }`}
      >
        {isOpen ? (
          <FiX size={24} className="text-white" />
        ) : (
          <FiMessageCircle size={24} className="text-white" />
        )}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-40 w-96 h-[600px] bg-dark-light border border-gray-custom rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple to-purple-dark p-4 flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <FiCpu className="text-white" size={20} />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-bold">CineBot AI</h3>
              <p className="text-white/80 text-xs">Trợ lý ảo thông minh</p>
            </div>
            <div className="flex items-center space-x-1">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              <span className="text-white/80 text-xs">Online</span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-dark">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-2 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.type === 'user' ? 'bg-purple' : 'bg-gradient-to-br from-purple to-purple-dark'
                  }`}>
                    {message.type === 'user' ? (
                      <FiUser size={16} className="text-white" />
                    ) : (
                      <FiCpu size={16} className="text-white" />
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div className="flex flex-col space-y-2">
                    <div className={`px-4 py-2 rounded-2xl ${
                      message.type === 'user'
                        ? 'bg-purple text-white rounded-tr-none'
                        : 'bg-dark-lighter text-gray-200 rounded-tl-none'
                    }`}>
                      <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                    </div>

                    {/* Suggestions */}
                    {message.suggestions && message.suggestions.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {message.suggestions.map((suggestion, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSend(suggestion)}
                            className="px-3 py-1 bg-dark-lighter hover:bg-purple/20 border border-gray-custom hover:border-purple rounded-full text-xs text-gray-300 transition-all"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}

                    <span className="text-xs text-gray-500">
                      {message.timestamp.toLocaleTimeString('vi-VN', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-start space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple to-purple-dark flex items-center justify-center">
                  <FiCpu size={16} className="text-white" />
                </div>
                <div className="px-4 py-3 bg-dark-lighter rounded-2xl rounded-tl-none">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          {messages.length === 1 && (
            <div className="p-4 border-t border-gray-custom bg-dark-light">
              <p className="text-xs text-gray-400 mb-3">Gợi ý câu hỏi:</p>
              <div className="grid grid-cols-2 gap-2">
                {quickActions.map((action, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(action.action)}
                    className="flex items-center space-x-2 p-2 bg-dark hover:bg-purple/20 border border-gray-custom hover:border-purple rounded-lg transition-all text-left"
                  >
                    <span className="text-lg">{action.icon}</span>
                    <span className="text-xs text-gray-300">{action.text}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-gray-custom bg-dark-light">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Nhập câu hỏi của bạn..."
                className="flex-1 px-4 py-2 bg-dark border border-gray-custom rounded-lg focus:outline-none focus:ring-2 focus:ring-purple/50 text-white text-sm"
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || isTyping}
                className="w-10 h-10 bg-purple hover:bg-purple-dark disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg flex items-center justify-center transition-all"
              >
                <FiSend size={18} className="text-white" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
