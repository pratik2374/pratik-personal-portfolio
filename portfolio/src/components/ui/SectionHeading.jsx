import { splitHeading } from '../../lib/profile'
import Reveal from './Reveal'

const LINE = 'block font-poppins font-bold text-4xl sm:text-6xl md:text-[72px] leading-[0.95] sm:leading-[0.9] tracking-tighter uppercase'

/** Two-tone section/page heading (white line, grey line) with a scroll reveal. */
export default function SectionHeading({ text, as: Tag = 'h2', className = 'mb-8 sm:mb-12' }) {
  const [first, second] = splitHeading(text)
  return (
    <Reveal className={className}>
      <Tag>
        <span className={`${LINE} text-white`}>{first}</span>
        {second && <span className={`${LINE} text-[#333333]`}>{second}</span>}
      </Tag>
    </Reveal>
  )
}
