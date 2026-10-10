"use client";

import { useState } from "react";

export default function AdminArticlesCMS() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("draft");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulasi integrasi upload ke Supabase Storage (bucket: portfolio-images) dan insert ke tabel articles
    try {
      console.log("Mengunggah file ke bucket: portfolio-images...", imageFile);
      // Di sini fungsi Server Action akan dipanggil oleh backend
      alert("Artikel/Portofolio berhasil disimpan!");
      setTitle("");
      setSlug("");
      setContent("");
      setImageFile(null);
    } catch (error) {
      console.error("Gagal mempublikasikan artikel:", error);
      alert("Terjadi kesalahan saat menyimpan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 p-4 pb-20">
      <div className="mb-6 mt-4">
        <h1 className="text-2xl font-bold text-primary">CMS Artikel & Portofolio</h1>
        <p className="text-sm text-base-content/70">Publikasikan dokumentasi pengiriman dan berita SEO langsung dari HP.</p>
      </div>

      <form onSubmit={handlePublish} className="bg-base-100 p-4 rounded-xl shadow-sm border border-base-300 space-y-4">
        <div className="form-control">
          <label className="label font-semibold text-xs">Judul Artikel / Portofolio</label>
          <input 
            type="text" 
            placeholder="Mis: Pengiriman Fuso Sukses ke Surabaya" 
            className="input input-bordered w-full"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-control">
          <label className="label font-semibold text-xs">Slug Unik (URL)</label>
          <input 
            type="text" 
            placeholder="pengiriman-fuso-surabaya" 
            className="input input-bordered w-full font-mono text-sm"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
          />
        </div>

        <div className="form-control">
          <label className="label font-semibold text-xs">Upload Dokumentasi Lapangan (Bucket: portfolio-images)</label>
          <input 
            type="file" 
            accept="image/*"
            className="file-input file-input-bordered w-full"
            onChange={(e) => e.target.files && setImageFile(e.target.files[0])}
          />
        </div>

        <div className="form-control">
          <label className="label font-semibold text-xs">Status Publikasi</label>
          <select 
            className="select select-bordered w-full"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="draft">Draft (Simpan Saja)</option>
            <option value="published">Published (Tayang Publik)</option>
          </select>
        </div>

        <div className="form-control">
          <label className="label font-semibold text-xs">Konten Artikel</label>
          <textarea 
            className="textarea textarea-bordered h-32" 
            placeholder="Tulis detail rute, armada, dan testimoni klien di sini..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          ></textarea>
        </div>

        <button 
          type="submit" 
          className="btn btn-primary w-full mt-2"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Menyimpan..." : "Simpan & Publikasikan"}
        </button>
      </form>
    </div>
  );
}
