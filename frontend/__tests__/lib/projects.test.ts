import { getAllProjects, getProjectCategories } from '@/lib/projects'

describe('Project Lib', () => {
  it('getAllProjects returns all projects', () => {
    const projects = getAllProjects()
    expect(projects.length).toBeGreaterThan(0)
    expect(projects[0]).toHaveProperty('title')
  })

  it('getProjectCategories returns unique categories', () => {
    const categories = getProjectCategories()
    expect(categories.length).toBeGreaterThan(0)
    // Check for duplicates
    const unique = new Set(categories)
    expect(unique.size).toBe(categories.length)
    expect(categories).toContain('조경식재')
  })
})
