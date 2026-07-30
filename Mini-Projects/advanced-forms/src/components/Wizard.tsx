import React, { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocalStorage, Card } from '@internal/ui-system';
import { fullSchema, type FullFormData } from '../schemas/formSchemas';

import { Step1BasicInfo } from './Step1BasicInfo';
import { Step2Account } from './Step2Account';
import { Step3Preferences } from './Step3Preferences';
import { Step4Review } from './Step4Review';

const WIZARD_STORAGE_KEY = 'advanced-forms-wizard-state';

export function Wizard() {
  const [storedData, setStoredData] = useLocalStorage<Partial<FullFormData> & { _step?: number }>(
    WIZARD_STORAGE_KEY,
    { _step: 1 }
  );

  const [currentStep, setCurrentStep] = useState(storedData._step || 1);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const methods = useForm<FullFormData>({
    resolver: zodResolver(fullSchema),
    defaultValues: storedData,
    mode: 'onChange',
  });

  const { handleSubmit, watch } = methods;

  // Persist form data on change
  useEffect(() => {
    const subscription = watch((value) => {
      setStoredData({
        ...value,
        _step: currentStep,
      });
    });
    return () => subscription.unsubscribe();
  }, [watch, setStoredData, currentStep]);

  // Sync step changes to local storage explicitly when navigating
  useEffect(() => {
    setStoredData((prev) => ({
      ...prev,
      _step: currentStep,
    }));
  }, [currentStep, setStoredData]);

  const handleNext = () => setCurrentStep((prev) => Math.min(prev + 1, 4));
  const handlePrev = () => setCurrentStep((prev) => Math.max(prev - 1, 1));
  const handleEditStep = (step: number) => setCurrentStep(step);

  const onSubmit = (data: FullFormData) => {
    console.log('Form submitted successfully!', data);
    alert('Form submitted successfully!');
    
    // Clear storage on successful submit
    window.localStorage.removeItem(WIZARD_STORAGE_KEY);
    
    // Reset state and go back to step 1
    methods.reset();
    setCurrentStep(1);
    setStoredData({ _step: 1 });
  };

  const onError = (errors: any) => {
    // If it gets here, the whole form failed validation on final submit
    // Focus first invalid field logic is already handled inside steps, 
    // but we add an accessible error summary region.
    setSubmitError('Please fix the errors in the form before submitting.');
  };

  return (
    <Card padding="lg" hoverable className="max-w-2xl mx-auto mt-10">
      <Card.Header>
        <h1 className="text-3xl font-bold text-center">Registration</h1>
        <div className="flex justify-between mt-4">
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className={`flex-1 h-2 mx-1 rounded ${
                step <= currentStep ? 'bg-indigo-600' : 'bg-slate-700'
              }`}
            />
          ))}
        </div>
      </Card.Header>
      
      <Card.Body>
        {submitError && (
          <div
            role="alert"
            aria-live="polite"
            className="p-4 mb-4 bg-red-900/50 border border-red-500 rounded text-red-200"
          >
            {submitError}
          </div>
        )}

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit, onError)}>
            {currentStep === 1 && <Step1BasicInfo onNext={handleNext} />}
            {currentStep === 2 && <Step2Account onNext={handleNext} onPrev={handlePrev} />}
            {currentStep === 3 && <Step3Preferences onNext={handleNext} onPrev={handlePrev} />}
            {currentStep === 4 && <Step4Review onEditStep={handleEditStep} />}
          </form>
        </FormProvider>
      </Card.Body>
    </Card>
  );
}
