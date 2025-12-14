import { APP_ENV } from '@/configs';

const BACKEND_URL = APP_ENV.BACKEND_API_URL;

export interface WebSearchResult {
  title: string;
  url: string;
  snippet: string;
  source?: string;
}

export interface SearchAnalysis {
  shouldSearch: boolean;
  searchQueries: string[];
}

/**
 * Analyzes conversation to determine if web search would be helpful
 * and generates appropriate search queries
 */
export const analyzeConversationForSearch = async (
  userMessage: string,
  agentResponse: string,
): Promise<SearchAnalysis> => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/openai/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a search query generator. Analyze the conversation between user and assistant to determine if web searches would provide helpful additional information.

Generate search queries for:
- Specific places, destinations, or locations mentioned
- Products, services, or items recommended
- Topics that would benefit from more detailed information
- Specific entities (companies, people, places) mentioned

Return a JSON object:
{
  "shouldSearch": boolean,
  "searchQueries": ["query1", "query2", ...]
}

Generate 2-5 specific, focused search queries. Make queries natural and search-engine friendly.
For example:
- "best beaches Maldives 2025"
- "Bora Bora luxury resorts"
- "Grace Bay Beach Turks and Caicos"

If the conversation is too general or doesn't mention specific searchable items, return:
{
  "shouldSearch": false,
  "searchQueries": []
}

Only return the JSON object, no additional text.`,
          },
          {
            role: 'user',
            content: `User: "${userMessage}"\n\nAssistant: "${agentResponse}"\n\nGenerate search queries for this conversation.`,
          },
        ],
        temperature: 0.3,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      return { shouldSearch: false, searchQueries: [] };
    }

    const result = await response.json();

    if (result.success && result.data?.choices?.[0]?.message?.content) {
      const content = result.data.choices[0].message.content;

      try {
        const cleanContent = content.replace(/```json\n?|\n?```/g, '').trim();
        const parsed = JSON.parse(cleanContent);

        return {
          shouldSearch: parsed.shouldSearch || false,
          searchQueries: parsed.searchQueries || [],
        };
      } catch (parseError) {
        console.error('Error parsing search analysis response:', parseError);
        return { shouldSearch: false, searchQueries: [] };
      }
    }

    return { shouldSearch: false, searchQueries: [] };
  } catch (error) {
    console.error('Error in analyzeConversationForSearch:', error);
    return { shouldSearch: false, searchQueries: [] };
  }
};

/**
 * Creates a Google search result for a query
 */
export const createGoogleSearchResult = (query: string): WebSearchResult => {
  return {
    title: query,
    url: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
    snippet: `Click to search for: ${query}`,
    source: 'Google Search',
  };
};

/**
 * Main function to analyze conversation and generate search links
 */
export const searchFromConversation = async (
  userMessage: string,
  agentResponse: string,
): Promise<WebSearchResult[]> => {
  try {
    // First, analyze if we should search
    const analysis = await analyzeConversationForSearch(userMessage, agentResponse);

    if (!analysis.shouldSearch || analysis.searchQueries.length === 0) {
      return [];
    }

    // Create Google search results for each query
    const searchResults: WebSearchResult[] = analysis.searchQueries.map((query) =>
      createGoogleSearchResult(query),
    );

    // Limit to top 5 results
    return searchResults.slice(0, 5);
  } catch (error) {
    console.error('Error in searchFromConversation:', error);
    return [];
  }
};
