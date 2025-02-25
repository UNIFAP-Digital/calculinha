import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { ButtonHTMLAttributes, useState } from 'react'

interface QuizButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  color?: string
  hoverColor?: string
  textColor?: string
  withAnimation?: boolean
}

export default function QuizButton({ children, color, hoverColor, textColor = 'white', withAnimation = true, className = '', ...props }: QuizButtonProps) {
  const [isHovered, setIsHovered] = useState(false)
  const ButtonComponent = withAnimation ? motion.div : 'div'
  const animationProps = withAnimation
    ? {
        whileHover: { scale: 1.05 },
        whileTap: { scale: 0.95 },
      }
    : {}

  const buttonStyle = {
    backgroundColor: isHovered && hoverColor ? hoverColor : color,
    color: textColor,
    transition: 'background-color 0.3s ease',
  }

  return (
    <ButtonComponent {...animationProps}>
      <Button
        className={`${className} rounded-xl font-bold`}
        style={buttonStyle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        {...props}
      >
        {children}
      </Button>
    </ButtonComponent>
  )
}
