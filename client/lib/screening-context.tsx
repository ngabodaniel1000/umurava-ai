'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Job, Candidate, ScreeningResult } from './types';

interface ScreeningContextType {
  activeJob: Job | null;
  candidates: Candidate[];
  results: ScreeningResult[];
  currentStep: number;
  setActiveJob: (job: Job) => void;
  setCurrentStep: (step: number) => void;
  addCandidates: (candidates: Candidate[]) => void;
  addResult: (result: ScreeningResult) => void;
  updateCandidateScore: (candidateId: string, score: number) => void;
  resetScreening: () => void;
}

const ScreeningContext = createContext<ScreeningContextType | undefined>(undefined);

export function ScreeningProvider({ children }: { children: ReactNode }) {
  const [activeJob, setActiveJob] = useState<Job | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [results, setResults] = useState<ScreeningResult[]>([]);
  const [currentStep, setCurrentStep] = useState(0);

  const addCandidates = (newCandidates: Candidate[]) => {
    setCandidates((prev) => [...prev, ...newCandidates]);
  };

  const addResult = (result: ScreeningResult) => {
    setResults((prev) => [...prev, result]);
  };

  const updateCandidateScore = (candidateId: string, score: number) => {
    const result = results.find((r) => r.candidateId === candidateId);
    if (result) {
      setResults((prev) =>
        prev.map((r) =>
          r.candidateId === candidateId ? { ...r, score } : r
        )
      );
    }
  };

  const resetScreening = () => {
    setActiveJob(null);
    setCandidates([]);
    setResults([]);
    setCurrentStep(0);
  };

  return (
    <ScreeningContext.Provider
      value={{
        activeJob,
        candidates,
        results,
        currentStep,
        setActiveJob,
        setCurrentStep,
        addCandidates,
        addResult,
        updateCandidateScore,
        resetScreening,
      }}
    >
      {children}
    </ScreeningContext.Provider>
  );
}

export function useScreening() {
  const context = useContext(ScreeningContext);
  if (!context) {
    throw new Error('useScreening must be used within ScreeningProvider');
  }
  return context;
}
