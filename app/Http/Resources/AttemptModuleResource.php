<?php


namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AttemptModuleResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
        {
            return [
                'id' => $this->id,
                'name' => $this->name,
                'description' => $this->description,
                'status' => $this->status,
                'score' => $this->score,
                
                // ATUALIZAÇÃO: Agora utiliza o ActivityResource para formatar a coleção de atividades.
                // Isso garante consistência e reutilização de código.
                'activities' => ActivityResource::collection($this->whenLoaded('activities')),
            ];
        }
}
