import { useRef, useEffect, useCallback, useImperativeHandle, forwardRef } from 'react'
import type { DynamicsLevel, Particle } from './types'
import { DYNAMICS_CONFIG } from './types'
import styles from './Dynamics.module.css'

export interface DynamicsVisualizerRef {
  triggerBurst: () => void
}

interface DynamicsVisualizerProps {
  level: DynamicsLevel
}

const DynamicsVisualizer = forwardRef<DynamicsVisualizerRef, DynamicsVisualizerProps>(({ level }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animationRef = useRef<number>(0)
  const timeRef = useRef<number>(0)
  const amplitudeRef = useRef<number>(0.3)
  const targetAmplitudeRef = useRef<number>(0.3)
  const levelRef = useRef<DynamicsLevel>(level)

  const getAmplitudeForLevel = (lvl: DynamicsLevel): number => {
    switch (lvl) {
      case 'f': return 0.9
      case 'mf': return 0.5
      case 'p': return 0.2
      default: return 0.5
    }
  }

  const getParticleCountForLevel = (lvl: DynamicsLevel): number => {
    switch (lvl) {
      case 'f': return 80
      case 'mf': return 40
      case 'p': return 15
      default: return 40
    }
  }

  const getParticleHeightForLevel = (lvl: DynamicsLevel): number => {
    switch (lvl) {
      case 'f': return 200
      case 'mf': return 120
      case 'p': return 60
      default: return 120
    }
  }

  const createParticles = useCallback((canvas: HTMLCanvasElement, currentLevel: DynamicsLevel) => {
    const config = DYNAMICS_CONFIG[currentLevel]
    const count = getParticleCountForLevel(currentLevel)
    const maxHeight = getParticleHeightForLevel(currentLevel)
    const newParticles: Particle[] = []

    for (let i = 0; i < count; i++) {
      const angle = (Math.random() - 0.5) * Math.PI * 0.8
      const speed = (Math.random() * 0.5 + 0.5) * maxHeight / 30
      newParticles.push({
        x: canvas.width / 2 + (Math.random() - 0.5) * 100,
        y: canvas.height - 40,
        vx: Math.sin(angle) * speed * 0.5,
        vy: -speed,
        size: Math.random() * 6 + 3,
        color: i % 2 === 0 ? config.color : config.colorLight,
        life: 1,
        maxLife: 1,
      })
    }

    particlesRef.current = [...particlesRef.current, ...newParticles]
  }, [])

  const triggerBurst = useCallback(() => {
    const canvas = canvasRef.current
    if (canvas) {
      createParticles(canvas, levelRef.current)
      amplitudeRef.current = getAmplitudeForLevel(levelRef.current) * 1.5
    }
  }, [createParticles])

  useImperativeHandle(ref, () => ({
    triggerBurst,
  }))

  useEffect(() => {
    levelRef.current = level
    targetAmplitudeRef.current = getAmplitudeForLevel(level)
  }, [level])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      ctx.scale(dpr, dpr)
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    const drawWaveform = (ctx: CanvasRenderingContext2D, width: number, height: number, time: number, amplitude: number, currentLevel: DynamicsLevel) => {
      const config = DYNAMICS_CONFIG[currentLevel]
      const centerY = height * 0.6
      const waveHeight = (height * 0.35) * amplitude

      const gradient = ctx.createLinearGradient(0, centerY - waveHeight, 0, centerY + waveHeight)
      gradient.addColorStop(0, config.colorLight + '80')
      gradient.addColorStop(0.5, config.color)
      gradient.addColorStop(1, config.colorLight + '80')

      ctx.beginPath()
      ctx.moveTo(0, centerY)

      for (let x = 0; x <= width; x += 2) {
        const y = centerY + Math.sin(x * 0.02 + time * 3) * waveHeight * 0.6
                    + Math.sin(x * 0.035 + time * 2) * waveHeight * 0.3
                    + Math.sin(x * 0.01 + time * 1.5) * waveHeight * 0.1
        ctx.lineTo(x, y)
      }

      ctx.strokeStyle = gradient
      ctx.lineWidth = 4
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.stroke()

      ctx.shadowColor = config.color
      ctx.shadowBlur = 20
      ctx.stroke()
      ctx.shadowBlur = 0
    }

    const drawParticles = (ctx: CanvasRenderingContext2D, particles: Particle[]) => {
      particles.forEach(particle => {
        const alpha = particle.life
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size * particle.life, 0, Math.PI * 2)
        ctx.fillStyle = particle.color + Math.floor(alpha * 255).toString(16).padStart(2, '0')
        ctx.fill()

        ctx.shadowColor = particle.color
        ctx.shadowBlur = 10
        ctx.fill()
        ctx.shadowBlur = 0
      })
    }

    const updateParticles = (particles: Particle[], gravity: number): Particle[] => {
      return particles
        .map(p => ({
          ...p,
          x: p.x + p.vx,
          y: p.y + p.vy,
          vy: p.vy + gravity,
          life: p.life - 0.015,
        }))
        .filter(p => p.life > 0 && p.y < 1000)
    }

    const animate = () => {
      const rect = canvas.getBoundingClientRect()
      const width = rect.width
      const height = rect.height

      ctx.clearRect(0, 0, width, height)

      timeRef.current += 0.016

      amplitudeRef.current += (targetAmplitudeRef.current - amplitudeRef.current) * 0.05

      drawWaveform(ctx, width, height, timeRef.current, amplitudeRef.current, levelRef.current)

      particlesRef.current = updateParticles(particlesRef.current, 0.15)
      drawParticles(ctx, particlesRef.current)

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(animationRef.current)
    }
  }, [])

  return (
    <div className={styles.visualizerContainer}>
      <canvas ref={canvasRef} className={styles.canvas} />
    </div>
  )
})

DynamicsVisualizer.displayName = 'DynamicsVisualizer'

export default DynamicsVisualizer
