<?php

namespace App\Http\Requests;

use App\Models\Module;
use App\Models\RoomModule;
use Illuminate\Foundation\Http\FormRequest;

class RoomModuleRequest extends FormRequest
{
    public function authorize(): bool
    {
        $room = $this->route('room');
        $moduleIds = $this->input('module_ids', []);
        if (empty($moduleIds)) {
            return false;
        }

        $modules = Module::findOrFail($moduleIds);

        foreach ($modules as $module) {
            if (!$this->user()->can('create', [RoomModule::class, $room, $module])) {
                return false;
            }
        }

        return true;
    }

    public function rules(): array
    {
        return [
            'module_ids'   => 'required|array',
            'module_ids.*' => 'required|integer',
        ];
    }
}
