import { render, screen, act, cleanup } from '@testing-library/react'
import Reveal from '../components/ui/Reveal'

let observers = []
class FakeIO {
  constructor(cb) {
    this.cb = cb
    this.targets = []
    observers.push(this)
  }
  observe(el) {
    this.targets.push(el)
  }
  disconnect() {
    this.targets = []
  }
  trigger(isIntersecting) {
    this.cb(this.targets.map((target) => ({ target, isIntersecting })))
  }
}

const rectAt = (top) => () => ({ top, bottom: top + 100, left: 0, right: 300, width: 300, height: 100, x: 0, y: top })

beforeEach(() => {
  observers = []
  globalThis.IntersectionObserver = FakeIO
  window.innerHeight = 800
  window.matchMedia = (q) => ({ matches: false, media: q, addEventListener() {}, removeEventListener() {} })
})
afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

describe('Reveal', () => {
  it('never hides content that is on screen at mount', () => {
    vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(rectAt(100))
    render(<Reveal>Above the fold</Reveal>)
    const el = screen.getByText('Above the fold')
    expect(el.className).not.toContain('reveal-hidden')
    expect(observers).toHaveLength(0)
  })

  it('hides below-the-fold content until it scrolls into view, once', () => {
    vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(rectAt(2000))
    render(<Reveal index={2}>Below the fold</Reveal>)
    const el = screen.getByText('Below the fold')
    expect(el.className).toContain('reveal-hidden')

    act(() => observers[0].trigger(true))
    expect(el.className).not.toContain('reveal-hidden')
    expect(el.className).toContain('reveal')
    expect(el.style.transitionDelay).toBe('120ms') // index 2 × 60ms stagger
    expect(observers[0].targets).toHaveLength(0) // disconnected: reveals only once
  })

  it('does nothing for users who prefer reduced motion', () => {
    vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(rectAt(2000))
    window.matchMedia = (q) => ({ matches: q.includes('reduce'), media: q, addEventListener() {}, removeEventListener() {} })
    render(<Reveal>Calm</Reveal>)
    expect(screen.getByText('Calm').className).not.toContain('reveal-hidden')
  })
})
