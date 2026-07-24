# Proof of Concept (PoC) - HR Genetic AI v2.0

> **Version:** 2.0 (Dual-Sided Enterprise Platform)
> **Last Updated:** 2026-07-24
> **Copyright:** © 2026 Djembar Arafat. All Rights Reserved.

---

## 1. Tujuan Utama (Objective)
Membuktikan bahwa arsitektur sistem skala *Enterprise* dengan PostgreSQL (Prisma) mampu menangani dua sisi pengguna sekaligus secara terisolasi (B2B HRD dan B2C Kandidat), serta menunjukkan kemampuan AI Gemini dalam membaca, mengoptimalkan, dan mencari kandidat tanpa *hallucinations*.

## 2. Ruang Lingkup PoC (Core Features for PoC)

### A. Sisi B2B (HRD & Rekruter)
1. **Keamanan & Multi-Tenancy:** HRD hanya bisa melihat data milik perusahaannya sendiri (`companyId`).
2. **AI RAG Assistant (Chatbot):** HRD dapat bertanya kepada chatbot (misal: *"Siapa kandidat yang jago React?"*), dan AI akan merespon dengan data kandidat yang relevan dari Vector Database (ChromaDB), lengkap dengan memori percakapan.

### B. Sisi B2C (Pencari Kerja)
1. **Structured Resume Builder:** Kandidat dapat membuat profil terstruktur (Pengalaman, Pendidikan, Skil) yang disimpan di PostgreSQL.
2. **AI ATS Enhancement:** Kandidat dapat meminta AI untuk menyempurnakan teks pengalaman kerjanya menjadi lebih formal dan berstandar ATS (fitur *Human-in-the-Loop*).
3. **Database-to-Vector Pipeline:** Saat kandidat mempublikasikan profilnya, sistem dapat menarik teks dari database (bukan parsing PDF) untuk dikirim ke ChromaDB secara *asynchronous*.

## 3. Kriteria Keberhasilan (Success Criteria)
- **Data Integrity:** PostgreSQL berhasil memisahkan data antar perusahaan dengan sempurna (tidak ada kebocoran data pelamar).
- **Security:** Login dan registrasi dilindungi oleh JWT (Access & Refresh token), dan pembuatan akun tidak bisa ditembus *role* ADMIN lewat manipulasi HTTP Request.
- **AI Accuracy:** Chatbot AI hanya menjawab berdasarkan data di dalam database vektor, dan *ATS Enhancement* mengembalikan format *bullet points* yang bersih.
- **Latency & Reliability:** Upload dan Vektorisasi tidak menyebabkan aplikasi utama *freeze* (Non-blocking I/O).

## 4. Risiko & Mitigasi
- **Limit Token Gemini API:** Karena versi gratis memiliki limitasi, antrian proses (Redis/BullMQ) akan diterapkan dengan strategi *retry* dan *exponential backoff*.
- **Overhead Skema Relasional:** Untuk mempercepat query di PostgreSQL, indeksasi (`@@index`) diterapkan pada kolom yang sering dicari seperti `companyId` dan `status`.

---
*© 2026 Djembar Arafat. All Rights Reserved.*
