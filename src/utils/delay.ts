/**
 * CUSTOM ASYNC FUNCTION: delay(ms)
 *
 * Menunda eksekusi selama `ms` milidetik secara asynchronous (non-blocking).
 *
 * Fungsi ini adalah contoh paling dasar pembuatan Promise secara manual:
 * - `new Promise(...)` membuat Object Promise baru.
 * - `resolve` adalah callback yang WAJIB dipanggil untuk mengubah status
 *   Promise menjadi "fulfilled" (berhasil) setelah waktu tunda selesai.
 * - Selama menunggu, status Promise adalah "pending" dan kode lain
 *   tetap bisa berjalan (tidak membekukan aplikasi).
 *
 * Contoh pemakaian: await delay(300); // berhenti 300ms, lalu lanjut
 */
export function delay(ms: number): Promise<void> {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}
