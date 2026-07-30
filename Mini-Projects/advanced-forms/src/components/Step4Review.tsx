import { useFormContext } from 'react-hook-form';
import { Button } from '@internal/ui-system';
import type { FullFormData } from '../schemas/formSchemas';

interface Step4Props {
  onEditStep: (step: number) => void;
}

export function Step4Review({ onEditStep }: Step4Props) {
  const { getValues } = useFormContext<FullFormData>();
  const values = getValues();

  return (
    <div className="step-container">
      <h2 className="text-2xl font-bold mb-4">Step 4: Review & Submit</h2>
      
      <div className="review-section mb-6 p-4 border rounded bg-slate-800/50">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xl font-semibold">Basic Info</h3>
          <Button variant="ghost" size="sm" onClick={() => onEditStep(1)}>Edit</Button>
        </div>
        <p><span className="text-slate-400">Name:</span> {values.name}</p>
        <p><span className="text-slate-400">Email:</span> {values.email}</p>
      </div>

      <div className="review-section mb-6 p-4 border rounded bg-slate-800/50">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xl font-semibold">Account</h3>
          <Button variant="ghost" size="sm" onClick={() => onEditStep(2)}>Edit</Button>
        </div>
        <p><span className="text-slate-400">Username:</span> {values.username}</p>
        <p><span className="text-slate-400">Password:</span> ••••••••</p>
      </div>

      <div className="review-section mb-6 p-4 border rounded bg-slate-800/50">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xl font-semibold">Preferences</h3>
          <Button variant="ghost" size="sm" onClick={() => onEditStep(3)}>Edit</Button>
        </div>
        <ul className="list-disc list-inside">
          {values.skills?.map((skill, i) => (
            <li key={i}>{skill.name}</li>
          ))}
        </ul>
      </div>

      <div className="flex justify-between mt-6">
        <Button onClick={() => onEditStep(3)} variant="outline">
          Back
        </Button>
        <Button type="submit" variant="primary">
          Submit Form
        </Button>
      </div>
    </div>
  );
}
