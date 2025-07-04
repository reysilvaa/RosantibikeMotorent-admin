'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import * as z from 'zod';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/lib/store/auth/auth-store';

const loginFormSchema = z.object({
  username: z.string().min(1, { message: 'Username harus diisi' }),
  password: z.string().min(1, { message: 'Password harus diisi' }),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

export function LoginForm() {
  const router = useRouter();
  const { login, isLoading, error } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    await login(values.username, values.password, () => {
      router.push('/dashboard');
    });
  };

  const formVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <Form {...form}>
      <motion.form
        initial="hidden"
        animate="visible"
        variants={formVariants}
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-5"
      >
        {error && (
          <motion.div variants={itemVariants}>
            <Alert
              variant="destructive"
              className="bg-destructive/10 text-destructive border-destructive/20 py-2"
            >
              <AlertDescription className="text-sm">{error}</AlertDescription>
            </Alert>
          </motion.div>
        )}

        <motion.div variants={itemVariants}>
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="group relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="text-muted-foreground h-4 w-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                        />
                      </svg>
                    </div>
                    <Input
                      placeholder="Username"
                      {...field}
                      className="bg-background/50 border-input text-foreground placeholder:text-muted-foreground focus-visible:ring-ring group-hover:border-primary/50 pl-10 transition-all"
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-destructive mt-1.5 text-xs" />
              </FormItem>
            )}
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="group relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="text-muted-foreground h-4 w-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                        />
                      </svg>
                    </div>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Password"
                      {...field}
                      className="bg-background/50 border-input text-foreground placeholder:text-muted-foreground focus-visible:ring-ring group-hover:border-primary/50 pr-10 pl-10 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-muted-foreground hover:text-foreground absolute inset-y-0 right-0 flex items-center pr-3 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage className="text-destructive mt-1.5 text-xs" />
              </FormItem>
            )}
          />
        </motion.div>

        <motion.div variants={itemVariants} className="pt-2">
          <Button
            type="submit"
            className="group relative w-full overflow-hidden"
            disabled={isLoading}
          >
            <span className="from-primary/0 via-primary/30 to-primary/0 absolute inset-0 bg-gradient-to-r transition-transform duration-700 ease-in-out group-hover:translate-x-full"></span>
            {isLoading ? (
              <div className="flex items-center justify-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span>Masuk...</span>
              </div>
            ) : (
              <span>Masuk</span>
            )}
          </Button>
        </motion.div>
      </motion.form>
    </Form>
  );
}
