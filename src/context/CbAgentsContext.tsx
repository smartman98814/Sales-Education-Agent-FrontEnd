'use client';

import _ from 'lodash';
import { ReactNode, createContext, useContext, useEffect, useState } from 'react';

type ContextType = {
  completedIntro: boolean;
  setCompletedIntro: (flag: boolean) => void;
  introStep: number;
  setIntroStep: (step: number) => void;
  lookedSimulatorPreview: boolean;
  setLookedSimulatorPreview: (flag: boolean) => void;
  isLoaded: boolean;
};

const CbAgentContext = createContext<ContextType | undefined>(undefined);

export function CbAgentsProvider({ children }: { children: ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [completedIntro, setCompletedIntro] = useState<boolean>(false);
  const [introStep, setIntroStep] = useState<number>(0);
  const [lookedSimulatorPreview, setLookedSimulatorPreview] = useState<boolean>(false);

  // Load from localStorage after component mounts to avoid hydration mismatch
  useEffect(() => {
    const storedCompletedIntro = localStorage.getItem('cbCompleteIntro');
    const storedIntroStep = localStorage.getItem('cbIntroStep');
    const storedLookedSimulatorPreview = localStorage.getItem('cbLookedSimulatorPreview');

    setCompletedIntro(storedCompletedIntro === 'true');
    setIntroStep(storedIntroStep ? parseInt(storedIntroStep) : 0);
    setLookedSimulatorPreview(storedLookedSimulatorPreview === 'true');
    setIsLoaded(true);
  }, []);

  const handleSetCompletedIntro = (flag: boolean) => {
    localStorage.setItem('cbCompleteIntro', flag ? 'true' : 'false');
    setCompletedIntro(flag);
  };

  const handleSetIntroStep = (step: number) => {
    localStorage.setItem('cbIntroStep', step.toString());
    setIntroStep(step);
  };

  const handleSetLookedSimulatorPreview = (flag: boolean) => {
    localStorage.setItem('cbLookedSimulatorPreview', flag ? 'true' : 'false');
    setLookedSimulatorPreview(flag);
  };

  const value: ContextType = {
    completedIntro,
    setCompletedIntro: handleSetCompletedIntro,
    introStep,
    setIntroStep: handleSetIntroStep,
    lookedSimulatorPreview,
    setLookedSimulatorPreview: handleSetLookedSimulatorPreview,
    isLoaded,
  };

  return <CbAgentContext.Provider value={value}>{children}</CbAgentContext.Provider>;
}

export function useCbAgents() {
  const context = useContext(CbAgentContext);
  if (!context) {
    throw new Error('useCbAgents must be used within a ThemeProvider');
  }
  return context;
}
