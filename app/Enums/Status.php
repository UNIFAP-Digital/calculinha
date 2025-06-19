<?php

namespace App\Enums;

enum Status: string
{
    /**
     * Usado para a Tentativa (Attempt) geral quando
     * todos os módulos foram concluídos.
     */
    case Completed = 'completed';

    /**
     * O módulo/tentativa que o aluno está a realizar no momento.
     */
    case Current   = 'current';

    /**
     * Um módulo que o aluno ainda não pode aceder.
     */
    case Locked    = 'locked';

    /**
     * NOVO: O aluno concluiu o módulo e atingiu a pontuação para passar.
     */
    case Passed    = 'passed';

    /**
     * NOVO: O aluno concluiu o módulo, mas não atingiu a pontuação para passar.
     */
    case Failed    = 'failed';
}
