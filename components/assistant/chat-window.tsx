"use client";

import { useChat } from "@ai-sdk/react";
import { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  X,
  MessageSquare,
  Send,
  Bot,
  User,
  Zap,
  Loader2,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function AssistantChat() {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Use the standard useChat hook from @ai-sdk/react
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    status,
    error
  } = useChat({
    api: "/api/chat",
    maxSteps: 5,
  });

  const isLoading = status === "streaming" || status === "submitted";

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, status]);

  // Keep only one state for isOpen
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="h-14 w-14 bg-primary rounded-full flex items-center justify-center shadow-lg shadow-primary/20 hover:scale-110 transition-transform"
          >
            <MessageSquare className="h-6 w-6 text-primary-foreground" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: 20, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.95 }}
            className="w-[380px] h-[500px] bg-card/95 backdrop-blur-xl border border-primary/20 rounded-2xl flex flex-col shadow-2xl overflow-hidden text-foreground"
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-primary/10 flex items-center justify-between bg-primary/5 shrink-0">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-primary" />
                <div>
                  <h3 className="text-sm font-display font-medium">AI Assistant</h3>
                  <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                     <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                     Groq Llama3 Powered
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Messages */}
            <div
               ref={scrollRef}
               className="flex-1 overflow-y-auto p-4 space-y-4 font-sans text-sm"
            >
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-3 opacity-50 px-6">
                   <Zap className="h-8 w-8 text-primary" />
                   <p>I am your Procreation engineer. Ask me anything about art generation or minting.</p>
                </div>
              )}

              {messages.map((m, index) => {
                const isUser = m.role === "user";
                const isLast = index === messages.length - 1;

                // Content is already a string in the useChat hook messages
                const textContent = m.content;

                return (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex items-start gap-3 ${isUser ? "flex-row-reverse" : ""}`}
                  >
                    <div className={`
                      h-8 w-8 rounded-full flex items-center justify-center shrink-0
                      ${isUser ? "bg-accent" : "bg-primary/20"}
                    `}>
                      {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                    </div>
                    <div className={`
                      max-w-[80%] px-4 py-2.5 rounded-2xl
                      ${isUser
                        ? "bg-accent text-accent-foreground rounded-tr-none"
                        : "bg-muted/50 border border-primary/10 rounded-tl-none"}
                    `}>
                      {textContent ? (
                        <div className="whitespace-pre-wrap">{textContent}</div>
                      ) : isLast && status === "streaming" ? (
                        <div className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></span>
                          <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce delay-100"></span>
                          <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce delay-200"></span>
                        </div>
                      ) : (
                        "..."
                      )}
                    </div>
                  </motion.div>
                );
              })}

              {/* Loading indicator */}
              {isLoading && messages.length > 0 && messages[messages.length - 1]?.role === "user" && (
                <div className="flex items-start gap-3">
                   <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <Bot className="h-4 w-4" />
                   </div>
                   <div className="px-4 py-2.5 rounded-2xl bg-muted/50 border border-primary/10 rounded-tl-none">
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                   </div>
                </div>
              )}

              {error && (
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-destructive/20 flex items-center justify-center">
                    <AlertCircle className="h-4 w-4 text-destructive" />
                  </div>
                  <div className="max-w-[80%] px-4 py-2.5 rounded-2xl bg-destructive/10 border border-destructive/20 rounded-tl-none text-sm text-destructive">
                    {error.message || "An error occurred"}
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-primary/10 shrink-0">
              <div className="relative">
                <Input
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Describe your vision..."
                  className="pr-10 border-primary/20 bg-background/50 focus:ring-1 focus:ring-primary h-10"
                  disabled={isLoading}
                />
                <Button
                   type="submit"
                   size="icon"
                   disabled={isLoading || !input.trim()}
                   className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 bg-primary hover:bg-primary/90"
                >
                  {isLoading ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Send className="h-3.5 w-3.5" />
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
