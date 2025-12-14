import { Icon } from '@iconify/react';
import { useVoiceAssistant } from '@livekit/components-react';
import React, { useEffect, useRef, useState } from 'react';

import useCombinedTranscriptions from '@/hooks/useCombinedTranscriptions';
import { WebSearchResult, searchFromConversation } from '@/services/webSearchService';

import SearchResultsCard from './SearchResultsCard';

interface TranscriptionViewProps {
  agentName?: string;
  textMessages?: any[];
}

export default function TranscriptionView({
  agentName = 'Agent',
  textMessages = [],
}: TranscriptionViewProps) {
  const combinedTranscriptions = useCombinedTranscriptions();

  // Merge text messages with combined transcriptions
  const allMessages = React.useMemo(() => {
    return [...combinedTranscriptions, ...textMessages].sort(
      (a, b) => a.firstReceivedTime - b.firstReceivedTime,
    );
  }, [combinedTranscriptions, textMessages]);
  const { state: agentState } = useVoiceAssistant();
  const containerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const [isAtBottom, setIsAtBottom] = useState(true);
  const [searchResultsMap, setSearchResultsMap] = useState<Record<string, WebSearchResult[]>>({});
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());
  const [lastProcessedMessageId, setLastProcessedMessageId] = useState<string | null>(null);
  const previousAgentState = useRef<string>(agentState);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    setIsAtBottom(true);
  };

  // Perform web search when agent finishes speaking (transitions to 'listening')
  useEffect(() => {
    const performSearchForConversation = async () => {
      // Only trigger when agent state changes from 'speaking' to 'listening'
      if (previousAgentState.current !== 'speaking' || agentState !== 'listening') {
        previousAgentState.current = agentState;
        return;
      }

      previousAgentState.current = agentState;

      // Find the last assistant message
      let lastAssistantMessage = null;
      for (let i = allMessages.length - 1; i >= 0; i--) {
        if (allMessages[i].role === 'assistant') {
          lastAssistantMessage = allMessages[i];
          break;
        }
      }

      if (!lastAssistantMessage) return;

      // Skip if already processed or currently processing
      if (
        lastAssistantMessage.id === lastProcessedMessageId ||
        searchResultsMap[lastAssistantMessage.id] ||
        processingIds.has(lastAssistantMessage.id)
      ) {
        return;
      }

      // Find the previous user message
      let userMessage = '';
      for (let i = allMessages.length - 1; i >= 0; i--) {
        if (allMessages[i].role === 'user') {
          userMessage = allMessages[i].text;
          break;
        }
      }

      // Mark as processing
      setProcessingIds((prev) => new Set(prev).add(lastAssistantMessage.id));
      setLastProcessedMessageId(lastAssistantMessage.id);

      try {
        const searchResults = await searchFromConversation(userMessage, lastAssistantMessage.text);

        if (searchResults.length > 0) {
          setSearchResultsMap((prev) => ({
            ...prev,
            [lastAssistantMessage.id]: searchResults,
          }));
        }
      } catch (error) {
        console.error('Error performing web search:', error);
      } finally {
        // Remove from processing
        setProcessingIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(lastAssistantMessage.id);
          return newSet;
        });
      }
    };

    performSearchForConversation();
  }, [agentState, allMessages]);

  // scroll to bottom when new transcription is added
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [allMessages]);

  useEffect(() => {
    if (isAtBottom) {
      scrollToBottom();
    }
  }, [allMessages, isAtBottom]);

  // Scroll to bottom when search results are added
  useEffect(() => {
    if (isAtBottom && Object.keys(searchResultsMap).length > 0) {
      // Use setTimeout to ensure DOM has updated with the new cards
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    }
  }, [searchResultsMap, isAtBottom]);

  // Track scroll position
  const handleScroll = () => {
    if (!chatContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 50;
    setIsAtBottom(isNearBottom);
  };

  return (
    <div className="relative w-full h-[calc(100%-57px)]">
      <div
        ref={chatContainerRef}
        onScroll={handleScroll}
        className="custom-scroll w-full h-full [scrollbar-gutter:stable_both-edges] overflow-auto px-3 py-4 flex flex-col gap-4"
      >
        <div className="w-full max-w-[694px] mx-auto space-y-4 pb-28">
          {allMessages.map((segment: any, index: number) => (
            <div
              key={segment.id}
              className={`max-w-[calc(100%-24px)] lg:max-w-[448px] p-4 rounded-2xl bg-gray-700 border border-gray-700 text-white ${
                segment.role !== 'assistant' ? 'ml-auto' : ''
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                {segment.role !== 'assistant' ? (
                  <span className="text-xs font-medium text-gray-350">You</span>
                ) : (
                  <span className="text-xs font-medium text-gray-350">{agentName}</span>
                )}
              </div>
              <p className="text-sm whitespace-pre-wrap">{segment.text}</p>

              {/* Display search results if detected */}
              {searchResultsMap[segment.id] && (
                <SearchResultsCard results={searchResultsMap[segment.id]} />
              )}

              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs text-gray-350">
                  {new Date(segment.firstReceivedTime).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                  })}
                </span>
              </div>
            </div>
          ))}

          {agentState === 'thinking' && (
            <div className="max-w-[calc(100%-24px)] lg:max-w-[448px] p-4 rounded-2xl bg-gray-700 border border-gray-700 text-white">
              <div className="flex items-center gap-2">
                <Icon icon="quill:loading-spin" className="w-4 h-4 text-white animate-spin" />
                <span className="text-sm text-gray-350">{agentName} is thinking...</span>
              </div>
            </div>
          )}
        </div>

        <div ref={messagesEndRef} />

        {/* Scroll to bottom button */}
        {!isAtBottom && (
          <button
            onClick={scrollToBottom}
            className="absolute bottom-28 right-5 p-2 bg-gray-700 text-white rounded-full shadow-lg hover:bg-blue-600 z-30"
          >
            <Icon icon="line-md:chevron-down" className="w-4 h-4" />
          </button>
        )}

        <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-gray-900 to-transparent z-10" />
      </div>
    </div>
  );
}
