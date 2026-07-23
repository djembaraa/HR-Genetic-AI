# PhaseWork - Master Development Plan

Dokumen ini berfungsi sebagai peta jalan (*roadmap*) utama untuk menjaga konsistensi pengerjaan project **HR-Genetic-AI**. Pengerjaan harus dilakukan secara berurutan agar sistem terintegrasi dengan baik.

---

## 🟢 Phase 1: Setup & Scaffolding (Selesai)
- [x] Inisialisasi Repository Git.
- [x] Pembuatan dokumen standar arsitektur (`SOT.md`, `PoC.md`, `WORKFLOW.md`, `UIUX.md`, `DB-Relations.md`).
- [x] Setup struktur *Monorepo* (`frontend`, `backend-node`, `ai-service`).
- [x] Instalasi *dependency* dasar (Vite, Express, FastAPI, Langchain).

---

## 🟢 Phase 2: Relational Database & Gateway (Node.js) (Selesai)
**Fokus:** Membangun *backend* utama untuk manajemen data dasar.
- [x] Menyusun Skema Prisma (`Candidate` dan `Job`).
- [x] Migrasi Database SQLite.
- [x] Membuat Endpoint `/api/candidates/upload` menggunakan Multer untuk menerima file PDF.
- [x] Menulis logika penerusan ( *forwarding* ) file PDF dari Express ke FastAPI.

---

## 🟢 Phase 3: AI Microservice - RAG Pipeline (Python) (Selesai)
**Fokus:** Membuat sistem yang bisa membaca dan memahami CV.
- [x] Konfigurasi `google-generativeai` dan API Key.
- [x] Membuat Endpoint FastAPI `/api/process-cv`.
- [x] Menggunakan `PyPDFLoader` untuk mengekstrak teks dari PDF.
- [x] Memecah teks dengan `RecursiveCharacterTextSplitter`.
- [x] Menghasilkan *Embeddings* dan menyimpannya ke **ChromaDB**.

---

## 🟢 Phase 4: Agentic Workflow & Chat (Python -> Node) (Selesai)
**Fokus:** Membuat *chatbot* pintar untuk HRD.
- [x] Membuat *Retriever Tool* di Langchain untuk mencari CV di ChromaDB.
- [x] Membuat AI Agent dengan *System Prompt* khusus HRD.
- [x] Membuat Endpoint `/api/chat` di FastAPI.
- [x] Menghubungkan endpoint *chat* Express ke FastAPI.

---

## 🟢 Phase 5: Frontend UI/UX (React) (Selesai)
**Fokus:** Membangun antarmuka yang memukau dan konsisten.
- [x] Setup CSS dasar sesuai *Gestalt Principles* (Warna Teal, Gradient, Glassmorphism).
- [x] Membangun **Landing Page** (Formulir pendaftaran dan upload CV untuk kandidat).
- [x] Membangun **HR Dashboard** (Daftar pelamar dan antarmuka Chatbot AI).
- [x] Mengintegrasikan React dengan API Express (Fungsi Upload & Chat).

---

## 🟡 Phase 6: End-to-End Testing & Polish
**Fokus:** Memastikan semuanya berjalan mulus dari ujung ke ujung.
- [ ] Skenario Uji: Upload CV -> Proses AI -> Tanya AI tentang CV tersebut.
- [ ] Menambahkan *loading state* dan *error handling* (misal jika API Gemini sedang *down*).
- [ ] *Code refactoring* dan persiapan dokumentasi akhir untuk presentasi portofolio.
