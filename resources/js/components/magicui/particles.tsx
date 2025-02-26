'use client'

import { cn } from '@/utils/ui'
import type React from 'react'
import { type ComponentPropsWithoutRef, useEffect, useRef, useState } from 'react'

interface MousePosition {
  x: number
  y: number
}

function MousePosition(): MousePosition {
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: 0,
    y: 0,
  })

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return mousePosition
}

interface MathSymbolsProps extends ComponentPropsWithoutRef<'div'> {
  className?: string
  quantity?: number
  staticity?: number
  ease?: number
  size?: number
  refresh?: boolean
  colors?: string[]
  vx?: number
  vy?: number
}

type MathSymbol = {
  x: number
  y: number
  translateX: number
  translateY: number
  size: number
  alpha: number
  targetAlpha: number
  dx: number
  dy: number
  magnetism: number
  symbol: string
  color: string
  rotation: number
}

export const MathSymbols: React.FC<MathSymbolsProps> = ({
  className = '',
  quantity = 50,
  staticity = 50,
  ease = 50,
  size = 1.5,
  colors = ['#FF9AA2', '#FFB7B2', '#FFDAC1', '#E2F0CB', '#B5EAD7', '#C7CEEA'],
  vx = 0,
  vy = 0,
  ...props
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const canvasContainerRef = useRef<HTMLDivElement>(null)
  const context = useRef<CanvasRenderingContext2D | null>(null)
  const symbols = useRef<MathSymbol[]>([])
  const mousePosition = MousePosition()
  const mouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const canvasSize = useRef<{ w: number; h: number }>({ w: 0, h: 0 })
  const dpr = typeof window !== 'undefined' ? window.devicePixelRatio : 1
  const rafID = useRef<number | null>(null)
  const resizeTimeout = useRef<NodeJS.Timeout>(null)

  const mathSymbols = ['+', '-', '×', '÷', '=']

  useEffect(() => {
    if (canvasRef.current) {
      context.current = canvasRef.current.getContext('2d')
    }
    initCanvas()
    animate()

    const handleResize = () => {
      if (resizeTimeout.current) {
        clearTimeout(resizeTimeout.current)
      }
      resizeTimeout.current = setTimeout(() => {
        initCanvas()
      }, 200)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      if (rafID.current != null) {
        window.cancelAnimationFrame(rafID.current)
      }
      if (resizeTimeout.current) {
        clearTimeout(resizeTimeout.current)
      }
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(() => {
    onMouseMove()
  }, [mousePosition.x, mousePosition.y])

  useEffect(() => {
    initCanvas()
  }, [quantity, staticity, ease, size, JSON.stringify(colors), vx, vy])

  const initCanvas = () => {
    resizeCanvas()
    drawSymbols()
  }

  const onMouseMove = () => {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect()
      const { w, h } = canvasSize.current
      const x = mousePosition.x - rect.left - w / 2
      const y = mousePosition.y - rect.top - h / 2
      const inside = x < w / 2 && x > -w / 2 && y < h / 2 && y > -h / 2
      if (inside) {
        mouse.current.x = x
        mouse.current.y = y
      }
    }
  }

  const resizeCanvas = () => {
    if (canvasContainerRef.current && canvasRef.current && context.current) {
      canvasSize.current.w = canvasContainerRef.current.offsetWidth
      canvasSize.current.h = canvasContainerRef.current.offsetHeight

      canvasRef.current.width = canvasSize.current.w * dpr
      canvasRef.current.height = canvasSize.current.h * dpr
      canvasRef.current.style.width = `${canvasSize.current.w}px`
      canvasRef.current.style.height = `${canvasSize.current.h}px`
      context.current.scale(dpr, dpr)

      symbols.current = []
      for (let i = 0; i < quantity; i++) {
        const symbol = symbolParams()
        drawSymbol(symbol)
      }
    }
  }

  const symbolParams = (): MathSymbol => {
    const x = Math.floor(Math.random() * canvasSize.current.w)
    const y = Math.floor(Math.random() * canvasSize.current.h)
    const translateX = 0
    const translateY = 0
    const symbolSize = (Math.random() * 2 + size) * 10
    const alpha = 0
    const targetAlpha = Number.parseFloat((Math.random() * 0.5 + 0.5).toFixed(1))
    const dx = (Math.random() - 0.5) * 0.1
    const dy = (Math.random() - 0.5) * 0.1
    const magnetism = 0.1 + Math.random() * 4
    const symbol = mathSymbols[Math.floor(Math.random() * mathSymbols.length)]
    const color = colors[Math.floor(Math.random() * colors.length)]
    const rotation = Math.random() * Math.PI * 2

    return {
      x,
      y,
      translateX,
      translateY,
      size: symbolSize,
      alpha,
      targetAlpha,
      dx,
      dy,
      magnetism,
      symbol,
      color,
      rotation,
    }
  }

  const drawSymbol = (mathSymbol: MathSymbol, update = false) => {
    if (context.current) {
      const { x, y, translateX, translateY, size, alpha, symbol, color, rotation } = mathSymbol

      context.current.save()
      context.current.translate(x + translateX, y + translateY)
      context.current.rotate(rotation)

      context.current.font = `bold ${size}px Arial`
      context.current.fillStyle = color.replace(')', `, ${alpha})`).replace('rgb', 'rgba')
      context.current.textAlign = 'center'
      context.current.textBaseline = 'middle'
      context.current.fillText(symbol, 0, 0)

      context.current.restore()

      if (!update) {
        symbols.current.push(mathSymbol)
      }
    }
  }

  const clearContext = () => {
    if (context.current) {
      context.current.clearRect(0, 0, canvasSize.current.w, canvasSize.current.h)
    }
  }

  const drawSymbols = () => {
    clearContext()
    const symbolCount = quantity
    for (let i = 0; i < symbolCount; i++) {
      const symbol = symbolParams()
      drawSymbol(symbol)
    }
  }

  const remapValue = (value: number, start1: number, end1: number, start2: number, end2: number): number => {
    const remapped = ((value - start1) * (end2 - start2)) / (end1 - start1) + start2
    return remapped > 0 ? remapped : 0
  }

  const animate = () => {
    clearContext()
    symbols.current.forEach((mathSymbol: MathSymbol, i: number) => {
      const edge = [
        mathSymbol.x + mathSymbol.translateX - mathSymbol.size / 2,
        canvasSize.current.w - mathSymbol.x - mathSymbol.translateX - mathSymbol.size / 2,
        mathSymbol.y + mathSymbol.translateY - mathSymbol.size / 2,
        canvasSize.current.h - mathSymbol.y - mathSymbol.translateY - mathSymbol.size / 2,
      ]
      const closestEdge = edge.reduce((a, b) => Math.min(a, b))
      const remapClosestEdge = Number.parseFloat(remapValue(closestEdge, 0, 20, 0, 1).toFixed(2))
      if (remapClosestEdge > 1) {
        mathSymbol.alpha += 0.02
        if (mathSymbol.alpha > mathSymbol.targetAlpha) {
          mathSymbol.alpha = mathSymbol.targetAlpha
        }
      } else {
        mathSymbol.alpha = mathSymbol.targetAlpha * remapClosestEdge
      }
      mathSymbol.x += mathSymbol.dx + vx
      mathSymbol.y += mathSymbol.dy + vy
      mathSymbol.translateX += (mouse.current.x / (staticity / mathSymbol.magnetism) - mathSymbol.translateX) / ease
      mathSymbol.translateY += (mouse.current.y / (staticity / mathSymbol.magnetism) - mathSymbol.translateY) / ease

      mathSymbol.rotation += 0.001

      drawSymbol(mathSymbol, true)

      const bufferSize = mathSymbol.size * 2
      if (
        mathSymbol.x < -bufferSize ||
        mathSymbol.x > canvasSize.current.w + bufferSize ||
        mathSymbol.y < -bufferSize ||
        mathSymbol.y > canvasSize.current.h + bufferSize
      ) {
        symbols.current.splice(i, 1)
        const newSymbol = symbolParams()
        drawSymbol(newSymbol)
      }
    })
    rafID.current = window.requestAnimationFrame(animate)
  }

  return (
    <div className={cn('pointer-events-none', className)} ref={canvasContainerRef} aria-hidden="true" {...props}>
      <canvas ref={canvasRef} className="size-full" />
    </div>
  )
}
