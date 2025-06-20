'use client';

import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { PageHeader } from '@/components/ui/page-header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { WhatsAppConnection } from '@/components/whatsapp/whatsapp-connection';
import { WhatsAppMessageForm } from '@/components/whatsapp/whatsapp-message-form';
import { WhatsAppChats } from '@/components/whatsapp/whatsapp-chats';
import { useWhatsAppStore } from '@/lib/store/whatsapp/whatsapp-store';

export default function WhatsappPage() {
  const { toast } = useToast();
  const { status, fetchStatus } = useWhatsAppStore();
  const [activeTab, setActiveTab] = useState('koneksi');

  useEffect(() => {
    fetchStatus();

    const interval = setInterval(() => {
      if (activeTab === 'koneksi') {
      fetchStatus();
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [fetchStatus, activeTab]);

  return (
    <DashboardLayout>
      <PageHeader
        title="WhatsApp"
        description="Kelola koneksi dan pengaturan WhatsApp"
        actionLabel={status.connected ? "Status: Terhubung" : "Status: Terputus"}
        actionIcon={status.connected ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />}
      />

      <Tabs 
        value={activeTab} 
        onValueChange={(value) => {
          if ((value === 'kirim-pesan' || value === 'chat') && !status.connected) {
            toast({
              title: "Tidak dapat mengakses",
              description: "Anda harus terhubung ke WhatsApp terlebih dahulu",
              variant: "destructive",
            });
            return;
          }
          setActiveTab(value);
        }} 
        className="mt-6"
      >
        <TabsList className="mb-4 grid w-full grid-cols-3">
          <TabsTrigger value="koneksi">
            Koneksi
          </TabsTrigger>
          <TabsTrigger value="kirim-pesan" className={!status.connected ? "opacity-50 cursor-not-allowed" : ""}>
            Kirim Pesan
          </TabsTrigger>
          <TabsTrigger value="chat" className={!status.connected ? "opacity-50 cursor-not-allowed" : ""}>
            Chat
          </TabsTrigger>
        </TabsList>

        <TabsContent value="koneksi">
          <WhatsAppConnection />
        </TabsContent>

        <TabsContent value="kirim-pesan">
          <WhatsAppMessageForm connected={status.connected} />
        </TabsContent>

        <TabsContent value="chat">
          <WhatsAppChats connected={status.connected} />
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
