"use client"

import React, { useState, useRef, useEffect } from 'react'
import { Send, Loader2 } from 'lucide-react'
import { ModeToggle } from './mainToggle'
import APIWarningBanner from './APIwarning'
import { languageDetector, translator, summarizer } from '@/utils/aiServices'

type Message = {
  id: string
  text: string
  language?: string
  summary?: string
  translation?: string
  selectedLanguage?: string
  isTranslating?: boolean
  isSummarizing?: boolean
}

type LanguageOption = {
  code: string
  name: string
}

declare global {
  interface Window {
    ai?: {
      translator: {
        capabilities: () => Promise<{
          languagePairAvailable: (source: string, target: string) => boolean;
        }>;
        create: (config: {
          sourceLanguage: string;
          targetLanguage: string;
        }) => Promise<{
          translate: (text: string) => Promise<string>;
        }>;
      };
      summarizer: {
        capabilities: () => Promise<{
          available: 'no' | 'readily' | 'after-download';
        }>;
        create: (config: {
          type: string;
          format: string;
          length: string;
        }) => Promise<{
          summarize: (text: string) => Promise<string>;
          ready: Promise<void>;
        }>;
      };
    };
  }
}

const LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: 'en', name: 'English' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'es', name: 'Spanish' },
  { code: 'ru', name: 'Russian' },
  { code: 'tr', name: 'Turkish' },
  { code: 'fr', name: 'French' },
  { code: 'ja', name: 'Japanese'}
]


const detectLanguage = async (text: string): Promise<string> => {
  try {
    const result = await languageDetector.detectLanguage(text);
    return result.detectedLanguage;
  } catch (error) {
    console.error('Language detection error:', error);
    throw new Error('Failed to detect language');
  }
};


