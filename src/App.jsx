import { useState, useEffect, useRef, useCallback } from 'react'
import azfarPhoto from './assets/azfar.jpg'
import './App.css'

/* ─── Data ─── */
const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Contact', href: '#contact' },
]

const PROJECTS = [
  {
    title: 'TaskFlow',
    desc: 'A full-stack task management platform with real-time updates, role-based access control, and a clean drag-and-drop interface for organizing workflows.',
    tags: ['React', 'Spring Boot', 'MongoDB'],
    gradient: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)',
    icon: '⚡',
    github: '#',
    live: '#',
  },
  {
    title: 'DevConnect',
    desc: 'A social platform where developers share projects, exchange code reviews, and find collaborators. Features real-time messaging and project matching.',
    tags: ['React', 'Node.js', 'SQL'],
    gradient: 'linear-gradient(135deg, #0f172a 0%, #312e81 50%, #0f172a 100%)',
    icon: '🔗',
    github: '#',
    live: '#',
  },
  {
    title: 'CloudDash',
    desc: 'A real-time cloud infrastructure monitoring dashboard with live metrics, alerting pipelines, and interactive charts for server health visibility.',
    tags: ['React', 'Java', 'MongoDB'],
    gradient: 'linear-gradient(135deg, #0f172a 0%, #1e3a2f 50%, #0f172a 100%)',
    icon: '☁️',
    github: '#',
    live: '#',
  },
]

const SKILLS = {
  Frontend: ['HTML & CSS', 'React'],
  Backend: ['Java', 'Spring Boot'],
  Database: ['SQL', 'MongoDB'],
}

/* ─── Icons (inline SVGs) ─── */
const GithubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
  </svg>
)

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
)

const MailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
)

const ExternalLinkIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
)

/* ─── Hook: scroll reveal via IntersectionObserver ─── */
function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    )

    const elements = document.querySelectorAll('.reveal')
    elements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])
}

/* ─── Component: Navbar ─── */
function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleNavClick = useCallback((e, href) => {
    e.preventDefault()
    setMobileOpen(false)
    const target = document.querySelector(href)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' })
    }
  }, [])

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`} id="navbar">
        <div className="navbar-inner">
          <a href="#" className="nav-logo" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>
            AJA
          </a>
          <div className="nav-links">
            {NAV_LINKS.map((link) => (
              <a key={link.label} href={link.href} onClick={(e) => handleNavClick(e, link.href)}>
                {link.label}
              </a>
            ))}
          </div>
          <button
            className={`hamburger ${mobileOpen ? 'open' : ''}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>

      <div className={`mobile-overlay ${mobileOpen ? 'open' : ''}`} onClick={() => setMobileOpen(false)} />
      <div className={`mobile-menu ${mobileOpen ? 'open' : ''}`}>
        {NAV_LINKS.map((link) => (
          <a key={link.label} href={link.href} onClick={(e) => handleNavClick(e, link.href)}>
            {link.label}
          </a>
        ))}
      </div>
    </>
  )
}

/* ─── Component: Hero ─── */
function Hero() {
  const gridRef = useRef(null)

  useEffect(() => {
    const handleMouse = (e) => {
      if (!gridRef.current) return
      const x = (e.clientX / window.innerWidth - 0.5) * 15
      const y = (e.clientY / window.innerHeight - 0.5) * 10
      gridRef.current.style.transform = `rotateX(${45 + y}deg) rotateY(${x}deg)`
    }
    window.addEventListener('mousemove', handleMouse, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouse)
  }, [])

  const handleNavClick = useCallback((e, href) => {
    e.preventDefault()
    const target = document.querySelector(href)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' })
    }
  }, [])

  return (
    <section className="hero-section" id="hero">
      <div className="hero-grid">
        <div className="hero-grid-inner" ref={gridRef}></div>
      </div>
      <div className="hero-glow"></div>

      <div className="hero-content">
        <p className="hero-role">Full Stack Developer</p>
        <h1 className="hero-name">
          Azfar <span className="highlight">Javith</span> Ali
        </h1>
        <div className="hero-terminal">
          <span className="prompt">&gt;</span>
          <span>building things that matter</span>
          <span className="cursor"></span>
        </div>
        <div className="hero-buttons">
          <a href="#projects" className="btn-primary" onClick={(e) => handleNavClick(e, '#projects')}>
            View Projects
          </a>
          <a href="#contact" className="btn-outline" onClick={(e) => handleNavClick(e, '#contact')}>
            Say Hi
          </a>
        </div>
      </div>
    </section>
  )
}

