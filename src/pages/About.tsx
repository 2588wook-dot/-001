/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import Navbar from '../components/Navbar';

export default function About() {
  return (
    <div className="flex flex-col min-h-screen pt-24 md:pt-32">
      <Navbar />
      <main className="flex-grow flex flex-col">
        <section className="px-8 md:px-24 pb-20 md:pb-40 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-natural-accent text-[11px] uppercase tracking-[0.4em] mb-4 font-bold">Background</p>
            <h1 className="text-4xl md:text-5xl font-serif mb-16 italic text-natural-dark">Architectural Integrity</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
              <div className="space-y-8 text-sm md:text-base text-natural-details leading-relaxed font-medium">
                <p>
                  Design Work Group is a professional group that researches the essence of space and implements it as actual construction results.
                  We enhance the value of the space users stay in through organized details and solid finishes rather than flashy decorations.
                </p>
                <p>
                  From interior design to small-scale new construction, we deliver the best results based on field-oriented thinking and a systematic design process, regardless of the scale of the project.
                </p>
              </div>
              
              <div className="pt-0 md:pt-4">
                <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-natural-dark mb-6">Core Philosophy</h3>
                <ul className="space-y-6">
                   <li className="flex gap-4 items-start">
                      <span className="text-natural-accent font-serif italic text-lg">01</span>
                      <p className="text-sm text-natural-details leading-snug">Building trust through clear communication</p>
                   </li>
                   <li className="flex gap-4 items-start">
                      <span className="text-natural-accent font-serif italic text-lg">02</span>
                      <p className="text-sm text-natural-details leading-snug">Flexible solutions optimized for field conditions</p>
                   </li>
                   <li className="flex gap-4 items-start">
                      <span className="text-natural-accent font-serif italic text-lg">03</span>
                      <p className="text-sm text-natural-details leading-snug">Simple beauty that remains timeless</p>
                   </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </section>
      </main>
    </div>
  );
}
