import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import Cookies from 'js-cookie';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format angka ke format rupiah
export function formatRupiah(angka: number | null | undefined): string {
  if (angka === null || angka === undefined || isNaN(angka)) {
    return "Rp0";
  }
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(angka);
}

// Format input angka ke format rupiah (tanpa simbol mata uang)
export function formatRupiahInput(angka: number | null | undefined): string {
  if (angka === null || angka === undefined || isNaN(angka)) {
    return "0";
  }
  return new Intl.NumberFormat("id-ID", {
    style: "decimal",
    minimumFractionDigits: 0,
  }).format(angka);
}

// Format tanggal ke format Indonesia
export function formatTanggal(tanggal: string | Date): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(tanggal));
}

// Format tanggal dan waktu ke format Indonesia
export function formatTanggalWaktu(tanggal: string | Date): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
  }).format(new Date(tanggal));
}

// Cek apakah sudah login
export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  // Periksa token di cookies (prioritas utama)
  const cookieToken = Cookies.get('accessToken');
  if (cookieToken) return true;
  
  // Fallback: periksa token di localStorage (untuk backward compatibility)
  return !!localStorage.getItem("accessToken");
}

// Mendapatkan data admin dari localStorage
export function getAdminData(): { id: string; username: string; nama: string } | null {
  if (typeof window === "undefined") return null;
  const adminData = localStorage.getItem("adminData");
  return adminData ? JSON.parse(adminData) : null;
} 