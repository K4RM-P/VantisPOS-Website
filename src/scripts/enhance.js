// Scroll progress bar
const progressBar = document.getElementById('scroll-progress')
if (progressBar) {
  const updateProgress = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight
    const fraction = scrollable > 0 ? window.scrollY / scrollable : 0
    progressBar.style.transform = `scaleX(${Math.min(1, Math.max(0, fraction))})`
  }
  updateProgress()
  window.addEventListener('scroll', updateProgress, { passive: true })
  window.addEventListener('resize', updateProgress)
}

// Cursor-reactive spotlight on cards
const spotlightEls = document.querySelectorAll('[data-spotlight]')
spotlightEls.forEach((el) => {
  el.addEventListener('pointermove', (e) => {
    const rect = el.getBoundingClientRect()
    el.style.setProperty('--x', `${e.clientX - rect.left}px`)
    el.style.setProperty('--y', `${e.clientY - rect.top}px`)
  })
})

// Count-up numbers on scroll into view
const countEls = document.querySelectorAll('[data-count-to]')
const skipCountAnimation =
  window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
  window.matchMedia('(max-width: 767px)').matches
if (countEls.length && !skipCountAnimation) {
  const countObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        const el = entry.target
        countObserver.unobserve(el)
        const target = parseFloat(el.getAttribute('data-count-to') || '0')
        const prefix = el.getAttribute('data-count-prefix') || ''
        const decimals = el.getAttribute('data-count-decimals')
          ? parseInt(el.getAttribute('data-count-decimals'), 10)
          : 0
        const duration = 900
        const start = performance.now()
        const step = (now) => {
          const progress = Math.min(1, (now - start) / duration)
          const eased = 1 - Math.pow(1 - progress, 3)
          el.textContent = prefix + (target * eased).toFixed(decimals)
          if (progress < 1) requestAnimationFrame(step)
        }
        requestAnimationFrame(step)
      }
    },
    { threshold: 0.5 }
  )
  countEls.forEach((el) => countObserver.observe(el))
} else {
  countEls.forEach((el) => {
    const target = parseFloat(el.getAttribute('data-count-to') || '0')
    const prefix = el.getAttribute('data-count-prefix') || ''
    const decimals = el.getAttribute('data-count-decimals')
      ? parseInt(el.getAttribute('data-count-decimals'), 10)
      : 0
    el.textContent = prefix + target.toFixed(decimals)
  })
}
