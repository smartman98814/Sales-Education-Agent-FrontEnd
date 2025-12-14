export interface VoiceOption {
  id: string;
  name: string;
  language: string;
  gender: 'male' | 'female';
  preview_url: string;
}

export interface VoiceOptionsResponse {
  data: VoiceOption[];
}
