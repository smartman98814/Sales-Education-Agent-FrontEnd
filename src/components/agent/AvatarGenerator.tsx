'use client';

import { Icon } from '@iconify/react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';

import { getAgentById, saveAgent } from '@/api/agent';
import { ButtonOrange } from '@/components/button';
import { Motion } from '@/components/common';
import { useAuth } from '@/context';
import { useRouter } from '@/i18n/navigation';
import {
  createAsset,
  generateImage,
  getAsset,
  pollGenerationStatus,
  uploadAsset,
  uploadFile,
  uploadToPinata,
} from '@/services';

// Predefined avatar images - 10 avatars for 2 rows x 5 columns layout
const PREDEFINED_AVATARS = [
  {
    url: 'https://cdn.chatandbuild.com/images/avatar0.jpg',
    id: '613c7977-6462-42cd-963c-60b1a526cf7f',
  },
  {
    url: 'https://cdn.chatandbuild.com/images/avatar1.png',
    id: 'e9eae3b2-0b2f-4d88-903b-cedac91a32e7',
  },
  {
    url: 'https://cdn.chatandbuild.com/images/avatar2.png',
    id: '3e0495d5-1b4d-4622-8b98-6e78dc89a4e3',
  },
  {
    url: 'https://cdn.chatandbuild.com/images/avatar3.png',
    id: 'b674fa11-dda0-494d-9470-7cd380230393',
  },
  {
    url: 'https://cdn.chatandbuild.com/images/avatar0.jpg',
    id: 'avatar-5',
  },
  {
    url: 'https://cdn.chatandbuild.com/images/avatar1.png',
    id: 'avatar-6',
  },
  {
    url: 'https://cdn.chatandbuild.com/images/avatar2.png',
    id: 'avatar-7',
  },
  {
    url: 'https://cdn.chatandbuild.com/images/avatar3.png',
    id: 'avatar-8',
  },
  {
    url: 'https://cdn.chatandbuild.com/images/avatar0.jpg',
    id: 'avatar-9',
  },
  {
    url: 'https://cdn.chatandbuild.com/images/avatar1.png',
    id: 'avatar-10',
  },
];

interface AvatarGeneratorProps {
  prompt?: string;
  assetId?: string;
  agentId?: string;
  avatarId?: string;
  avatarUrl?: string;
}

