import { ReactNode } from 'react'

/**
 * Recommended folder structure for pages:
 * 
 * pages/
 * ├── welcome.tsx (no layout - 'none')
 * ├── auth/ (guest layout)
 * ├── quiz/ (no layout - 'none' for minimal gameplay)
 * ├── student/ (authenticated-student layout)
 * └── teacher-admin/ (authenticated-teacher layout)
 *     ├── rooms/
 *     ├── modules/
 *     ├── activities/
 *     └── dashboard/
 */

// Layout Types
export type LayoutType = 'none' | 'guest' | 'authenticated-student' | 'authenticated-teacher'

// Layout Component Interface
export interface LayoutComponent {
  (page: ReactNode): ReactNode
}

// Page with Layout Interface
export interface PageWithLayout {
  default: React.ComponentType<Record<string, unknown>> & {
    layout?: LayoutComponent
  }
}

/**
 * Determines the appropriate layout type based on the page name
 */
export function getLayoutType(pageName: string): LayoutType {
  // Welcome page and quiz pages - no layout wrapper
  if (pageName === 'welcome' || pageName.startsWith('quiz/')) {
    return 'none'
  }
  
  // Auth pages (login, register, etc.)
  if (pageName.startsWith('auth/')) {
    return 'guest'
  }
  
  // Student-specific pages
  if (pageName.startsWith('student/')) {
    return 'authenticated-student'
  }
  
  // Teacher-admin pages (all teacher management functionality)
  if (pageName.startsWith('teacher-admin/')) {
    return 'authenticated-teacher'
  }
  
  // Default - this shouldn't happen with the new structure
  return 'none'
}

/**
 * Applies the appropriate layout to a page based on its type
 */
export function applyLayout(
  page: PageWithLayout, 
  layoutComponents: Partial<Record<LayoutType, LayoutComponent>>,
  pageName?: string
): PageWithLayout {
  // If the page already has a layout defined, don't override it
  if (page.default.layout) {
    return page
  }
  
  // Use provided pageName or try to extract from module
  const resolvedPageName = pageName || getPageNameFromModule(page)
  const layoutType = getLayoutType(resolvedPageName)
  
  // If layout type is 'none', don't apply any layout
  if (layoutType === 'none') {
    return page
  }
  
  const layoutComponent = layoutComponents[layoutType]
  
  if (layoutComponent) {
    page.default.layout = layoutComponent
  }
  
  return page
}

/**
 * Helper to extract page name from the imported module
 * This is used internally by applyLayout
 */
function getPageNameFromModule(page: PageWithLayout): string {
  // This is a fallback - in practice, the page name will be passed from the resolve function
  return page.default.name || 'Unknown'
}

/**
 * Creates a layout wrapper function
 */
export function createLayout(
  LayoutComponent: React.ComponentType<{ children: ReactNode }>,
  props?: Record<string, unknown>
): LayoutComponent {
  return (page: ReactNode) => (
    <LayoutComponent {...props}>
      {page}
    </LayoutComponent>
  )
}

/**
 * Creates nested layouts
 */
export function createNestedLayout(
  OuterLayout: React.ComponentType<{ children: ReactNode }>,
  InnerLayout: React.ComponentType<{ children: ReactNode }>,
  outerProps?: Record<string, unknown>,
  innerProps?: Record<string, unknown>
): LayoutComponent {
  return (page: ReactNode) => (
    <OuterLayout {...outerProps}>
      <InnerLayout {...innerProps}>
        {page}
      </InnerLayout>
    </OuterLayout>
  )
}
