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
            // LÓGICA ATUALIZADA: Baseado no seu exemplo, esta consulta agora carrega
            // o módulo da tentativa atual do aluno, incluindo suas atividades específicas.
            $attempt = Attempt::current($room, $user)->load([
                // Carregamos o módulo específico da tentativa (AttemptModule)
                // e, dentro dele, suas atividades (AttemptModuleActivity)
                'modules' => fn($query) => $query->where('id', $moduleId),
                'modules.activities' => fn($query) => $query->orderBy('position'),
            ]);

            // Pegamos o primeiro (e único) módulo carregado que corresponde ao ID.
            $module = $attempt->modules->first();
            
            if (!$module) {
                // Se o módulo não pertence a esta tentativa, retorna um erro.
                abort(404, 'Módulo não encontrado nesta tentativa.');
            }

            // Usamos o AttemptModuleResource para garantir que os IDs corretos
            // da tabela 'attempt_module_activities' sejam enviados para o frontend.
            $moduleData = AttemptModuleResource::make($module);

        } else {
            // Para professores/admins, a lógica original de carregar o template do módulo permanece.
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
