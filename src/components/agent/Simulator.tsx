'use client';

import { Button } from '@headlessui/react';
import { Icon } from '@iconify/react';
import {
  BarVisualizer,
  DisconnectButton,
  RoomAudioRenderer,
  RoomContext,
  VideoTrack,
  useVoiceAssistant,
} from '@livekit/components-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Room, RoomEvent, setLogLevel } from 'livekit-client';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';

import { getAgentById } from '@/api/agent';
import type { ConnectionDetails } from '@/app/api/connection-details/route';
import { ChatIcon } from '@/components/svg';
import { useAuth } from '@/context';
import { useIsMobile } from '@/hooks';
import { Character } from '@/types';

import TranscriptionView from './TranscriptionView';

interface SimulatorProps {
  agentId?: string;
}

export const Simulator = ({ agentId }: SimulatorProps) => {
  if (process.env.NODE_ENV !== 'development') {
    setLogLevel('silent');
  }

  const { user } = useAuth();
  const [room] = useState(new Room());
  const router = useRouter();

  const isMobile = useIsMobile();
  const [showChatOnMobile, setShowChatOnMobile] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [uid, setUid] = useState<string>('');
  const [type, setType] = useState<'agent' | ''>('agent');
  // const [textMessage, setTextMessage] = useState<string>('');
  const [sentTextMessages] = useState<any[]>([]);

  // Check for agentId and redirect if not provided
  useEffect(() => {
    if (!agentId) {
      // Redirect to build page if no agentId is provided
      router.push('/build');
    }
  }, [agentId, router]);

  const onConnectButtonClicked = useCallback(
    async (uid: string, type: string) => {
      if (!user) {
        return;
      }
      const url = new URL(
        `/api/connection-details?uid=${uid}&type=${type}`,
        window.location.origin,
      );
      const response = await fetch(url.toString());
      const connectionDetailsData: ConnectionDetails = await response.json();

      await room.connect(connectionDetailsData.serverUrl, connectionDetailsData.participantToken);
      await room.localParticipant.setMicrophoneEnabled(true);
    },
    [room, user, agentId],
  );

  useEffect(() => {
    room.on(RoomEvent.MediaDevicesError, onDeviceFailure);

    return () => {
      room.off(RoomEvent.MediaDevicesError, onDeviceFailure);
    };
  }, [room]);

  // Load agent data based on agentId
  useEffect(() => {
    const loadAgentData = async () => {
      if (!user) return;
      if (!agentId) return;

      // Add a small delay to ensure authentication session is fully established
      await new Promise((resolve) => setTimeout(resolve, 500));

      try {
        // Load agent data
        const agent = await getAgentById(agentId);
        const characterUrl = agent.characterUrl;
        const agentNumber = agent.agentNumber || '';

        // Fetch character data from character URL
        if (characterUrl) {
          try {
            const response = await fetch(characterUrl);
            const characterData = await response.json();

            // Create Character object from characterData
            const character: Character = {
              uid: characterData.agent.uid,
              agentNumber: agentNumber,
              name: characterData.name,
              image: characterData.image || '/images/chatandbuild/agent-avatar.webp',
              description: characterData.description,
              type: characterData.agent.type,
              skills: characterData.agent.skills || [],
              vaultURI: '',
              vaultHash: '',
            };

            setType('agent');
            setUid(agentId);
            setSelectedCharacter(character);
          } catch (error) {
            console.error('Failed to fetch character data from URL:', error);
          }
        }
      } catch (error) {
        console.error('Failed to load agent from backend:', error);
      }
    };

    loadAgentData();
  }, [user, agentId]);

  function onDeviceFailure(error: Error) {
    console.error(error);
    alert(
      'Error acquiring camera or microphone permissions. Please make sure you grant the necessary permissions in your browser and reload the tab',
    );
  }

  function SimpleVoiceAssistant() {
    const { state: agentState } = useVoiceAssistant();
    const [imageLoaded, setImageLoaded] = useState(false);
    const [currentImageUrl, setCurrentImageUrl] = useState<string>('');
    const imgRef = React.useRef<HTMLImageElement>(null);

    useEffect(() => {
      const newImageUrl = selectedCharacter?.image || '/images/chatandbuild/agent-avatar.webp';

      if (newImageUrl !== currentImageUrl) {
        setCurrentImageUrl(newImageUrl);
        setImageLoaded(false);

        if (imgRef.current?.complete && imgRef.current?.naturalHeight !== 0) {
          setImageLoaded(true);
        }
      }
    }, [selectedCharacter?.image, currentImageUrl]);

    const handleImageLoad = () => {
      setImageLoaded(true);
    };

    const handleImageError = () => {
      setImageLoaded(true);
    };

    return (
      <>
        {agentState === 'disconnected' ? (
          <div className="relative w-full h-full">
            {!selectedCharacter ? (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-white text-sm font-medium">Loading...</p>
                </div>
              </div>
            ) : (
              <>
                {!imageLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-800 z-10">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-white text-sm font-medium">Loading agent...</p>
                    </div>
                  </div>
                )}
                <img
                  ref={imgRef}
                  src={selectedCharacter.image || '/images/chatandbuild/agent-avatar.webp'}
                  alt="Agent avatar"
                  className="w-full h-full object-cover"
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                />
              </>
            )}
          </div>
        ) : agentState === 'connecting' ? (
          <div className="relative w-full h-full flex items-center justify-center bg-gray-800">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-white text-sm font-medium">Connecting...</p>
            </div>
          </div>
        ) : (
          <>
            <AgentVisualizer />
            <RoomAudioRenderer />
          </>
        )}
      </>
    );
  }

  function AgentVisualizer() {
    const { state: agentState, videoTrack, audioTrack } = useVoiceAssistant();
    if (videoTrack) {
      return (
        <div className="h-full w-full rounded-lg overflow-hidden">
          <VideoTrack className="w-full h-full" trackRef={videoTrack} />
        </div>
      );
    }
    return (
      <div className="h-full w-full">
        <BarVisualizer
          state={agentState}
          barCount={5}
          trackRef={audioTrack}
          className="agent-visualizer"
          options={{ minHeight: 24 }}
        />
      </div>
    );
  }

  function EditButtons() {
    const { state: agentState } = useVoiceAssistant();

    // Only show edit buttons when disconnected
    if (agentState !== 'disconnected' || !agentId) {
      return null;
    }

    const isDisabled = !selectedCharacter;

    return (
      <div className="flex items-center justify-center gap-3 px-6">
        <button
          onClick={() => !isDisabled && router.push(`/avatar?agentId=${agentId}`)}
          disabled={isDisabled}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-white text-sm font-medium rounded-lg transition-colors min-h-[44px] ${
            isDisabled
              ? 'bg-gray-600 cursor-not-allowed opacity-50'
              : 'bg-gray-700 hover:bg-gray-600'
          }`}
        >
          <Icon icon="heroicons:photo" className="w-5 h-5" />
          <span>Edit Image</span>
        </button>
        <button
          onClick={() => !isDisabled && router.push(`/agent?agentId=${agentId}`)}
          disabled={isDisabled}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-white text-sm font-medium rounded-lg transition-colors min-h-[44px] ${
            isDisabled
              ? 'bg-gray-600 cursor-not-allowed opacity-50'
              : 'bg-orange-500 hover:bg-orange-600'
          }`}
        >
          <Icon icon="heroicons:pencil-square" className="w-5 h-5" />
          <span>Edit Agent</span>
        </button>
      </div>
    );
  }

  function ControlBar(props: { onConnectButtonClicked: (uid: string, type: string) => void }) {
    const { state: agentState } = useVoiceAssistant();
    const [isMuted, setIsMuted] = useState(false);
    const isConnectDisabled = !user || !selectedCharacter;

    useEffect(() => {
      setIsMuted(!room.localParticipant.isMicrophoneEnabled);
    }, [room.localParticipant.isMicrophoneEnabled]);

    const handleMuteToggle = useCallback(async () => {
      try {
        const currentlyMuted = room.localParticipant.isMicrophoneEnabled;
        await room.localParticipant.setMicrophoneEnabled(!currentlyMuted);
      } catch (error) {
        console.error('Failed to toggle microphone:', error);
      }
    }, []);

    return (
      <div className="relative w-full px-6 mt-4">
        <AnimatePresence>
          {agentState === 'disconnected' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.0, ease: [0.09, 1.04, 0.245, 1.055] }}
              className="w-full flex justify-center items-center gap-4"
            >
              {/* Call Start Button */}
              <button
                className={`w-16 h-16 ${
                  isConnectDisabled
                    ? 'bg-gray-500 cursor-not-allowed'
                    : 'bg-green-500 hover:bg-green-600 active:bg-green-700'
                } text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group`}
                onClick={() => !isConnectDisabled && props.onConnectButtonClicked(uid, type)}
                disabled={isConnectDisabled}
                title="Chat With Your Agent"
              >
                <Icon
                  icon="ph:phone-fill"
                  className="w-7 h-7 group-active:scale-95 transition-transform duration-100"
                />
              </button>

            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {agentState !== 'disconnected' && agentState !== 'connecting' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.0, ease: [0.09, 1.04, 0.245, 1.055] }}
              className="w-full h-16 flex justify-center items-center gap-4"
            >
              {/* Mute Button */}
              <button
                onClick={handleMuteToggle}
                className={`w-16 h-16 ${
                  isMuted
                    ? 'bg-gray-500 hover:bg-gray-600 active:bg-gray-700'
                    : 'bg-white hover:bg-gray-300 active:bg-gray-500'
                } text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group p-0 border-0 min-w-[48px]`}
                title={isMuted ? 'Unmute microphone' : 'Mute microphone'}
              >
                <Icon
                  icon={isMuted ? 'ph:microphone-slash-fill' : 'ph:microphone-fill'}
                  className={`w-6 h-6 group-active:scale-95 transition-transform duration-100 ${isMuted ? ' text-white' : ' text-black'}`}
                />
              </button>

              {/* Disconnect Button */}
              <DisconnectButton className="w-16 h-16 bg-red-500 hover:bg-red-600 active:bg-red-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group p-0 border-0 min-w-[48px]">
                <Icon
                  icon="ph:phone-slash-fill"
                  className="w-6 h-6 group-active:scale-95 transition-transform duration-100"
                />
              </DisconnectButton>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="h-full overflow-hidden flex relative">
      <RoomContext.Provider value={room}>
        {/* Left part - Video Response */}
        <div
          className={`${
            isMobile
              ? showChatOnMobile
                ? 'hidden'
                : 'flex w-full px-5 py-4'
              : 'hidden md:flex w-full max-w-[400px] lg:max-w-[600px] xl:max-w-[800px] px-5 py-4'
          } justify-center gap-4 h-full`}
        >
          <div className="w-full max-w-[600px] flex flex-col justify-between h-full">
            <div className="space-y-2">
              <p className="text-gray-350 uppercase pl-3 relative text-xs before:content-[''] before:w-2 before:h-2 before:absolute before:top-1 before:left-0 before:bg-white/40">
                <span>video response</span>
                {selectedCharacter && (
                  <span className="text-white">: {selectedCharacter.name || 'Agent'}</span>
                )}
              </p>
              <div className="relative w-full aspect-square rounded-2xl bg-gray-600 flex justify-center items-center overflow-hidden">
                <div className="lk-room-container w-full h-full flex justify-center items-center">
                  <SimpleVoiceAssistant />
                </div>
              </div>
            </div>

            {/* Edit Buttons - Only shown when disconnected */}
            <EditButtons />

            <ControlBar onConnectButtonClicked={() => onConnectButtonClicked(uid, type)} />

            {/* Text Input Box */}
            {/* <div className="w-full mt-4 px-6">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={textMessage}
                  onChange={(e) => setTextMessage(e.target.value)}
                  onKeyDown={async (e) => {
                    if (e.key === 'Enter' && textMessage.trim()) {
                      try {
                        const timestamp = Date.now();
                        await room.localParticipant.sendText(textMessage, {
                          topic: 'lk.chat',
                        });

                        // Add to local state for display
                        setSentTextMessages((prev) => [
                          ...prev,
                          {
                            id: `text-${timestamp}`,
                            text: textMessage,
                            role: 'user',
                            startTime: timestamp,
                            firstReceivedTime: timestamp,
                          },
                        ]);

                        console.log('Text message sent:', textMessage);
                        setTextMessage('');
                      } catch (error) {
                        console.error('Failed to send text message:', error);
                      }
                    }
                  }}
                  placeholder="Text message..."
                  className="flex-1 px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                />
                <button
                  onClick={async () => {
                    if (textMessage.trim()) {
                      try {
                        const timestamp = Date.now();
                        await room.localParticipant.sendText(textMessage, {
                          topic: 'lk.chat',
                        });

                        // Add to local state for display
                        setSentTextMessages((prev) => [
                          ...prev,
                          {
                            id: `text-${timestamp}`,
                            text: textMessage,
                            role: 'user',
                            startTime: timestamp,
                            firstReceivedTime: timestamp,
                          },
                        ]);

                        console.log('Text message sent:', textMessage);
                        setTextMessage('');
                      } catch (error) {
                        console.error('Failed to send text message:', error);
                      }
                    }
                  }}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <Icon icon="ph:paper-plane-tilt-fill" className="w-5 h-5" />
                  Send
                </button>
              </div>
            </div> */}

            {/* How Agent Simulator Works */}
            {/* <div className="w-full rounded-2xl border border-blue-500/25 bg-blue-500/10 text-blue-500 px-3 py-4 flex gap-3">
              <div className="w-5 min-w-5 h-5">
                <Icon icon="ci:info" className="w-5 h-5" />
              </div>
              <div className="grow">
                <h3 className="text-base leading-none font-medium">
                  How does the Agent Simulator work?
                </h3>
                <p className="mt-4 text-sm">
                  ChatAndBuild Agents is an OS-inspired agent management system for virtual context
                  management. It can read and write to external data sources (90M+), modify their
                  own context, and choose when to return responses to your input.
                </p>
              </div>
            </div> */}
          </div>
        </div>

        {/* Right part - Chat */}
        <div
          className={`${
            isMobile ? (showChatOnMobile ? 'flex w-full' : 'hidden') : 'w-full grow'
          } border-x border-gray-700 bg-gray-900 flex-col h-full`}
        >
          {/* Header */}
          <div className="w-full bg-gray-800 border-b border-gray-700 px-6 py-3">
            <div className="w-full max-w-[765px] mx-auto flex justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                {/* Back button for mobile */}
                {isMobile && showChatOnMobile && (
                  <Button
                    className="text-white hover:text-gray-300 transition-colors"
                    onClick={() => setShowChatOnMobile(false)}
                  >
                    <Icon icon="mdi:arrow-left" className="w-6 h-6" />
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Chat */}
          <TranscriptionView
            agentName={selectedCharacter?.name || 'Agent'}
            textMessages={sentTextMessages}
          />
        </div>
        {/* Mobile Chat Toggle Button */}
        {isMobile && !showChatOnMobile && (
          <Button
            className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-colors z-20"
            onClick={() => setShowChatOnMobile(true)}
          >
            <ChatIcon className="w-6 h-6" />
          </Button>
        )}
      </RoomContext.Provider>
    </div>
  );
};
