# Layout Organization - Calculinha App

## Overview
This document explains the new persistent layout organization for the Calculinha application, following Inertia.js best practices for layout management.

## File Structure

### Pages Organization
```
pages/
├── welcome.tsx                    # Home page (HomeLayout)
├── auth/                         # Authentication pages (GuestLayout)
│   ├── forgot-password.tsx
│   ├── login.tsx
│   ├── register.tsx
│   ├── reset-password.tsx
│   ├── student-login.tsx
│   └── student-register.tsx
├── quiz/                         # Quiz gameplay (QuizLayout)
│   ├── index.tsx
│   └── show.tsx
├── student/                      # Student dashboard & features (StudentLayout)
│   └── dashboard.tsx
└── teacher-admin/                # Teacher management (TeacherLayout)
    ├── dashboard.tsx
    ├── activities/
    │   └── activity-management.tsx
    ├── modules/
    │   ├── form.tsx
    │   └── index.tsx
    └── rooms/
        ├── form.tsx
        └── index.tsx
```

### Layout Components
```
components/layouts/
├── AuthenticatedLayout.tsx       # Default for authenticated users
├── GuestLayout.tsx               # Authentication pages
├── HomeLayout.tsx                # Welcome/landing page
├── QuizLayout.tsx                # Minimal layout for gameplay
├── StudentLayout.tsx             # Student-specific navigation
└── TeacherLayout.tsx             # Teacher admin navigation
```

## Layout System

### Layout Types
The system uses 4 layout types:

- `none` - No layout wrapper (welcome page, quiz gameplay)
- `guest` - For authentication pages
- `authenticated-student` - For student dashboard and features
- `authenticated-teacher` - For teacher admin interface

### Automatic Layout Assignment
The layout system automatically assigns the appropriate layout based on the page path:

- `welcome` → none (no layout)
- `quiz/*` → none (minimal for gameplay)
- `auth/*` → guest
- `student/*` → authenticated-student
- `teacher-admin/*` → authenticated-teacher

### Layout Components Used
```
components/layouts/
├── GuestLayout.tsx               # Authentication pages
├── StudentLayout.tsx             # Student-specific navigation
└── TeacherLayout.tsx             # Teacher admin navigation
```

Note: `HomeLayout.tsx`, `QuizLayout.tsx`, and `AuthenticatedLayout.tsx` are no longer needed with the simplified system.

### Customizing Layouts

If a page needs a specific layout, you can override the automatic assignment:

```tsx
// In any page component
export default function SpecialPage() {
  return <div>Content</div>
}

// Override automatic layout
SpecialPage.layout = page => <CustomLayout>{page}</CustomLayout>
```

## Benefits

1. **Better Organization**: Clear separation of concerns
2. **Maintainable**: Centralized layout logic
3. **Scalable**: Easy to add new layouts and pages
4. **Type Safe**: Full TypeScript support
5. **Performance**: Persistent layouts prevent unnecessary re-renders
6. **Developer Experience**: Automatic layout assignment reduces boilerplate

## Migration Notes

- All page files renamed to snake-case
- Teacher pages moved to `teacher-admin/` folder
- Simplified layout types: `none`, `guest`, `authenticated-student`, `authenticated-teacher`
- Removed unused layouts: `HomeLayout`, `QuizLayout`, `AuthenticatedLayout`
- New layout utility handles all assignment logic
- Welcome and quiz pages now use no layout wrapper for better performance
