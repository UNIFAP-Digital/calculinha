,# Technical Implementation Guide - Calculinha Authentication System

## Overview
This guide provides comprehensive instructions for implementing the authentication system with Laravel backend and Inertia.js frontend, following the snake-case convention for file naming and domain-based folder structure.

## Architecture Overview

### User Flow
```
Welcome Page → Login (Teacher/Student) → Dashboard (Role-based) → Application Features
```

### Route Structure
```
/
├── welcome page → login techear | login student → dashboard teacher | dashboard student → join room student → start quiz student → results pages → back to the rooms page → repeat until finish the room, can go back to the dashboard that can join and show already joined rooms.
the teacher dashboard is a view of all the modules rooms and activities separate by tabs, can view all thoses models inside a table with crud actions, in the room view page can see the results of the students and joined students, the quantity, current score for the user.
```

## Backend Implementation

### 1. Controllers
- **LoginController**: Handles authentication for both student and teacher roles
- **RegisterUserController**: Handles user registration
- **AuthenticatedSessionController**: Standard Laravel auth controller

### 2. Authentication Flow
```php
// Student Login
POST /login/student
- Validates: username, password, remember
- Checks role: student
- Redirects: student.dashboard

// Teacher Login  
POST /login/teacher
- Validates: email, password, remember
- Checks role: teacher
- Redirects: teacher.dashboard
```

### 3. Middleware Configuration
```php
// In app/Http/Kernel.php or bootstrap/app.php
'can:student-only' => \App\Http\Middleware\EnsureStudent::class,
'can:teacher-only' => \App\Http\Middleware\EnsureTeacher::class,
```

## Frontend Implementation

### 1. Page Structure (snake-case convention)
```
resources/js/pages/
├── welcome.tsx
├── auth/
│   ├── student-login.tsx
│   ├── teacher-login.tsx
│   ├── student-register.tsx
│   └── teacher-register.tsx
├── student/
│   └── dashboard.tsx
├── teacher/
│   └── dashboard.tsx
├── room/
│   ├── index.tsx
│   ├── form.tsx
│   └── show.tsx
├── module/
│   ├── index.tsx
│   ├── form.tsx
│   └── show.tsx
├── activity/
│   ├── index.tsx
│   ├── form.tsx
│   └── show.tsx
└── quiz/
    ├── join.tsx
    ├── play.tsx
    └── results.tsx
```

### 2. Component Structure
```
resources/js/components/
├── common/           # Shared components
│   ├── ui/          # Shadcn UI components
│   └── layout/      # Layout components
├── student/         # Student-specific components
│   ├── quiz/
│   └── dashboard/
└── teacher/         # Teacher-specific components
    ├── rooms/
    ├── modules/
    └── activities/
```

### 3. Layout Components
- **HomeLayout**: For guest pages (welcome, login, register)
- **StudentLayout**: For authenticated student pages
- **TeacherLayout**: For authenticated teacher pages

## Implementation Steps

### Phase 1: Backend Setup
1. **Update LoginController** ✅
   - Fix authentication logic
   - Add role-based validation
   - Implement rate limiting

2. **Update Routes** ✅
   - Configure proper route names
   - Add middleware groups
   - Set up redirects

3. **Create Middleware** (if needed)
   ```php
   // app/Http/Middleware/EnsureStudent.php
   public function handle($request, Closure $next)
   {
       if (!auth()->check() || !auth()->user()->isStudent()) {
           abort(403, 'Acesso não autorizado.');
       }
       return $next($request);
   }
   ```

### Phase 2: Frontend Pages

#### Student Login Page (`auth/student-login.tsx`)
- Username + Password authentication
- "Remember me" functionality
- Links to student register and teacher login

#### Teacher Login Page (`auth/teacher-login.tsx`)
- Email + Password authentication
- "Remember me" functionality
- Links to teacher register and student login

#### Student Register Page (`auth/student-register.tsx`)
- Name, username, password fields
- Invite code validation
- Automatic role assignment

#### Teacher Register Page (`auth/teacher-register.tsx`)
- Name, email, username, password fields
- Terms acceptance
- Automatic role assignment

### Phase 3: Dashboard Pages

#### Student Dashboard (`student/dashboard.tsx`)
- Join room functionality
- View joined rooms
- Progress tracking
- Quick access to active quizzes

#### Teacher Dashboard (`teacher/dashboard.tsx`)
- Tabbed interface for rooms, modules, activities
- CRUD operations for all resources
- Student progress overview
- Analytics and reports

### Phase 4: Navigation Flow

#### Student Flow
1. Welcome → Student Login → Student Dashboard
2. Student Dashboard → Join Room → Quiz Play → Results
3. Results → Back to Room → Student Dashboard

#### Teacher Flow
1. Welcome → Teacher Login → Teacher Dashboard
2. Teacher Dashboard → Create/Edit Rooms → View Results
3. Teacher Dashboard → Create/Edit Modules → Manage Activities

## API Endpoints

### Authentication
```
POST /login/student
POST /login/teacher
POST /logout
POST /register/student
POST /register/teacher
```

### Student Operations
```
POST /student/join
GET  /student/room/{room}
POST /student/answer
POST /student/retry/{module}
```

### Teacher Operations
```
GET    /teacher/dashboard
GET    /teacher/rooms
POST   /teacher/rooms
PUT    /teacher/rooms/{room}
DELETE /teacher/rooms/{room}
# Similar for modules and activities
```

## Error Handling

### Backend
- Validation errors with Portuguese messages
- Role-based access errors
- Rate limiting responses

### Frontend
- Form validation with real-time feedback
- Error boundaries for React components
- User-friendly error messages

## Security Considerations

1. **Rate Limiting**: Implemented on login endpoints
2. **CSRF Protection**: Laravel's built-in CSRF tokens
3. **Input Validation**: Server-side validation for all inputs
4. **Role-based Access**: Middleware ensures proper authorization
5. **Password Security**: Bcrypt hashing with Laravel defaults

## Testing Checklist

### Authentication Tests
- [ ] Student can login with username/password
- [ ] Teacher can login with email/password
- [ ] Invalid credentials show appropriate errors
- [ ] Role mismatch shows access denied
- [ ] Remember me functionality works
- [ ] Logout clears session properly

### Registration Tests
- [ ] Student registration with invite code
- [ ] Teacher registration with email verification
- [ ] Duplicate username/email prevention
- [ ] Password confirmation validation
- [ ] Terms acceptance required

### Navigation Tests
- [ ] Guest users redirected to login
- [ ] Students cannot access teacher routes
- [ ] Teachers cannot access student routes
- [ ] Proper redirects after login/logout

## Deployment Notes

1. **Environment Variables**
   ```
   APP_URL=https://calculinha.com
   SESSION_DRIVER=database
   SESSION_LIFETIME=120
   ```

2. **Database Migration**
   ```bash
   php artisan migrate
   php artisan db:seed
   ```

3. **Frontend Build**
   ```bash
   npm run build
   php artisan optimize
   ```

## Troubleshooting

### Common Issues
1. **Route not found**: Check route names and middleware
2. **CSRF token mismatch**: Ensure proper Inertia.js setup
3. **Role access issues**: Verify middleware configuration
4. **Session issues**: Check session driver configuration

### Debug Commands
```bash
php artisan route:list
php artisan route:cache
php artisan config:cache
npm run dev
```

This guide provides a complete roadmap for implementing the authentication system with proper separation of concerns and following Laravel/Inertia.js best practices.
