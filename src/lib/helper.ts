export function formatRupiah(
  angka: number | string | null | undefined
): string {
  if (angka === null || angka === undefined) {
    return 'Rp0';
  }

  let nilaiAngka: number;
  if (typeof angka === 'string') {
    nilaiAngka = parseFloat(angka.replace(/[^0-9.-]+/g, ''));
    if (isNaN(nilaiAngka)) return 'Rp0';
  } else {
    nilaiAngka = angka;
    if (isNaN(nilaiAngka)) return 'Rp0';
  }

  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(nilaiAngka);
}

export function formatRupiahInput(angka: number | null | undefined): string {
  if (angka === null || angka === undefined || isNaN(angka)) {
    return '0';
  }
  return new Intl.NumberFormat('id-ID', {
    style: 'decimal',
    minimumFractionDigits: 0,
  }).format(angka);
}

export function formatTanggal(tanggal: string | Date): string {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(tanggal));
}

export function formatTanggalWaktu(tanggal: string | Date): string {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  }).format(new Date(tanggal));
}
