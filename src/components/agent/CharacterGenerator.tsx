'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Icon } from '@iconify/react';
import { ObjectId } from 'bson';
import { useRouter } from 'next/navigation';
import numeral from 'numeral';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { twMerge } from 'tailwind-merge';
import { z } from 'zod';

import { getAgentById, saveAgent } from '@/api/agent';
import { ButtonBlue, ButtonOrange } from '@/components/button';
import { Motion } from '@/components/common';
import { FileDropzone, FormSelect } from '@/components/form';
import { VoiceLoadingIcon, VoicePlayIcon } from '@/components/svg';
import { AGENT_TYPE_OPTIONS } from '@/constants';
import { useAuth } from '@/context';
import {
  createAsset,
  generateSpeech,
  getAsset,
  scrape,
  sendMessageToGPT4,
  uploadAsset,
  uploadFile,
  uploadToPinata,
} from '@/services';
import { KnowledgeItem } from '@/types';

const agentFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Title must be at least 2 characters long')
    .max(100, 'Title must not exceed 100 characters'),
  description: z
    .string()
    .min(4, 'Description must be at least 4 characters long')
    .max(1000, 'Description must not exceed 1000 characters'),
  voice: z.string().min(1, 'Choose one voice model!'),
  image: z.string().min(1, 'At least one image is required'),
  type: z.string().min(1, 'Agent type is required'),
  skills: z
    .array(z.string())
    .min(1, 'At least 1 skill is required')
    .max(10, 'Maximum 10 skills allowed'),
});

type AgentFormData = z.infer<typeof agentFormSchema>;

interface CharacterGeneratorProps {
  agentId?: string;
  avatar?: string;
  initialPrompt?: string;
}

