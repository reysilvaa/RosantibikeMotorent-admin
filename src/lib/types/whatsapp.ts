export interface WhatsAppStatus {
  connected: boolean;
  state: string;
  message: string;
}

export interface WhatsAppSession {
  id: string;
  name: string;
  phone: string;
  status: string;
  qrCode?: string;
}

export interface WhatsAppChat {
  id: string;
  name: string;
  timestamp: number;
  lastMessage?: string;
  unreadCount: number;
  isGroup: boolean;
}

export interface WhatsAppMessage {
  id: string;
  body: string;
  fromMe: boolean;
  timestamp: number;
  type: string;
}

export interface WhatsAppContact {
  id: string;
  name: string;
  pushname: string;
  isGroup: boolean;
  isBlocked: boolean;
}

export interface WhatsAppQrCodeResponse {
  status: string;
  message?: string;
  qrCode?: string;
  connected?: boolean;
  data?: string;
}

export interface WhatsAppState {
  status: WhatsAppStatus;
  qrCode: string;
  qrError: string;
  qrLoading: boolean;
  loading: boolean;
  refreshing: boolean;
  qrLastUpdated: Date | null;
}
