import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface OnboardingData {
  // Personal Info
  fullName: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other' | 'prefer_not_to_say' | '';
  
  // Body Metrics
  weight: string;
  weightUnit: 'kg' | 'lbs';
  height: string;
  heightUnit: 'cm' | 'ft';
  
  // Goals
  goal: 'lose_weight' | 'maintain_weight' | 'gain_weight' | '';
  targetWeight: string;
  activityLevel: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active' | '';
  
  // Preferences
  dietaryPreference: 'none' | 'vegetarian' | 'vegan' | 'pescatarian' | 'keto' | 'paleo';
  allergies: string;
}

interface OnboardingContextType {
  data: OnboardingData;
  updatePersonalInfo: (info: Partial<OnboardingData>) => void;
  updateBodyMetrics: (metrics: Partial<OnboardingData>) => void;
  updateGoals: (goals: Partial<OnboardingData>) => void;
  updatePreferences: (preferences: Partial<OnboardingData>) => void;
  resetData: () => void;
}

const initialData: OnboardingData = {
  fullName: '',
  dateOfBirth: '',
  gender: '',
  weight: '',
  weightUnit: 'kg',
  height: '',
  heightUnit: 'cm',
  goal: '',
  targetWeight: '',
  activityLevel: '',
  dietaryPreference: 'none',
  allergies: '',
};

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const OnboardingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [data, setData] = useState<OnboardingData>(initialData);

  const updatePersonalInfo = (info: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...info }));
  };

  const updateBodyMetrics = (metrics: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...metrics }));
  };

  const updateGoals = (goals: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...goals }));
  };

  const updatePreferences = (preferences: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...preferences }));
  };

  const resetData = () => {
    setData(initialData);
  };

  return (
    <OnboardingContext.Provider
      value={{
        data,
        updatePersonalInfo,
        updateBodyMetrics,
        updateGoals,
        updatePreferences,
        resetData,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within OnboardingProvider');
  }
  return context;
};
