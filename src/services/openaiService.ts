import { APP_ENV } from '@/configs';
import { AssistantMessage, MESSAGE_TYPE, UserMessage } from '@/types';

const BACKEND_URL = APP_ENV.BACKEND_API_URL;

interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface BackendResponse {
  success: boolean;
  data?: {
    id: string;
    object: string;
    created: number;
    model: string;
    choices: Array<{
      index: number;
      message: {
        role: string;
        content: string;
      };
      finish_reason: string;
    }>;
    usage: {
      prompt_tokens: number;
      completion_tokens: number;
      total_tokens: number;
    };
  };
  error?: string;
}

// Store conversation history
let conversationHistory: OpenAIMessage[] = [
  {
    role: 'system',
    content:
      'You are a helpful AI assistant focused on competitive intelligence. You help analyze market trends, competitor activities, and provide strategic insights.',
  },
];

export const sendMessageToGPT4 = async (
  userMessage: string,
): Promise<(UserMessage | AssistantMessage)[]> => {
  try {
    // Add user message to history
    conversationHistory.push({
      role: 'user',
      content: userMessage,
    });

    const response = await fetch(`${BACKEND_URL}/api/openai/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: conversationHistory,
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.statusText}`);
    }

    const result: BackendResponse = await response.json();

    if (!result.success || !result.data) {
      throw new Error(result.error || 'Failed to get response from backend');
    }

    if (result.data.choices && result.data.choices.length > 0) {
      const assistantMessage = result.data.choices[0].message.content;

      // Add assistant message to history
      conversationHistory.push({
        role: 'assistant',
        content: assistantMessage,
      });

      // Return formatted messages for the UI
      const messages: AssistantMessage[] = [
        {
          id: Date.now().toString(),
          date: new Date(),
          message_type: MESSAGE_TYPE.ASSISTANT_MESSAGE,
          content: assistantMessage,
        },
      ];

      return messages;
    }

    throw new Error('No response from OpenAI');
  } catch (error) {
    // Return error message
    return [
      {
        id: Date.now().toString(),
        date: new Date(),
        message_type: MESSAGE_TYPE.ASSISTANT_MESSAGE,
        content: `Error: ${
          error instanceof Error ? error.message : 'Failed to get response from GPT-4o'
        }`,
      },
    ];
  }
};

export const clearConversationHistory = () => {
  conversationHistory = [
    {
      role: 'system',
      content:
        'You are a helpful AI assistant focused on competitive intelligence. You help analyze market trends, competitor activities, and provide strategic insights.',
    },
  ];
};

export const getConversationHistory = () => {
  return conversationHistory;
};

// Speech synthesis function
export const generateSpeech = async (
  input: string,
  voice: string = 'coral',
  model: string = 'gpt-4o-mini-tts',
): Promise<Blob> => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/openai/speech`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input,
        voice,
        model,
      }),
    });

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.statusText}`);
    }

    // Return the audio blob directly
    return await response.blob();
  } catch (error) {
    throw new Error(
      `Failed to generate speech: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
};
