The application is a Laravel 12 + React Inertia 2 project with the following structure:

**Core Models** (app/Models):
- Activity.php
- Attempt.php (tracks student progress)
- Module.php (contains activities)
- Room.php (contains modules)
- Student.php (user entity with room/attempt relationships)
- User.php (base user model)
- RoomModule.php (pivot table model for room-module relationships)
- ModuleActivity.php (pivot table model for module-activity relationships)

**Key Routes** (routes/web.php):
1. Welcome page: `Route::inertia('/', 'Welcome')`
2. Student dashboard: `/student/dashboard` (redirects to last attempt or index)
3. Quiz routes: 
   - `/salas/{room}/quiz` (index)
   - `/salas/{room}/quiz/{module}` (show)
4. Module routes:
   - `/trilhas` (CRUD)
   - `/trilhas/{module}/atividades` (activity ordering)
5. Room routes:
   - `/salas` (CRUD)
   - `/salas/{room}/trilhas` (module ordering)

**Frontend Structure** (resources/js):
- Pages: 
  - `quiz/show.tsx` (quiz interface)
  - `student/room.tsx` (student room view)
  - `room/Index.tsx` (room management)
- Components:
  - `QuizResult.tsx` (displays quiz outcomes)
  - `ParticipantsTab.tsx`/`EmptyParticipantsCard.tsx` (room participant management)
  - `quizMachine.ts` (state machine logic for quiz flow)

**Main Logic**:
- Room → RoomModule → Module → ModuleActivity → Activity hierarchy
- Student attempts tracked via Attempt → AttemptModule → AttemptModuleActivity
- Uses Inertia.js for React page rendering (Welcome, Dashboard, Quiz, Room management)
- Authentication: Separate middleware for `auth` (teachers/admins) and `auth:student`