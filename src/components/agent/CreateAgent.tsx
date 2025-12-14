'use client';

import { Icon } from '@iconify/react';
import { useRef, useState } from 'react';
import { toast } from 'react-toastify';

import { Motion } from '@/components/common';
import { useAuth } from '@/context';
import { useRouter, usePathname } from '@/i18n/navigation';

// Predefined avatar images - 10 avatars for 2 rows x 5 columns layout
const PREDEFINED_AVATARS = [
  {
    id: 1,
    name: 'Maya',
    fullName: 'Maya - Rushed Salon Owner',
    role: 'Owner of a busy hair and nail salon',
    description: 'Friendly but hurried salon owner focused on Instagram-worthy aesthetics',
    personality: 'Busy, Instagram-obsessed, cost-skeptical at first',
    backgroundColor: '#FF6B9D',
    initials: 'M',
    url: 'https://files2.heygen.ai/avatar/v3/d3370d0f86784bde8e2144d16d573dcc_55280/preview_target.webp',
    heygenAvatarId: 'Anastasia_Chair_Sitting_public',
    heygenVoiceId: 'e0cc82c22f414c95b1f25696c732f058',
  },
  {
    id: 2,
    name: 'Patricia',
    fullName: 'Patricia - Medical Office Manager',
    role: 'Office manager at a dental practice',
    description: 'Detail-oriented healthcare office manager focused on patient comfort and compliance',
    personality: 'Detail-oriented, cautious, asks about sanitation/allergies/maintenance',
    backgroundColor: '#4ECDC4',
    initials: 'P',
    url: 'https://files2.heygen.ai/avatar/v3/699a4c2995914d39b2cb311a930d7720_45570/preview_talk_3.webp',
    heygenAvatarId: 'Ann_Doctor_Standing2_public',
    heygenVoiceId: 'f8c69e517f424cafaecde32dde57096b',
  },
  {
    id: 3,
    name: 'Jennifer',
    fullName: 'Jennifer - Corporate Receptionist',
    role: 'Receptionist and gatekeeper at a professional office',
    description: 'Polite but protective gatekeeper who controls access to decision makers',
    personality: 'Tired of salespeople, initially deflects, warms up if treated respectfully',
    backgroundColor: '#95E1D3',
    initials: 'J',
    url: 'https://files2.heygen.ai/avatar/v3/89e07b826f1c4cb1a5549201cdd8f4d6_55300/preview_target.webp',
    heygenAvatarId: 'Alessandra_Chair_Sitting_public',
    heygenVoiceId: 'fb8c5c3f02854c57a4da182d4ed59467',
  },
  {
    id: 4,
    name: 'Marcus',
    fullName: 'Marcus - Cost-Conscious Café Owner',
    role: 'Owner of a small café with tight margins',
    description: 'Pragmatic, budget-focused café owner who compares all costs carefully',
    personality: 'Pragmatic, immediately asks "How much?", compares everything to Costco',
    backgroundColor: '#F38181',
    initials: 'M',
    url: 'https://gateway.pinata.cloud/ipfs/QmfVoPvuWvvbbsueXsQ1DjsZ7Zc3BUAYELkLN7VK5JheSh',
    heygenAvatarId: 'Bryan_FitnessCoach_public',
    heygenVoiceId: '3b4aec73277b4a3f8afd462f76da2778',
  },
  {
    id: 5,
    name: 'Diane',
    fullName: 'Diane - Corporate Marketing Manager',
    role: 'Marketing manager at a law firm',
    description: 'Strategic, brand-focused manager who needs ROI justification',
    personality: 'Strategic, measured, thinks ROI/client perception, needs data',
    backgroundColor: '#AA96DA',
    initials: 'D',
    url: 'https://files2.heygen.ai/avatar/v3/4e5afdfe8bdb44f3ae18b90281ab034c_45610/preview_talk_1.webp',
    heygenAvatarId: 'Elenora_FitnessCoach2_public',
    heygenVoiceId: 'cef3bc4e0a84424cafcde6f2cf466c97',
  },
  {
    id: 6,
    name: 'Rick',
    fullName: 'Rick - Auto Dealership GM',
    role: 'General manager of a car dealership',
    description: 'Sales-driven, enthusiastic GM who loves customer wow-factor',
    personality: 'Energetic, obsessed with customer wow-factor and showroom appeal',
    backgroundColor: '#FCBAD3',
    initials: 'R',
    url: 'https://files2.heygen.ai/avatar/v3/f83fffc45faa4368b6db9597e6b323ca_45590/preview_talk_3.webp',
    heygenAvatarId: 'Dexter_Doctor_Sitting2_public',
    heygenVoiceId: 'e0cc82c22f414c95b1f25696c732f058',
  },
  {
    id: 7,
    name: 'Sofia',
    fullName: 'Sofia - Boutique Retail Owner',
    role: 'Owner of a boutique retail store',
    description: 'Design-focused owner who makes emotional decisions based on aesthetics',
    personality: 'Design-focused, emotional, highly visual decisions, brand-conscious',
    backgroundColor: '#FFFFD2',
    initials: 'S',
    url: 'https://files2.heygen.ai/avatar/v3/b1ff5edbf96242e6ac9469227df40924_55360/preview_target.webp',
    heygenAvatarId: 'Katya_Chair_Sitting_public',
    heygenVoiceId: '0c418eab508d4030879c0c3381433806',
  },
  {
    id: 8,
    name: 'Robert',
    fullName: 'Robert - Skeptical CFO',
    role: 'CFO focused on financial justification',
    description: 'Analytical, numbers-focused CFO who demands clear financial value',
    personality: 'Analytical, data-focused, questions financial value, demands ROI',
    backgroundColor: '#A8DADC',
    initials: 'R',
    url: 'https://files2.heygen.ai/avatar/v3/db2fb7fd0d044b908395a011166ab22d_45680/preview_target.webp',
    heygenAvatarId: 'Shawn_Therapist_public',
    heygenVoiceId: 'c4a8ceb7a2954500bc047fb092bcff3f',
  },
  {
    id: 9,
    name: 'Amanda',
    fullName: 'Amanda - Hotel Manager',
    role: 'Manager of a boutique hotel focused on guest experience',
    description: 'Guest-obsessed hotel manager who thinks at scale and values reviews',
    personality: 'Guest-focused, obsessed with reviews, thinks at scale',
    backgroundColor: '#FFB4A2',
    initials: 'A',
    url: 'https://files2.heygen.ai/avatar/v3/2b901b6b72c4444d81a93a2eb8fe1070_55420/preview_target.webp',
    heygenAvatarId: 'Rika_Chair_Sitting_public',
    heygenVoiceId: '16a09e4706f74997ba4ed05ea11470f6',
  },
  {
    id: 10,
    name: 'James',
    fullName: 'James - Multi-Location Franchise Owner',
    role: 'Owner of 8-12 franchise locations seeking turnkey solutions',
    description: 'Strategic multi-location owner who values consistency and hates complexity',
    personality: 'Strategic, thinks scale, hates complexity, wants turnkey solutions',
    backgroundColor: '#B5EAD7',
    initials: 'J',
    url: 'https://files2.heygen.ai/avatar/v3/a1ed8c71e4bf4e6cb9071d2b7cd71e4e_45660/preview_talk_1.webp',
    heygenAvatarId: 'Silas_CustomerSupport_public',
    heygenVoiceId: 'd2f4f24783d04e22ab49ee8fdc3715e0',
  },
];

