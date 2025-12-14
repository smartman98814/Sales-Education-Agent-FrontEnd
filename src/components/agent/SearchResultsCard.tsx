import { Icon } from '@iconify/react';
import React from 'react';

import { WebSearchResult } from '@/services/webSearchService';

interface SearchResultsCardProps {
  results: WebSearchResult[];
}

export default function SearchResultsCard({ results }: SearchResultsCardProps) {
  if (!results || results.length === 0) {
    return null;
  }

  const openUrl = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const isGoogleSearch = (url: string) => url.includes('google.com/search');

  return (
    <div className="mt-3 space-y-2">
      <div className="flex items-center gap-2 mb-2">
        <Icon icon="mdi:magnify" className="w-4 h-4 text-blue-400" />
        <span className="text-xs font-medium text-blue-400">
          {isGoogleSearch(results[0]?.url) ? 'Related Searches' : 'Web Search Results'}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {results.map((result, index) => (
          <div
            key={index}
            onClick={() => openUrl(result.url)}
            className="group p-3 rounded-lg bg-gray-800 border border-gray-600 hover:border-blue-500 transition-all cursor-pointer"
          >
            <div className="flex items-start gap-2">
              <Icon
                icon={isGoogleSearch(result.url) ? 'mdi:google' : 'mdi:link-variant'}
                className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors line-clamp-2 mb-1">
                  {result.title}
                </h4>
                {result.snippet && (
                  <p className="text-xs text-gray-400 line-clamp-2 mb-2">{result.snippet}</p>
                )}
                <div className="flex items-center gap-2">
                  {result.source ? (
                    <span className="text-xs text-gray-500 truncate">{result.source}</span>
                  ) : isGoogleSearch(result.url) ? (
                    <span className="text-xs text-gray-500">Search on Google</span>
                  ) : null}
                  <Icon
                    icon="mdi:open-in-new"
                    className="w-3 h-3 text-gray-500 group-hover:text-blue-400 transition-colors ml-auto flex-shrink-0"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
