export type AgentType = {
  name: string;
  role: string;
  avatar: string;
  photo: string;
  portfolio: string;
};

export interface Character {
  uid: string;
  name: string;
  description: string;
  agentNumber: string;
  image: string;
  type: string;
  skills: string[];
  vaultHash: string;
  vaultURI: string;
}

export interface AnimationProgress {
  step: string;
  progress: number;
}

export interface AgentMetadata {
  name: string;
  symbol: string;
  image: File | string;
  logicAddress: string;
  metadataURI: string;
  extendedMetadata: {
    persona: string;
    experience: string;
    voiceHash: string;
    animationURI: string;
    vaultURI: string;
    vaultHash: string;
  };
}

export interface KnowledgeItem {
  id: string;
  type: 'pdf' | 'doc' | 'docx' | 'txt' | 'url';
  name: string;
  value: string; // S3 URL for files, URL for urls
}

export interface NFA {
  tokenId: string;
  tokenAddress: string;
  deployerAddress: string;
  agentId: string;
  characterUrl: string;
  createdAt?: string;
  updatedAt?: string;
}
