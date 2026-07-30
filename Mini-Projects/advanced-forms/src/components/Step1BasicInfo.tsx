import { useFormContext } from 'react-hook-form';
import { FormField, Input, Button } from '@internal/ui-system';
import type { FullFormData } from '../schemas/formSchemas';

interface Step1Props {
  onNext: () => void;
}

export function Step1BasicInfo({ onNext }: Step1Props) {
  const {
    register,
    trigger,
    formState: { errors },
    setFocus,
  } = useFormContext<FullFormData>();

  const handleNext = async () => {
    const isValid = await trigger(['name', 'email']);
    if (isValid) {
      onNext();
    } else {
      // Accessible error focus
      const errorKeys = Object.keys(errors);
      if (errorKeys.includes('name')) {
        setFocus('name');
      } else if (errorKeys.includes('email')) {
        setFocus('email');
      }
    }
  };

  return (
    <div className="step-container">
      <h2 className="text-2xl font-bold mb-4">Step 1: Basic Info</h2>
      <FormField label="Name" error={errors.name?.message}>
        <Input
          {...register('name')}
          placeholder="John Doe"
          aria-invalid={!!errors.name}
        />
      </FormField>
      <FormField label="Email" error={errors.email?.message}>
        <Input
          {...register('email')}
          type="email"
          placeholder="john@example.com"
          aria-invalid={!!errors.email}
        />
      </FormField>
      <div className="flex justify-end mt-6">
        <Button onClick={handleNext} variant="primary">
          Next
        </Button>
      </div>
    </div>
  );
}