export const AvatarGenerator = ({
  prompt: initialPrompt = '',
  assetId,
  agentId,
  avatarId: initialAvatarId,
  avatarUrl: initialAvatarUrl,
}: AvatarGeneratorProps) => {
  const router = useRouter();
  const { user, isAuthenticated, openSignInDialog } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [prompt, setPrompt] = useState(agentId ? '' : initialPrompt);
  const [generatedAvatar, setGeneratedAvatar] = useState<{ url: string; id: string } | null>(null);
  const [selectedAvatar, setSelectedAvatar] = useState<{ url: string; id: string } | null>(
    initialAvatarId && initialAvatarUrl
      ? { id: initialAvatarId, url: decodeURIComponent(initialAvatarUrl) }
      : null
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  // const [generatedAvatars, setGeneratedAvatars] = useState<{ url: string; id: string }[]>([]);
  const [cachedCharacterData, setCachedCharacterData] = useState<any>(null);

  // Load generated avatars from localStorage on mount
  // useEffect(() => {
  //   try {
  //     const stored = localStorage.getItem('generatedAvatars');
  //     if (stored) {
  //       const parsed = JSON.parse(stored);
  //       setGeneratedAvatars(parsed);
  //     }
  //   } catch (error) {
  //     console.error('Failed to load generated avatars from localStorage:', error);
  //   }
  // }, []);

  // // Save generated avatars to localStorage whenever they change
  // useEffect(() => {
  //   try {
  //     if (generatedAvatars.length > 0) {
  //       localStorage.setItem('generatedAvatars', JSON.stringify(generatedAvatars));
  //     }
  //   } catch (error) {
  //     console.error('Failed to save generated avatars to localStorage:', error);
  //   }
  // }, [generatedAvatars]);

  // Load agent's existing avatar when agentId is provided
  useEffect(() => {
    const loadAgentAvatar = async () => {
      if (!agentId || !user) return;
      try {
        const agent = await getAgentById(agentId);

        if (agent.characterUrl) {
          const response = await fetch(agent.characterUrl);
          const characterData = await response.json();

          // Cache the character data for later use
          setCachedCharacterData(characterData);

          // Get the agent's avatar
          if (characterData.agent?.image) {
            const avatarId = characterData.agent.image;

            // Try to get the asset URL from Hedra
            try {
              const assetData = await getAsset(avatarId, 'image');
              if (assetData && assetData[0]?.asset?.url) {
                const existingAvatar = {
                  url: assetData[0].asset.url,
                  id: avatarId,
                };
                setSelectedAvatar(existingAvatar);
                setGeneratedAvatar(existingAvatar);
              }
            } catch (error) {
              console.error('Failed to load avatar from Hedra:', error);
              // If Hedra fails, try using the IPFS image
              if (characterData.image) {
                const existingAvatar = {
                  url: characterData.image,
                  id: avatarId,
                };
                setSelectedAvatar(existingAvatar);
                setGeneratedAvatar(existingAvatar);
              }
            }
          }
        }
      } catch (error) {
        console.error('Failed to load agent avatar:', error);
        toast.error('Failed to load agent avatar', {
          position: 'bottom-right',
          pauseOnHover: false,
          autoClose: 2000,
        });
      }
    };

    loadAgentAvatar();
  }, [agentId, user]);

  // Auto-generate avatar only when prompt is provided and no agentId
  useEffect(() => {
    if (initialPrompt && user && !agentId) {
      setPrompt(initialPrompt);
      // Auto-generate avatar on load after user is logged in
      handleGenerateAvatar(initialPrompt);
    }
  }, [initialPrompt, user, agentId]);

  const handleGenerateAvatar = async (promptText?: string) => {
    const textToUse = promptText || prompt;

    if (!user) {
      openSignInDialog();
      toast.error('Please log in!', {
        position: 'bottom-right',
        pauseOnHover: false,
        autoClose: 1500,
      });
      return;
    }

    if (!textToUse.trim()) {
      toast.error('Please enter a description', {
        position: 'bottom-right',
        pauseOnHover: false,
        autoClose: 1500,
      });
      return;
    }

    setIsGenerating(true);

    try {
      // Call Hedra API to generate image with specific portrait instructions
      const portraitPrompt = `Close-up portrait photo, headshot, face and upper shoulders only, professional avatar style. The image must not be circular. ${textToUse}`;
      // Use assetId as start_keyframe_id if provided
      const generationResult = await generateImage(portraitPrompt, assetId);

      if (!generationResult?.id) {
        throw new Error('Failed to start image generation');
      }

      // Poll for generation status
      const completedGeneration = await pollGenerationStatus(generationResult.id);

      if (!completedGeneration?.asset_id) {
        throw new Error('No asset_id in generation result');
      }

      // Get the asset details to retrieve the image URL
      const assetData = await getAsset(completedGeneration.asset_id, 'image');

      if (!assetData[0]?.asset?.url) {
        throw new Error('No image URL in asset data');
      }

      // Set the generated avatar
      const newAvatar = {
        url: assetData[0].asset.url,
        id: assetData[0].id,
      };

      setGeneratedAvatar(newAvatar);
      setSelectedAvatar(newAvatar);

      // Add to generated avatars array
      // setGeneratedAvatars((prev) => [newAvatar, ...prev]);

      toast.success('Avatar generated successfully!', {
        position: 'bottom-right',
        pauseOnHover: false,
        autoClose: 1500,
      });
    } catch (error) {
      console.error('Failed to generate avatar:', error);
      toast.error(
        `Failed to generate avatar: ${error instanceof Error ? error.message : 'Unknown error'}`,
        {
          position: 'bottom-right',
          pauseOnHover: false,
          autoClose: 3000,
        },
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerateAvatar = () => {
    handleGenerateAvatar();
  };

  const handleSelectPredefinedAvatar = (avatar: { url: string; id: string }) => {
    setSelectedAvatar(avatar);
    toast.success('Agent selected!', {
      position: 'bottom-right',
      pauseOnHover: false,
      autoClose: 1000,
    });
  };

  const handleUploadClick = () => {
    // Treat non-authenticated (guest) users as needing to sign in
    if (!isAuthenticated) {
      openSignInDialog();
      toast.error('Please log in!', {
        position: 'bottom-right',
        pauseOnHover: false,
        autoClose: 1500,
      });
      return;
    }
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file', {
        position: 'bottom-right',
        pauseOnHover: false,
        autoClose: 1500,
      });
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB', {
        position: 'bottom-right',
        pauseOnHover: false,
        autoClose: 1500,
      });
      return;
    }

    setIsUploading(true);

    try {
      // Step 1: Upload file to Hedra
      const uploadResult = await uploadFile(file, 'image');
      if (!uploadResult?.filename) {
        throw new Error('Failed to upload file');
      }

      // Step 2: Create asset
      const assetResult = await createAsset('image', uploadResult.filename);
      if (!assetResult?.id) {
        throw new Error('Failed to create asset');
      }

      // Step 3: Upload asset
      await uploadAsset(assetResult.id, uploadResult.filename);

      // Step 4: Get asset details to retrieve the image URL
      const assetData = await getAsset(assetResult.id, 'image');
      if (!assetData[0]?.asset?.url) {
        throw new Error('No image URL in asset data');
      }

      // Set the uploaded avatar
      const uploadedAvatar = {
        url: assetData[0].asset.url,
        id: assetResult.id,
      };

      setSelectedAvatar(uploadedAvatar);
      setGeneratedAvatar(uploadedAvatar);

      toast.success('Avatar uploaded successfully!', {
        position: 'bottom-right',
        pauseOnHover: false,
        autoClose: 1500,
      });
    } catch (error) {
      console.error('Failed to upload avatar:', error);
      toast.error(
        `Failed to upload avatar: ${error instanceof Error ? error.message : 'Unknown error'}`,
        {
          position: 'bottom-right',
          pauseOnHover: false,
          autoClose: 3000,
        },
      );
    } finally {
      setIsUploading(false);
      // Reset file input
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  const handleContinue = async () => {
    if (!selectedAvatar) {
      toast.error('Please select or generate an agent', {
        position: 'bottom-right',
        pauseOnHover: false,
        autoClose: 1500,
      });
      return;
    }

    // If agentId is provided, update the agent's avatar and navigate to simulator
    if (agentId) {
      try {
        // Use cached character data if available, otherwise fetch it
        let characterData = cachedCharacterData;

        if (!characterData) {
          const agent = await getAgentById(agentId);
          if (!agent.characterUrl) {
            throw new Error('Agent character URL not found');
          }
          const response = await fetch(agent.characterUrl);
          characterData = await response.json();
        }

        // Check if avatar has changed
        const currentAvatarId = characterData.agent?.image;
        const avatarChanged = currentAvatarId !== selectedAvatar.id;

        if (avatarChanged) {
          // Only update if avatar has changed
          // Fetch the new avatar image and upload to Pinata
          const avatarResponse = await fetch(selectedAvatar.url);
          const avatarBlob = await avatarResponse.blob();
          const avatarFile = new File([avatarBlob], `avatar-${selectedAvatar.id}.jpg`, {
            type: 'image/jpeg',
          });

          const uploadedIPFSImage = await uploadToPinata(
            avatarFile,
            `${user?.address || 'user'}-avatar-${selectedAvatar.id}`,
          );

          // Update character data with new avatar
          const updatedCharacterData = {
            ...characterData,
            image: uploadedIPFSImage,
            agent: {
              ...characterData.agent,
              image: selectedAvatar.id, // Hedra asset ID
            },
          };

          // Upload updated character data to Pinata
          const jsonString = JSON.stringify(updatedCharacterData, null, 2);
          const jsonBlob = new Blob([jsonString], { type: 'application/json' });
          const fileName = `character-${agentId}.json`;
          const jsonFile = new File([jsonBlob], fileName, { type: 'application/json' });

          const uploadedCharacterUrl = await uploadToPinata(jsonFile, fileName);

          if (!uploadedCharacterUrl) {
            throw new Error('Failed to upload updated character to IPFS');
          }

          // Update agent in backend
          await saveAgent({
            id: agentId,
            characterUrl: uploadedCharacterUrl,
          });

          toast.success('Avatar updated successfully!', {
            position: 'bottom-right',
            pauseOnHover: false,
            autoClose: 1500,
          });
        }

        // Navigate to simulator (whether avatar changed or not)
        router.push(`/simulator?agentId=${agentId}`);
      } catch (error) {
        console.error('Failed to update agent avatar:', error);
        toast.error(
          `Failed to update avatar: ${error instanceof Error ? error.message : 'Unknown error'}`,
          {
            position: 'bottom-right',
            pauseOnHover: false,
            autoClose: 3000,
          },
        );
      }
    } else {
      // Otherwise, navigate to agent creation page with avatar and prompt
      router.push(
        `/agent?avatar=${encodeURIComponent(selectedAvatar.id)}&prompt=${encodeURIComponent(prompt)}`,
      );
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-200px)] px-4 md:px-6 py-10">
      <div className="w-full max-w-6xl mx-auto space-y-8">
        {/* Header with Back Button */}
        <Motion.div
          className="flex items-center gap-4"
          initial={{ y: -20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
        >
          <div>
            <h1 className="text-white font-semibold text-2xl md:text-3xl font-tektur">
              Generate Your Agent
            </h1>
            <p className="text-gray-400 text-sm mt-1">Create or select an agent</p>
          </div>
        </Motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Avatar Display Section */}
          <Motion.div
            className="space-y-4"
            initial={{ x: -20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            delay={0.2}
          >
            <h2 className="text-white font-semibold text-xl font-tektur">Agent</h2>

            <div className="relative aspect-square bg-gray-900 border border-white/15 rounded-2xl overflow-hidden">
              {isGenerating ? (
                <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                  <Icon
                    icon="eos-icons:loading"
                    className="w-16 h-16 text-orange-500 animate-spin"
                  />
                  <p className="text-gray-400">Generating your agent...</p>
                </div>
              ) : selectedAvatar ? (
                <>
                  <img
                    src={selectedAvatar.url}
                    alt="Selected Agent"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1.5 rounded-full text-sm font-semibold flex items-center gap-1">
                    <Icon icon="heroicons:check" className="w-4 h-4" />
                    Selected
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-4 p-8">
                  <Icon icon="heroicons:photo" className="w-20 h-20 text-gray-600" />
                  <p className="text-gray-400 text-center">Click generate to create your agent</p>
                </div>
              )}
            </div>

            {/* Generate/Regenerate Button */}
            <ButtonOrange
              onClick={handleRegenerateAvatar}
              disabled={isGenerating}
              className="w-full"
            >
              <div className="flex items-center justify-center gap-2 font-tektur font-semibold text-base uppercase py-1">
                <Icon icon="heroicons:sparkles" className="w-5 h-5" />
                {generatedAvatar ? 'Regenerate Real Time Agent' : 'Generate Agent'}
              </div>
            </ButtonOrange>
          </Motion.div>

          {/* Predefined Avatars Section */}
          <Motion.div
            className="space-y-4"
            initial={{ x: 20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            delay={0.3}
          >
            <h2 className="text-white font-semibold text-xl font-tektur">Or Choose from Presets</h2>

            <div className="grid grid-cols-5 gap-4">
              {PREDEFINED_AVATARS.map((avatar, index) => (
                <Motion.button
                  key={index}
                  onClick={() => handleSelectPredefinedAvatar(avatar)}
                  className={`relative aspect-square bg-gray-900 border-2 rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 ${
                    selectedAvatar?.id === avatar.id
                      ? 'border-orange-500 ring-2 ring-orange-500/50'
                      : 'border-white/15 hover:border-orange-500/50'
                  }`}
                  initial={{ scale: 0.9, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  delay={0.1 * index}
                >
                  <img
                    src={avatar.url}
                    alt={`Preset Avatar ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {selectedAvatar?.id === avatar.id && (
                    <div className="absolute inset-0 bg-orange-500/20 flex items-center justify-center">
                      <div className="bg-orange-500 text-white p-2 rounded-full">
                        <Icon icon="heroicons:check" className="w-6 h-6" />
                      </div>
                    </div>
                  )}
                </Motion.button>
              ))}
            </div>

            {/* Upload Yours Button */}
            <button
              onClick={handleUploadClick}
              disabled={isUploading}
              className="w-full px-4 py-3 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {isUploading ? (
                <>
                  <Icon icon="eos-icons:loading" className="w-5 h-5 animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Icon icon="heroicons:arrow-up-tray" className="w-5 h-5" />
                  <span>Upload Yours</span>
                </>
              )}
            </button>

            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />

            {/* Generated Avatars History - Right below presets */}
            {/* {generatedAvatars.length > 0 && (
              <div className="space-y-4 mt-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-semibold text-lg font-tektur">
                    Generated Avatars ({generatedAvatars.length})
                  </h3>
                  <button
                    onClick={() => {
                      setGeneratedAvatars([]);
                      localStorage.removeItem('generatedAvatars');
                      toast.success('Generated avatars cleared!', {
                        position: 'bottom-right',
                        pauseOnHover: false,
                        autoClose: 1000,
                      });
                    }}
                    className="text-gray-400 hover:text-red-400 transition-colors text-sm flex items-center gap-1"
                  >
                    <Icon icon="heroicons:trash" className="w-4 h-4" />
                    Clear All
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {generatedAvatars.map((avatar, index) => (
                    <button
                      key={avatar.id}
                      onClick={() => handleSelectPredefinedAvatar(avatar)}
                      className={`relative aspect-square bg-gray-900 border-2 rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 ${
                        selectedAvatar?.id === avatar.id
                          ? 'border-orange-500 ring-2 ring-orange-500/50'
                          : 'border-white/15 hover:border-orange-500/50'
                      }`}
                    >
                      <img
                        src={avatar.url}
                        alt={`Generated Avatar ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {selectedAvatar?.id === avatar.id && (
                        <div className="absolute inset-0 bg-orange-500/20 flex items-center justify-center">
                          <div className="bg-orange-500 text-white p-2 rounded-full">
                            <Icon icon="heroicons:check" className="w-6 h-6" />
                          </div>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )} */}
          </Motion.div>
        </div>

        {/* Continue Button */}
        <Motion.div
          className="flex justify-center pt-4"
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          delay={0.5}
        >
          <ButtonOrange
            onClick={handleContinue}
            disabled={!selectedAvatar}
            className="w-full max-w-md"
          >
            <div className="flex items-center justify-center gap-2 font-tektur font-semibold text-base uppercase py-1">
              Continue to Build Agent
              <Icon icon="heroicons:arrow-right" className="w-5 h-5" />
            </div>
          </ButtonOrange>
        </Motion.div>
      </div>
    </div>
  );
};
