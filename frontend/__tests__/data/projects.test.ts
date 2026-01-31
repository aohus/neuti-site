import projects from '@/data/projects.json'
import { Project } from '@/types/project'

describe('Project Data', () => {
  it('should have valid project entries', () => {
    expect(projects.length).toBeGreaterThan(0)
    
    projects.forEach((project: any) => {
      expect(project).toHaveProperty('id')
      expect(typeof project.id).toBe('number')
      
      expect(project).toHaveProperty('title')
      expect(typeof project.title).toBe('string')
      expect(project.title.length).toBeGreaterThan(0)
      
      expect(project).toHaveProperty('category')
      expect(typeof project.category).toBe('string')
      
      if (project.year) {
        expect(typeof project.year).toBe('string')
      }
      
      if (project.tags) {
        expect(Array.isArray(project.tags)).toBe(true)
      }
    })
  })
})
