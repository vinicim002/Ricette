import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLayoutEffect, type RefObject } from 'react'

gsap.registerPlugin(ScrollTrigger)

const EASE = 'power3.out'
const DURATION = 0.65

function revealUp(
  trigger: Element,
  targets: gsap.TweenTarget,
  options?: { stagger?: number; delay?: number; y?: number },
) {
  gsap.from(targets, {
    y: options?.y ?? 28,
    opacity: 0,
    duration: DURATION,
    ease: EASE,
    stagger: options?.stagger ?? 0,
    delay: options?.delay ?? 0,
    scrollTrigger: {
      trigger,
      start: 'top 85%',
      toggleActions: 'play none none none',
    },
  })
}

export function useLandingGsap(rootRef: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: reduce)', () => {
        const bg = root.querySelector<HTMLElement>('[data-landing-bg]')
        if (bg) {
          gsap.set(bg, { opacity: 1 })
        }
      })

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const cleanups: Array<() => void> = []

        const bg = root.querySelector<HTMLElement>('[data-landing-bg]')
        const header = root.querySelector<HTMLElement>('[data-landing-header]')
        const heroItems = root.querySelectorAll('[data-hero-item]')
        const heroStats = root.querySelectorAll('[data-hero-stat]')
        const heroHighlight = root.querySelector('[data-hero-highlight]')

        if (bg) {
          gsap.fromTo(
            bg,
            { opacity: 0, y: 0 },
            { opacity: 0.35, duration: 1.1, ease: 'power2.out' },
          )
          gsap.to(bg, {
            y: 48,
            ease: 'none',
            scrollTrigger: {
              trigger: root,
              start: 'top top',
              end: 'bottom top',
              scrub: 0.6,
            },
          })
        }

        if (header) {
          gsap.from(header, { y: -16, opacity: 0, duration: 0.5, ease: EASE })
        }

        const heroTl = gsap.timeline({ defaults: { ease: EASE } })
        heroTl.from(heroItems, {
          y: 32,
          opacity: 0,
          duration: DURATION,
          stagger: 0.12,
          delay: 0.1,
        })
        if (heroHighlight) {
          heroTl.from(heroHighlight, { opacity: 0, duration: 0.5 }, '-=0.35')
        }
        heroTl.from(
          heroStats,
          { y: 16, opacity: 0, scale: 0.98, duration: 0.55, stagger: 0.08 },
          '-=0.25',
        )

        const quote = root.querySelector('[data-section-quote]')
        if (quote) {
          gsap.from(quote.querySelectorAll('[data-reveal]'), {
            y: 24,
            opacity: 0,
            scale: 0.98,
            duration: 0.8,
            stagger: 0.12,
            ease: EASE,
            scrollTrigger: {
              trigger: quote,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          })
        }

        const features = root.querySelector('[data-section-features]')
        if (features) {
          const head = features.querySelector('[data-section-head]')
          if (head) revealUp(features, head, { y: 20 })
          revealUp(features, features.querySelectorAll('[data-feature-card]'), {
            stagger: 0.14,
            y: 36,
          })
        }

        const steps = root.querySelector('[data-section-steps]')
        if (steps) {
          const head = steps.querySelector('[data-section-head]')
          if (head) revealUp(steps, head, { y: 20 })
          revealUp(steps, steps.querySelectorAll('[data-step]'), { stagger: 0.15, y: 28 })

          steps.querySelectorAll('[data-step-line]').forEach((line, i) => {
            gsap.from(line, {
              scaleX: 0,
              transformOrigin: 'left center',
              duration: 0.9,
              ease: EASE,
              delay: 0.2 + i * 0.12,
              scrollTrigger: {
                trigger: steps,
                start: 'top 75%',
                toggleActions: 'play none none none',
              },
            })
          })

          steps.querySelectorAll('[data-step-num]').forEach((num, i) => {
            gsap.from(num, {
              scale: 0.85,
              opacity: 0,
              duration: 0.5,
              ease: 'back.out(1.4)',
              delay: i * 0.1,
              scrollTrigger: {
                trigger: steps,
                start: 'top 75%',
                toggleActions: 'play none none none',
              },
            })
          })
        }

        const showcase = root.querySelector('[data-section-showcase]')
        if (showcase) {
          const head = showcase.querySelector('[data-section-head]')
          if (head) revealUp(showcase, head, { y: 20 })
          revealUp(showcase, showcase.querySelectorAll('[data-showcase-card]'), {
            stagger: 0.12,
            y: 40,
          })

          showcase.querySelectorAll('[data-showcase-img]').forEach((img) => {
            gsap.to(img, {
              yPercent: 14,
              ease: 'none',
              scrollTrigger: {
                trigger: img.closest('[data-showcase-card]') ?? img,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1.5,
              },
            })
          })
        }

        const split = root.querySelector('[data-section-split]')
        if (split) {
          const left = split.querySelector('[data-split-left]')
          const right = split.querySelector('[data-split-right]')
          const img = split.querySelector('[data-split-img]')

          if (left) {
            gsap.from(left, {
              x: -40,
              opacity: 0,
              duration: 0.8,
              ease: EASE,
              scrollTrigger: { trigger: split, start: 'top 80%', toggleActions: 'play none none none' },
            })
            revealUp(split, left.querySelectorAll('[data-split-item]'), { stagger: 0.1, y: 16 })
          }

          if (right) {
            gsap.from(right, {
              x: 40,
              opacity: 0,
              duration: 0.8,
              ease: EASE,
              scrollTrigger: { trigger: split, start: 'top 80%', toggleActions: 'play none none none' },
            })
          }

          if (img) {
            gsap.to(img, {
              backgroundPosition: '50% 30%',
              ease: 'none',
              scrollTrigger: {
                trigger: split,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1.8,
              },
            })
          }
        }

        const faq = root.querySelector('[data-section-faq]')
        if (faq) {
          const head = faq.querySelector('[data-section-head]')
          if (head) revealUp(faq, head, { y: 20 })
          revealUp(faq, faq.querySelectorAll('[data-faq-item]'), { stagger: 0.08, y: 20 })
        }

        const cta = root.querySelector('[data-section-cta]')
        if (cta) {
          gsap.from(cta.querySelectorAll('[data-reveal]'), {
            y: 24,
            opacity: 0,
            scale: 0.97,
            duration: 0.75,
            stagger: 0.1,
            ease: EASE,
            scrollTrigger: {
              trigger: cta,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          })
        }

        const footer = root.querySelector('[data-landing-footer]')
        if (footer) {
          gsap.from(footer, {
            y: 20,
            opacity: 0,
            duration: DURATION,
            ease: EASE,
            scrollTrigger: {
              trigger: footer,
              start: 'top 92%',
              toggleActions: 'play none none none',
            },
          })
        }

        root.querySelectorAll('[data-feature-card]').forEach((card) => {
          const icon = card.querySelector('[data-feature-icon]')
          const onEnter = () => {
            gsap.to(card, { y: -4, duration: 0.25, ease: EASE })
            if (icon) gsap.to(icon, { scale: 1.12, rotate: 4, duration: 0.3, ease: EASE })
          }
          const onLeave = () => {
            gsap.to(card, { y: 0, duration: 0.25, ease: EASE })
            if (icon) gsap.to(icon, { scale: 1, rotate: 0, duration: 0.3, ease: EASE })
          }
          card.addEventListener('mouseenter', onEnter)
          card.addEventListener('mouseleave', onLeave)
          cleanups.push(() => {
            card.removeEventListener('mouseenter', onEnter)
            card.removeEventListener('mouseleave', onLeave)
          })
        })

        root.querySelectorAll('[data-showcase-card]').forEach((card) => {
          const onEnter = () => {
            gsap.to(card, { y: -6, duration: 0.35, ease: 'power2.out' })
          }
          const onLeave = () => {
            gsap.to(card, { y: 0, duration: 0.35, ease: 'power2.out' })
          }
          card.addEventListener('mouseenter', onEnter)
          card.addEventListener('mouseleave', onLeave)
          cleanups.push(() => {
            card.removeEventListener('mouseenter', onEnter)
            card.removeEventListener('mouseleave', onLeave)
          })
        })

        return () => cleanups.forEach((fn) => fn())
      })
    }, root)

    return () => {
      ctx.revert()
    }
  }, [rootRef])
}
