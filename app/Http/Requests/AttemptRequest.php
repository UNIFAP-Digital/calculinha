<?php

namespace App\Http\Requests;

use App\Models\AttemptModuleActivity;
use App\Models\Student;
use Illuminate\Foundation\Http\FormRequest;

class AttemptRequest extends FormRequest
{
    public function authorize(): bool
    {
        $student = Student::findOrFail(session('student_id'));
        $activity = AttemptModuleActivity::findOrFail($this->input('activity_id'));

        return $activity->module->attempt->student_id === $student->id;
    }

    public function rules(): array
    {
        return [
            'activity_id' => ['required', 'exists:attempt_module_activities,id'],
            'answer'      => ['required', 'string', 'max:255']
        ];
    }
}
