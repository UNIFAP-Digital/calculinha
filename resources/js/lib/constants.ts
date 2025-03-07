import { Operation } from "@/models";


export type DisplayModuleName = 'Adição' | 'Subtração' | 'Multiplicação' | 'Divisão' | 'Pré-Teste' | 'Pós-Teste'

export const MODULES_NAMES: Record<Operation | 'pre_test' | 'pos_test', DisplayModuleName> = {
    addition: 'Adição',
    subtraction: 'Subtração',
    multiplication: 'Multiplicação',
    division: 'Divisão',
    pre_test: 'Pré-Teste',
    pos_test: 'Pós-Teste',
} as const
