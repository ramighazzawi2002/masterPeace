import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Send, MessageCircle, X, Minus } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { BASE_URL } from "../config";

function HeritageChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef(null);
  const chatId = useRef(null);

  useEffect(() => {
    if (!chatId.current) {
      chatId.current = `chat_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { text: userMessage, isUser: true }]);
    setIsLoading(true);

    try {
      const response = await axios.post(`${BASE_URL}/api/chat`, {
        message: userMessage,
        chatId: chatId.current,
      });

      setMessages(prev => [
        ...prev,
        { text: response.data.response, isUser: false },
      ]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [
        ...prev,
        {
          text: "عذراً، حدث خطأ في معالجة طلبك. يرجى المحاولة مرة أخرى.",
          isUser: false,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
  };

  const toggleMinimize = e => {
    e.stopPropagation();
    setIsMinimized(!isMinimized);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="bg-customBrown text-white p-4 rounded-full shadow-lg hover:bg-customBrown/90 transition-all duration-300 flex items-center gap-2"
        >
          <MessageCircle className="w-6 h-6" />
          <span className="text-sm">تحدث مع مساعد التراث</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`bg-white rounded-2xl shadow-2xl transition-all duration-300 overflow-hidden
            ${isMinimized ? "h-14" : "h-[600px] "} w-[450px]`}
        >
          {/* Header */}
          <div className="bg-customBrown p-4 flex justify-between items-center cursor-pointer">
            <h2 className="text-xl font-bold text-white">
              مساعد التراث الأردني
            </h2>
            <div className="flex gap-2">
              <button
                onClick={toggleMinimize}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <Minus className="w-5 h-5" />
              </button>
              <button
                onClick={toggleChat}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Chat Content */}
          {!isMinimized && (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-4 h-[480px] ">
                {/* Welcome message */}
                <div className="text-center text-gray-500 my-8">
                  <p>مرحباً! أنا مساعدك في استكشاف التراث الأردني.</p>
                  <p>يمكنك سؤالي عن أي شيء يتعلق بالتراث والثقافة الأردنية.</p>
                </div>

                {/* Chat messages */}
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.isUser ? "justify-start" : "justify-end"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-xl p-4 ${
                        message.isUser
                          ? "bg-customGreen/10 text-customGreen"
                          : "bg-customBrown/10 text-customBrown"
                      }`}
                    >
                      {message.isUser ? (
                        <p className="text-sm">{message.text}</p>
                      ) : (
                        <div className="prose prose-sm max-w-none prose-headings:text-customBrown prose-a:text-customBrown">
                          <ReactMarkdown>{message.text}</ReactMarkdown>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* Loading indicator */}
                {isLoading && (
                  <div className="flex justify-end">
                    <div className="bg-gray-100 rounded-xl p-4">
                      <div className="flex gap-x-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input form */}
              <form onSubmit={handleSubmit} className="p-4 border-t">
                <div className="flex gap-x-2">
                  <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="اكتب سؤالك هنا..."
                    className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-customBrown"
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-customBrown text-white p-2 rounded-lg hover:bg-customBrown/90 transition-colors disabled:opacity-50"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default HeritageChat;
