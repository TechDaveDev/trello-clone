import { Github, Globe } from 'lucide-react';

export default function AboutContent() {
  const stack = ["Next.js", "TaildindCSS", "Tailwind CSS", "Supabase", "Lucide React", "Hello Pangea DnD", "React Hot Toast"];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm leading-relaxed text-foreground/80">
          Este proyecto es un clon simple de Trello, desarrollado para implementar distintas librerias a nivel funcional.
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-foreground font-bold text-xs uppercase tracking-widest">
          Tecnologías
        </div>
        <div className="flex flex-wrap gap-2">
          {stack.map((tech) => (
            <span
              key={tech}
              className="px-2.5 py-0.5 bg-foreground/5 text-foreground/70 text-[10px] font-medium rounded-full border border-foreground/10 hover:bg-foreground/10 transition-colors"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      <div className="pt-6 border-t border-border">
        <p className="text-[10px] font-black uppercase tracking-[0.15em] text-foreground/30 mb-4 text-center">
          Desarrollado por <span className='text-foreground'>David Aliaga</span>
        </p>
        <div className="flex justify-center gap-6">
          <a
            href='https://github.com/TechDaveDev'
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-1 text-foreground/50 hover:text-primary transition-all hover:scale-110"
            title='GitHub'
          >
            <Github size={20} />
          </a>
          <a
            href='https://davidaliaga.vercel.app/'
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-1 text-foreground/50 hover:text-primary transition-all hover:scale-110"
            title='Portfolio'
          >
            <Globe size={20} />
          </a>
        </div>
      </div>
    </div>
  );
}