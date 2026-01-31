import { Project } from '@/types/project'
import Image from 'next/image'

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
      {/* Image Container */}
      <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
        {project.image && (
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        )}
        <div className="absolute top-4 left-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-600 text-white shadow-sm">
            {project.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <p className="text-xs text-green-700 font-bold mb-2 uppercase tracking-wider">{project.client}</p>
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-green-700 transition-colors">
          {project.title}
        </h3>
        {project.year && (
          <p className="text-sm text-gray-400 mb-4">{project.year}년 시공</p>
        )}
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span key={tag} className="text-[10px] bg-gray-50 text-gray-500 px-2 py-1 rounded border border-gray-100">
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
