import { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField, Input, Button, useDebounce } from '@internal/ui-system';
import type { FullFormData } from '../schemas/formSchemas';

interface Step2Props {
  onNext: () => void;
  onPrev: () => void;
}

// Mock async availability check
const checkUsernameAvailability = async (username: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // randomly return taken or available for demo, but always return true if username is 'admin' for testing
      if (username === 'admin') resolve(false);
      else resolve(Math.random() > 0.3); // 70% available
    }, 800);
  });
};

export function Step2Account({ onNext, onPrev }: Step2Props) {
  const {
    register,
    trigger,
    watch,
    formState: { errors },
    setFocus,
    setError,
    clearErrors,
  } = useFormContext<FullFormData>();

  const usernameValue = watch('username');
  const debouncedUsername = useDebounce(usernameValue, 500);
  
  const [isChecking, setIsChecking] = useState(false);
  const [availabilityMessage, setAvailabilityMessage] = useState('');

  useEffect(() => {
    if (debouncedUsername && debouncedUsername.length >= 3) {
      setIsChecking(true);
      setAvailabilityMessage('Checking...');
      
      checkUsernameAvailability(debouncedUsername).then((isAvailable) => {
        setIsChecking(false);
        if (isAvailable) {
          setAvailabilityMessage('Available!');
          clearErrors('username');
        } else {
          setAvailabilityMessage('Taken!');
          setError('username', {
            type: 'manual',
            message: 'Username is already taken.',
          });
        }
      });
    } else {
      setAvailabilityMessage('');
    }
  }, [debouncedUsername, clearErrors, setError]);

  const handleNext = async () => {
    const isValid = await trigger(['username', 'password']);
    // Ensure we don't proceed if it's taken
    if (isValid && availabilityMessage !== 'Taken!') {
      onNext();
    } else {
      const errorKeys = Object.keys(errors);
      if (errorKeys.includes('username') || availabilityMessage === 'Taken!') {
        setFocus('username');
      } else if (errorKeys.includes('password')) {
        setFocus('password');
      }
    }
  };

  return (
    <div className="step-container">
      <h2 className="text-2xl font-bold mb-4">Step 2: Account Setup</h2>
      <FormField 
        label="Username" 
        error={errors.username?.message}
        hint={
          isChecking ? 'Checking...' : 
          (availabilityMessage ? availabilityMessage : 'Choose a unique username')
        }
      >
        <Input
          {...register('username')}
          placeholder="e.g. johndoe123"
          aria-invalid={!!errors.username || availabilityMessage === 'Taken!'}
        />
      </FormField>
      <FormField label="Password" error={errors.password?.message}>
        <Input
          {...register('password')}
          type="password"
          placeholder="••••••••"
          aria-invalid={!!errors.password}
        />
      </FormField>
      <div className="flex justify-between mt-6">
        <Button onClick={onPrev} variant="outline">
          Back
        </Button>
        <Button onClick={handleNext} variant="primary" disabled={isChecking || availabilityMessage === 'Taken!'}>
          Next
        </Button>
      </div>
    </div>
  );
}
