// Format angka ke format rupiah
export function formatRupiah(angka: number | string | null | undefined): string {
    if (angka === null || angka === undefined) {
      return "Rp0";
    }
    
    // Konversi string ke number jika input adalah string
    let nilaiAngka: number;
    if (typeof angka === 'string') {
      nilaiAngka = parseFloat(angka.replace(/[^0-9.-]+/g, ""));
      if (isNaN(nilaiAngka)) return "Rp0";
    } else {
      nilaiAngka = angka;
      if (isNaN(nilaiAngka)) return "Rp0";
    }
    
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(nilaiAngka);
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
  
  