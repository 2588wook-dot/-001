/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import Navbar from '../components/Navbar';
import { Lock, Plus, LogOut, Trash2, Upload, X, Edit3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Project } from '../types';

const INITIAL_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Gyeongju Cafe "M"',
    category: 'remodeling',
    location: 'Gyeongju',
    area: '148㎡',
    period: '2024',
    description: 'A project that combines the beauty of traditional Hanok with modern convenience.',
    thumbnail: 'https://images.unsplash.com/photo-1590059510108-04f7f6f70a91?q=80&w=2000&auto=format&fit=crop',
    images: [],
    createdAt: new Date(),
    featured: true
  },
  {
    id: '2',
    title: 'Seongsu Residence',
    category: 'interior',
    location: 'Seongsu, Seoul',
    area: '92㎡',
    period: '2023',
    description: 'A sophisticated office space using white tones and exposed concrete.',
    thumbnail: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2000&auto=format&fit=crop',
    images: [],
    createdAt: new Date(),
    featured: true
  },
  {
    id: '3',
    title: 'Pyeongchang Villa',
    category: 'construction',
    location: 'Haeundae, Busan',
    area: '205㎡',
    period: '2023',
    description: 'A modern private house project that maximizes the ocean view.',
    thumbnail: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2000&auto=format&fit=crop',
    images: [],
    createdAt: new Date(),
    featured: true
  }
];

