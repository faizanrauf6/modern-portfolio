import { Mail, Linkedin, Github, MapPin } from 'lucide-react';
import portfolioData from '@/data/portfolio.json';

export default function Contact() {
  const { profile } = portfolioData;
  
  return (
    <section className="px-6 pt-10 pb-8 md:py-12 lg:px-24 border-t border-zinc-100">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          <div>
            <h2 className="text-xl min-[375px]:text-2xl sm:text-3xl xl:text-4xl font-medium tracking-tight mb-7 whitespace-nowrap">Let&apos;s build <span className="text-accent">together.</span></h2>
            <p className="text-sm md:text-base text-zinc-500 max-w-md mb-8">
              Let&apos;s discuss full-stack engineering, AI-powered automation,
              and cloud delivery for your next product.
            </p>
            
            <div className="space-y-6">
              <a href={`mailto:${profile.email}`} className="flex items-center gap-4 group">
                <div className="p-3 bg-zinc-50 rounded-full group-hover:bg-primary group-hover:text-bg transition-all">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] text-zinc-400 uppercase tracking-widest">Email</p>
                  <p className="text-base md:text-lg font-medium">{profile.email}</p>
                </div>
              </a>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-zinc-50 rounded-full">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] text-zinc-400 uppercase tracking-widest">Location</p>
                  <p className="text-base md:text-lg font-medium">{profile.location}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-end">
            <div className="grid grid-cols-2 gap-4">
              <a 
                href={profile.linkedin} 
                target="_blank"
                className="p-6 md:p-8 border border-zinc-100 rounded-2xl hover:border-primary transition-all group"
              >
                <Linkedin className="w-6 h-6 mb-4 text-zinc-400 group-hover:text-primary transition-colors" />
                <p className="font-medium text-sm md:text-base">LinkedIn</p>
                <p className="text-[10px] text-zinc-400">Professional Network</p>
              </a>
              <a 
                href={profile.github} 
                target="_blank"
                className="p-6 md:p-8 border border-zinc-100 rounded-2xl hover:border-primary transition-all group"
              >
                <Github className="w-6 h-6 mb-4 text-zinc-400 group-hover:text-primary transition-colors" />
                <p className="font-medium text-sm md:text-base">GitHub</p>
                <p className="text-[10px] text-zinc-400">Open Source</p>
              </a>
            </div>
          </div>
        </div>

        <footer className="mt-10 md:mt-12 pt-8 border-t border-zinc-100 flex justify-center items-center text-zinc-400 text-[10px] md:text-xs uppercase tracking-widest">
          <p className="text-center">© 2026 <span className="block sm:inline">{profile.name}</span></p>
        </footer>
      </div>
    </section>
  );
}
