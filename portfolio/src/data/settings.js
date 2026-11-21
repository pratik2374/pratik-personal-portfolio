/**
 * Static fallback for the shared profile. The live values come from the
 * `siteSettings` document in Sanity (Insanity studio) and are merged over
 * these field by field, so this file only shows until that loads (or if it
 * is missing). See src/lib/profile.js.
 */
export const settings = {
  name: 'Pratik Gond',
  jobTitle: 'Software & AI Engineer',
  tagline: 'PROBLEM SOLVING\nRAG · LLM · GEN AI\nC++ · PYTHON',
  // TODO(Pratik): bio and bioSnippet are still template copy — rewrite in your own words (in the studio).
  bio: 'Passionate about creating intuitive and engaging user experiences. Specialize in transforming ideas into beautifully crafted products.',
  bioSnippet: 'A Software Engineer who has developed countless innovative solutions.',
  avatar: null,
  email: 'pratik.gond.dev@gmail.com',
  location: '',
  github: 'https://github.com/pratik2374',
  linkedin: 'https://linkedin.com/in/pratikgond',
  twitter: '',
  portfolioUrl: 'https://pratikgond.tech',
  blogUrl: 'https://blog.pratikgond.tech',
  socialLinks: [],
  // TODO(Pratik): confirm these numbers ("Projects Completed", "Worldwide Clients").
  stats: [
    { value: '+2', label: 'Years of\nExperience' },
    { value: '+46', label: 'Projects\nCompleted' },
    { value: '+10', label: 'Worldwide\nClients' },
  ],
  heroOrangeCard: 'Experience',
  heroLimeCard: 'Projects',
  // A "\n" marks where the white first line ends and the grey second line starts.
  headings: {
    projects: 'RECENT\nPROJECTS',
    allProjects: 'ALL\nPROJECTS',
    experience: '2 YEARS OF\nEXPERIENCE',
    workExperience: 'WORK\nEXPERIENCE',
    tools: 'TOOLS\nI USE',
    blog: 'FROM THE\nBLOG',
  },
}
