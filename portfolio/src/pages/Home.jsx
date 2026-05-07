import Hero from '../components/sections/Hero'
import FeaturedProjects from '../components/sections/FeaturedProjects'
import ExperienceSection from '../components/sections/ExperienceSection'
import ToolsSection from '../components/sections/ToolsSection'
import BlogSection from '../components/sections/BlogSection'
import ContactForm from '../components/ui/ContactForm'

export default function Home() {
  return (
    <div className="pt-12 sm:pt-0">
      <section id="home"><Hero /></section>
      <section id="projects"><FeaturedProjects /></section>
      <section id="experience"><ExperienceSection /></section>
      <section id="tools"><ToolsSection /></section>
      <section id="blog"><BlogSection /></section>
      <ContactForm />
    </div>
  )
}