export const CharacterGenerator = ({ agentId, avatar, initialPrompt }: CharacterGeneratorProps) => {
  const router = useRouter();
  const [voiceOptions] = useState<string[]>([
    'alloy',
    'ash',
    'ballad',
    'coral',
    'echo',
    'fable',
    'onyx',
    'nova',
    'sage',
    'shimmer',
    'verse',
  ]);

  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isLoadingVoicePreview, setIsLoadingVoicePreview] = useState<boolean>(false);
  const [isScraping, setIsScraping] = useState<boolean>(false);
  const [isUploadingCharacter, setIsUploadingCharacter] = useState<boolean>(false);
  const [uploadedImage, setUploadedImage] = useState<string>('');
  const [uploadedIPFSImage, setUploadedIPFSImage] = useState<string>('');
  const [isEnhancing, setIsEnhancing] = useState<boolean>(false);
  // later use
  // const [isLoadingCharacter, setIsLoadingCharacter] = useState<boolean>(false);
  const [existingAgentId, setExistingAgentId] = useState<string | null>(null);

  // Knowledge state
  const [knowledgeItems, setKnowledgeItems] = useState<KnowledgeItem[]>([]);
  const [urlInput, setUrlInput] = useState<string>('');
  const [isUploadingKnowledge, setIsUploadingKnowledge] = useState<boolean>(false);
  const MAX_KNOWLEDGE_ITEMS = 10;
  // Template images
  const templateImages = [
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
  ];
  // Error and success state
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const { openSignInDialog, user } = useAuth();

  /* Form */
  const {
    register,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<AgentFormData>({
    resolver: zodResolver(agentFormSchema),
    defaultValues: {
      name: '',
      description: '',
      voice: '',
      image: '',
      type: '',
      skills: [],
    },
  });

  const voice = watch('voice');
  const image = watch('image');
  const name = watch('name');
  const description = watch('description');
  const type = watch('type');
  const skills = watch('skills');

  // If we already have an uploaded IPFS image (from avatar selection), ensure the form image value is populated
  useEffect(() => {
    if (uploadedIPFSImage && !image) {
      setValue('image', uploadedIPFSImage);
    }
  }, [uploadedIPFSImage, image, setValue]);

  // Transform voice options for FormSelect using voiceService
  const selectVoiceOptions = voiceOptions.map((voiceOption) => ({
    label: voiceOption.charAt(0).toUpperCase() + voiceOption.slice(1),
    value: voiceOption,
  }));

  // Handle voice preview
  const handleVoicePreview = async () => {
    if (!user) {
      openSignInDialog();
      toast.error('Please log in!', {
        position: 'bottom-right',
        pauseOnHover: false,
        autoClose: 1500,
      });
      return;
    }

    if (isLoadingVoicePreview) return; // Prevent multiple requests

    setIsLoadingVoicePreview(true);
    setError(''); // Clear any previous errors

    try {
      const input =
        "Hello! I'm your AI assistant focused on competitive intelligence. How can I help you analyze market trends and competitor activities today?";

      // Use the selected voice or default to 'coral'
      const selectedVoice = voice || 'coral';

      // Call the backend service to generate speech
      const audioBlob = await generateSpeech(input, selectedVoice, 'tts-1');

      // Create audio URL and play it
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);

      // Play the audio
      await audio.play();

      // Clean up the URL after playing
      audio.addEventListener('ended', () => {
        URL.revokeObjectURL(audioUrl);
      });
    } catch (error) {
      console.error('Error playing voice preview:', error);
      setError('Failed to play voice preview. Please try again.');
    } finally {
      setIsLoadingVoicePreview(false);
    }
  };

  // Handle template image selection
  const handleTemplateSelect = (template: { url: string; id: string }) => {
    if (!user) {
      openSignInDialog();
      toast.error('Please log in!', {
        position: 'bottom-right',
        pauseOnHover: false,
        autoClose: 1500,
      });
      return;
    }

    setValue('image', template.url);
    setUploadedImage(template.id);
    setUploadedIPFSImage(template.url);
    setSuccess('Agent selected successfully!');
    setError('');
  };

  // Handle image upload and processing
  const handleImageUpload = async (files: File[]) => {
    if (!user) {
      openSignInDialog();
      toast.error('Please log in!', {
        position: 'bottom-right',
        pauseOnHover: false,
        autoClose: 1500,
      });
      return;
    }

    if (files.length === 0) return;

    const file = files[0];
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setError('');

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      // Step 1: Upload file using uploadFile in hedraService and get filename
      const uploadResult = await uploadFile(file, 'image');

      if (!uploadResult?.filename) {
        throw new Error('Failed to upload file');
      }

      const filename = uploadResult.filename;

      // Step 2: Create asset using createAsset in hedraService and get asset id
      const assetResult = await createAsset('image', filename);

      if (!assetResult?.id) {
        throw new Error('Failed to create asset');
      }

      const assetId = assetResult.id;

      // Step 3: Upload asset using uploadAsset in hedraService with filename and asset id
      await uploadAsset(assetId, filename);

      // Complete the progress
      clearInterval(progressInterval);
      setUploadProgress(100);

      // Store asset id instead of filename
      setUploadedImage(assetId);

      const uploadedIpfsURL = await uploadToPinata(file, user.address + '-avatar');
      setUploadedIPFSImage(uploadedIpfsURL);

      const reader = new FileReader();

      reader.onload = (e: any) => {
        const imageDataURL = e.target.result;
        setValue('image', imageDataURL);
      };
      reader.readAsDataURL(file); // Read the file as a data URL

      setSuccess('Image uploaded successfully!');
    } catch (error) {
      setError(`Failed to upload image: ${error}`);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Handle using the character - generate idle video and navigate to simulator
  const handleUseCharacter = async () => {
    if (!user) {
      openSignInDialog();
      toast.error('Please log in!', {
        position: 'bottom-right',
        pauseOnHover: false,
        autoClose: 1500,
      });
      return;
    }

    if (!voice) {
      setError('Please select a voice');
      return;
    }

    // Ensure we have an avatar; if missing, fall back to first template to avoid blocking
    if (!image && !uploadedIPFSImage) {
      const fallback = templateImages[0];
      setValue('image', fallback.url);
      setUploadedImage(fallback.id);
      setUploadedIPFSImage(fallback.url);
    }

    if (!type) {
      setError('Please select a agent type');
      return;
    }

    if (!skills || skills.length === 0) {
      setError('Please select at least one skill');
      return;
    }

    setError('');
    setSuccess('');

    const address = user?.address || '';

    // Generate new agentId if creating new agent
    let agentUid = existingAgentId;
    if (!existingAgentId) {
      agentUid = new ObjectId().toString();
      setExistingAgentId(agentUid);
    }

    let uploadedCharacterUrl = '';
    const characterData = {
      name,
      description,
      image: uploadedIPFSImage,
      attributes: [
        {
          trait_type: 'Created By',
          value: address,
        },
        {
          trait_type: 'Voice',
          value: voice,
        },
        {
          trait_type: 'Type',
          value: type,
        },
        {
          trait_type: 'Skills',
          value: skills.join(', '),
        },
        {
          trait_type: 'Knowledge Sources',
          value: knowledgeItems.length,
        },
      ],
      properties: {
        uid: agentUid,
        voice,
        type,
        skills,
        knowledge: knowledgeItems,
      },
      agent: {
        type,
        skills,
        knowledge: knowledgeItems,
        uid: agentUid,
        voice,
        image: uploadedImage, // This is now the asset ID from Hedra
      },
    };

    // Step 1: Create JSON character file and upload to S3
    setIsUploadingCharacter(true);
    try {
      const jsonString = JSON.stringify(characterData, null, 2);
      const jsonBlob = new Blob([jsonString], { type: 'application/json' });
      const fileName = `character-${agentUid}.json`;
      const jsonFile = new File([jsonBlob], fileName, { type: 'application/json' });

      uploadedCharacterUrl = await uploadToPinata(jsonFile, fileName);
      if (!uploadedCharacterUrl) {
        setError('Failed to upload file to IPFS');
        setSuccess('');
        setIsUploadingCharacter(false);
        throw new Error('Failed to upload character to IPFS');
      }
      localStorage.setItem('metadataURI', uploadedCharacterUrl);

      // Store character URL in backend using agent service
      try {
        // Always use saveAgent with agentId (for both create and update)
        await saveAgent({
          id: agentUid!,
          characterUrl: uploadedCharacterUrl,
        });
      } catch (error) {
        console.error('Failed to store character URL:', error);
        // Don't throw error here, just log it - we can continue even if this fails
      }
    } catch (error) {
      setError(`${error}`);
      setSuccess('');
      setIsUploadingCharacter(false);
      return;
    }
    setIsUploadingCharacter(false);

    // Step 2: Call scrape endpoint only if there are knowledge items
    if (knowledgeItems.length > 0) {
      setIsScraping(true);
      try {
        await scrape(agentUid!, uploadedCharacterUrl);
      } catch (error) {
        setError(`${error}`);
        setSuccess('');
        setIsScraping(false);
        throw error;
      }
      setIsScraping(false);
    }

    setTimeout(() => {
      router.push(`/simulator?agentId=${agentUid}`);
    }, 2000);
  };

  // Reset form and clear all data
  const handleReset = () => {
    reset();
    setError('');
    setSuccess('');
    setKnowledgeItems([]);
    setUrlInput('');
  };

  // If an avatar is provided (e.g., from the avatar selection page) but no prompt,
  // fetch the asset, upload to Pinata, and prefill the image fields.
  useEffect(() => {
    const preloadAvatar = async () => {
      if (!user || !avatar) return;
      if (agentId) return; // only for create flow
      if (uploadedImage && uploadedIPFSImage) return; // already set

      try {
        const assetData = await getAsset(avatar, 'image');
        if (assetData && assetData[0]?.asset?.url) {
          const assetUrl = assetData[0].asset.url;
          const imageResponse = await fetch(assetUrl);
          const imageBlob = await imageResponse.blob();
          const imageFile = new File([imageBlob], `avatar-${avatar}.jpg`, {
            type: 'image/jpeg',
          });
          const pinataUrl = await uploadToPinata(imageFile, `${user?.address || 'user'}-avatar-${avatar}`);
          if (pinataUrl) {
            setValue('image', pinataUrl);
            setUploadedImage(avatar);
            setUploadedIPFSImage(pinataUrl);
          }
        } else {
          const matchingTemplate = templateImages.find((t) => t.id === avatar);
          if (matchingTemplate) {
            setValue('image', matchingTemplate.url);
            setUploadedImage(matchingTemplate.id);
            setUploadedIPFSImage(matchingTemplate.url);
          }
        }
      } catch (error) {
        console.error('Error preloading avatar:', error);
        const matchingTemplate = templateImages.find((t) => t.id === avatar);
        if (matchingTemplate) {
          setValue('image', matchingTemplate.url);
          setUploadedImage(matchingTemplate.id);
          setUploadedIPFSImage(matchingTemplate.url);
        }
      }
    };

    preloadAvatar();
  }, [user, avatar, agentId, uploadedImage, uploadedIPFSImage, setValue, templateImages]);

  // Handle prompt mode - auto-generate fields from prompt
  useEffect(() => {
    const generateFromPrompt = async () => {
      if (!user || !initialPrompt || !avatar) return;

      // Only generate if we're in prompt mode (have avatar and initialPrompt but no agentId)
      if (agentId) return;

      setIsEnhancing(true);
      setError('');

      try {
        const prompt = `You are an AI agent configuration generator. Based on the user's prompt, generate appropriate agent details.

User Prompt: "${initialPrompt}"

Generate the following in JSON format:
{
  "name": "A catchy, professional agent name (2-50 characters)",
  "description": "A detailed, engaging description (50-500 characters)",
  "type": "One of: ${AGENT_TYPE_OPTIONS.map((opt) => opt.value).join(', ')}",
  "skills": ["Array of 2-5 relevant skills from:"]
}

Rules:
1. Name should be creative and relevant to the prompt
2. Description should be detailed and professional
3. Type must be one of the provided options
4. Skills must be from the provided list and relevant to the prompt
5. Return ONLY valid JSON, no additional text

JSON:`;

        const response = await sendMessageToGPT4(prompt);

        if (response && response.length > 0 && response[0].content) {
          const content = response[0].content.trim();

          // Try to extract JSON from the response
          const jsonMatch = content.match(/\{[\s\S]*\}/);
          if (!jsonMatch) {
            throw new Error('No valid JSON found in response');
          }

          const generatedData = JSON.parse(jsonMatch[0]);

          // Set the generated values
          if (generatedData.name) setValue('name', generatedData.name);
          if (generatedData.description) setValue('description', generatedData.description);
          if (
            generatedData.type &&
            AGENT_TYPE_OPTIONS.some((opt) => opt.value === generatedData.type)
          ) {
            setValue('type', generatedData.type);
          }
          // Set the avatar from the avatar prop
          if (avatar) {
            try {
              // Get asset URL from Hedra using the avatar ID
              const assetData = await getAsset(avatar, 'image');

              if (assetData && assetData[0]?.asset?.url) {
                const assetUrl = assetData[0].asset.url;

                // Fetch the image from the asset URL
                const imageResponse = await fetch(assetUrl);
                const imageBlob = await imageResponse.blob();

                // Convert blob to file
                const imageFile = new File([imageBlob], `avatar-${avatar}.jpg`, {
                  type: 'image/jpeg',
                });

                // Upload to Pinata
                const pinataUrl = await uploadToPinata(
                  imageFile,
                  `${user?.address || 'user'}-avatar-${avatar}`,
                );

                if (pinataUrl) {
                  // Set the form values
                  setValue('image', pinataUrl);
                  setUploadedImage(avatar);
                  setUploadedIPFSImage(pinataUrl);
                }
              } else {
                // Fallback to template if asset not found
                const matchingTemplate = templateImages.find((t) => t.id === avatar);
                if (matchingTemplate) {
                  setValue('image', matchingTemplate.url);
                  setUploadedImage(matchingTemplate.id);
                  setUploadedIPFSImage(matchingTemplate.url);
                }
              }
            } catch (error) {
              console.error('Error fetching/uploading avatar:', error);
              // Fallback to template
              const matchingTemplate = templateImages.find((t) => t.id === avatar);
              if (matchingTemplate) {
                setValue('image', matchingTemplate.url);
                setUploadedImage(matchingTemplate.id);
                setUploadedIPFSImage(matchingTemplate.url);
              }
            }
          }

          // Set default voice
          setValue('voice', 'coral');

          setSuccess('Agent details generated from your prompt!');
        } else {
          throw new Error('No response received');
        }
      } catch (error) {
        console.error('Error generating from prompt:', error);
        setError(
          `Failed to generate agent details: ${error instanceof Error ? error.message : 'Unknown error'}`,
        );
      } finally {
        setIsEnhancing(false);
      }
    };

    generateFromPrompt();
  }, [user, initialPrompt, avatar, agentId, setValue]);

  // Load existing data from backend on mount - only if agentId is provided
  useEffect(() => {
    const loadExistingData = async () => {
      if (!user) return;

      // Only load data if agentId is provided (edit mode)
      if (!agentId) return;

      // Add a small delay to ensure authentication session is fully established
      // This prevents the race condition where the API is called before cookies are set
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // later use
      // setIsLoadingCharacter(true);
      try {
        // Get specific agent by agentId
        const agent = await getAgentById(agentId);

        setExistingAgentId(agent.id);

        // Fetch character data from character URL
        if (agent.characterUrl) {
          try {
            const response = await fetch(agent.characterUrl);
            const characterData = await response.json();

            // Populate form with character data
            if (characterData.name) setValue('name', characterData.name);
            if (characterData.description) setValue('description', characterData.description);
            if (characterData.agent?.voice && voiceOptions.includes(characterData.agent.voice)) {
              setValue('voice', characterData.agent.voice);
            }
            if (characterData.agent?.type) setValue('type', characterData.agent.type);
            if (characterData.agent?.skills && Array.isArray(characterData.agent?.skills)) {
              setValue('skills', characterData.agent?.skills);
            }
            if (characterData.image) {
              setValue('image', characterData.image);
              setUploadedIPFSImage(characterData.image);
            }

            // Handle image - fetch from Hedra using getAsset
            if (characterData.agent?.image) {
              setUploadedImage(characterData.agent?.image);
            }

            // Handle knowledge items
            if (characterData.agent?.knowledge && Array.isArray(characterData.agent?.knowledge)) {
              setKnowledgeItems(characterData.agent?.knowledge);
            }
          } catch (error) {
            console.error('Failed to fetch character data from URL:', error);
          }
        }
      } catch (error) {
        console.error('Failed to load character from backend:', error);
      } finally {
        // later use
        // setIsLoadingCharacter(false);
      }
    };

    loadExistingData();
  }, [user, agentId, setValue, voiceOptions]);

  // Handle knowledge file upload
  const handleKnowledgeFileUpload = async (files: File[]) => {
    if (!user) {
      openSignInDialog();
      toast.error('Please log in!', {
        position: 'bottom-right',
        pauseOnHover: false,
        autoClose: 1500,
      });
      return;
    }

    if (files.length === 0) return;

    // Check if limit is reached
    if (knowledgeItems.length >= MAX_KNOWLEDGE_ITEMS) {
      setError(`Maximum of ${MAX_KNOWLEDGE_ITEMS} knowledge items allowed`);
      return;
    }

    const file = files[0];
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
    ];

    if (!allowedTypes.includes(file.type)) {
      setError('Only PDF, DOC, DOCX, and TXT files are allowed');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('File size should be less than 10MB');
      return;
    }

    setIsUploadingKnowledge(true);
    setError('');

    try {
      const address = user?.address || '';

      // Determine file type from extension
      const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
      let fileType: 'pdf' | 'doc' | 'docx' | 'txt' = 'pdf';

      if (fileExtension === 'pdf') fileType = 'pdf';
      else if (fileExtension === 'doc') fileType = 'doc';
      else if (fileExtension === 'docx') fileType = 'docx';
      else if (fileExtension === 'txt') fileType = 'txt';

      // Upload file to S3 knowledges folder
      const fileName = `${address}-${Date.now()}-${file.name}`;
      const uploadedFileUrl = await uploadToPinata(file, fileName);
      if (!uploadedFileUrl) {
        throw new Error('Failed to upload file to IPFS');
      }
      // Add to knowledge items
      const newKnowledgeItem: KnowledgeItem = {
        id: crypto.randomUUID(),
        type: fileType,
        name: file.name,
        value: uploadedFileUrl,
      };

      const updatedKnowledge = [...knowledgeItems, newKnowledgeItem];
      setKnowledgeItems(updatedKnowledge);

      setSuccess('Knowledge file uploaded successfully!');
    } catch (error) {
      console.error('Error uploading knowledge file:', error);
      setError(`Failed to upload knowledge file: ${error}`);
    } finally {
      setIsUploadingKnowledge(false);
    }
  };

  // Handle adding URL
  const handleAddUrl = () => {
    if (!user) {
      openSignInDialog();
      toast.error('Please log in!', {
        position: 'bottom-right',
        pauseOnHover: false,
        autoClose: 1500,
      });
      return;
    }

    if (!urlInput.trim()) {
      setError('Please enter a valid URL');
      return;
    }

    // Check if limit is reached
    if (knowledgeItems.length >= MAX_KNOWLEDGE_ITEMS) {
      setError(`Maximum of ${MAX_KNOWLEDGE_ITEMS} knowledge items allowed`);
      return;
    }

    // Basic URL validation
    try {
      new URL(urlInput);
    } catch (error) {
      console.error('Invalid URL:', error);
      setError('Please enter a valid URL');
      return;
    }

    // Just add URL to list, don't upload to backend yet
    const newKnowledgeItem: KnowledgeItem = {
      id: crypto.randomUUID(),
      type: 'url',
      name: urlInput,
      value: urlInput,
    };

    const updatedKnowledge = [...knowledgeItems, newKnowledgeItem];
    setKnowledgeItems(updatedKnowledge);

    setUrlInput('');
    setSuccess('URL added successfully!');
    setError('');
  };

  // Handle removing knowledge item
  const handleRemoveKnowledge = (id: string) => {
    const updatedKnowledge = knowledgeItems.filter((item) => item.id !== id);
    setKnowledgeItems(updatedKnowledge);
    setSuccess('Knowledge item removed successfully!');
  };

  // Handle enhance description
  const handleEnhanceDescription = async () => {
    if (!user) {
      openSignInDialog();
      return;
    }

    if (!name?.trim()) {
      setError('Please enter an agent name first');
      return;
    }

    if (!description?.trim()) {
      setError('Please enter a description to enhance');
      return;
    }

    setIsEnhancing(true);
    setError('');

    try {
      const prompt = `You are an AI agent description enhancer. Given an agent name and description, enhance the description to be more detailed, professional, and engaging while maintaining the core intent.

Agent Name: ${name}
Current Description: ${description}

Please provide an enhanced version of the description that:
1. Maintains the original intent and key characteristics
2. Adds more detail and personality
3. Makes it more engaging and professional
4. Keeps it concise (under 500 characters)

Return ONLY the enhanced description text, without any additional commentary or formatting.`;

      const response = await sendMessageToGPT4(prompt);

      if (response && response.length > 0 && response[0].content) {
        const enhancedDescription = response[0].content.trim();
        setValue('description', enhancedDescription);
        setSuccess('Description enhanced successfully!');
      } else {
        throw new Error('No response received');
      }
    } catch (error) {
      console.error('Error enhancing description:', error);
      setError(
        `Failed to enhance description: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    } finally {
      setIsEnhancing(false);
    }
  };

  return (
    <div className="w-full max-w-[90rem] mx-auto px-4 md:px-6">
      <form className="pt-10" onSubmit={(e) => e.preventDefault()}>
        <Motion.h1
          className="text-center text-white font-semibold text-2xl font-tektur uppercase"
          initial={{ y: -20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
        >
          Build Your Agent
        </Motion.h1>
        <div className="w-full max-w-[608px] mx-auto mt-4 space-y-6">
          {/* Character Information */}
          <Motion.div className="space-y-4 bg-gray-800/75 p-4 border border-white/15" delay={0.2}>
            <h2 className="relative pl-4 font-medium text-base text-white leading-5 before:content-[''] before:w-2 before:h-2 before:absolute before:top-1.5 before:left-0 before:bg-orange-500">
              Agent Information
            </h2>
            <div className="space-y-2">
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleEnhanceDescription}
                  disabled={isEnhancing || !name?.trim() || !description?.trim()}
                  className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-medium rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5"
                >
                  {isEnhancing ? (
                    <>
                      <Icon icon="eos-icons:loading" className="w-3.5 h-3.5 animate-spin" />
                      <span>Enhancing...</span>
                    </>
                  ) : (
                    <>
                      <Icon icon="heroicons:sparkles" className="w-3.5 h-3.5" />
                      <span>Enhance</span>
                    </>
                  )}
                </button>
              </div>
              {errors.description && (
                <p className="text-xs text-red-600">{errors.description.message}</p>
              )}
            </div>
            <FormSelect
              wrapperClassName="grow"
              label="Agent Type"
              error={errors.type}
              value={type || ''}
              onChange={(val) => setValue('type', val)}
              options={[...AGENT_TYPE_OPTIONS]}
              placeholder="Select agent type..."
            />
          </Motion.div>

          {/* Voice Selection */}
          <Motion.div className="space-y-4 bg-gray-800/75 p-4 border border-white/15" delay={0.3}>
            <h2 className="relative pl-4 font-medium text-base text-white leading-5 before:content-[''] before:w-2 before:h-2 before:absolute before:top-1.5 before:left-0 before:bg-orange-500">
              Voice Selection
            </h2>
            <div className="flex flex-col md:flex-row gap-2 justify-between">
              <FormSelect
                key={`voice-select-${voice}`}
                wrapperClassName="grow"
                label="Select Voice"
                error={errors.voice}
                value={voice || ''}
                onChange={(val) => setValue('voice', val)}
                options={selectVoiceOptions}
                placeholder="Select a voice..."
              />
              <div
                className={twMerge(
                  'w-full md:w-[140px] md:min-w-[140px] flex items-end justify-end',
                  errors.voice && 'pb-5',
                )}
              >
                <button
                  type="button"
                  className="cursor-pointer flex items-center gap-2 w-fit md:w-full h-10 rounded-full bg-black-light border border-gray-700 p-1.5 pr-3 md:pr-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
                  disabled={voice === '' || isLoadingVoicePreview}
                  onClick={handleVoicePreview}
                >
                  {isLoadingVoicePreview ? <VoiceLoadingIcon /> : <VoicePlayIcon />}
                  <span className="font-medium text-xs text-gray-100">VOICE PREVIEW</span>
                </button>
              </div>
            </div>
          </Motion.div>

          {/* Knowledge Section */}
          <Motion.div className="space-y-4 bg-gray-800/75 p-4 border border-white/15" delay={0.4}>
            <div className="flex items-center justify-between">
              <h2 className="relative pl-4 font-medium text-base text-white leading-5 before:content-[''] before:w-2 before:h-2 before:absolute before:top-1.5 before:left-0 before:bg-orange-500">
                Knowledge Base
              </h2>
              <span className="text-xs text-gray-400">
                {knowledgeItems.length}/{MAX_KNOWLEDGE_ITEMS}
              </span>
            </div>

            <p className="text-xs text-gray-400">
              Add documents and URLs to enhance your character&apos;s knowledge (max{' '}
              {MAX_KNOWLEDGE_ITEMS})
            </p>

            {/* File Upload */}
            <div className="space-y-2">
              <label className="text-sm text-gray-300">Upload Documents</label>
              {isUploadingKnowledge ? (
                <div className="flex items-center justify-center gap-3 p-4 bg-black-light border border-gray-700 rounded">
                  <Icon icon="eos-icons:loading" className="w-5 h-5 text-orange-500 animate-spin" />
                  <span className="text-sm text-gray-300">Uploading knowledge...</span>
                </div>
              ) : (
                <>
                  <div className="relative">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.txt,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
                      onChange={(e) => {
                        const files = e.target.files;
                        if (files && files.length > 0) {
                          handleKnowledgeFileUpload(Array.from(files));
                          e.target.value = ''; // Reset input
                        }
                      }}
                      disabled={knowledgeItems.length >= MAX_KNOWLEDGE_ITEMS}
                      className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-orange-500 file:text-white hover:file:bg-orange-600 file:cursor-pointer file:transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    Supported formats: PDF, DOC, DOCX, TXT (Max 10MB)
                  </p>
                </>
              )}
            </div>

            {/* URL Input */}
            <div className="space-y-2">
              <label className="text-sm text-gray-300">Add URL</label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://example.com"
                  className="flex-1 px-3 py-2 bg-black-light border border-gray-700 rounded text-white text-sm placeholder:text-gray-500 focus:outline-none focus:border-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddUrl();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddUrl}
                  disabled={!urlInput.trim() || knowledgeItems.length >= MAX_KNOWLEDGE_ITEMS}
                  className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Knowledge Items List */}
            {knowledgeItems.length > 0 && (
              <div className="space-y-2 mt-4">
                <label className="text-sm text-gray-300">
                  Added Knowledge ({knowledgeItems.length})
                </label>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {knowledgeItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-2 p-3 bg-black-light border border-gray-700 rounded"
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <Icon
                          icon={item.type === 'url' ? 'heroicons:link' : 'heroicons:document-text'}
                          className="w-5 h-5 text-gray-400 flex-shrink-0"
                        />
                        <span className="text-sm text-gray-300 truncate" title={item.name}>
                          {item.name}
                        </span>
                        <span className="text-xs text-gray-500 uppercase">{item.type}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveKnowledge(item.id)}
                        className="p-1 hover:bg-red-500/20 rounded transition-colors flex-shrink-0"
                      >
                        <Icon icon="heroicons:x-mark" className="w-5 h-5 text-red-400" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Motion.div>

          {/* Template Images */}
          <Motion.div className="space-y-4 bg-gray-800/75 p-4 border border-white/15" delay={0.5}>
            <h2 className="relative pl-4 font-medium text-base text-white leading-5 before:content-[''] before:w-2 before:h-2 before:absolute before:top-1.5 before:left-0 before:bg-orange-500">
              Try one of our realtime agents
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {templateImages.map((template, index) => (
                <div
                  key={index}
                  className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-200 hover:border-orange-500 ${
                    image === template.url
                      ? 'border-orange-500 ring-2 ring-orange-500/50'
                      : 'border-gray-600'
                  }`}
                  onClick={() => handleTemplateSelect(template)}
                >
                  <div className="aspect-square">
                    <img
                      src={template.url}
                      alt={`Template ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {image === template.url && (
                    <div className="absolute inset-0 bg-orange-500/20 flex items-center justify-center">
                      <Icon
                        icon="heroicons:check-circle-solid"
                        className="w-8 h-8 text-orange-500"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400">
              Try one of our realtime agents or upload your own below
            </p>
          </Motion.div>

          {/* Character image */}
          <Motion.div
            className="space-y-4 bg-gray-800/75 pt-4 px-4 pb-6 border border-white/15"
            delay={0.6}
          >
            <input type="hidden" {...register('image')} />
            {image && (
              <>
                <div className="flex flex-col md:flex-row gap-5 py-2 pl-2 pr-4 w-full bg-black-light rounded border border-gray-700">
                  <div className="flex w-full justify-center md:w-30 md:h-30 rounded bg-gray-600 relative overflow-hidden">
                    <img
                      src={image}
                      alt="Agent avatar"
                      className="w-full h-full object-cover max-w-30"
                    />
                  </div>
                  <div className="grow flex flex-col md:flex-row justify-between gap-4 md:gap-2">
                    <div className="flex flex-col justify-center">
                      <h3 className="relative pl-4 font-medium text-base text-white leading-5 before:content-[''] before:w-2 before:h-2 before:absolute before:top-1.5 before:left-0 before:bg-orange-500">
                        Create your own realtime agent
                      </h3>
                      <div className="mt-2.5 text-gray-350 text-xs">
                        <p>Max file size: {numeral(5 * 1024 * 1024).format('0b')}</p>
                        <p>Recommended: square image.</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <FileDropzone
                        maxSize={5 * 1024 * 1024}
                        maxFiles={1}
                        accept={['image/jpeg', 'image/jpg', 'image/png', 'image/webp']}
                        showOnlyButton={true}
                        buttonLabel="Change"
                        onFilesSelected={handleImageUpload}
                        disabled={isUploading}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
            {!image && (
              <>
                <h2 className="relative pl-4 font-medium text-base leading-5 before:content-[''] before:w-2 before:h-2 before:absolute before:top-1.5 before:left-0 before:bg-orange-500">
                  Create your own realtime agent
                </h2>
                <FileDropzone
                  maxSize={5 * 1024 * 1024}
                  maxFiles={1}
                  accept={['image/jpeg', 'image/jpg', 'image/png', 'image/webp']}
                  onFilesSelected={handleImageUpload}
                  disabled={isUploading}
                />
              </>
            )}
            {errors.image && <p className="mt-1 text-xs text-red-600">{errors.image.message}</p>}

            {/* Upload Progress Bar */}
            {isUploading && (
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-300">Uploading agent...</span>
                  <span className="text-sm text-gray-300">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-orange-500 to-orange-400 h-2 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </Motion.div>

          {/* Error and Success Messages */}
          {error && (
            <Motion.div
              className="bg-red-900/50 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg flex items-center gap-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Icon icon="heroicons:exclamation-triangle" className="w-5 h-5 text-red-400" />
              <span>{error}</span>
            </Motion.div>
          )}

          {success && (
            <Motion.div
              className="bg-green-900/50 border border-green-500/50 text-green-200 px-4 py-3 rounded-lg flex items-center gap-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Icon icon="heroicons:check-circle" className="w-5 h-5 text-green-400" />
              <span>{success}</span>
            </Motion.div>
          )}

          <Motion.div
            className="flex flex-col-reverse md:grid grid-cols-2 gap-2 md:gap-6 pb-6"
            delay={0.7}
          >
            <ButtonBlue
              type="button"
              wrapperClassName="p-0"
              innerClassName="shadow-none w-full"
              btnClassName="w-full"
              onClick={handleReset}
            >
              <div className="flex items-center justify-center gap-2 font-tektur font-semibold text-base uppercase text-shadow-sm text-shadow-black/25">
                <Icon icon="heroicons-solid:refresh" className="w-6 h-6" />
                Reset
              </div>
            </ButtonBlue>

            <ButtonOrange
              className="w-full p-0"
              innerClassName="shadow-none"
              contentClassName="py-2 px-5"
              onClick={(e) => {
                e.preventDefault();
                handleUseCharacter();
              }}
              disabled={isUploadingCharacter || isScraping || isEnhancing}
              disabledGrayType={true}
            >
              <div className="flex items-center gap-2.5 font-tektur font-semibold text-base uppercase text-shadow-sm text-shadow-black/25 text-white">
                {isUploadingCharacter || isScraping || isEnhancing ? (
                  <>
                    <Icon icon="eos-icons:loading" className="w-5 h-5 animate-spin" />
                    {isScraping
                      ? 'Processing knowledge...'
                      : isEnhancing
                        ? 'Enhancing description...'
                        : 'Uploading character...'}
                  </>
                ) : (
                  'Chat with Agent'
                )}
              </div>
            </ButtonOrange>
          </Motion.div>
        </div>
      </form>
    </div>
  );
};
