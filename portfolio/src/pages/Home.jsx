import Hero from '../components/sections/Hero'
import FeaturedProjects from '../components/sections/FeaturedProjects'
import ExperienceSection from '../components/sections/ExperienceSection'
import ToolsSection from '../components/sections/ToolsSection'
import BlogSection from '../components/sections/BlogSection'
import ContactForm from '../components/ui/ContactForm'

export default function Home() {
  return (
    <div className="pt-12 sm:pt-0">
      <Hero />
      <FeaturedProjects />
      <ExperienceSection />
      <ToolsSection />
      <BlogSection />
      <ContactForm />
    </div>
  )
}
