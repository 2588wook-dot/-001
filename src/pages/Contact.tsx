/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import Navbar from '../components/Navbar';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Contact() {
  return (
    <div className="flex flex-col min-h-screen pt-24 md:pt-32">
      <Navbar />
      <main className="flex-grow flex flex-col">
        <section className="px-8 md:px-16 pb-20 md:pb-40 grid grid-cols-1 xl:grid-cols-2 gap-20 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <p className="text-natural-accent text-[11px] uppercase tracking-[0.4em] mb-4 font-bold">Get in Touch</p>
            <h1 className="text-4xl md:text-5xl font-serif italic text-natural-dark mb-10">Start a Project</h1>
            <p className="text-sm md:text-base text-natural-details mb-16 leading-relaxed max-w-md font-medium">
              Consultations for new projects or quotes are available via the contact info below.
              Please contact us in advance as we have many external schedules such as site visits.
            </p>

            <div className="space-y-12">
              <div className="flex items-start gap-6">
                <div className="w-10 h-10 border border-natural-border flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4 text-natural-accent" />
                </div>
                <div>
                  <p className="text-[10px] text-natural-muted uppercase tracking-widest font-bold mb-1">Telephone</p>
                  <p className="text-lg font-bold text-natural-dark tracking-tight">02-1234-5678</p>
                </div>
              </div>
              <div className="flex items-start gap-6">
                <div className="w-10 h-10 border border-natural-border flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 text-natural-accent" />
                </div>
                <div>
                  <p className="text-[10px] text-natural-muted uppercase tracking-widest font-bold mb-1">Email</p>
                  <p className="text-lg font-bold text-natural-dark tracking-tight">info@designwork.kr</p>
                </div>
              </div>
              <div className="flex items-start gap-6">
                <div className="w-10 h-10 border border-natural-border flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-natural-accent" />
                </div>
                <div>
                  <p className="text-[10px] text-natural-muted uppercase tracking-widest font-bold mb-1">Main Studio</p>
                  <p className="text-lg font-bold text-natural-dark tracking-tight">123 Teheran-ro, Gangnam-gu, Seoul</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             className="bg-white border border-natural-border p-10 md:p-14"
          >
            <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-2">
                <label className="block text-[10px] uppercase tracking-widest font-bold text-natural-muted">Full Name</label>
                <input type="text" className="w-full bg-transparent border-b border-natural-border py-2 text-sm outline-none focus:border-natural-accent transition-colors font-medium" placeholder="Please enter your name." />
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] uppercase tracking-widest font-bold text-natural-muted">Contact Info</label>
                <input type="text" className="w-full bg-transparent border-b border-natural-border py-2 text-sm outline-none focus:border-natural-accent transition-colors font-medium" placeholder="Please enter your contact information." />
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] uppercase tracking-widest font-bold text-natural-muted">Inquiry Details</label>
                <textarea rows={4} className="w-full bg-transparent border-b border-natural-border py-2 text-sm outline-none focus:border-natural-accent transition-colors font-medium resize-none" placeholder="Please enter the details of your inquiry."></textarea>
              </div>
              <button className="w-full bg-natural-dark text-white py-4 text-[11px] uppercase tracking-[0.3em] font-bold hover:bg-natural-accent transition-all mt-6 shadow-sm">
                Send Inquiry
              </button>
            </form>
          </motion.div>
        </section>
      </main>
    </div>
  );
}
