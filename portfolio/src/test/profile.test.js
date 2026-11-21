import { mergeSettings, splitHeading } from '../lib/profile'
import { parseStat } from '../components/ui/CountUp'
import { settings as base } from '../data/settings'

describe('mergeSettings', () => {
  it('returns the static settings when there is no document', () => {
    expect(mergeSettings(base, null)).toBe(base)
    expect(mergeSettings(base, undefined)).toBe(base)
    expect(mergeSettings(base, [])).toBe(base)
  })

  it('overrides only the fields the document fills in', () => {
    const merged = mergeSettings(base, {
      name: 'Pratik G.',
      bio: '',
      bioSnippet: '   ',
      email: null,
      github: 'https://github.com/someone',
    })
    expect(merged.name).toBe('Pratik G.')
    expect(merged.github).toBe('https://github.com/someone')
    // empty / whitespace / null keep the static value
    expect(merged.bio).toBe(base.bio)
    expect(merged.bioSnippet).toBe(base.bioSnippet)
    expect(merged.email).toBe(base.email)
    // untouched fields carry over
    expect(merged.linkedin).toBe(base.linkedin)
    expect(merged.heroOrangeCard).toBe(base.heroOrangeCard)
  })

  it('maps portfolioHeadings field by field', () => {
    const merged = mergeSettings(base, { portfolioHeadings: { projects: 'SELECTED WORK', tools: '' } })
    expect(merged.headings.projects).toBe('SELECTED WORK')
    expect(merged.headings.tools).toBe(base.headings.tools)
    expect(merged.headings.blog).toBe(base.headings.blog)
  })

  it('uses stats only when there are complete rows', () => {
    expect(mergeSettings(base, { stats: [] }).stats).toBe(base.stats)
    expect(mergeSettings(base, { stats: [{ value: '+3' }] }).stats).toBe(base.stats)
    expect(mergeSettings(base, { stats: [{ value: '+3', label: 'Years' }, { label: 'x' }] }).stats).toEqual([
      { value: '+3', label: 'Years' },
    ])
  })

  it('takes the avatar only when it has an asset, and trims the blog URL slash', () => {
    expect(mergeSettings(base, { avatar: { alt: 'me' } }).avatar).toBe(base.avatar)
    const avatar = { asset: { _ref: 'image-abc-10x10-jpg' }, alt: 'me' }
    expect(mergeSettings(base, { avatar }).avatar).toBe(avatar)
    expect(mergeSettings(base, { blogUrl: 'https://blog.example.com/' }).blogUrl).toBe('https://blog.example.com')
  })
})

describe('splitHeading', () => {
  it('splits on an explicit line break', () => {
    expect(splitHeading('2 YEARS OF\nEXPERIENCE')).toEqual(['2 YEARS OF', 'EXPERIENCE'])
  })

  it('puts the last word on line two, pulling a one-letter word with it', () => {
    expect(splitHeading('RECENT PROJECTS')).toEqual(['RECENT', 'PROJECTS'])
    expect(splitHeading('TOOLS I USE')).toEqual(['TOOLS', 'I USE'])
    expect(splitHeading('FROM THE BLOG')).toEqual(['FROM THE', 'BLOG'])
    expect(splitHeading('PROJECTS')).toEqual(['PROJECTS', ''])
  })
})

describe('parseStat', () => {
  it('keeps prefix and suffix around the number', () => {
    expect(parseStat('+46')).toEqual({ prefix: '+', number: 46, decimals: 0, suffix: '' })
    expect(parseStat('99%')).toEqual({ prefix: '', number: 99, decimals: 0, suffix: '%' })
    expect(parseStat('4.5k+')).toEqual({ prefix: '', number: 4.5, decimals: 1, suffix: 'k+' })
    expect(parseStat('many')).toBeNull()
  })
})
