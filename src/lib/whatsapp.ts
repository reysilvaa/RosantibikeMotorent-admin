import {
  getWhatsAppStatus,
  getWhatsAppSessionStatus,
  getWhatsAppQrCode,
  resetWhatsAppConnection,
  logoutWhatsAppSession,
  startAllWhatsAppSessions,
  getAllWhatsAppSessions,
  getWhatsAppChats,
  getWhatsAppMessages,
  getWhatsAppContact,
  sendWhatsAppMessage,
  sendWhatsAppMessageToAdmin,
} from "./api";

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

export const getStatus = async (): Promise<WhatsAppStatus> => {
  return getWhatsAppStatus();
};

export const getSessionStatus = async () => {
  return getWhatsAppSessionStatus();
};

export const getQrCode = async () => {
  return getWhatsAppQrCode();
};

export const resetConnection = async () => {
  return resetWhatsAppConnection();
};

export const logoutSession = async () => {
  return logoutWhatsAppSession();
};

export const startAllSessions = async () => {
  return startAllWhatsAppSessions();
};

export const getAllSessions = async () => {
  return getAllWhatsAppSessions();
};

export const getChats = async () => {
  return getWhatsAppChats();
};

export const getMessages = async (phone: string) => {
  return getWhatsAppMessages(phone);
};

export const getContact = async (phone: string) => {
  return getWhatsAppContact(phone);
};

export const sendMessage = async (to: string, message: string) => {
  return sendWhatsAppMessage(to, message);
};

export const sendToAdmin = async (message: string) => {
  return sendWhatsAppMessageToAdmin(message);
}; 