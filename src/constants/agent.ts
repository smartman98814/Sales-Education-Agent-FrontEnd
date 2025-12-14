import { ethers } from 'ethers';

export const AGENT_CREATION_FEE = ethers.parseEther('0.01');

export const AGENT_TYPE_OPTIONS = [
  { label: 'Rushed Salon Owner', value: 'Rushed Salon Owner' },
  { label: 'Medical Office Manager', value: 'Medical Office Manager' },
  { label: 'Corporate Receptionist / Gatekeeper', value: 'Corporate Receptionist / Gatekeeper' },
  { label: 'Cost-Conscious Café Owner', value: 'Cost-Conscious Café Owner' },
  { label: 'Corporate Marketing Manager', value: 'Corporate Marketing Manager' },
  { label: 'Auto Dealership General Manager', value: 'Auto Dealership General Manager' },
  { label: 'Boutique Retail Store Owner', value: 'Boutique Retail Store Owner' },
  { label: 'Skeptical Accountant/CFO', value: 'Skeptical Accountant/CFO' },
  { label: 'Aesthetic-Driven Hotel Manager', value: 'Aesthetic-Driven Hotel Manager' },
  { label: 'Overloaded Multi-Location Owner', value: 'Overloaded Multi-Location Owner' },
] as const;
