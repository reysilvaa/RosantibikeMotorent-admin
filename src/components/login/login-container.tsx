'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { LoginForm } from './login-form';
import { LoginHeader } from './login-header';

export function Login() {
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    const videoElement = document.querySelector('video');
    if (videoElement) {
      videoElement.addEventListener('loadeddata', () => {
        setVideoLoaded(true);
      });
      videoElement.addEventListener('error', () => {
        setVideoLoaded(false);
      });
    }
  }, []);

  return (
    <div className="bg-background relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
      {}
      <video
        autoPlay
        muted
        loop
        className={`absolute inset-0 h-full w-full object-cover ${videoLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1000`}
      >
        <source src="/videos/aurora.mp4" type="video/mp4" />
      </video>

      {!videoLoaded && (
        <div className="from-background to-background/80 absolute inset-0 bg-gradient-to-br"></div>
      )}

      {}
      <div className="from-background/40 via-background/20 to-background/60 absolute inset-0 z-0 bg-gradient-to-b"></div>

      {}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="bg-primary/20 animate-pulse-slow absolute top-1/4 left-1/4 h-64 w-64 rounded-full mix-blend-multiply blur-3xl filter"></div>
        <div
          className="bg-secondary/20 animate-pulse-slow absolute top-1/3 right-1/4 h-72 w-72 rounded-full mix-blend-multiply blur-3xl filter"
          style={{ animationDelay: '1s' }}
        ></div>
        <div
          className="bg-primary/10 animate-pulse-slow absolute right-1/3 bottom-1/4 h-60 w-60 rounded-full mix-blend-multiply blur-3xl filter"
          style={{ animationDelay: '2s' }}
        ></div>
      </div>

      {}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="z-10 w-full max-w-md px-4"
      >
        <Card className="border-border/30 bg-card/70 relative overflow-hidden border shadow-xl backdrop-blur-lg">
          {}
          <div className="from-primary/50 via-primary to-secondary/50 absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r"></div>

          <div className="px-8 py-8">
            <LoginHeader />

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mt-8"
            >
              <LoginForm />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-muted-foreground/80 mt-8 text-center text-xs"
            >
              <div className="flex items-center justify-center space-x-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-3 w-3"
                >
                  <path d="M2 16.1A5 5 0 0 1 5.9 20M2 12.05A9 9 0 0 1 9.95 20M2 8V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6"></path>
                  <line x1="2" y1="20" x2="2" y2="20"></line>
                </svg>
                <span>&copy; {new Date().getFullYear()} Rosantibike Admin</span>
              </div>
            </motion.div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
