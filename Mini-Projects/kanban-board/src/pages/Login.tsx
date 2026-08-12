import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input, FormField } from '@internal/ui-system';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useState } from 'react';

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const navigate = useNavigate();
  const login = useAuthStore(state => state.login);
  const [serverError, setServerError] = useState<string | null>(null);
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setServerError(null);
      await login(data.email, data.password);
      navigate('/board');
    } catch (err: any) {
      setServerError('Invalid email or password');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '4rem' }}>
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle className="text-center">Login</CardTitle>
        </CardHeader>
        <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <FormField label="Email" error={errors.email?.message}>
            <Input type="email" placeholder="Email" {...register('email')} />
          </FormField>
          <FormField label="Password" error={errors.password?.message}>
            <Input type="password" placeholder="Password" {...register('password')} />
          </FormField>
          {serverError && <p style={{ color: 'red', textAlign: 'center' }}>{serverError}</p>}
          <Button type="submit" disabled={isSubmitting} style={{ marginTop: '1rem' }}>
            {isSubmitting ? 'Logging in...' : 'Login'}
          </Button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1rem' }}>
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
        </CardContent>
      </Card>
    </div>
  );
}
