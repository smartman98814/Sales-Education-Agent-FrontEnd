type FollowJoinlistItem = {
  type: 'twitter' | 'discord';
  id: string;
};

export const FOLLOW_JOINLIST: FollowJoinlistItem[] = [
  {
    type: 'twitter',
    id: 'nfaxyz',
  },
  {
    type: 'twitter',
    id: 'chatandbuild',
  },
  {
    type: 'discord',
    id: 'ChatAndBuild',
  },
];

export const HEADER_NAV_MENUS = [
  {
    title: 'Account',
    link: '/account',
    target: '_self',
  },
  {
    title: 'Marketplace',
    link: '/',
    target: '_self',
  },
  {
    title: 'Create',
    link: '/',
    target: '_self',
  },
];

export const AGENTS = [
  {
    name: 'Mona',
    role: 'Astrology GURU',
    avatar: '/images/landing/agent-mona-thumb.png',
    photo: '/images/landing/agent-mona.png',
    portfolio: '“I’ll help you say it smoother. Even the slang.”',
  },
  {
    name: 'Richard',
    role: 'BUDGET BEE',
    avatar: '/images/landing/agent-richard-thumb.png',
    photo: '/images/landing/agent-richard.png',
    portfolio: '“I’ll help you say it smoother. Even the slang.”',
  },
  {
    name: 'Morgan',
    role: 'language coach',
    avatar: '/images/landing/agent-morgan-thumb.png',
    photo: '/images/landing/agent-morgan.png',
    portfolio: '“I’ll help you say it smoother. Even the slang.”',
  },
  {
    name: 'Ana',
    role: 'LOVE HERO',
    avatar: '/images/landing/agent-ana-thumb.png',
    photo: '/images/landing/agent-ana.png',
    portfolio: 'Your go-to AI for all things DAO.',
  },
];

export const AGENT_IDS = [
  {
    digits: 1,
    price: 50,
    img: '/images/landing/agent-id-1.png',
  },
  {
    digits: 2,
    price: 30,
    img: '/images/landing/agent-id-2.png',
  },
  {
    digits: 3,
    price: 20,
    img: '/images/landing/agent-id-3.png',
  },
  {
    digits: 4,
    price: 10,
    img: '/images/landing/agent-id-4.png',
  },
  {
    digits: 5,
    price: 3,
    img: '/images/landing/agent-id-5.png',
  },
];

export const TOKEN_STANDARDS = [
  {
    title: '$NFA powers evolution, upgrades, and governance',
    image: '/images/landing/powers-evolution.png',
  },

  {
    title: 'BAP-578 is a memory-native upgrade to ERC-721',
    image: '/images/landing/coin.png',
  },
  {
    title: 'Meme-ready, protocol-secure, and culture-aligned',
    image: '/images/landing/meme-secure.png',
  },
];
