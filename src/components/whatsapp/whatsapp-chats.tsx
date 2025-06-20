'use client';

import React, { useState, useEffect } from 'react';
import { Loader2, MessageSquare, RefreshCcw, User, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { LoadingIndicator } from '@/components/ui/loading-indicator';
import { Badge } from '@/components/ui/badge';
import { getWhatsAppChats } from '@/lib/api/whatsapp';
import { WhatsAppChat } from '@/lib/types/whatsapp';
import { useToast } from '@/components/ui/use-toast';

interface WhatsAppChatsProps {
  connected: boolean;
  className?: string;
}

export function WhatsAppChats({ connected, className = '' }: WhatsAppChatsProps) {
  const { toast } = useToast();
  const [chats, setChats] = useState<WhatsAppChat[]>([]);
  const [loadingChats, setLoadingChats] = useState(false);

  useEffect(() => {
    if (connected) {
      fetchChats();
    }
  }, [connected]);

  const fetchChats = async () => {
    if (!connected) {
      toast({
        title: 'Tidak dapat mengambil chat',
        description: 'WhatsApp tidak terhubung. Hubungkan terlebih dahulu.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setLoadingChats(true);
      const response = await getWhatsAppChats();
      if (Array.isArray(response)) {
        setChats(response);
      } else if (response && Array.isArray(response.data)) {
        setChats(response.data);
      } else {
        setChats([]);
      }
    } catch (error) {
      console.error('Error fetching chats:', error);
      toast({
        title: 'Error',
        description: 'Gagal mengambil daftar chat WhatsApp',
        variant: 'destructive',
      });
    } finally {
      setLoadingChats(false);
    }
  };

  const renderChats = () => {
    if (loadingChats) {
      return <LoadingIndicator message="Memuat daftar chat..." />;
    }

    if (chats.length === 0) {
      return (
        <EmptyState
          icon={MessageSquare}
          title="Tidak Ada Chat"
          description="Belum ada percakapan WhatsApp yang tersedia"
          actionLabel="Muat Ulang"
          actionHandler={fetchChats}
        />
      );
    }

    return (
      <div className="space-y-2">
        {chats.map((chat) => (
          <div 
            key={chat.id}
            className="flex items-center justify-between rounded-lg border p-3 hover:bg-neutral-50 dark:hover:bg-neutral-800"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30">
                {chat.isGroup ? (
                  <Users className="h-5 w-5" />
                ) : (
                  <User className="h-5 w-5" />
                )}
              </div>
              <div>
                <h4 className="font-medium">{chat.name || 'Tidak diketahui'}</h4>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  {chat.lastMessage ? (
                    <span className="line-clamp-1">{chat.lastMessage}</span>
                  ) : (
                    'Tidak ada pesan'
                  )}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              {chat.timestamp && (
                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                  {new Date(chat.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              )}
              {chat.unreadCount > 0 && (
                <Badge className="bg-blue-500">{chat.unreadCount}</Badge>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Daftar Chat</CardTitle>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Daftar percakapan WhatsApp terbaru
        </p>
      </CardHeader>
      <CardContent>
        {renderChats()}
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={fetchChats}
          disabled={loadingChats || !connected}
        >
          {loadingChats ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <RefreshCcw className="mr-2 h-4 w-4" />
          )}
          Muat Ulang Daftar Chat
        </Button>
      </CardFooter>
    </Card>
  );
} 