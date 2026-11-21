import Link from "next/link"
import { getProfile } from "@/lib/profile"
import { SanityImage } from "./SanityImage"

/** "Written by" card at the end of each post, driven by the shared studio profile. */
export async function AuthorBox() {
  const profile = await getProfile()
  const initial = profile.name.trim().charAt(0).toUpperCase() || "P"

  return (
    <aside
      aria-label="About the author"
      className="mt-16 p-6 sm:p-8 rounded-3xl border border-gray-200 dark:border-gray-800 bg-gray-50/70 dark:bg-[#141414] flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6"
    >
      {profile.avatar ? (
        <div className="relative w-14 h-14 rounded-2xl overflow-hidden shrink-0 bg-gray-200 dark:bg-gray-800">
          <SanityImage image={profile.avatar} alt={profile.avatar.alt || profile.name} fill aspectRatio={1} sizes="56px" className="object-cover" />
        </div>
      ) : (
        <div className="w-14 h-14 rounded-2xl bg-orange-500 flex items-center justify-center text-white text-xl font-medium shrink-0" aria-hidden="true">
          {initial}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-4 mb-1 flex-wrap">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Written by {profile.name}</h2>
          <a href={profile.url} target="_blank" rel="noreferrer" className="text-xs font-medium text-orange-500 hover:underline active:scale-95 duration-150 inline-flex items-center justify-center min-h-[44px] min-w-[44px] -my-2">
            Portfolio ↗
          </a>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-3">{profile.bio}</p>
        <div className="flex items-center gap-4 text-xs font-medium text-gray-500 dark:text-gray-400 flex-wrap">
          <a href={profile.github} target="_blank" rel="noreferrer me" className="hover:text-black dark:hover:text-white active:scale-95 duration-150 inline-flex items-center justify-center min-h-[44px] min-w-[44px] -my-2">
            GitHub
          </a>
          <span aria-hidden="true">·</span>
          <a href={profile.linkedin} target="_blank" rel="noreferrer me" className="hover:text-blue-500 active:scale-95 duration-150 inline-flex items-center justify-center min-h-[44px] min-w-[44px] -my-2">
            LinkedIn
          </a>
          {profile.twitter && (
            <>
              <span aria-hidden="true">·</span>
              <a href={profile.twitter} target="_blank" rel="noreferrer me" className="hover:text-black dark:hover:text-white active:scale-95 duration-150 inline-flex items-center justify-center min-h-[44px] min-w-[44px] -my-2">
                X / Twitter
              </a>
            </>
          )}
          <span aria-hidden="true">·</span>
          <Link href="/contact" className="hover:text-orange-500 active:scale-95 duration-150 inline-flex items-center justify-center min-h-[44px] min-w-[44px] -my-2">
            Contact
          </Link>
        </div>
      </div>
    </aside>
  )
}
