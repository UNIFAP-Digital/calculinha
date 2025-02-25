import { useAnimate } from 'motion/react'

export function useShakeAnimation() {
  const [scope, animate] = useAnimate()

  function shake() {
    animate(
      scope.current,
      {
        x: [0, 20, -20, 0],
      },
      {
        duration: 0.1,
      },
    )
  }

  return {
    scope,
    shake,
  }
}
