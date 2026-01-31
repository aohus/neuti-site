import { Project } from '@/types/project'
import projectsData from '@/data/projects.json'

export function getAllProjects(): Project[] {
  return projectsData as Project[]
}

export function getProjectCategories(): string[] {
  const projects = getAllProjects()
  const categories = new Set(projects.map((p) => p.category))
  return Array.from(categories)
}
