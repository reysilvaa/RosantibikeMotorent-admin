'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';

export function LoginHeader() {
  return (
    <div className="space-y-4 text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          type: 'spring',
          stiffness: 260,
          damping: 20,
          duration: 0.6,
        }}
        className="flex justify-center"
      >
        <div className="relative w-120">
          <div className="flex justify-center">
            <Image src="/logo2.svg" alt="Logo" width={200} height={400} />
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      ></motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="text-muted-foreground flex items-center justify-center gap-1.5 text-xs"
      >
        <ShieldCheck className="h-3 w-3" />
        <span>Admin access only</span>
      </motion.div>
    </div>
  );
}