/* ─── Component: About ─── */
function About() {
  return (
    <section className="about-section section" id="about">
      <div className="reveal">
        <p className="section-label">About</p>
        <h2 className="section-title">Who I am</h2>
      </div>

      <div className="about-card reveal">
        <div className="about-photo">
          <img src={azfarPhoto} alt="Azfar Javith Ali" className="about-photo-img" />
        </div>
        <div className="about-text">
          <h3>Hey, I&apos;m Azfar.</h3>
          <p>
            I&apos;m a Full Stack Developer who enjoys building clean, functional applications
            from front to back. I work across the stack — from crafting responsive React interfaces
            to designing robust Spring Boot APIs and managing data with SQL and MongoDB.
          </p>
          <p>
            I care about writing code that&apos;s maintainable, solving problems that matter, and
            shipping things that people actually want to use. When I&apos;m not coding, I&apos;m
            probably exploring new tech or figuring out how to make something work better.
          </p>
        </div>
      </div>
    </section>
  )
}

/* ─── Component: Projects ─── */
function Projects() {
  return (
    <section className="projects-section section" id="projects">
      <div className="reveal">
        <p className="section-label">Work</p>
        <h2 className="section-title">Selected Projects</h2>
      </div>

      <div className="projects-grid stagger-children">
        {PROJECTS.map((project) => (
          <div className="project-card reveal" key={project.title}>
            <div className="project-thumbnail">
              <div
                className="project-thumbnail-bg"
                style={{ background: project.gradient }}
              >
                <span className="project-icon">{project.icon}</span>
              </div>
            </div>
            <div className="project-body">
              <h3 className="project-title">{project.title}</h3>
              <p className="project-desc">{project.desc}</p>
              <div className="project-tags">
                {project.tags.map((tag) => (
                  <span className="project-tag" key={tag}>{tag}</span>
                ))}
              </div>
              <div className="project-links">
                <a href={project.github} className="project-link" aria-label={`${project.title} GitHub repository`}>
                  <GithubIcon /> Code
                </a>
                <a href={project.live} className="project-link" aria-label={`${project.title} live demo`}>
                  <ExternalLinkIcon /> Live
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ─── Component: Skills ─── */
function Skills() {
  return (
    <section className="skills-section section" id="skills">
      <div className="reveal">
        <p className="section-label">Toolkit</p>
        <h2 className="section-title">Skills &amp; Technologies</h2>
      </div>

      <div className="skills-groups">
        {Object.entries(SKILLS).map(([group, skills]) => (
          <div key={group} className="reveal">
            <p className="skill-group-label">{group}</p>
            <div className="skill-chips">
              {skills.map((skill) => (
                <span className="skill-chip" key={skill}>{skill}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ─── Component: Contact ─── */
function Contact() {
  return (
    <section className="contact-section section" id="contact">
      <div className="reveal">
        <p className="section-label">Connect</p>
        <h2 className="section-title">Let&apos;s build something together</h2>
      </div>

      <div className="reveal">
        <p className="contact-desc">
          Have a project in mind, a question, or just want to say hello?
          I&apos;m always open to conversations about new opportunities and ideas.
        </p>

        <a href="mailto:hello@azfarjavithali.dev" className="contact-email-btn">
          <MailIcon /> Get in Touch
        </a>

        <div className="contact-socials">
          <a
            href="https://github.com/AzfarJavithAli"
            target="_blank"
            rel="noopener noreferrer"
            className="social-link"
            aria-label="GitHub"
          >
            <GithubIcon />
          </a>
          <a
            href="https://linkedin.com/in/azfarjavithali"
            target="_blank"
            rel="noopener noreferrer"
            className="social-link"
            aria-label="LinkedIn"
          >
            <LinkedInIcon />
          </a>
          <a
            href="mailto:hello@azfarjavithali.dev"
            className="social-link"
            aria-label="Email"
          >
            <MailIcon />
          </a>
        </div>
      </div>
    </section>
  )
}

/* ─── Component: Footer ─── */
function Footer() {
  return (
    <footer className="footer">
      <p>
        &copy; {new Date().getFullYear()} <span className="signal-text">Azfar Javith Ali</span>. Built with intent.
      </p>
    </footer>
  )
}

/* ─── Component: Divider ─── */
function Divider() {
  return (
    <div className="section-divider">
      <div className="section-divider-line"></div>
    </div>
  )
}

/* ─── App ─── */
function App() {
  useScrollReveal()

  return (
    <>
      <Navbar />
      <Hero />
      <Divider />
      <About />
      <Divider />
      <Projects />
      <Divider />
      <Skills />
      <Divider />
      <Contact />
      <Footer />
    </>
  )
}

export default App
