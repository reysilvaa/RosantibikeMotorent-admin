"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { LoginHeader } from "./login-header";
import { LoginForm } from "./login-form";
import { motion } from "framer-motion";

export function Login() {
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    // Mencoba memuat video dan menangani jika tidak ada
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
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-background">
      {/* Background Video */}
      <video 
        autoPlay 
        muted 
        loop 
        className={`absolute inset-0 w-full h-full object-cover ${videoLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1000`}
      >
        <source src="/videos/aurora.mp4" type="video/mp4" />
      </video>
      
      {!videoLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-background to-background/80"></div>
      )}
      
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/20 to-background/60 z-0"></div>
      
      {/* Animated particles/shapes */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse-slow"></div>
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-secondary/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/4 right-1/3 w-60 h-60 bg-primary/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      </div>
      
      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="z-10 w-full max-w-md px-4"
      >
        <Card className="overflow-hidden border border-border/30 bg-card/70 backdrop-blur-lg shadow-xl relative">
          {/* Card top highlight */}
          <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-primary/50 via-primary to-secondary/50"></div>
          
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
              className="mt-8 text-center text-xs text-muted-foreground/80"
            >
              <div className="flex items-center justify-center space-x-1">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
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