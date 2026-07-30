import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { FormField, Input, Button } from '@internal/ui-system';
import type { FullFormData } from '../schemas/formSchemas';

interface Step3Props {
  onNext: () => void;
  onPrev: () => void;
}

export function Step3Preferences({ onNext, onPrev }: Step3Props) {
  const {
    control,
    register,
    trigger,
    formState: { errors },
    setFocus,
  } = useFormContext<FullFormData>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'skills',
  });

  const handleNext = async () => {
    const isValid = await trigger('skills');
    if (isValid) {
      onNext();
    } else {
      // Find the first skill error and focus it
      if (errors.skills && Array.isArray(errors.skills)) {
        const firstErrorIndex = errors.skills.findIndex(err => err !== undefined);
        if (firstErrorIndex !== -1) {
          setFocus(`skills.${firstErrorIndex}.name` as const);
        }
      }
    }
  };

  return (
    <div className="step-container">
      <h2 className="text-2xl font-bold mb-4">Step 3: Preferences</h2>
      
      <div className="mb-4">
        <label className="block form-label mb-2">Skills & Interests</label>
        {fields.map((field, index) => (
          <div key={field.id} className="flex gap-2 mb-2 items-start">
            <div className="flex-grow">
              <FormField
                label="" // visually hidden but needed for wrapper if we wanted, or just omit since we use FormField
                error={errors.skills?.[index]?.name?.message}
              >
                <Input
                  {...register(`skills.${index}.name` as const)}
                  placeholder={`Skill ${index + 1}`}
                  aria-invalid={!!errors.skills?.[index]?.name}
                />
              </FormField>
            </div>
            <Button
              type="button"
              variant="danger"
              onClick={() => remove(index)}
              className="mt-1" // align with input ignoring error space
            >
              Remove
            </Button>
          </div>
        ))}
        {errors.skills && !Array.isArray(errors.skills) && (
          <p className="text-red-500 text-sm mb-2">{errors.skills.message}</p>
        )}
        <Button
          type="button"
          variant="secondary"
          onClick={() => append({ name: '' })}
          className="mt-2"
        >
          + Add Skill
        </Button>
      </div>

      <div className="flex justify-between mt-6">
        <Button onClick={onPrev} variant="outline">
          Back
        </Button>
        <Button onClick={handleNext} variant="primary">
          Review
        </Button>
      </div>
    </div>
  );
}
