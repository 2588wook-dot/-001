/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Project } from '../types';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

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

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filter, setFilter] = useState<'all' | 'interior' | 'construction' | 'remodeling'>('all');

  useEffect(() => {
    const saved = localStorage.getItem('dwg_projects');
    if (saved) {
      setProjects(JSON.parse(saved));
    } else {
      setProjects(INITIAL_PROJECTS);
      localStorage.setItem('dwg_projects', JSON.stringify(INITIAL_PROJECTS));
    }
  }, []);

  const filteredProjects = projects.filter(p => filter === 'all' || p.category === filter);

  return (
    <div className="min-h-screen flex flex-col pt-20 md:pt-24">
      <Navbar />
      
      <main className="flex-grow flex flex-col">
        {/* Hero Section */}
        <section className="h-[450px] md:h-[600px] w-full p-8 md:p-16 flex items-end relative overflow-hidden bg-natural-dark">
          <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000')] bg-cover bg-center"></div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="relative z-10"
          >
            <p className="text-natural-accent text-[11px] uppercase tracking-[0.4em] mb-4 font-bold">Architecture & Interior</p>
            <h2 className="text-4xl md:text-6xl font-serif text-white leading-[1.1] mb-8">
              Simple, Clean,<br/>Timeless Spaces.
            </h2>
            <button 
              onClick={() => document.getElementById('projects-grid')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-10 py-3.5 bg-white text-natural-dark text-[11px] uppercase tracking-[0.2em] font-bold hover:bg-natural-accent hover:text-white transition-all"
            >
              View Portfolio
            </button>
          </motion.div>
        </section>

        {/* Projects Filter Header */}
        <section id="projects-grid" className="px-8 md:px-16 py-12 bg-white">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
            <h3 className="text-2xl font-serif italic text-natural-dark">Featured Projects</h3>
            <div className="flex gap-8 text-[11px] uppercase tracking-[0.2em] font-bold">
              <span 
                onClick={() => setFilter('all')}
                className={`pb-1 cursor-pointer transition-all ${filter === 'all' ? 'border-b-2 border-natural-dark' : 'text-natural-muted hover:text-natural-dark'}`}
              >
                All
              </span>
              <span 
                onClick={() => setFilter('interior')}
                className={`pb-1 cursor-pointer transition-all ${filter === 'interior' ? 'border-b-2 border-natural-dark' : 'text-natural-muted hover:text-natural-dark'}`}
              >
                Interior
              </span>
              <span 
                onClick={() => setFilter('construction')}
                className={`pb-1 cursor-pointer transition-all ${filter === 'construction' ? 'border-b-2 border-natural-dark' : 'text-natural-muted hover:text-natural-dark'}`}
              >
                Architecture
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group cursor-pointer"
              >
                <Link to={`/project/${project.id}`}>
                  <div className="aspect-[4/3] bg-natural-bg mb-6 overflow-hidden relative">
                    <div className="absolute inset-0 bg-natural-muted/20 group-hover:bg-transparent transition-colors z-10"></div>
                    <img
                      src={project.thumbnail}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-bold uppercase tracking-[0.1em] text-natural-dark">{project.title}</h4>
                      <p className="text-[11px] text-natural-details mt-2 italic font-medium">
                        {project.category.charAt(0).toUpperCase() + project.category.slice(1)} / {project.area}
                      </p>
                    </div>
                    <span className="text-[10px] bg-natural-bg px-2.5 py-1.5 border border-natural-border text-natural-details font-bold">
                      {project.period}
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
          {filteredProjects.length === 0 && (
            <div className="text-center py-20 text-natural-muted uppercase tracking-widest text-xs font-bold">
              No projects found in this category.
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="mt-auto bg-white border-t border-natural-border p-8 md:p-16 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <p className="text-[10px] text-natural-muted uppercase tracking-[0.2em] font-bold">
            © 2024 DESIGN WORK GROUP. All Rights Reserved.
          </p>
          <div className="flex gap-8 text-[10px] uppercase tracking-[0.2em] font-bold text-natural-muted">
            <span className="hover:text-natural-dark cursor-pointer transition-colors">Instagram</span>
            <span className="hover:text-natural-dark cursor-pointer transition-colors">KakaoTalk</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
