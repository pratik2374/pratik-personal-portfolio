import { useSettingsContext } from '../../context/SettingsContext'
import { motion } from 'framer-motion'
import portfolioImage from './portfolio_image.png'

export default function ProfileSidebar() {
  const settings = useSettingsContext()

  return (
    <div className="bg-white rounded-[32px] p-9 flex flex-col items-center text-center shadow-[0_4px_20px_rgb(0,0,0,0.06)] relative overflow-hidden isolate border border-black/5">
      
      {/* SVG Background Layer (Behind Content) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Top Left Dashed Arc */}
        <svg className="absolute top-[-30px] left-[-30px] w-44 h-44 text-accent-orange" viewBox="0 0 100 100" fill="none">
          <motion.path 
            d="M 10 100 A 90 90 0 0 0 100 10" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            strokeDasharray="4 4"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
        </svg>

        {/* Bottom Left Dashed Curve */}
        <svg className="absolute top-[50%] left-[-20px] w-44 h-28 text-accent-orange" viewBox="0 0 100 100" fill="none" preserveAspectRatio="none">
          <motion.path 
            d="M 0 100 Q 50 100 90 20" 
            stroke="currentColor" 
            strokeWidth="2" 
            // strokeDasharray="5 5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut", delay: 0.5 }}
          />
        </svg>
      </div>

      {/* Profile Image Container */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full h-72 mb-5 rounded-[24px] overflow-hidden bg-accent-orange"
      >
        <img
          src={portfolioImage}
          alt="Pratik Gond"
          className="w-full h-full object-cover mix-blend-multiply grayscale contrast-125"
        />
      </motion.div>

      {/* Name */}
      <motion.h1 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="font-poppins font-bold text-[28px] leading-[1.1] tracking-tight text-black mb-2 relative z-10"
      >
        Pratik Gond
      </motion.h1>

      {/* Small orange flame/icon badge */}
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, delay: 1 }}
        className="w-7 h-7 rounded-full bg-accent-orange flex items-center justify-center text-white shadow-lg z-10 mb-4 relative"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.5 13.5c0 3.03-2.47 5.5-5.5 5.5s-5.5-2.47-5.5-5.5c0-2.12 1.19-4.07 3.07-5.02.26-.13.57-.15.84-.04.28.11.49.33.58.62.43 1.34 1.7 2.22 3.14 2.22.42 0 .83-.08 1.22-.24.28-.11.58-.08.84.06.26.14.45.37.52.66.19.89.29 1.83.29 2.74zm-2.02-8.52c-1.39-2.06-3.77-3.32-6.35-3.32-.4 0-.75.25-.9.62-.14.38-.05.81.24 1.09 1.14 1.14 1.77 2.72 1.77 4.39 0 1.25-.38 2.44-1.07 3.44-1.08 1.55-2.73 2.58-4.57 2.85-.38.05-.71.29-.86.64-.15.35-.06.76.22 1.03 1.63 1.57 3.82 2.44 6.13 2.44 5.24 0 9.5-4.26 9.5-9.5 0-1.89-.55-3.69-1.55-5.21-.21-.32-.59-.5-.97-.47-.37.03-.7.25-.87.59l-.72 1.41z"/>
        </svg>
      </motion.div>

      {/* Bio Snippet */}
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="font-poppins font-medium text-[#666666] text-[14px] leading-[1.6] mb-6 px-4 relative z-10"
      >
        {settings?.bioSnippet || 'A Software Engineer who has developed countless innovative solutions.'}
      </motion.p>

      {/* Social Icons */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex items-center gap-5 text-accent-orange relative z-10 mb-2"
      >
        {settings?.github && (
          <a href={settings.github} target="_blank" rel="noreferrer" className="hover:scale-110 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
            </svg>
          </a>
        )}
        {settings?.twitter && (
          <a href={settings.twitter} target="_blank" rel="noreferrer" className="hover:scale-110 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
            </svg>
          </a>
        )}
        {settings?.linkedin && (
          <a href={settings.linkedin} target="_blank" rel="noreferrer" className="hover:scale-110 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
              <rect x="2" y="9" width="4" height="12"></rect>
              <circle cx="4" cy="4" r="2"></circle>
            </svg>
          </a>
        )}
        {settings?.email && (
          <a href={`mailto:${settings.email}`} className="hover:scale-110 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
          </a>
        )}
        {settings?.socialLinks?.map((link, i) => link.url && (
          <a key={i} href={link.url} target="_blank" rel="noreferrer" title={link.label} className="hover:scale-110 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="2" y1="12" x2="22" y2="12"></line>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
            </svg>
          </a>
        ))}
      </motion.div>
    </div>
  )
}
