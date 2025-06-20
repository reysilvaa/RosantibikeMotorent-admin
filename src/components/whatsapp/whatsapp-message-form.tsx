'use client';

import React, { useState } from 'react';
import { Loader2, Send, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { getWhatsAppContact, sendWhatsAppMessage, sendWhatsAppMessageToAdmin } from '@/lib/api/whatsapp';
import { WhatsAppContact } from '@/lib/types/whatsapp';

interface WhatsAppMessageFormProps {
  connected: boolean;
}

export function WhatsAppMessageForm({ connected }: WhatsAppMessageFormProps) {
  const { toast } = useToast();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [sendingAdminMessage, setSendingAdminMessage] = useState(false);
  const [adminMessage, setAdminMessage] = useState('');
  const [selectedContact, setSelectedContact] = useState<WhatsAppContact | null>(null);
  const [loadingContact, setLoadingContact] = useState(false);

  const formatPhoneNumber = (phone: string) => {
    let cleaned = phone.replace(/\D/g, '');
    
    if (cleaned.startsWith('0')) {
      cleaned = '62' + cleaned.substring(1);
    } else if (!cleaned.startsWith('62')) {
      cleaned = '62' + cleaned;
    }
    
    if (!cleaned.includes('@c.us')) {
      cleaned = cleaned + '@c.us';
    }
    
    return cleaned;
  };

  const fetchContact = async (phone: string) => {
    if (!phone) return;
    
    try {
      setLoadingContact(true);
      const formattedPhone = formatPhoneNumber(phone);
      const response = await getWhatsAppContact(formattedPhone);
      setSelectedContact(response);
    } catch (error) {
      console.error('Error fetching contact:', error);
      toast({
        title: 'Error',
        description: 'Gagal mengambil informasi kontak',
        variant: 'destructive',
      });
      setSelectedContact(null);
    } finally {
      setLoadingContact(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || !message) {
      toast({
        title: 'Peringatan',
        description: 'Nomor telepon dan pesan harus diisi',
        variant: 'destructive',
      });
      return;
    }

    try {
      setSendingMessage(true);
      const formattedPhone = formatPhoneNumber(phoneNumber);
      
      toast({
        title: 'Mengirim pesan',
        description: 'Sedang mencoba mengirim pesan WhatsApp...',
      });
      
      await sendWhatsAppMessage(formattedPhone, message);
      
      toast({
        title: 'Berhasil',
        description: 'Pesan berhasil dikirim',
      });
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      
      let errorMessage = 'Gagal mengirim pesan WhatsApp';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      if (errorMessage.includes('500')) {
        errorMessage = 'Server mengalami masalah internal. Pastikan WhatsApp terhubung dan coba lagi.';
      } else if (errorMessage.includes('404')) {
        errorMessage = 'Endpoint pengiriman pesan tidak ditemukan. Pastikan server berjalan dengan benar.';
      } else if (errorMessage.includes('Invalid')) {
        errorMessage = 'Format nomor telepon tidak valid. Pastikan nomor telepon benar.';
      } else if (errorMessage.includes('timeout')) {
        errorMessage = 'Waktu habis saat mengirim pesan. Coba lagi nanti.';
      }
      
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setSendingMessage(false);
    }
  };

  const handleSendAdminMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminMessage) {
      toast({
        title: 'Peringatan',
        description: 'Pesan harus diisi',
        variant: 'destructive',
      });
      return;
    }

    try {
      setSendingAdminMessage(true);
      
      toast({
        title: 'Mengirim pesan',
        description: 'Sedang mencoba mengirim pesan ke admin...',
      });
      
      await sendWhatsAppMessageToAdmin(adminMessage);
      
      toast({
        title: 'Berhasil',
        description: 'Pesan berhasil dikirim ke admin',
      });
      setAdminMessage('');
    } catch (error) {
      console.error('Error sending message to admin:', error);
      
      let errorMessage = 'Gagal mengirim pesan ke admin';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      if (errorMessage.includes('500')) {
        errorMessage = 'Server mengalami masalah internal. Pastikan WhatsApp terhubung dan coba lagi.';
      } else if (errorMessage.includes('404')) {
        errorMessage = 'Endpoint pengiriman pesan tidak ditemukan. Pastikan server berjalan dengan benar.';
      } else if (errorMessage.includes('Invalid')) {
        errorMessage = 'Format pesan tidak valid. Periksa kembali pesan Anda.';
      } else if (errorMessage.includes('timeout')) {
        errorMessage = 'Waktu habis saat mengirim pesan. Coba lagi nanti.';
      }
      
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setSendingAdminMessage(false);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Kirim Pesan</CardTitle>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Kirim pesan WhatsApp ke nomor tertentu
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSendMessage} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phoneNumber" className="text-sm font-medium">
                Nomor Telepon
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="phoneNumber"
                  placeholder="Contoh: 628123456789"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  disabled={sendingMessage || !connected}
                  required
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  size="icon"
                  onClick={() => fetchContact(phoneNumber)}
                  disabled={!phoneNumber || loadingContact || !connected}
                >
                  {loadingContact ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <User className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {selectedContact && (
                <div className="mt-2 rounded-md bg-neutral-50 p-2 text-xs dark:bg-neutral-800">
                  <p><strong>Nama:</strong> {selectedContact.name || selectedContact.pushname || 'Tidak diketahui'}</p>
                  <p><strong>ID:</strong> {selectedContact.id}</p>
                  <p><strong>Tipe:</strong> {selectedContact.isGroup ? 'Grup' : 'Kontak'}</p>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="message" className="text-sm font-medium">
                Pesan
              </Label>
              <Textarea
                id="message"
                placeholder="Ketik pesan Anda di sini..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={sendingMessage || !connected}
                required
                className="min-h-[120px]"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={sendingMessage || !phoneNumber || !message || !connected}
            >
              {sendingMessage ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Mengirim...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Kirim Pesan
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Kirim Pesan ke Admin</CardTitle>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Kirim pesan WhatsApp ke semua admin terdaftar
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSendAdminMessage} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="adminMessage" className="text-sm font-medium">
                Pesan untuk Admin
              </Label>
              <Textarea
                id="adminMessage"
                placeholder="Ketik pesan untuk admin di sini..."
                value={adminMessage}
                onChange={(e) => setAdminMessage(e.target.value)}
                disabled={sendingAdminMessage || !connected}
                required
                className="min-h-[180px]"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={sendingAdminMessage || !adminMessage || !connected}
            >
              {sendingAdminMessage ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Mengirim...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Kirim ke Admin
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 