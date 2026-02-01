import { Project } from '@/types/project'
import Image from 'next/image'
import Link from 'next/link'

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Link href={`/performance/${project.id}`} className="group bg-white rounded-[2rem] shadow-sm border border-black/5 overflow-hidden hover:shadow-2xl transition-all duration-500">
      {/* Image Container */}
      <div className="relative aspect-[4/3] bg-surface overflow-hidden">
        {project.image && (
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
          />
        )}
        <div className="absolute top-5 left-5">
          <span className="inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest bg-deep text-white shadow-lg shadow-deep/20">
            {project.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        <p className="text-[11px] font-black text-primary mb-3 uppercase tracking-[0.2em]">{project.client}</p>
        <h3 className="text-xl font-black text-deep mb-4 line-clamp-2 group-hover:text-primary transition-colors leading-snug">
          {project.title}
        </h3>
        <div className="flex items-center justify-between mt-auto">
          {project.year && (
            <p className="text-[12px] font-bold text-gray-300 uppercase tracking-tighter">{project.year} YEAR</p>
          )}
          <div className="flex flex-wrap gap-2">
            {project.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="text-[10px] font-bold text-gray-400">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  )
}