export default function Admin() {
  const [password, setPassword] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [error, setError] = useState('');
  
  // Data State
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('dwg_projects');
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });

  // Form State
  const [form, setForm] = useState<Partial<Project>>({
    title: '',
    category: 'interior',
    location: '',
    area: '',
    period: '',
    description: '',
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [galleryPreviewUrls, setGalleryPreviewUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      localStorage.setItem('dwg_projects', JSON.stringify(projects));
    } catch (e) {
      console.error('Storage full:', e);
      setError('저장 공간이 부족합니다. 사진 크기를 줄이거나 일부 프로젝트를 삭제해 주세요.');
    }
  }, [projects]);

  // Image compression helper
  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const maxDim = 1200;

          if (width > height) {
            if (width > maxDim) {
              height *= maxDim / width;
              width = maxDim;
            }
          } else {
            if (height > maxDim) {
              width *= maxDim / height;
              height = maxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.7));
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '7777') {
      setIsAuthorized(true);
      setError('');
    } else {
      setError('비밀번호가 올바르지 않습니다.');
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      setError('');
      try {
        const compressed = await compressImage(file);
        setPreviewUrl(compressed);
      } catch (err) {
        setError('이미지 처리 중 오류가 발생했습니다.');
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleGalleryFilesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    
    setIsUploading(true);
    setError('');
    try {
      const compressedImages = await Promise.all(
        files.map(file => compressImage(file))
      );
      setGalleryPreviewUrls(prev => [...prev, ...compressedImages]);
    } catch (err) {
      setError('이미지 처리 중 오류가 발생했습니다.');
    } finally {
      setIsUploading(false);
      if (galleryInputRef.current) galleryInputRef.current.value = '';
    }
  };

  const removeGalleryImage = (index: number) => {
    setGalleryPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const clearPreview = () => {
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const resetForm = () => {
    setForm({
      title: '',
      category: 'interior',
      location: '',
      area: '',
      period: '',
      description: '',
    });
    setEditingId(null);
    setPreviewUrl(null);
    setGalleryPreviewUrls([]);
    setError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (galleryInputRef.current) galleryInputRef.current.value = '';
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title) {
        setError('제목을 입력해 주세요.');
        return;
    }
    if (!previewUrl && !editingId) {
        setError('대표 이미지를 업로드해 주세요.');
        return;
    }

    if (editingId) {
      setProjects(prev => prev.map(p => 
        p.id === editingId 
          ? { ...p, ...form, thumbnail: previewUrl || p.thumbnail, images: galleryPreviewUrls } as Project
          : p
      ));
    } else {
      const newProject: Project = {
        id: Date.now().toString(),
        title: form.title!,
        category: form.category as any,
        location: form.location || '',
        area: form.area || '',
        period: form.period || '',
        description: form.description || '',
        thumbnail: previewUrl || '',
        images: galleryPreviewUrls,
        createdAt: new Date(),
        featured: true
      };
      setProjects(prev => [newProject, ...prev]);
    }
    resetForm();
  };

  const executeDelete = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    setDeleteConfirmId(null);
  };

  const handleEdit = (project: Project) => {
    setForm({
      title: project.title,
      category: project.category,
      location: project.location,
      area: project.area,
      period: project.period,
      description: project.description,
    });
    setEditingId(project.id);
    setPreviewUrl(project.thumbnail);
    setGalleryPreviewUrls(project.images || []);
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex flex-col pt-24">
        <Navbar />
        <div className="flex-grow flex items-center justify-center p-6 bg-natural-dark">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-sm bg-white p-12 shadow-2xl text-center"
          >
            <h5 className="text-sm uppercase tracking-widest font-bold mb-10 text-natural-dark font-sans">관리자 로그인</h5>
            <form onSubmit={handleLogin} className="space-y-8">
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border-b border-natural-dark py-3 text-center outline-none tracking-[0.5em] text-lg font-bold bg-transparent"
                  placeholder="••••"
                />
                {error && <p className="text-red-500 text-[10px] mt-2 font-bold uppercase tracking-widest">{error}</p>}
              </div>
              <div className="flex gap-4">
                 <Link to="/" className="flex-1 py-3.5 text-[11px] uppercase tracking-widest border border-natural-border hover:bg-natural-bg font-bold transition-colors">
                  취소
                 </Link>
                 <button className="flex-1 py-3.5 bg-natural-dark text-white text-[11px] uppercase tracking-widest font-bold hover:bg-natural-accent transition-colors">
                  입장
                 </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col pt-24 bg-white">
      <Navbar />
      <main className="flex-grow flex flex-col">
        <div className="max-w-7xl w-full mx-auto px-8 md:px-16 py-12 md:py-20">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-6">
            <div>
              <p className="text-natural-accent text-[11px] uppercase tracking-[0.3em] font-bold mb-2">Management System</p>
              <h1 className="text-3xl font-serif italic text-natural-dark">포트폴리오 관리판</h1>
            </div>
            <button 
              onClick={() => setIsAuthorized(false)} 
              className="flex items-center gap-2 bg-natural-bg border border-natural-border px-8 py-3 text-[10px] uppercase tracking-widest font-bold hover:bg-white transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" /> 로그아웃
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            <div className="lg:col-span-1">
              <div className="bg-natural-bg p-10 border border-natural-border sticky top-32 text-natural-dark">
                <h2 className="text-sm uppercase tracking-widest font-bold mb-8 flex items-center gap-2">
                   {editingId ? '프로젝트 수정' : '새 프로젝트 추가'}
                </h2>
                <form className="space-y-6" onSubmit={handleRegister}>
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-red-50 border border-red-100 text-red-600 text-[10px] font-bold uppercase tracking-wider text-center"
                    >
                      {error}
                    </motion.div>
                  )}
                  <div className="space-y-2">
                    <label className="block text-[9px] uppercase tracking-widest font-bold text-natural-muted">프로젝트 제목</label>
                    <input 
                      type="text" 
                      value={form.title}
                      onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full bg-transparent border-b border-natural-border py-2 text-sm outline-none focus:border-natural-accent font-medium text-natural-dark" 
                      placeholder="예: 경주 한옥 카페" 
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[9px] uppercase tracking-widest font-bold text-natural-muted">카테고리</label>
                    <select 
                      value={form.category}
                      onChange={e => setForm(prev => ({ ...prev, category: e.target.value as any }))}
                      className="w-full bg-transparent border-b border-natural-border py-2 text-sm outline-none focus:border-natural-accent font-medium text-natural-dark"
                    >
                      <option value="interior">인테리어</option>
                      <option value="construction">신축</option>
                      <option value="remodeling">리모델링</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[9px] uppercase tracking-widest font-bold text-natural-muted">위치</label>
                    <input 
                      type="text" 
                      value={form.location}
                      onChange={e => setForm(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full bg-transparent border-b border-natural-border py-2 text-sm outline-none focus:border-natural-accent font-medium text-natural-dark" 
                      placeholder="예: 서울 성수동" 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-[9px] uppercase tracking-widest font-bold text-natural-muted">면적</label>
                      <input 
                        type="text" 
                        value={form.area}
                        onChange={e => setForm(prev => ({ ...prev, area: e.target.value }))}
                        className="w-full bg-transparent border-b border-natural-border py-2 text-sm outline-none focus:border-natural-accent font-medium text-natural-dark" 
                        placeholder="예: 30평" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-[9px] uppercase tracking-widest font-bold text-natural-muted">작업년도</label>
                      <input 
                        type="text" 
                        value={form.period}
                        onChange={e => setForm(prev => ({ ...prev, period: e.target.value }))}
                        className="w-full bg-transparent border-b border-natural-border py-2 text-sm outline-none focus:border-natural-accent font-medium text-natural-dark" 
                        placeholder="예: 2024" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[9px] uppercase tracking-widest font-bold text-natural-muted">설명</label>
                    <textarea 
                      value={form.description}
                      onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full bg-transparent border-b border-natural-border py-2 text-sm outline-none focus:border-natural-accent font-medium text-natural-dark resize-none" 
                      placeholder="공간에 대한 설명을 적어주세요." 
                      rows={2}
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="block text-[9px] uppercase tracking-widest font-bold text-natural-muted">대표 이미지 (메인)</label>
                    
                    {!previewUrl ? (
                      <div 
                        onClick={() => !isUploading && fileInputRef.current?.click()}
                        className={`w-full aspect-[4/3] bg-white border border-dashed border-natural-border flex flex-col items-center justify-center transition-colors group ${isUploading ? 'opacity-50 cursor-wait' : 'cursor-pointer hover:border-natural-accent'}`}
                      >
                        <Upload className="w-6 h-6 text-natural-muted group-hover:text-natural-accent mb-3" />
                        <p className="text-[10px] uppercase tracking-widest font-bold text-natural-muted">{isUploading ? '처리 중...' : '이미지 업로드'}</p>
                        <input 
                          type="file" 
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          className="hidden" 
                          accept="image/*"
                        />
                      </div>
                    ) : (
                      <div className="relative aspect-[4/3] w-full border border-natural-border overflow-hidden group">
                        <img src={previewUrl} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-natural-dark/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button 
                            type="button"
                            onClick={clearPreview}
                            className="bg-white p-2 rounded-full text-natural-dark hover:bg-natural-accent hover:text-white transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4 pt-4 border-t border-natural-border/30">
                    <label className="block text-[9px] uppercase tracking-widest font-bold text-natural-muted">상세 갤러리 (다중 선택 가능)</label>
                    
                    <div className="grid grid-cols-3 gap-2">
                      {galleryPreviewUrls.map((url, index) => (
                        <div key={index} className="relative aspect-square border border-natural-border overflow-hidden group">
                          <img src={url} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-natural-dark/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button 
                              type="button"
                              onClick={() => removeGalleryImage(index)}
                              className="bg-white p-1 rounded-full text-natural-dark hover:bg-natural-accent hover:text-white transition-colors"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                      <div 
                        onClick={() => !isUploading && galleryInputRef.current?.click()}
                        className={`aspect-square bg-white border border-dashed border-natural-border flex flex-col items-center justify-center transition-colors group ${isUploading ? 'opacity-50 cursor-wait' : 'cursor-pointer hover:border-natural-accent'}`}
                      >
                        <Plus className="w-4 h-4 text-natural-muted group-hover:text-natural-accent" />
                        <input 
                          type="file" 
                          ref={galleryInputRef}
                          onChange={handleGalleryFilesChange}
                          className="hidden" 
                          accept="image/*"
                          multiple
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      type="submit" 
                      disabled={isUploading}
                      className="flex-grow bg-natural-dark text-white py-4 text-[11px] uppercase tracking-[0.2em] font-bold hover:bg-natural-accent transition-all shadow-md font-sans disabled:opacity-50 disabled:cursor-wait"
                    >
                      {isUploading ? '처리 중...' : (editingId ? '수정 완료' : '프로젝트 등록하기')}
                    </button>
                    {editingId && (
                      <button 
                        type="button" 
                        onClick={resetForm}
                        className="px-4 bg-white border border-natural-border text-natural-dark hover:bg-natural-bg transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-sm uppercase tracking-widest font-bold mb-8 text-natural-dark">등록된 프로젝트 목록 ({projects.length})</h2>
              <div className="space-y-4">
                {projects.map((project) => (
                  <div key={project.id} className="bg-white p-6 border border-natural-border flex items-center justify-between group hover:border-natural-accent transition-colors text-natural-dark">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-natural-bg overflow-hidden flex-shrink-0">
                        <img src={project.thumbnail} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold uppercase tracking-wide">{project.title}</h3>
                        <p className="text-[10px] text-natural-muted mt-1 uppercase font-bold tracking-tighter">
                          {project.category} / {project.location} / {project.area}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4 md:gap-6 items-center">
                      <button 
                        onClick={() => handleEdit(project)}
                        className="text-[10px] font-bold text-natural-muted hover:text-natural-dark uppercase tracking-widest transition-colors flex items-center gap-1"
                      >
                        <Edit3 className="w-3 h-3" /> 수정
                      </button>
                      
                      {deleteConfirmId === project.id ? (
                        <div className="flex items-center gap-3 bg-red-50 px-3 py-2 border border-red-100">
                          <span className="text-[9px] font-bold text-red-600 uppercase">정말 삭제하시겠습니까?</span>
                          <button 
                            onClick={() => executeDelete(project.id)}
                            className="text-[9px] font-black text-red-700 hover:underline uppercase"
                          >
                            확인
                          </button>
                          <button 
                            onClick={() => setDeleteConfirmId(null)}
                            className="text-[9px] font-bold text-natural-muted hover:text-natural-dark uppercase"
                          >
                            취소
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => setDeleteConfirmId(project.id)}
                          className="text-[10px] font-bold text-red-700/60 hover:text-red-700 uppercase tracking-widest flex items-center gap-1 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" /> 삭제
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
