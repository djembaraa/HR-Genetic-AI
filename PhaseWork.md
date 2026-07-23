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

## 🟡 Phase 3: AI Microservice - RAG Pipeline (Python)
**Fokus:** Membuat sistem yang bisa membaca dan memahami CV.
- [ ] Konfigurasi `google-generativeai` dan API Key.
- [ ] Membuat Endpoint FastAPI `/api/process-cv`.
- [ ] Menggunakan `PyPDFLoader` untuk mengekstrak teks dari PDF.
- [ ] Memecah teks dengan `RecursiveCharacterTextSplitter`.
- [ ] Menghasilkan *Embeddings* dan menyimpannya ke **ChromaDB**.

---

## 🟡 Phase 4: Agentic Workflow & Chat (Python -> Node)
**Fokus:** Membuat *chatbot* pintar untuk HRD.
- [ ] Membuat *Retriever Tool* di Langchain untuk mencari CV di ChromaDB.
- [ ] Membuat AI Agent dengan *System Prompt* khusus HRD.
- [ ] Membuat Endpoint `/api/chat` di FastAPI.
- [ ] Menghubungkan endpoint *chat* Express ke FastAPI.

---

## 🟡 Phase 5: Frontend UI/UX (React)
**Fokus:** Membangun antarmuka yang memukau dan konsisten.
- [ ] Setup CSS dasar sesuai *Gestalt Principles* (Warna Teal, Gradient, Glassmorphism).
- [ ] Membangun **Landing Page** (Formulir pendaftaran dan upload CV untuk kandidat).
- [ ] Membangun **HR Dashboard** (Daftar pelamar dan antarmuka Chatbot AI).
- [ ] Mengintegrasikan React dengan API Express (Fungsi Upload & Chat).

---

## 🟡 Phase 6: End-to-End Testing & Polish
**Fokus:** Memastikan semuanya berjalan mulus dari ujung ke ujung.
- [ ] Skenario Uji: Upload CV -> Proses AI -> Tanya AI tentang CV tersebut.
- [ ] Menambahkan *loading state* dan *error handling* (misal jika API Gemini sedang *down*).
- [ ] *Code refactoring* dan persiapan dokumentasi akhir untuk presentasi portofolio.
