import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  PaperAirplaneIcon, 
  ArrowLeftIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { CpuChipIcon } from '@heroicons/react/24/solid';
import { useAuth } from '../context/AuthContext';
import { useAIChat } from '../hooks/useAIChat';
import config from '../config';
import TutorImageBlock from '../components/TutorImageBlock';

const AIChatPage = () => {
  const { skillId } = useParams();
  const [searchParams] = useSearchParams();
  const skillName = searchParams.get('skill') || 'General';
  const navigate = useNavigate();
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState('');
  const [aiTeacherInfo, setAiTeacherInfo] = useState(null);
  const messagesEndRef = useRef(null);
  // Track image requests by their IDs (keyed by content hash to prevent duplicates)
  const [imageRequests, setImageRequests] = useState({});
  const processedImagesRef = useRef(new Set());

  const { messages, isLoading, error, sendMessage, clearMessages } = useAIChat(skillName);


  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Fetch AI teacher info
  useEffect(() => {
    const fetchAITeacher = async () => {
      try {
        const response = await fetch(`${config.API_URL}/api/ai-teachers?skill_id=${skillId}`);
        const data = await response.json();
        if (data.success && data.teachers?.[0]) {
          setAiTeacherInfo(data.teachers[0]);
        }
      } catch (err) {
        console.error('Error fetching AI teacher:', err);
      }
    };

    if (skillId) {
      fetchAITeacher();
    }
  }, [skillId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || isLoading) return;

    const message = newMessage;
    setNewMessage('');
    await sendMessage(message);
  };

  // Parse and trigger image generation from AI response
  const parseAndTriggerImages = async (content, messageId) => {
    // Regex to find GENERATE_IMAGE blocks with any JSON content
    const imageBlockRegex = /GENERATE_IMAGE:\s*\n?\s*\{[\s\S]*?"prompt"\s*:\s*"([^"]+)"[\s\S]*?\}/g;
    
    let match;
    while ((match = imageBlockRegex.exec(content)) !== null) {
      const prompt = match[1].trim();
      const blockKey = `${messageId}-${prompt.substring(0, 50)}`;
      
      // Skip if already processed
      if (processedImagesRef.current.has(blockKey)) continue;
      processedImagesRef.current.add(blockKey);
      
      try {
        const res = await fetch(`${config.API_URL}/api/tutor-image/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            type: 'EXPLANATION', 
            topic: prompt.substring(0, 50), 
            details: prompt 
          })
        });
        
        const data = await res.json();
        if (data.success && data.imageId) {
          setImageRequests(prev => ({
            ...prev,
            [blockKey]: { imageId: data.imageId, prompt }
          }));
        }
      } catch (err) {
        console.error('Failed to trigger image generation:', err);
      }
    }
  };

  // Effect to process AI messages for image requests
  useEffect(() => {
    messages.forEach(msg => {
      if (msg.role === 'assistant' && msg.content.includes('GENERATE_IMAGE:')) {
        parseAndTriggerImages(msg.content, msg.id);
      }
    });
  }, [messages]);

  // Format message content (handle markdown code blocks and image requests)
  const formatMessage = (content, messageId) => {
    // Regex to match GENERATE_IMAGE blocks with any JSON content
    const imageBlockRegex = /(GENERATE_IMAGE:\s*\n?\s*\{[\s\S]*?\})/g;
    const parts = content.split(imageBlockRegex);
    
    return parts.map((part, i) => {
      // Check if this is a GENERATE_IMAGE block
      if (part.trim().startsWith('GENERATE_IMAGE:')) {
        // Extract prompt from the JSON
        const promptMatch = part.match(/"prompt"\s*:\s*"([^"]+)"/);
        
        if (promptMatch) {
          const prompt = promptMatch[1].trim();
          const blockKey = `${messageId}-${prompt.substring(0, 50)}`;
          const imageData = imageRequests[blockKey];
          
          if (imageData?.imageId) {
            return (
              <TutorImageBlock 
                key={i}
                imageId={imageData.imageId}
                topic={prompt.substring(0, 50)}
                type="EXPLANATION"
              />
            );
          }
          
          // Show placeholder while waiting for image ID
          return (
            <div key={i} className="my-4 p-4 rounded-xl border border-teal-500/30 bg-teal-950/30">
              <p className="text-teal-300 text-sm">🎨 Generating visual...</p>
            </div>
          );
        }
        // If no prompt found, don't render this block
        return null;
      }
      
      // Handle code blocks in regular text
      const codeParts = part.split(/(```[\s\S]*?```)/g);
      return codeParts.map((codePart, j) => {
        if (codePart.startsWith('```') && codePart.endsWith('```')) {
          const code = codePart.slice(3, -3).replace(/^\w+\n/, '');
          return (
            <pre key={`${i}-${j}`} className="bg-charcoal-900 text-green-400 p-3 rounded-lg my-2 overflow-x-auto text-sm">
              <code>{code}</code>
            </pre>
          );
        }
        return <span key={`${i}-${j}`}>{codePart}</span>;
      });
    });
  };




  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-mint-50 dark:bg-charcoal-950">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-violet-600 to-indigo-600 border-b border-violet-500 flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5" />
        </button>
        
        <div className="flex items-center gap-3 flex-1">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <CpuChipIcon className="w-6 h-6 text-white" />
            </div>
            <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-400 ring-2 ring-violet-600" />
          </div>
          <div>
            <h3 className="font-bold text-white flex items-center gap-2">
              {aiTeacherInfo?.full_name || `${skillName} AI Tutor`}
              <SparklesIcon className="w-4 h-4" />
            </h3>
            <p className="text-xs text-violet-200">
              AI Tutor • Always Online • Instant Responses
            </p>
          </div>
        </div>

        <button
          onClick={clearMessages}
          className="text-violet-200 hover:text-white text-sm px-3 py-1 hover:bg-white/10 rounded-lg transition-colors"
        >
          Clear Chat
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Welcome Message */}
        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-8"
          >
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
              <CpuChipIcon className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-xl font-bold text-charcoal-900 dark:text-white mb-2">
              Welcome! I'm your {skillName} AI Tutor
            </h2>
            <p className="text-charcoal-600 dark:text-mint-300 max-w-md mx-auto">
              Ask me anything about {skillName}. I'm here to help you learn, answer questions, 
              and provide examples. Let's start learning!
            </p>
            
            {/* Quick Start Prompts */}
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {[
                `What should I learn first in ${skillName}?`,
                `Explain the basics of ${skillName}`,
                `Give me a practice exercise`
              ].map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setNewMessage(prompt);
                  }}
                  className="px-4 py-2 bg-white dark:bg-charcoal-800 border border-violet-200 dark:border-violet-700 rounded-full text-sm text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/30 transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Message List */}
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center mr-2 flex-shrink-0">
                <CpuChipIcon className="w-4 h-4 text-white" />
              </div>
            )}
            <div className={`max-w-[80%] px-4 py-3 rounded-2xl ${
              msg.role === 'user'
                ? 'bg-emerald-500 text-white rounded-tr-sm'
                : 'bg-white dark:bg-charcoal-800 text-charcoal-900 dark:text-white border border-violet-100 dark:border-violet-800 rounded-tl-sm'
            }`}>
              <div className="whitespace-pre-wrap">{formatMessage(msg.content, msg.id)}</div>
              <p className={`text-xs mt-2 ${
                msg.role === 'user' ? 'text-emerald-100' : 'text-charcoal-500 dark:text-mint-400'
              }`}>
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </motion.div>
        ))}

        {/* AI Typing Indicator */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center mr-2">
              <CpuChipIcon className="w-4 h-4 text-white" />
            </div>
            <div className="bg-white dark:bg-charcoal-800 px-4 py-3 rounded-2xl rounded-tl-sm border border-violet-100 dark:border-violet-800">
              <div className="flex space-x-1.5 items-center h-5">
                {[0, 1, 2].map((dot) => (
                  <motion.div
                    key={dot}
                    className="w-2 h-2 bg-violet-500 rounded-full"
                    initial={{ y: 0 }}
                    animate={{ y: -6 }}
                    transition={{
                      duration: 0.5,
                      repeat: Infinity,
                      repeatType: "reverse",
                      ease: "easeInOut",
                      delay: dot * 0.15
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Error Message */}
        {error && (
          <div className="text-center py-2">
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white dark:bg-charcoal-900 border-t border-mint-200 dark:border-charcoal-700">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={`Ask me about ${skillName}...`}
            disabled={isLoading}
            className="flex-1 p-3 border border-violet-200 dark:border-charcoal-700 rounded-xl bg-mint-50 dark:bg-charcoal-800 text-charcoal-900 dark:text-mint-100 placeholder-charcoal-500 dark:placeholder-mint-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || isLoading}
            className="p-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl hover:from-violet-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
          >
            <PaperAirplaneIcon className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AIChatPage;
