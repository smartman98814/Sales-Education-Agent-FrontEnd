'use client';

import { Icon } from '@iconify/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { Agent, getAgents } from '@/api/agent';
import { ButtonOrange } from '@/components/button';
import { Motion } from '@/components/common';
import { useAuth } from '@/context';

export const AgentsList = () => {
  const router = useRouter();
  const { user, openSignInDialog } = useAuth();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [agentDetails, setAgentDetails] = useState<
    Map<
      string,
      { name: string; description: string; image: string; type: string; skills: string[] }
    >
  >(new Map());

  useEffect(() => {
    const loadAgents = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError('');

        // Add delay to ensure authentication session is established
        await new Promise((resolve) => setTimeout(resolve, 2000));

        const fetchedAgents = await getAgents();
        setAgents(fetchedAgents);

        // Fetch character details for each agent
        const detailsMap = new Map();
        for (const agent of fetchedAgents) {
          if (agent.characterUrl) {
            try {
              const response = await fetch(agent.characterUrl);
              const characterData = await response.json();
              detailsMap.set(agent.id, {
                name: characterData.name || 'Unnamed Agent',
                description: characterData.description || 'No description available',
                image: characterData.image || '',
                type: characterData.agent?.type || 'Unknown',
                skills: characterData.agent?.skills || [],
              });
            } catch (error) {
              console.error(`Failed to fetch character data for agent ${agent.id}:`, error);
              detailsMap.set(agent.id, {
                name: 'Unnamed Agent',
                description: 'No description available',
                image: '',
                type: 'Unknown',
                skills: [],
              });
            }
          }
        }
        setAgentDetails(detailsMap);
      } catch (error) {
        console.error('Failed to load agents:', error);
        setError('Failed to load agents. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    loadAgents();
  }, [user]);

  const handleCreateAgent = () => {
    if (!user) {
      openSignInDialog();
      toast.error('Please log in!', {
        position: 'bottom-right',
        pauseOnHover: false,
        autoClose: 1500,
      });
      return;
    }
    router.push('/');
  };

  const handleChatWithAgent = (agentId: string) => {
    router.push(`/simulator?agentId=${agentId}`);
  };

  const handleEditAgent = (agentId: string) => {
    router.push(`/build?agentId=${agentId}`);
  };

  const handleMintAgent = (agentId: string) => {
    router.push(`/own-your-agent?agentId=${agentId}`);
  };

  if (!user) {
    return (
      <div className="w-full max-w-[90rem] mx-auto px-4 md:px-6 py-10">
        <Motion.div
          className="flex flex-col items-center justify-center gap-6 py-20"
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
        >
          <Icon icon="heroicons:user-circle" className="w-20 h-20 text-gray-500" />
          <h2 className="text-2xl font-semibold text-white font-tektur">
            Please Sign In to View Your Agents
          </h2>
          <p className="text-gray-400 text-center max-w-md">
            Connect your wallet to view and manage your AI agents
          </p>
        </Motion.div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full max-w-[90rem] mx-auto px-4 md:px-6 py-10">
        <Motion.div
          className="flex flex-col items-center justify-center gap-4 py-20"
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
        >
          <Icon icon="eos-icons:loading" className="w-12 h-12 text-orange-500 animate-spin" />
          <p className="text-gray-400">Loading your agents...</p>
        </Motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-[90rem] mx-auto px-4 md:px-6 py-10">
        <Motion.div
          className="flex flex-col items-center justify-center gap-6 py-20"
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
        >
          <Icon icon="heroicons:exclamation-triangle" className="w-20 h-20 text-red-500" />
          <h2 className="text-2xl font-semibold text-white font-tektur">Error Loading Agents</h2>
          <p className="text-gray-400 text-center max-w-md">{error}</p>
          <ButtonOrange onClick={() => window.location.reload()}>
            <span className="font-tektur font-semibold text-base uppercase">Try Again</span>
          </ButtonOrange>
        </Motion.div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[90rem] mx-auto px-4 md:px-6 py-10">
      <Motion.div
        className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8"
        initial={{ y: -20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
      >
        <div>
          <h1 className="text-white font-semibold text-3xl font-tektur uppercase">My Agents</h1>
          <p className="text-gray-400 mt-2">
            Manage and interact with your AI agents ({agents.length})
          </p>
        </div>
        <button
          onClick={handleCreateAgent}
          className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded transition-colors flex items-center gap-2"
        >
          <Icon icon="heroicons:plus-circle" className="w-4 h-4" />
          <span>Create New Agent</span>
        </button>
      </Motion.div>

      {agents.length === 0 ? (
        <Motion.div
          className="flex flex-col items-center justify-center gap-6 py-20 bg-gray-800/50 border border-white/15 rounded-lg"
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          delay={0.2}
        >
          <Icon icon="heroicons:cube-transparent" className="w-20 h-20 text-gray-500" />
          <h2 className="text-2xl font-semibold text-white font-tektur">No Agents Yet</h2>
          <p className="text-gray-400 text-center max-w-md">
            Create your first AI agent to get started with personalized conversations
          </p>
          <ButtonOrange onClick={handleCreateAgent}>
            <div className="flex items-center gap-2 font-tektur font-semibold text-base uppercase">
              <Icon icon="heroicons:plus-circle" className="w-5 h-5" />
              Create Your First Agent
            </div>
          </ButtonOrange>
        </Motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent, index) => {
            const details = agentDetails.get(agent.id);
            return (
              <Motion.div
                key={agent.id}
                className="bg-gray-800/75 border border-white/15 rounded-lg overflow-hidden hover:border-orange-500/50 transition-all duration-300"
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                delay={0.1 * index}
              >
                {/* Agent Image */}
                <div className="relative w-full aspect-square bg-gray-900">
                  {details?.image ? (
                    <img
                      src={details.image}
                      alt={details.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Icon icon="heroicons:user-circle" className="w-24 h-24 text-gray-600" />
                    </div>
                  )}
                  {agent.agentNumber && (
                    <div className="absolute top-3 right-3 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      #{agent.agentNumber}
                    </div>
                  )}
                </div>

                {/* Agent Details */}
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="text-white font-semibold text-xl font-tektur truncate">
                      {details?.name || 'Unnamed Agent'}
                    </h3>
                    <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                      {details?.description || 'No description available'}
                    </p>
                  </div>

                  {/* Agent Type */}
                  {details?.type && (
                    <div className="flex items-center gap-2">
                      <Icon icon="heroicons:tag" className="w-4 h-4 text-orange-500" />
                      <span className="text-xs text-gray-300 uppercase">{details.type}</span>
                    </div>
                  )}

                  {/* Skills */}
                  {details?.skills && details.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {details.skills.slice(0, 3).map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-orange-500/20 border border-orange-500/30 text-orange-400 text-xs rounded"
                        >
                          {skill}
                        </span>
                      ))}
                      {details.skills.length > 3 && (
                        <span className="px-2 py-1 bg-gray-700 text-gray-400 text-xs rounded">
                          +{details.skills.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Created Date */}
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Icon icon="heroicons:calendar" className="w-4 h-4" />
                    <span>Created {new Date(agent.createdAt).toLocaleDateString()}</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => handleEditAgent(agent.id)}
                      className="flex-1 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded transition-colors flex items-center justify-center gap-1"
                    >
                      <Icon icon="heroicons:pencil-square" className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleChatWithAgent(agent.id)}
                      className="flex-1 px-3 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded transition-colors flex items-center justify-center gap-1"
                    >
                      <Icon icon="heroicons:chat-bubble-left-right" className="w-4 h-4" />
                      Chat
                    </button>
                    <button
                      onClick={() => handleMintAgent(agent.id)}
                      className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded transition-colors flex items-center justify-center gap-1"
                    >
                      <Icon icon="heroicons:sparkles" className="w-4 h-4" />
                      Mint
                    </button>
                  </div>
                </div>
              </Motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};
