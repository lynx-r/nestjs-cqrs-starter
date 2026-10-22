export enum NodeEnv {
  Production = "production",
  Development = "development",
  Test = "test",
}

export type DatabaseConfig = {
  connectionUrl: string
  name: string
  username: string
  password: string
  port: string
  host: string
}

export interface ConfigProfile {
  name: string
  description: string | undefined
  active: boolean
  links: Link[]
  skills: Skill[]
  experience: Experience[]
  projects: Project[]
}

interface Link {
  href: string
  text: string
}

interface Skill {
  name: string
}

interface Experience {
  company: string
  position: string
  startWorkDate: Date | null
  endWorkDate: Date | null
  archives: string | null
}

interface Project {
  name: string
  links: Link[]
}
