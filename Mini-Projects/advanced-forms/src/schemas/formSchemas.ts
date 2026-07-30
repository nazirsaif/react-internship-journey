import { z } from 'zod';

export const basicInfoSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
});

export const accountSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});

export const preferencesSchema = z.object({
  skills: z
    .array(
      z.object({
        name: z.string().min(1, 'Skill name cannot be empty'),
      })
    )
    .min(1, 'Please add at least one skill'),
});

export const fullSchema = basicInfoSchema
  .merge(accountSchema)
  .merge(preferencesSchema);

export type BasicInfoFormData = z.infer<typeof basicInfoSchema>;
export type AccountFormData = z.infer<typeof accountSchema>;
export type PreferencesFormData = z.infer<typeof preferencesSchema>;
export type FullFormData = z.infer<typeof fullSchema>;
