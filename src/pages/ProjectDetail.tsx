/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import Navbar from '../components/Navbar';
import { ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Project } from '../types';

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('dwg_projects');
    if (saved) {
      const projects: Project[] = JSON.parse(saved);
      const found = projects.find(p => p.id === id);
      if (found) setProject(found);
    }
  }, [id]);

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col pt-24 bg-white items-center justify-center">
        <Navbar />
        <p className="text-natural-muted font-bold uppercase tracking-widest">Project Not Found</p>
        <Link to="/" className="mt-8 text-[11px] underline uppercase tracking-widest text-natural-dark font-bold">Back to Portfolio</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col pt-24 bg-white">
      <Navbar />
      <main className="flex-grow flex flex-col">
        <div className="max-w-7xl w-full mx-auto px-8 md:px-16 py-12 md:py-20">
          <Link to="/" className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest text-natural-muted hover:text-natural-dark mb-16 transition-colors font-bold">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Portfolio
          </Link>

          <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-20 mb-24">
              <div>
                <p className="text-natural-accent text-[11px] uppercase tracking-[0.4em] mb-4 font-bold">Space Story</p>
                <h1 className="text-4xl md:text-5xl font-serif italic text-natural-dark mb-10">{project.title}</h1>
                <p className="text-sm md:text-base text-natural-details leading-relaxed font-medium">
                  {project.description}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-x-8 gap-y-10 text-[11px]">
                <div className="pb-4 border-b border-natural-border">
                  <p className="text-natural-muted uppercase tracking-widest font-bold mb-2">Location</p>
                  <p className="font-bold text-natural-dark uppercase">{project.location}</p>
                </div>
                <div className="pb-4 border-b border-natural-border">
                  <p className="text-natural-muted uppercase tracking-widest font-bold mb-2">Category</p>
                  <p className="font-bold text-natural-dark uppercase">{project.category}</p>
                </div>
                <div className="pb-4 border-b border-natural-border">
                  <p className="text-natural-muted uppercase tracking-widest font-bold mb-2">Area</p>
                  <p className="font-bold text-natural-dark uppercase">{project.area}</p>
                </div>
                <div className="pb-4 border-b border-natural-border">
                  <p className="text-natural-muted uppercase tracking-widest font-bold mb-2">Registration</p>
                  <p className="font-bold text-natural-dark uppercase">{project.period}</p>
                </div>
              </div>
            </div>

            <div className="space-y-16 pb-40">
              <div className="aspect-video bg-natural-bg overflow-hidden border border-natural-border">
                <img src={project.thumbnail} alt={project.title} className="w-full h-full object-cover shadow-xl" />
              </div>
              
              {project.images && project.images.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                  {project.images.map((img, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                      className={`${idx % 3 === 0 ? 'md:col-span-2 aspect-video' : 'aspect-[4/5]'} bg-natural-bg overflow-hidden border border-natural-border shadow-lg`}
                    >
                      <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000" />
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