export const TextProcessor = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!inputText.trim()) {
      setError('Please enter some text');
      return;
    }
  
    setIsLoading(true);
    setError(null);
  
    try {
      const detectedLang = await detectLanguage(inputText);
      const newMessage: Message = {
        id: Date.now().toString(),
        text: inputText,
        language: detectedLang,
      };
  
      setMessages(prev => [...prev, newMessage]);
      setInputText('');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to process text. Please try again.';
      setError(errorMessage);
      console.error('Send error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSummarize = async (messageId: string) => {
    setIsLoading(true);
    setError(null);
  
    try {
      const message = messages.find(m => m.id === messageId);
      if (!message) {
        throw new Error('Message not found');
      }
  
      console.log('Text to summarize:', {
        content: message.text,
        length: message.text.length,
        type: typeof message.text
      });
  
      setMessages(prev =>
        prev.map(m =>
          m.id === messageId ? { ...m, isSummarizing: true } : m
        )
      );
  
      const summary = await summarizer.summarize(message.text);
      
      setMessages(prev =>
        prev.map(m =>
          m.id === messageId ? { 
            ...m, 
            summary,
            isSummarizing: false 
          } : m
        )
      );
    } catch (err) {
      console.error('Summarization error:', err);
      setError(err instanceof Error ? err.message : 'Failed to summarize text');
      
      setMessages(prev =>
        prev.map(m =>
          m.id === messageId ? { ...m, isSummarizing: false } : m
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleTranslate = async (messageId: string, targetLang: string) => {
    if (!targetLang) {
      setError('Target language is required');
      return;
    }
  
    setIsLoading(true);
    setError(null);
  
    try {
      const message = messages.find(m => m.id === messageId);
      if (!message) {
        throw new Error('Message not found');
      }

      const sourceLanguage = message.language || await detectLanguage(message.text);
  
      if (sourceLanguage === targetLang) {
        setError('Source and target languages are the same');
        return;
      }
  
      setMessages(prev =>
        prev.map(m =>
          m.id === messageId ? { ...m, isTranslating: true } : m
        )
      );
  
      const { translatedText } = await translator.translate(
        message.text,
        sourceLanguage,
        targetLang
      );
  
      setMessages(prev =>
        prev.map(m =>
          m.id === messageId ? {
            ...m,
            translation: translatedText,
            selectedLanguage: targetLang,
            isTranslating: false
          } : m
        )
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to translate text';
      setError(errorMessage);
      console.error('Translation error:', err);
      
      // Reset translating state on error
      setMessages(prev =>
        prev.map(m =>
          m.id === messageId ? { ...m, isTranslating: false } : m
        )
      );
    } finally {
      setIsLoading(false);
    }
};

const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    handleSend();
  }
};

const handleClearMessages = () => {
  setMessages([]);
};

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto p-4 gap-4">
      <APIWarningBanner/>
      <div className="flex justify-between">
        <ModeToggle />
        <button
          onClick={handleClearMessages}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-red-600 "
          aria-label="Clear messages"
        >
          Clear Chats
        </button>
      </div>
      

      <div className="flex-1 overflow-y-auto space-y-4 pb-4">
        {messages.map(message => (
          <div
            key={message.id}
            className="bg-gray-400 dark:bg-gray-800 rounded-lg shadow p-4 space-y-2"
            role="article"
            aria-label="Message"
          >
            <p className="text-gray-800 dark:text-gray-200">{message.text}</p>
            
            {message.language && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Detected language: {
                  LANGUAGE_OPTIONS.find(l => l.code === message.language)?.name || message.language
                }
              </p>
            )}

            <div className="flex flex-wrap gap-2 mt-2">
              {message.language === 'en' && message.text.length > 150 && !message.summary && (
                <button
                  onClick={() => handleSummarize(message.id)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 focus:outline-none dark:focus:ring-blue-600"
                  aria-label="Summarize text"
                >
                  Summarize
                </button>
              )}

              <div className="flex gap-2">
                <select
                  onChange={(e) => handleTranslate(message.id, e.target.value)}
                  className="border rounded px-3 py-2 focus:ring-2 focus:ring-blue-300 focus:outline-none bg-slate-800 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                  aria-label="Select target language"
                >
                  <option value="">Select language</option>
                  {LANGUAGE_OPTIONS.map(lang => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {message.summary && (
              <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900 rounded">
                <p className="text-sm font-medium dark:text-gray-200">Summary:</p>
                <p className="dark:text-gray-300">{message.summary}</p>
              </div>
            )}
            {message.isSummarizing && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Loader2 className="w-4 h-4 animate-spin" />
                Summarizing...
              </div>
            )}

            {message.translation && (
              <div className="mt-2 p-2 bg-gray-900 dark:bg-green-900 rounded">
                <p className="text-sm font-medium dark:text-gray-200">
                  Translation ({LANGUAGE_OPTIONS.find(l => l.code === message.selectedLanguage)?.name}):
                </p>
                <p className=" dark:text-gray-300">{message.translation}</p>
              </div>
            )}
            {message.isTranslating && (
              <div className="flex items-center gap-2 text-sm text-gray-900 ">
                <Loader2 className="w-4 h-4 animate-spin" />
                Translating...
              </div>
)}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {error && (
        <div
          className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded"
          role="alert"
        >
          <p>{error}</p>
        </div>
      )}

      <div className="flex gap-2 items-end">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 flex-col gap-1.5 p-3 transition-all duration-200 relative cursor-text z-10 rounded-t-2xl border-b-0 focus:ring-2 focus:ring-blue-300 focus:outline-none resize-none bg-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          placeholder="Type your message..."
          rows={3}
          aria-label="Message input"
        />
        <button
          onClick={handleSend}
          disabled={isLoading}
          className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 focus:outline-none disabled:opacity-50 dark:focus:ring-blue-600"
          aria-label="Send message"
        >
          {isLoading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <Send className="w-6 h-6" />
          )}
        </button>
      </div>
    </div>
  )
}
