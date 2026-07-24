# Single Source of Truth (SOT) - Master Index

> **Version:** 2.0 (Dual-Sided Enterprise Platform)
> **Last Updated:** 2026-07-24
> **Copyright:** © 2026 Djembar Arafat. All Rights Reserved.

---

## 1. Pendahuluan
Dokumen ini adalah **Master Index** dari seluruh dokumentasi *Single Source of Truth* (SOT) untuk project **HR Genetic AI**. Proyek ini adalah platform SaaS B2B (untuk HRD/Rekruter) sekaligus Portal B2C (untuk Kandidat Pencari Kerja).

Semua pengembangan, perubahan arsitektur, dan penulisan kode **wajib** merujuk pada dokumen-dokumen di bawah ini agar sistem tetap konsisten dan berstandar industri.

## 2. Dokumen SOT Utama

### 📘 [WORKFLOW.md](./WORKFLOW.md)
Berisi arsitektur sistem secara keseluruhan (Topologi Node.js & Python), 6 alur data (*pipeline*) utama (mulai dari upload CV hingga RAG Chat), dan peta jalan (*roadmap*) eksekusi 4 fase. Dokumen ini juga memuat standarisasi operasi *Enterprise* (DLQ, Redis, CI/CD, Sentry).

### 📘 [DB-Relations.md](./DB-Relations.md)
Berisi skema database relasional (PostgreSQL) yang menggunakan Prisma ORM. Mencakup implementasi isolasi *Multi-Tenant* (`companyId`), tabel resume terstruktur (Pengalaman, Pendidikan, Skil), dan aturan integritas data (*Cascade rules*).

### 📘 [SECURITY.md](./SECURITY.md)
Berisi protokol keamanan ketat, termasuk manajemen JWT (*Access & Refresh Tokens*), *Role-Based Access Control* (ADMIN, HR_MANAGER, RECRUITER, CANDIDATE), validasi input menggunakan Zod, serta mitigasi celah keamanan standar OWASP.

### 📘 [UIUX.md](./UIUX.md)
Berisi sistem desain (warna, tipografi, spasi) yang diekstrak dari referensi visual berkualitas tinggi. Mencakup pedoman pemotongan layout (*responsive slicing*), standarisasi ikon (`lucide-react`), dan arsitektur CSS (BEM).

---

## 3. Aturan Emas Pengembangan (*Golden Rules*)
1. **Tidak Ada Emoji:** Antarmuka dilarang menggunakan karakter emoji. Selalu gunakan pustaka ikon `lucide-react`.
2. **Keamanan Ekstra:** Semua rute sensitif (`/api/admin`, `/api/hr`) wajib dilindungi oleh *middleware* JWT dan verifikasi peran.
3. **Isolasi Data (Multi-Tenant):** Data pelamar dan lowongan tidak boleh bocor antar perusahaan. Semua *query* wajib menyertakan filter `companyId`.
4. **Resiliensi AI:** Proses vektorisasi dan API LLM Gemini harus dibungkus dengan *error handling* dan mekanisme antrian (*Queue*) agar tidak memblokir respon *server* utama.

---
*© 2026 Djembar Arafat. All Rights Reserved.*
