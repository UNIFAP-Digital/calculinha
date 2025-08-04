<?php

namespace App\Http\Controllers;

use App\Http\Resources\AttemptResource;
use App\Http\Resources\ModuleResource;
use App\Http\Resources\RoomResource;
use App\Http\Resources\StudentResource;
use App\Http\Resources\AttemptModuleResource;
use App\Models\Attempt;
use App\Models\AttemptModule;
use App\Models\Module;
use App\Models\Room;
use App\Models\Student;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class AttemptController extends Controller
{
    public function index(Room $room)
    {
        Gate::authorize('create', [Attempt::class, $room]);
        $user = Auth::user();

        if ($user instanceof Student) {
            $attempt = Attempt::current($room, $user);
            $attempt->load([
                'modules' =>
                    fn($query) => $query->withCount([
                        'activities',
                        'activities as activities_completed' => fn($query) => $query->whereNotNull('is_correct')
                    ])
            ]);
        } else {
            $attempt = Attempt::fake($room);
        }

        return Inertia::render('quiz/Index', [
            'attempt' => AttemptResource::make($attempt),
            'room'    => RoomResource::make($room),
            'student' => $user instanceof Student ? StudentResource::make($user) : null,
        ]);
    }
 public function show(Room $room, int $moduleId)
    {
        Gate::authorize('view', [Attempt::class, $room]);
        $user = Auth::user();

        $moduleData = null;

        if ($user instanceof Student) {
            // Para alunos: $moduleId é o ID do AttemptModule
            // Carregamos diretamente o AttemptModule com suas atividades
            $attemptModule = AttemptModule::with([
                'activities' => fn($query) => $query->orderBy('position'),
                'activities.originalActivity' // Carrega a atividade original para acessar o conteúdo
            ])->findOrFail($moduleId);

            // Verificar se o AttemptModule pertence ao aluno atual
            $attempt = Attempt::current($room, $user);
            if ($attemptModule->attempt_id !== $attempt->id) {
                abort(403, 'Este módulo não pertence à sua tentativa atual.');
            }

            // Usamos o AttemptModuleResource para garantir que os IDs corretos
            // da tabela 'attempt_module_activities' sejam enviados para o frontend.
            $moduleData = ModuleResource::make($attemptModule);

        } else {
            // Para professores/admins: $moduleId é o ID do Module original
            $module = Module::with('activities')->findOrFail($moduleId);
            $moduleData = ModuleResource::make($module);
        }

        return Inertia::render('quiz/Show', [
            'room'    => RoomResource::make($room),
            'module'  => $moduleData, // Envia os dados formatados corretamente
            'student' => $user instanceof Student ? StudentResource::make($user) : null
        ]);
    }
}
