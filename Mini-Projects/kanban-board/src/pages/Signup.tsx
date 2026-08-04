import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input, FormField, Button, Card } from '@internal/ui-system';
import { Link, useNavigate } from 'react-router-dom';

const signupSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string().min(1, { message: "Confirm password is required" })
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function Signup() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormValues) => {
    // API call will be handled in step 4-5
    console.log("Signup data:", data);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '4rem' }}>
      <Card style={{ width: '400px', padding: '2rem' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Sign Up</h2>
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <FormField label="Email" error={errors.email?.message}>
            <Input type="email" placeholder="Email" {...register('email')} />
          </FormField>
          <FormField label="Password" error={errors.password?.message}>
            <Input type="password" placeholder="Password" {...register('password')} />
          </FormField>
          <FormField label="Confirm Password" error={errors.confirmPassword?.message}>
            <Input type="password" placeholder="Confirm Password" {...register('confirmPassword')} />
          </FormField>
          <Button type="submit" style={{ marginTop: '1rem' }}>Sign Up</Button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1rem' }}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </Card>
    </div>
  );
}
