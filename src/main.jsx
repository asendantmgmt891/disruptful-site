import React, { useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { ArrowRight, BadgeCheck, BarChart3, BookOpen, Camera, ChevronRight, ExternalLink, Globe2, HeartHandshake, LockKeyhole, Menu, Mic2, Sparkles, Star, X, Zap } from 'lucide-react'
import './styles.css'

const team = {
  eddie: {
    name: 'Eddie',
    role: 'Co-Founder, Technology & Creative Strategy',
    intro: 'Eddie leads the systems behind Disruptful’s growth engine: proprietary technology, creative content direction, model positioning, and the strategy that turns attention into durable revenue.',
    details: ['Proprietary technology leadership', 'Creative content direction', 'Model positioning and brand strategy', 'Revenue systems and growth operations'],
    image: '/images/eddie-primary.jpg',
  },
  sky: {
    name: 'Sky Alexandra',
    role: 'Co-Founder & Talent Manager',
    intro: 'Sky brings creator experience, public voice, wellness entrepreneurship, and advocacy into the Disruptful model relationship. She helps talent feel seen, prepared, and powerful before they ever post.',
    details: ['Published author and audiobook creator', 'Professional motivational speaker', 'Health and wellness entrepreneur', 'Advocate for safety, agency, and decriminalization'],
  },
  sharon: {
    name: 'Sharon',
    role: 'Data Intelligence & Performance Strategy',
    intro: 'Sharon turns content performance into clear decisions. Her analysis shows us what is actually effective, so we can do more of what works, stop wasting energy on what does not, and make each model’s strategy sharper and more profitable over time.',
    details: ['Reach and engagement analysis', 'Content performance intelligence', 'Audience behavior insights', 'Profitability-focused optimization'],
    image: '/images/sharon-primary.jpg',
    gallery: ['/images/sharon-red-car.jpg'],
  },
}

const skyLinks = [
  { label: 'Stop the Violence, Kinda — Audiobook', href: 'https://www.audible.com/pd/B08QSKVPP1/?source_code=AUDFPWS0223189MWT-BK-ACX0-227499&ref=acx_bty_BK_ACX0_227499_rh_us' },
  { label: 'Stop The Violence, Kinda — Book', href: 'https://www.amazon.com/Stop-Violence-Kinda-Psykhe-Skybaby-ebook/dp/B08CBFWKMV/' },
  { label: 'Fox News Primetime Interview', href: 'https://vimeo.com/1141498463?share=copy&fl=sv&fe=ci' },
  { label: 'A Guiding Voice Podcast', href: 'https://aguidingvoice.onpodcastai.com/episodes/YizUYrunqtm' },
  { label: 'Pressure Politics Full Interview', href: 'https://youtu.be/1uXyKert4ZI?si=xAhz-sInQuVG7lg8' },
  { label: 'TikTok @skyalexandra925', href: 'https://www.tiktok.com/@skyalexandra925?_t=zt-90ib30kiev9&_r=1' },
]

const models = [
  { name: 'Veyra Stehl', slug: '/models/veyra-stehl', market: 'Yoga • Fitness • Visual inspiration', status: 'Digital creator', tone: 'Yoga and fitness for visual inspiration — mainly for men, but all are welcome. Move better, stress less, and build a stronger mind and body.', description: 'Yoga and fitness for visual inspiration — mainly for men, but all are welcome. Move better, stress less, and build a stronger mind and body.', instagram: 'https://www.instagram.com/veyrastehl/', x: 'https://x.com/veyrastehl', tiktok: 'https://www.tiktok.com/@veyrastehl', premium: 'https://onlyfans.com/veyrastehl', mym: 'https://mym.fans/Veyrastehl', image: '/images/models/veyra-stehl.jpg', gallery: ['/images/models/veyra-stehl-yoga-rocks.jpg', '/images/models/veyra-stehl-profile-side.jpg', '/images/models/veyra-stehl-yoga-lunge.jpg', '/images/models/veyra-stehl-blue-studio.jpg', '/images/models/veyra-stehl-sunlit-portrait.jpg', '/images/models/veyra-stehl-car-duo.jpg', '/images/models/veyra-stehl-car-portrait.jpg'] },
  { name: 'Emyra Vesce', slug: '/models/emyra-vesce', market: 'Lifestyle • Fashion • Visual inspiration', status: 'Digital creator', tone: 'A polished visual presence with confident lifestyle and fashion-forward content direction.', description: 'A digital creator with a polished visual presence, confident lifestyle imagery, and fashion-forward content direction.', instagram: 'https://www.instagram.com/emyravesce/', premium: 'https://onlyfans.com/emyravesce', mym: 'https://mym.fans/Emyravesce', image: '/images/models/emyra-vesce.jpg', gallery: ['/images/models/emyra-vesce-purple-studio.jpg', '/images/models/emyra-vesce-red-car.jpg', '/images/models/emyra-vesce-car-interior.jpg', '/images/models/emyra-vesce-side-car.jpg', '/images/models/emyra-vesce-sunlit-closeup.jpg', '/images/models/emyra-vesce-car-exterior.jpg', '/images/models/emyra-vesce-yellow-car-closeup.jpg', '/images/models/emyra-vesce-in-car-duo.jpg', '/images/models/emyra-vesce-graffiti-yoga.jpg', '/images/models/emyra-vesce-graffiti-cobra.jpg', '/images/models/emyra-vesce-outdoor-backbend.jpg'] },
  { name: 'Siyenna Luyxe', slug: '/models/siyenna-luyxe', market: 'Desert • Fitness • Visual inspiration', status: 'Digital creator', tone: 'A confident visual creator with desert-lit fitness imagery and bold, polished brand presence.', description: 'A digital creator with confident desert-lit fitness imagery, bold visual identity, and polished brand presence.', instagram: 'https://www.instagram.com/siyennaluyxe/', x: 'https://x.com/siyennaluyxe', tiktok: 'https://www.tiktok.com/@siyennaluyxe', premium: 'https://onlyfans.com/siyennaluyxe', mym: 'https://mym.fans/Siyennaluyxe', image: '/images/models/siyenna-luyxe.jpg', gallery: ['/images/models/siyenna-luyxe-seated-yoga.jpg', '/images/models/siyenna-luyxe-desert-pink.jpg', '/images/models/siyenna-luyxe-desert-black.jpg', '/images/models/siyenna-luyxe-desert-turquoise.jpg'] },
]

function pathName() {
  return window.location.pathname.replace(/\/$/, '') || '/'
}

// Cloudflare Web Analytics auto-tracks page views on every path, including
// SPA soft-navigations driven by history.pushState (which navigate() below
// uses) -- so /models/<slug> and /premium/<slug> page views are covered once
// a token is configured. Only loads if VITE_CF_BEACON_TOKEN is set at build
// time (Cloudflare Pages project env var), so it's a no-op until the Web
// Analytics site is created in the dashboard and the token is wired up.
function initWebAnalytics() {
  const token = import.meta.env.VITE_CF_BEACON_TOKEN
  if (!token) return
  const script = document.createElement('script')
  script.type = 'module'
  script.src = 'https://static.cloudflareinsights.com/beacon.min.js'
  script.setAttribute('data-cf-beacon', JSON.stringify({ token }))
  document.head.appendChild(script)
}
initWebAnalytics()

// Cloudflare Web Analytics has no public custom-events API for the standard
// beacon (only automatic page views + web vitals). To distinguish OnlyFans
// vs MYM clicks per model, briefly push a synthetic path so the beacon's
// SPA soft-navigation tracking records it as a page view, then immediately
// restore the real URL via replaceState so the address bar and back button
// are unaffected. This never calls preventDefault, so the actual link
// (opened in a new tab) navigates instantly and is never delayed.
function trackPremiumClick(platform, model) {
  try {
    const modelKey = model.slug.split('/').pop()
    const eventPath = `/events/premium-click/${platform.toLowerCase()}/${modelKey}`
    const realPath = window.location.pathname + window.location.search
    window.history.pushState(null, '', eventPath)
    window.history.replaceState(null, '', realPath)
  } catch (err) {
    // analytics must never block navigation
  }
}

function App() {
  const [route, setRoute] = useState(pathName())
  const navigate = (href) => (event) => {
    event.preventDefault()
    window.history.pushState(null, '', href)
    setRoute(pathName())
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  React.useEffect(() => {
    const onPop = () => setRoute(pathName())
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const page = useMemo(() => {
    if (route === '/apply') return <ApplyPage />
    if (route === '/eddie') return <PersonPage person={team.eddie} />
    if (route === '/sky') return <SkyPage />
    if (route === '/sharon') return <SharonPage />
    if (route === '/models') return <ModelsPage />
    if (route === '/models/veyra-stehl') return <ModelProfilePage model={models[0]} />
    if (route === '/models/emyra-vesce') return <ModelProfilePage model={models[1]} />
    if (route === '/models/siyenna-luyxe') return <ModelProfilePage model={models[2]} />
    if (route === '/premium/veyra-stehl') return <PremiumSitesPage model={models[0]} />
    if (route === '/premium/emyra-vesce') return <PremiumSitesPage model={models[1]} />
    if (route === '/premium/siyenna-luyxe') return <PremiumSitesPage model={models[2]} />
    return <HomePage navigate={navigate} />
  }, [route])

  return (
    <>
      <Header route={route} navigate={navigate} />
      <main>{React.cloneElement(page, { navigate })}</main>
      <Footer navigate={navigate} />
    </>
  )
}

function Header({ route, navigate }) {
  const [open, setOpen] = useState(false)
  const nav = [['/', 'Studio'], ['/sky', 'Sky'], ['/eddie', 'Eddie'], ['/sharon', 'Sharon'], ['/models', 'Models'], ['/apply', 'Apply']]
  return (
    <header className="site-header">
      <a className="brand" href="/" onClick={navigate('/')} aria-label="Disruptful home">
        <span className="brand-mark">D</span><span>Disruptful</span>
      </a>
      <button className="menu-button" onClick={() => setOpen(!open)} aria-label="Toggle navigation">{open ? <X /> : <Menu />}</button>
      <nav className={open ? 'nav open' : 'nav'}>
        {nav.map(([href, label]) => <a key={href} className={route === href ? 'active' : ''} href={href} onClick={(e) => { navigate(href)(e); setOpen(false) }}>{label}</a>)}
      </nav>
    </header>
  )
}

function HomePage({ navigate }) {
  return (
    <>
      <section className="hero section-pad">
        <div className="hero-copy">
          <p className="eyebrow"><Sparkles size={16} /> Creator growth, built like a studio</p>
          <h1>Premium content development, social marketing, and European monetization for ambitious models.</h1>
          <p className="lede">Disruptful works alongside models as a team: shaping content, strengthening social presence, and building monetization paths with polish, consistency, and discretion.</p>
          <div className="hero-actions">
            <a className="button primary" href="/apply" onClick={navigate('/apply')}>Apply to work with us <ArrowRight size={18} /></a>
            <a className="button ghost" href="/models" onClick={navigate('/models')}>View selected models</a>
          </div>
          <div className="trust-strip" aria-label="Key promises">
            <span><BadgeCheck size={16}/> Talent-first</span><span><LockKeyhole size={16}/> Discreet</span><span><Globe2 size={16}/> Europe-ready</span>
          </div>
        </div>
        <div className="hero-card" aria-label="Disruptful growth system visual">
          <div className="growth-orbit">
            <div className="orbit-ring ring-one"></div>
            <div className="orbit-ring ring-two"></div>
            <div className="phone-frame">
              <div className="phone-top"></div>
              <div className="metric-card large">
                <span>Monthly direction</span>
                <strong>Content × Social × Revenue</strong>
              </div>
              <div className="growth-path" aria-hidden="true">
                <div className="path-node"><Camera size={18}/><span>Content</span></div>
                <i></i>
                <div className="path-node"><BarChart3 size={18}/><span>Social</span></div>
                <i></i>
                <div className="path-node"><Zap size={18}/><span>Revenue</span></div>
              </div>
              <div className="metric-row"><div><small>Reach</small><b>+42%</b></div><div><small>Consistency</small><b>5×/wk</b></div></div>
              <div className="mini-dashboard">
                <div><span>Hook score</span><b>91</b><em></em></div>
                <div><span>Saved posts</span><b>2.8k</b><em></em></div>
                <div><span>Conversion path</span><b>Live</b><em></em></div>
              </div>
            </div>
            <div className="floating-chip chip-content"><Camera size={16}/><span>Shoot plan</span></div>
            <div className="floating-chip chip-social"><BarChart3 size={16}/><span>Growth loop</span></div>
            <div className="floating-chip chip-revenue"><Zap size={16}/><span>Revenue system</span></div>
          </div>
        </div>
      </section>

      <section className="section-pad grid-section">
        <div className="section-heading"><p className="eyebrow">What we do</p><h2>A complete creator support system.</h2></div>
        <div className="cards three">
          <Feature icon={<Camera />} title="Develop content" text="Shoot planning, creative direction, profile presentation, and content calendars designed around the model’s strengths and comfort level." />
          <Feature icon={<BarChart3 />} title="Market attention" text="Social media strategy, platform-native hooks, posting rhythm, audience growth, and brand consistency built around measurable performance." />
          <Feature icon={<Zap />} title="Monetize globally" text="European platform readiness, conversion strategy, fan-retention systems, compliance awareness, and sustainable revenue operations." />
        </div>
      </section>

      <section className="section-pad system-section">
        <div className="section-heading"><p className="eyebrow">How growth works</p><h2>We turn creator effort into a real operating system.</h2><p className="lede">Most of the work that drives revenue happens before a follower ever reaches a paid platform: positioning, social content, consistency, trust, and smart conversion paths.</p></div>
        <div className="process-grid">
          <article><span>01</span><h3>Find the niche</h3><p>We help define a clear creator lane, audience promise, and visual identity so the model stands out instead of blending into a crowded feed.</p></article>
          <article><span>02</span><h3>Build social demand</h3><p>We plan high-performing, social-safe content around hooks, captions, style, retention, saves, shares, and repeatable posting systems.</p></article>
          <article><span>03</span><h3>Study performance</h3><p>We review what is working, what is not, and what to improve so content decisions become sharper over time instead of random.</p></article>
          <article><span>04</span><h3>Increase revenue</h3><p>We support conversion, organization, fan attention, and growth-focused tools so the model can focus on creating while the team handles the system around her.</p></article>
        </div>
      </section>

      <section className="section-pad tech-section">
        <div className="tech-panel">
          <div>
            <p className="eyebrow">Exclusive technology</p>
            <h2>Our proprietary stack gives models an unfair advantage.</h2>
            <p className="lede">Disruptful has developed exclusive, highly advanced software for planning, organizing, publishing, and improving model content. It is built to be among the most sophisticated technology systems in the industry — and our models benefit from tools they cannot get anywhere else.</p>
          </div>
          <div className="tech-stats">
            <div><strong>Exclusive</strong><span>proprietary systems available only to Disruptful models</span></div>
            <div><strong>Hours</strong><span>from onboarding to active marketing</span></div>
            <div><strong>Smarter loops</strong><span>content, social signals, and revenue feedback connected</span></div>
          </div>
        </div>
        <div className="launch-strip">
          <article><span>Onboard</span><p>We clarify goals, audience, comfort level, and immediate content priorities.</p></article>
          <article><span>Produce</span><p>We quickly begin turning usable ideas and assets into structured content.</p></article>
          <article><span>Market</span><p>Within hours, the team can begin testing social angles and building demand.</p></article>
          <article><span>Improve</span><p>Performance feedback shapes the next content cycle instead of waiting weeks.</p></article>
        </div>
      </section>

      <section className="section-pad split dark-panel">
        <div><p className="eyebrow">Selective by design</p><h2>We are not trying to work with everyone.</h2></div>
        <p>We are building a focused roster of models who want a professional team, clear expectations, premium execution, privacy-aware strategy, and serious upside. The best fit is confident, highly motivated, responsive, consistent, and open to guidance.</p>
      </section>
    </>
  )
}

function Feature({ icon, title, text }) {
  return <article className="card"><div className="icon">{icon}</div><h3>{title}</h3><p>{text}</p></article>
}

function PersonPage({ person, navigate }) {
  return (
    <section className="section-pad profile-page">
      <div className="profile-hero">
        <div className={person.image ? 'portrait photo-portrait' : 'portrait'}>{person.image ? <img src={person.image} alt={`${person.name} portrait`} /> : <span>{person.name[0]}</span>}</div>
        <div><p className="eyebrow">Leadership</p><h1>{person.name}</h1><h2>{person.role}</h2><p className="lede">{person.intro}</p></div>
      </div>
      <div className="cards two">{person.details.map(item => <article className="card compact" key={item}><BadgeCheck /><span>{item}</span></article>)}</div>
      <a className="button primary" href="/apply" onClick={navigate('/apply')}>Apply to work with {person.name} <ArrowRight size={18}/></a>
    </section>
  )
}

function SkyPage({ navigate }) {
  return (
    <section className="section-pad profile-page sky-page">
      <div className="profile-hero sky-hero">
        <div className="portrait sky-portrait photo-portrait"><img src="/images/sky-alexandra.jpg" alt="Sky Alexandra" /></div>
        <div>
          <p className="eyebrow">Talent partner</p>
          <h1>Sky Alexandra</h1>
          <h2>Co-Founder & Talent Manager</h2>
          <p className="lede">Sky’s work sits at the intersection of public storytelling, wellness, activism, and lived creator experience. For Disruptful, she helps models step into a more confident, prepared, and professionally supported version of their online presence.</p>
          <div className="hero-actions">
            <a className="button primary" href="/apply" onClick={navigate('/apply')}>Apply to work with Sky <ArrowRight size={18}/></a>
          </div>
        </div>
      </div>

      <div className="cards three sky-credentials">
        <Feature icon={<BookOpen />} title="Published author" text="Creator of Stop the Violence, Kinda: Psykhe Ubuntu, with book and audiobook presence across major marketplaces." />
        <Feature icon={<Mic2 />} title="Public speaker" text="A media-tested motivational speaker who understands how to carry a story, hold attention, and speak with conviction." />
        <Feature icon={<HeartHandshake />} title="Model advocate" text="An advocate for agency, safety, and decriminalization who can meet talent with empathy and real-world perspective." />
      </div>

      <section className="split dark-panel sky-story">
        <div>
          <p className="eyebrow">Why Sky matters</p>
          <h2>Models need more than tactics. They need trust.</h2>
        </div>
        <p>Sky gives Disruptful a human center: someone who understands public visibility, pressure, personal reinvention, and the courage it takes to build a brand around yourself. Her role strengthens onboarding, confidence, creator voice, and the kind of professional support that keeps models from feeling alone in the process.</p>
      </section>

      <section className="section-heading sky-media-heading">
        <p className="eyebrow">Selected links</p>
        <h2>Books, interviews, and public work.</h2>
      </section>
      <div className="link-list">
        {skyLinks.map((link) => <a key={link.href} href={link.href} target="_blank" rel="noreferrer"><span>{link.label}</span><ExternalLink size={17}/></a>)}
      </div>
    </section>
  )
}

function SharonPage({ navigate }) {
  return (
    <section className="section-pad profile-page sharon-page">
      <div className="profile-hero sharon-hero">
        <div className="portrait sharon-portrait photo-portrait"><img src={team.sharon.image} alt="Sharon" /></div>
        <div>
          <p className="eyebrow">Performance intelligence</p>
          <h1>Sharon</h1>
          <h2>Data Intelligence & Performance Strategy</h2>
          <p className="lede">Sharon helps Disruptful models grow with evidence instead of guesswork. Her data analysis shows the team what is effective, so we can do more of what works, refine what is close, and stop wasting time on content that is not moving reach or profitability. Sharon's job is to turn numbers into dollars.</p>
          <div className="hero-actions">
            <a className="button primary" href="/apply" onClick={navigate('/apply')}>Apply to join the system <ArrowRight size={18}/></a>
          </div>
        </div>
      </div>
      <div className="cards three sharon-cards">
        <Feature icon={<BarChart3 />} title="Reach analysis" text="Identifies which content formats, hooks, captions, and posting patterns are expanding audience attention." />
        <Feature icon={<Sparkles />} title="Do more of what works" text="Turns performance data into practical direction, helping the team repeat effective content patterns instead of guessing." />
        <Feature icon={<Zap />} title="Profitability signals" text="Connects social performance to revenue outcomes so growth efforts stay focused on what actually improves the business." />
      </div>
      {team.sharon.gallery?.length ? <div className="profile-gallery" aria-label="Sharon photo gallery">
        {team.sharon.gallery.map((image, index) => <img key={image} src={image} alt={`Sharon photo ${index + 1}`} />)}
      </div> : null}
      <section className="split dark-panel sharon-story">
        <div><p className="eyebrow">Why it matters</p><h2>Every content cycle should make the next one smarter.</h2></div>
        <p>Models should not have to wonder whether something is working. Sharon’s analysis helps the team identify what is effective, do more of it, protect momentum, and make better decisions from the first posts through long-term growth.</p>
      </section>
    </section>
  )
}

function ModelsPage({ navigate }) {
  return (
    <section className="section-pad">
      <div className="section-heading"><p className="eyebrow">Selected roster</p><h1>A selection of models we’re building with.</h1><p className="lede">A growing roster of creators with public profiles, approved imagery, and brand-safe bios as each launch is ready.</p></div>
      <div className="model-grid">
        {models.map((model, idx) => <article className="model-card" key={model.name}>{model.slug ? <a className={`model-art model-art-link art-${idx + 1}`} href={model.slug} onClick={navigate(model.slug)} aria-label={`View ${model.name} profile`}>{model.image ? <img src={model.image} alt={`${model.name} portrait`} /> : <Star />}</a> : <div className={`model-art art-${idx + 1}`}>{model.image ? <img src={model.image} alt={`${model.name} portrait`} /> : <Star />}</div>}<div><p className="status">{model.status}</p><h3>{model.name}</h3><p className="market">{model.market}</p><p>{model.tone}</p></div>{model.slug ? <a href={model.slug} onClick={navigate(model.slug)}>View profile <ChevronRight size={17}/></a> : <a href="/apply" onClick={navigate('/apply')}>Collaborate with us <ChevronRight size={17}/></a>}</article>)}
      </div>
    </section>
  )
}

function PremiumSitesLink({ premiumSlug, navigate }) {
  // 2026-09-29 (Edgar): previously this rendered an on-page modal, so the
  // model's own profile page -- the exact page linked from the Instagram
  // bio -- always contained a "Premium sites" button plus, after two
  // clicks, direct OnlyFans/MYM links, all in the same document Instagram
  // reviews when evaluating bio-link recommendability. Moved to a plain
  // navigation to a separate, unlinked page (see PremiumSitesPage) so the
  // profile page itself never references premium platforms at all. The
  // age-verification step is unchanged, just relocated with it.
  return <a className="button dark" href={premiumSlug} onClick={navigate(premiumSlug)}>Premium sites <ExternalLink size={18}/></a>
}

function PremiumSitesPage({ model, navigate }) {
  const [ageVerified, setAgeVerified] = useState(false)
  const availableLinks = [{ label: 'OF', href: model.premium }, { label: 'MYM', href: model.mym }].filter((link) => link.href)

  return (
    <section className="section-pad sensitive-page">
      <div className="sensitive-page-card" role="dialog" aria-labelledby="premium-sites-title">
        {!ageVerified ? <>
          <h1 id="premium-sites-title">Sensitive Content</h1>
          <p>These links may contain content that is not appropriate for all audiences.</p>
          <button className="button modal-continue" type="button" onClick={() => setAgeVerified(true)}>I am over 18</button>
        </> : <>
          <h1 id="premium-sites-title">Premium sites</h1>
          <p>Choose a site to continue.</p>
          <div className="premium-site-options">
            {availableLinks.map((link) => <a key={link.label} className="button modal-continue" href={link.href} target="_blank" rel="noreferrer" onClick={() => trackPremiumClick(link.label, model)}>{link.label}</a>)}
          </div>
        </>}
        <a className="button ghost" href={model.slug} onClick={navigate(model.slug)}>Back to {model.name}</a>
      </div>
    </section>
  )
}

function ModelProfilePage({ model, navigate }) {
  return (
    <section className="section-pad model-profile-page">
      <div className="profile-hero model-profile-hero">
        <div className="portrait model-portrait photo-portrait"><img src={model.image} alt={`${model.name} portrait`} /></div>
        <div>
          <p className="eyebrow">Digital Creator</p>
          <h1>{model.name}</h1>
          <h2>{model.market}</h2>
          <p className="lede">{model.description || model.tone}</p>
          {(model.instagram || model.x || model.tiktok || model.premium || model.mym) ? <div className="hero-actions">
            {model.instagram ? <a className="button primary" href={model.instagram} target="_blank" rel="noreferrer">Instagram <ExternalLink size={18}/></a> : null}
            {model.tiktok ? <a className="button primary" href={model.tiktok} target="_blank" rel="noreferrer">TikTok <ExternalLink size={18}/></a> : null}
            {model.x ? <a className="button primary" href={model.x} target="_blank" rel="noreferrer">X <ExternalLink size={18}/></a> : null}
            {(model.premium || model.mym) ? <PremiumSitesLink premiumSlug={model.slug.replace('/models/', '/premium/')} navigate={navigate} /> : null}
          </div> : null}
        </div>
      </div>
      {model.gallery?.length ? <div className="model-gallery" aria-label={`${model.name} photo gallery`}>
        {model.gallery.map((image, index) => <img key={image} src={image} alt={`${model.name} yoga and fitness photo ${index + 1}`} />)}
      </div> : null}
      <a className="button ghost" href="/models" onClick={navigate('/models')}>Back to models</a>
    </section>
  )
}

function ApplyPage() {
  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ name: '', age: '', cityState: '', instagram: '', platforms: '', goals: '', phone: '', telegram: '', website: '' })
  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value })
  const submit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    const submittedAt = new Date().toISOString()
    localStorage.setItem('disruptful-application-draft', JSON.stringify({ ...form, submittedAt }))
    try {
      const response = await fetch('/api/apply', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ...form, submittedAt }),
      })
      const result = await response.json().catch(() => ({}))
      if (!response.ok || !result.ok) throw new Error(result.error || 'Something went wrong. Please try again.')
      setSent(true)
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }
  return (
    <section className="section-pad apply-page">
      <div className="section-heading"><p className="eyebrow">Model application</p><h1>Apply to work with Disruptful.</h1><p className="lede">Tell us where you are now and where you want to go. Applicants must be 18+.</p></div>
      {sent ? <div className="success"><BadgeCheck /><h2>Application received.</h2><p>Thanks for reaching out. The Disruptful team has your application and will review it soon.</p></div> :
      <form className="apply-form" onSubmit={submit}>
        <label className="hidden-field">Website<input name="website" value={form.website} onChange={update} tabIndex="-1" autoComplete="off" /></label>
        <label>Full name or creator name<input name="name" value={form.name} onChange={update} required /></label>
        <label>Age<input name="age" inputMode="numeric" value={form.age} onChange={update} required placeholder="18+ only" /></label>
        <label>City / state<input name="cityState" value={form.cityState} onChange={update} required /></label>
        <label>Instagram / TikTok / main social<input name="instagram" value={form.instagram} onChange={update} required /></label>
        <label>Current platforms<textarea name="platforms" value={form.platforms} onChange={update} placeholder="Where are you currently posting or monetizing?" /></label>
        <label>Goals<textarea name="goals" value={form.goals} onChange={update} required placeholder="What do you want help building?" /></label>
        <label>Phone<input name="phone" type="tel" value={form.phone} onChange={update} required placeholder="Best phone number" /></label>
        <label>Telegram <span className="optional">optional</span><input name="telegram" value={form.telegram} onChange={update} placeholder="@username or phone-linked Telegram" /></label>
        {error && <p className="form-error" role="alert">{error}</p>}
        <button className="button primary" type="submit" disabled={submitting}>{submitting ? 'Sending application…' : 'Submit application'} <ArrowRight size={18}/></button>
      </form>}
    </section>
  )
}

function Footer({ navigate }) {
  return <footer className="footer"><div><strong>Disruptful</strong><p>Premium creator growth studio. 18+ applicants only.</p></div><a href="/apply" onClick={navigate('/apply')}>Apply now</a></footer>
}

createRoot(document.getElementById('root')).render(<App />)