export const CreateAgent = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, openSignInDialog } = useAuth();
  const [selectedAvatar, setSelectedAvatar] = useState<typeof PREDEFINED_AVATARS[0] | null>(null);
  const [hoveredAvatar, setHoveredAvatar] = useState<{ avatar: typeof PREDEFINED_AVATARS[0]; index: number } | null>(null);
  const [modalPosition, setModalPosition] = useState<{ top: number; left: number } | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const leaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const avatarRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const modalRef = useRef<HTMLDivElement>(null);

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

    try {
      // Navigate to avatar page with selected avatar if any
      if (selectedAvatar) {
        // Extract locale from current pathname (e.g., "/en" from "/en/...")
        const localeMatch = pathname.match(/^\/([^/]+)/);
        const locale = localeMatch ? localeMatch[1] : 'en';
        const url = `/${locale}/avatar?avatarId=${selectedAvatar.id}&avatarUrl=${encodeURIComponent(selectedAvatar.url)}`;
        console.log('Navigating to:', url);
        console.log('Selected avatar:', selectedAvatar);
        // Use window.location for full page reload to ensure server component re-renders with new searchParams
        // This is necessary because Next.js App Router server components don't always re-render on client-side navigation
        window.location.href = url;
      } else {
        console.log('No avatar selected, navigating to /avatar');
        router.push('/avatar');
      }
    } catch (error) {
      console.error('Navigation error:', error);
      toast.error('Failed to navigate. Please try again.', {
        position: 'bottom-right',
        pauseOnHover: false,
        autoClose: 3000,
      });
    }
  };

  const handleSelectAvatar = (avatar: typeof PREDEFINED_AVATARS[0]) => {
    setSelectedAvatar(avatar);
  };

  const calculateModalPosition = (avatarId: number | string) => {
    const avatarElement = avatarRefs.current.get(String(avatarId));
    if (!avatarElement) return;

    const rect = avatarElement.getBoundingClientRect();
    const modalWidth = 280; // Width/Height = 4/5, so height = 280 * 5/4 = 350
    const modalHeight = 350;
    const padding = 16;
    const gap = 12;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let top = 0;
    let left = 0;

    // Calculate available space
    const spaceBelow = viewportHeight - rect.bottom;
    const spaceAbove = rect.top;
    const spaceRight = viewportWidth - rect.right;
    const spaceLeft = rect.left;

    // Prefer bottom placement
    if (spaceBelow >= modalHeight + gap + padding) {
      top = rect.bottom + gap;
      left = rect.left + rect.width / 2 - modalWidth / 2;
    }
    // Fallback to top
    else if (spaceAbove >= modalHeight + gap + padding) {
      top = rect.top - modalHeight - gap;
      left = rect.left + rect.width / 2 - modalWidth / 2;
    }
    // Fallback to right
    else if (spaceRight >= modalWidth + gap + padding) {
      top = rect.top + rect.height / 2 - modalHeight / 2;
      left = rect.right + gap;
    }
    // Fallback to left
    else if (spaceLeft >= modalWidth + gap + padding) {
      top = rect.top + rect.height / 2 - modalHeight / 2;
      left = rect.left - modalWidth - gap;
    }
    // Default: bottom with adjustments
    else {
      top = rect.bottom + gap;
      left = rect.left + rect.width / 2 - modalWidth / 2;
    }

    // Ensure modal stays within viewport
    left = Math.max(padding, Math.min(left, viewportWidth - modalWidth - padding));
    top = Math.max(padding, Math.min(top, viewportHeight - modalHeight - padding));

    setModalPosition({ top, left });
  };

  const handleAvatarMouseEnter = (avatar: typeof PREDEFINED_AVATARS[0], index: number) => {
    // Clear any pending leave timeout - this is crucial for moving between avatars
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }

    // Clear any existing hover timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }

    // Immediately update hover state and position when entering a new avatar
    setHoveredAvatar({ avatar, index });
    
    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(() => {
      calculateModalPosition(avatar.id);
    });
  };

  const handleAvatarMouseLeave = () => {
    // Clear hover timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }

    // Delay hiding to allow moving to modal or another avatar
    leaveTimeoutRef.current = setTimeout(() => {
      setHoveredAvatar(null);
      setModalPosition(null);
    }, 150);
  };

  const handleModalMouseEnter = () => {
    // Cancel hide if mouse enters modal
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }
  };

  const handleModalMouseLeave = () => {
    // Hide modal when leaving
    setHoveredAvatar(null);
    setModalPosition(null);
  };



  return (
    <div className="w-full min-h-[calc(100vh-200px)] flex flex-col items-center justify-center px-4 md:px-6 py-10 relative">
      {/* Modern gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-gray-900 to-black-light -z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,106,42,0.15),transparent_50%)] -z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(39,145,252,0.1),transparent_50%)] -z-10" />
      <div className="w-full max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <Motion.div
          className="text-center"
          initial={{ y: -20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
        >
          <h1 className="text-white font-semibold text-3xl md:text-4xl font-tektur">
            What can I help with?
          </h1>
        </Motion.div>

        {/* Avatar Selection Grid - 2 rows x 5 columns */}
        <Motion.div
          className="w-full"
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          delay={0.1}
        >
          <h2 className="text-white font-semibold text-xl font-tektur mb-4 text-center">
             &nbsp;
          </h2>
          <div className="grid grid-cols-5 gap-4 relative">
            {PREDEFINED_AVATARS.map((avatar, index) => (
              <Motion.button
                key={avatar.id}
                ref={(el) => {
                  if (el) avatarRefs.current.set(String(avatar.id), el);
                }}
                onClick={() => handleSelectAvatar(avatar)}
                onMouseEnter={() => handleAvatarMouseEnter(avatar, index)}
                onMouseLeave={handleAvatarMouseLeave}
                className={`relative aspect-square bg-gray-900 border-2 rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 ${
                  selectedAvatar?.id === avatar.id
                    ? 'border-orange-500 ring-2 ring-orange-500/50'
                    : 'border-white/15 hover:border-orange-500/50'
                }`}
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                delay={0.05 * index}
              >
                <img
                  src={avatar.url}
                  alt={avatar.name}
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

            {/* Avatar Details Modal Popup */}
            {hoveredAvatar && modalPosition && (
              <div
                ref={modalRef}
                className="fixed z-50 pointer-events-auto transition-opacity duration-200"
                style={{
                  top: `${modalPosition.top}px`,
                  left: `${modalPosition.left}px`,
                }}
                onMouseEnter={handleModalMouseEnter}
                onMouseLeave={handleModalMouseLeave}
              >
                <div className="bg-gradient-to-br from-orange-400 via-orange-300 to-yellow-300 border-2 border-orange-500/60 rounded-xl shadow-2xl p-4 w-[280px] h-[350px] backdrop-blur-sm flex flex-col ring-2 ring-orange-400/30">
                  <div className="flex flex-col gap-3 flex-1">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 ring-2 ring-orange-400/30">
                        <img
                          src={hoveredAvatar.avatar.url}
                          alt={hoveredAvatar.avatar.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-bold text-lg font-tektur truncate drop-shadow-md">
                          {hoveredAvatar.avatar.name}
                        </h3>
                        <p className="text-white font-medium text-sm mt-1 truncate drop-shadow-md">{hoveredAvatar.avatar.role}</p>
                      </div>
                    </div>
                    <div className="pt-3 border-t border-white/40 flex-1 flex flex-col gap-3">
                      <div>
                        <p className="text-white text-base leading-relaxed font-medium drop-shadow-md">
                          {hoveredAvatar.avatar.description}
                        </p>
                      </div>
                      <div className="pt-2 border-t border-white/30">
                        <p className="text-white text-sm font-bold mb-1.5 drop-shadow-md">Personality:</p>
                        <p className="text-white text-sm leading-relaxed font-medium drop-shadow-md">
                          {hoveredAvatar.avatar.personality}
                        </p>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-white/30">
                      
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Motion.div>

        {/* Create Agent Button */}
        <Motion.div
          className="flex justify-center"
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          delay={0.2}
        >
          <button
            onClick={handleCreateAgent}
            className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 font-tektur text-lg"
          >
            <Icon icon="heroicons:plus-circle" className="w-6 h-6" />
            Create New Agent
          </button>
        </Motion.div>

      </div>
    </div>
  );
};

