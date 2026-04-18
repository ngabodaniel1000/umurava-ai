'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useState } from 'react';
import { ChevronRight, CheckCircle2, Zap, BarChart3 } from 'lucide-react';

interface ScreeningWizardProps {
  jobTitle: string;
  candidateName?: string;
  mode?: 'manual' | 'bulk';
  onComplete: (result: any) => void;
}

export function ScreeningWizard({ jobTitle, candidateName = "Multiple Candidates", mode = 'bulk', onComplete }: ScreeningWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [matchPercentage, setMatchPercentage] = useState(0);

  // Simulate screening steps for Scenario 2
  const steps = [
    {
      title: 'Parsing Documents',
      description: 'Extracting skills and experience from unstructured CVs...',
    },
    {
      title: 'Normalizing Data',
      description: 'Transforming candidates into standardized profiles...',
    },
    {
      title: 'Matching Skills',
      description: 'Comparing extracted skills with job requirements...',
    },
    {
      title: 'Scoring & Ranking',
      description: 'Evaluating and ranking candidates by relevance...',
    },
    {
      title: 'AI Generation',
      description: 'Generating detailed insights and explanations...',
    },
  ];

  // Simulate screening process
  const runScreening = async () => {
    for (let i = 0; i < steps.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setCurrentStep(i + 1);
      setMatchPercentage(Math.floor((i + 1) * 20 + Math.random() * 10));
    }

    // Complete screening
    setTimeout(() => {
      onComplete({
        jobTitle,
        candidateName,
        score: 7.8,
        matchPercentage: 78,
        matchedSkills: ['React', 'TypeScript', 'AWS'],
        feedback:
          'Strong candidate with relevant skills and experience. Recommended for next round.',
        status: 'passed',
      });
    }, 500);
  };

  if (currentStep > 0 && currentStep < steps.length + 1) {
    return (
      <div className="space-y-8">
        {/* Progress Bar */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-foreground">Screening Progress</span>
            <span className="text-sm font-semibold text-accent">{matchPercentage}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-3">
            <div
              className="bg-linear-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${matchPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border ${index < currentStep
                ? 'bg-green-500/10 border-green-500/30'
                : index === currentStep
                  ? 'bg-accent/10 border-accent/50'
                  : 'bg-muted border-border'
                }`}
            >
              <div className="flex items-center gap-3">
                {index < currentStep ? (
                  <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                ) : index === currentStep ? (
                  <Zap className="w-5 h-5 text-accent shrink-0 animate-pulse" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-border shrink-0"></div>
                )}
                <div className="flex-1">
                  <p className={`font-semibold ${index <= currentStep ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {step.title}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (currentStep > steps.length) {
    return (
      <Card className="p-8 bg-linear-to-br from-green-500/10 via-background to-background border-green-500/30">
        <div className="text-center">
          <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-foreground mb-2">Screening Complete!</h3>
          <p className="text-muted-foreground mb-6">Results are ready for review</p>
          <Button
            className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
            onClick={() => window.location.reload()}
          >
            View Results
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-8 bg-card border-border">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-foreground mb-2">Ready to Screen?</h3>
        <p className="text-muted-foreground mb-6">
          AI screening will analyze {candidateName} for the {jobTitle} position
        </p>
        <Button
          onClick={runScreening}
          className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold gap-2 h-12"
        >
          <BarChart3 className="w-5 h-5" />
          Start AI Screening
        </Button>
      </div>
    </Card>
  );
}
