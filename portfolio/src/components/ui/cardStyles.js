/**
 * Shared card interaction: a small lift + soft shadow on hover (pointer
 * devices only, via Tailwind's hoverOnlyWhenSupported), a press scale on
 * tap/click, one timing for every card, and no movement for reduced motion.
 */
export const CARD_MOTION =
  'transform-gpu transition-[transform,background-color,border-color,box-shadow,opacity] duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] ' +
  'hover:-translate-y-1 hover:shadow-[0_12px_32px_-12px_rgba(0,0,0,0.65)] active:translate-y-0 active:scale-[0.985] ' +
  'motion-reduce:transform-none motion-reduce:hover:translate-y-0 motion-reduce:active:scale-100'
