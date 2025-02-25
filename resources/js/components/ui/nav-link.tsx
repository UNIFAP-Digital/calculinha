import { cn } from '@/utils/ui'
import { InertiaLinkProps, Link } from '@inertiajs/react'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

type ColorVariant = 'primary' | 'secondary' | 'muted'
type StyleVariant = 'default' | 'underline'

const linkVariants = cva('inline-flex items-center text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none', {
  variants: {
    variant: {
      default: '',
      underline: 'underline underline-offset-4',
    } satisfies Record<StyleVariant, string>,
    color: {
      primary: 'text-primary/80 hover:text-primary focus:text-primary',
      secondary: 'text-secondary/80 hover:text-secondary focus:text-secondary',
      muted: 'text-muted-foreground hover:text-foreground focus:text-foreground',
    } satisfies Record<ColorVariant, string>,
  },
  defaultVariants: {
    variant: 'default',
    color: 'primary',
  },
})

interface NavLinkProps extends InertiaLinkProps, Omit<VariantProps<typeof linkVariants>, keyof InertiaLinkProps> {
  variant?: StyleVariant
  color?: ColorVariant
}

const NavLink = React.forwardRef<HTMLAnchorElement, NavLinkProps>(({ className, variant, color, ...props }, ref) => {
  return <Link {...props} className={cn(linkVariants({ variant, color }), className)} ref={ref} />
})
NavLink.displayName = 'NavLink'

export { linkVariants, NavLink, type NavLinkProps }
