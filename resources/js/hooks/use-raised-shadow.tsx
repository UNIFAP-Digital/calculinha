import { animate, MotionValue, useMotionValue } from 'motion/react'
import { useEffect } from 'react'

const inactiveShadow = '0px 0px 0px rgba(0,0,0,0.8)'

export function useRaisedShadow(value: MotionValue<number>) {
  const boxShadow = useMotionValue(inactiveShadow)

  useEffect(() => {
    function updateBoxShadow(latest: number) {
      const wasActive = isActive
      if (latest !== 0) {
        isActive = true
        if (isActive !== wasActive) {
          animate(boxShadow, '5px 5px 10px rgba(0,0,0,0.3)')
        }
      } else {
        isActive = false
        if (isActive !== wasActive) {
          animate(boxShadow, inactiveShadow)
        }
      }
    }
    let isActive = false

    const unsubscribe = value.on("change", updateBoxShadow)

    return () => unsubscribe()
  }, [value, boxShadow])

  return boxShadow
}
