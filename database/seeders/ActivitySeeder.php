<?php

namespace Database\Seeders;

use App\Enums\Operation;
use App\Models\Activity;
use Illuminate\Database\Seeder;

class ActivitySeeder extends Seeder
{
    public function run(): void
    {
        $operations = [
            Operation::Addition->value       => $this->getAdditions(),
            Operation::Subtraction->value    => $this->getSubtractions(),
            Operation::Multiplication->value => $this->getMultiplications(),
            Operation::Division->value       => $this->getDivisions()
        ];

        foreach ($operations as $operation => $activities) {
            foreach ($activities as $activity) {
                Activity::create([
                    'type'      => 'multiple_choice',
                    'operation' => $operation,
                    'content'   => [
                        'question'       => $activity[0],
                        'correct_answer' => $activity[1],
                        'wrong_answers'  => $activity[2]
                    ]
                ]);
            }
        }
    }

    private function getAdditions(): array
    {
        return [
            // APENAS OBJETOS
            ["Resolva corretamente a adição de\n🍌🍌🍌 + 🍌\n= ?", "🍌🍌🍌🍌", ["🍌🍌🍌", "🍌🍌", "🍌"]],
            ["Resolva corretamente a adição de\n🍊🍊🍊🍊 + 🍊\n= ?", "🍊🍊🍊🍊🍊", ["🍊🍊", "🍎🍎", "🍊"]],
            ["Resolva corretamente a adição de\n🍎🍎 + 🍎🍎\n= ?", "🍎🍎🍎🍎", ["🍎", "🍎🍎🍎", "🍎🍎"]],
            ["Resolva corretamente a adição de\n🍍🍍🍍 + 🍍🍍🍍\n= ?", "🍍🍍🍍🍍🍍🍍", ["🍍🍍🍍", "🍍🍍🍍🍍🍍", "🍍🍍"]],
            ["Calcule a adição de\n🍇🍇🍇 + 🍇🍇\n= ?", "🍇🍇🍇🍇🍇", ["🍇🍇🍇", "🍇🍇", "🍇"]],
            ["Calcule a adição de\n🍐🍐🍐 + 🍐🍐🍐🍐\n= ?", "🍐🍐🍐🍐🍐🍐🍐", ["🍐🍐🍐🍐🍐", "🍐🍐🍐", "🍐🍐"]],
            ["Calcule a adição de\n🍓🍓 + 🍓🍓🍓🍓\n= ?", "🍓🍓🍓🍓🍓🍓", ["🍓🍓🍓🍓", "🍓🍓", "🍓"]],
            ["Calcule a adição de\n🍉🍉🍉 + 🍉🍉🍉\n= ?", "🍉🍉🍉🍉🍉🍉", ["🍉🍉", "🍉🍉🍉", "🍉🍉🍉🍉"]],
            // OBJETOS E NÚMEROS
            ["Resolva corretamente a adição de\n🍌🍌🍌 + 🍌 = ?\n3 + 1= ?", "🍌🍌🍌🍌\n4", ["🍌🍌🍌\n3", "🍌🍌\n2", "🍌\n1"]],
            ["Resolva corretamente a adição de\n🍊🍊🍊🍊 + 🍊 = ?\n4 + 1 = ?", "🍊🍊🍊🍊🍊\n5", ["🍊🍊🍊\n3", "🍊🍊\n2", "🍊\n1"]],
            ["Resolva corretamente a adição de\n🍎🍎 + 🍎🍎 = ?\n2 + 2 = ?", "🍎🍎🍎🍎\n4", ["🍎\n1", "🍎🍎🍎\n3", "🍎🍎\n2"]],
            ["Resolva corretamente a adição de\n🍍🍍🍍 + 🍍🍍🍍 = ?\n3 + 3 = ?", "🍍🍍🍍🍍🍍🍍\n6", ["🍍🍍🍍\n3", "🍍🍍🍍🍍🍍\n5", "🍍🍍\n2"]],
            ["Calcule a adição de\n🍇🍇🍇 + 🍇🍇= ?\n3 + 2 = ?", "🍇🍇🍇🍇🍇\n5", ["🍇🍇🍇\n3", "🍇🍇\n2", "🍇\n1"]],
            ["Calcule a adição de\n🍐🍐🍐 + 🍐🍐🍐🍐 = ?\n3 + 4 = ?", "🍐🍐🍐🍐🍐🍐🍐\n7", ["🍐🍐🍐🍐🍐\n5", "🍐🍐🍐\n3", "🍐🍐\n2"]],
            ["Calcule a adição de\n🍓🍓 + 🍓🍓🍓🍓 = ?\n2 + 4 = ?", "🍓🍓🍓🍓🍓🍓\n6", ["🍓🍓🍓🍓\n4", "🍓🍓\n2", "🍓\n1"]],
            ["Calcule a adição de\n🍉🍉🍉 + 🍉🍉🍉 = ?\n3 + 3 = ?", "🍉🍉🍉🍉🍉🍉\n6", ["🍉🍉\n2", "🍉🍉🍉\n3", "🍉🍉🍉🍉\n4"]],
            // APENAS NÚMEROS
            ["Resolva corretamente a adição de\n3 + 4\n= ?", "7", ["3", "2", "1"]],
            ["Resolva corretamente a adição de\n4 + 2\n= ?", "6", ["3", "2", "1"]],
            ["Resolva corretamente a adição de\n4 + 4\n= ?", "8", ["1", "3", "2"]],
            ["Resolva corretamente a adição de\n4 + 5\n= ?", "9", ["3", "5", "2"]],
            ["Calcule a adição de\n5 + 4\n= ?", "9", ["5", "4", "2"]],
            ["Calcule a adição de\n4 + 4\n= ?", "8", ["6", "3", "5"]],
            ["Calcule a adição de\n3 + 4\n= ?", "7", ["4", "5", "3"]],
            ["Calcule a adição de\n4 + 2\n= ?", "6", ["2", "4", "5"]]
        ];
    }

    private function getSubtractions(): array
    {
        return [
            // APENAS OBJETOS
            ["Resolva corretamente a subtração de\n🏀🏀🏀🏀🏀🏀🏀 – 🏀🏀\n= ?", "🏀🏀🏀🏀", ["🏀🏀🏀", "🏀🏀", "🏀"]],
            ["Resolva corretamente a subtração de\n🍿🍿🍿🍿🍿🍿 – 🍿🍿🍿\n= ?", "🍿🍿🍿", ["🍿🍿🍿🍿", "🍿🍿🍿🍿🍿", "🍿🍿"]],
            ["Resolva corretamente a subtração de\n🛴🛴🛴🛴🛴🛴🛴 – 🛴🛴\n= ?", "🛴🛴🛴🛴🛴", ["🛴🛴🛴", "🛴🛴", "🛴"]],
            ["Resolva corretamente a subtração de\n🏠🏠🏠🏠🏠🏠 – 🏠🏠\n= ?", "🏠🏠🏠🏠", ["🏠🏠", "🏠", "🏠🏠🏠🏠🏠"]],
            ["Calcule a subtração de\n🎻🎻🎻🎻🎻 – 🎻🎻🎻\n= ?", "🎻🎻", ["🎻🎻🎻", "🎻🎻🎻🎻", "🎻🎻🎻🎻🎻"]],
            ["Calcule a subtração de\n🔨🔨🔨🔨🔨🔨🔨🔨 – 🔨🔨\n= ?", "🔨🔨🔨🔨🔨🔨", ["🔨🔨🔨🔨", "🔨🔨", "🔨🔨🔨"]],
            ["Calcule a subtração de\n🍭🍭🍭🍭🍭🍭🍭 – 🍭🍭🍭🍭\n= ?", "🍭🍭🍭", ["🍭🍭", "🍭🍭🍭🍭", "🍭🍭🍭🍭🍭"]],
            ["Calcule a subtração de\n🕯️🕯️🕯️🕯️🕯️🕯️🕯️🕯️🕯️ – 🕯️🕯️🕯️🕯️\n= ?", "🕯️🕯️🕯️🕯️🕯️", ["🕯️🕯️🕯️🕯️", "🕯️🕯️", "🕯️🕯️🕯️"]],
            // OBJETOS E NÚMEROS
            ["Resolva corretamente a subtração de\n🏀🏀🏀🏀🏀 – 🏀🏀🏀 = ?\n5 - 3 = ?", "🏀🏀🏀🏀\n4", ["🏀🏀🏀\n3", "🏀🏀\n2", "🏀\n1"]],
            ["Resolva corretamente a subtração de\n🍿🍿🍿🍿🍿🍿 – 🍿🍿🍿 = ?\n6 - 3 = ?", "🍿🍿🍿\n3", ["🍿🍿🍿🍿\n4", "🍿🍿🍿🍿🍿\n5", "🍿🍿\n2"]],
            ["Resolva corretamente a subtração de\n🛴🛴🛴🛴🛴🛴🛴 – 🛴🛴 = ?\n7 - 2 = ?", "🛴🛴🛴🛴🛴\n5", ["🛴🛴🛴\n3", "🛴🛴\n2", "🛴\n1"]],
            ["Resolva corretamente a subtração de\n🏠🏠🏠🏠🏠🏠 – 🏠🏠 = ?\n6 - 2 = ?", "🏠🏠🏠🏠\n4", ["🏠🏠\n2", "🏠\n1", "🏠🏠🏠🏠🏠\n5"]],
            ["Calcule a subtração de\n🎻🎻🎻🎻🎻 – 🎻🎻🎻 = ?\n5 - 3 = ?", "🎻🎻\n2", ["🎻🎻🎻🎻🎻\n5", "🎻🎻🎻🎻\n4", "🎻🎻🎻\n3"]],
            ["Calcule a subtração de\n🔨🔨🔨🔨🔨🔨🔨🔨 – 🔨🔨 = ?\n8 - 2 = ?", "🔨🔨🔨🔨🔨🔨\n6", ["🔨🔨🔨🔨\n4", "🔨🔨\n2", "🔨🔨🔨\n3"]],
            ["Calcule a subtração de\n🍭🍭🍭🍭🍭🍭🍭 – 🍭🍭🍭🍭 = ?\n7 - 4 = ?", "🍭🍭🍭\n3", ["🍭🍭\n2", "🍭🍭🍭🍭\n4", "🍭🍭🍭🍭🍭\n5"]],
            ["Calcule a subtração de\n🕯️🕯️🕯️🕯️🕯️🕯️🕯️🕯️🕯️ – 🕯️🕯️🕯️🕯️ = ?\n9 - 4 = ?", "🕯️🕯️🕯️🕯️🕯️\n5", ["🕯️🕯️🕯️🕯️\n4", "🕯️🕯️\n2", "🕯️🕯️🕯️\n3"]],
            // APENAS NÚMEROS
            ["Resolva corretamente a subtração de\n7 – 4\n= ?", "3", ["6", "5", "2"]],
            ["Resolva corretamente a subtração de\n9 – 2\n= ?", "7", ["3", "4", "5"]],
            ["Resolva corretamente a subtração de\n5 – 4\n= ?", "1", ["2", "3", "4"]],
            ["Resolva corretamente a subtração de\n8 – 5\n= ?", "3", ["5", "2", "1"]],
            ["Calcule a subtração de\n6 – 3\n= ?", "3", ["5", "4", "2"]],
            ["Calcule a subtração de\n4 – 2\n= ?", "2", ["6", "3", "5"]],
            ["Calcule a subtração de\n7 – 3\n= ?", "4", ["1", "5", "3"]],
            ["Calcule a subtração de\n8 – 2\n= ?", "4", ["2", "3", "5"]],
        ];
    }

    private function getMultiplications(): array
    {
        return [
            // APENAS OBJETOS
            ["Resolva corretamente a multiplicação de\n⚽⚽⚽ x ⚽⚽\n= ?", "⚽⚽⚽⚽⚽⚽", ["⚽⚽⚽", "⚽", "⚽⚽"]],
            ["Resolva corretamente a multiplicação de\n👞👞 x 👞👞\n= ?", "👞👞👞👞", ["👞", "👞👞👞", "👞👞"]],
            ["Resolva corretamente a multiplicação de\n🍼🍼🍼🍼 x 🍼🍼\n= ?", "🍼🍼🍼🍼🍼🍼🍼", ["🍼🍼🍼🍼", "🍼🍼", "🍼🍼🍼"]],
            ["Resolva corretamente a multiplicação de\n🚗🚗🚗 x 🚗\n= ?", "🚗🚗🚗", ["🚗🚗", "🚗🚗🚗🚗", "🚗"]],
            ["Calcule a multiplicação de\n🍵🍵🍵 x 🍵\n= ?", "🍵🍵🍵🍵", ["🍵", "🍵🍵🍵", "🍵🍵"]],
            ["Calcule a multiplicação de\n👜👜👜👜 x 👜\n= ?", "👜👜👜👜", ["👜👜", "👜👜👜", "👜👜👜👜👜"]],
            ["Calcule a multiplicação de\n⏱️⏱️⏱️ x ⏱️⏱️\n= ?", "⏱️⏱️⏱️⏱️⏱️⏱️", ["⏱️⏱️⏱️", "⏱️⏱️", "⏱️⏱️⏱️⏱️⏱️"]],
            ["Calcule a multiplicação de\n🍦🍦🍦🍦 x 🍦🍦\n= ?", "🍦🍦🍦🍦🍦🍦🍦🍦", ["🍦🍦🍦🍦", "🍦🍦🍦", "🍦🍦"]],
            // OBJETOS E NÚMEROS
            ["Resolva corretamente a multiplicação de\n⚽⚽⚽ x ⚽⚽ = ?\n3 x 2 = ?", "⚽⚽⚽⚽⚽⚽\n6", ["⚽⚽⚽\n3", "⚽\n1", "⚽⚽\n2"]],
            ["Resolva corretamente a multiplicação de\n👞👞 x 👞👞 = ?\n2 x 2 = ?", "👞👞👞👞\n4", ["👞\n1", "👞👞👞\n3", "👞👞\n2"]],
            ["Resolva corretamente a multiplicação de\n🍼🍼🍼🍼 x 🍼🍼 = ?\n3 x 2 = ?", "🍼🍼🍼🍼🍼🍼🍼🍼\n8", ["🍼🍼🍼🍼\n4", "🍼🍼\n2", "🍼🍼🍼\n3"]],
            ["Resolva corretamente a multiplicação de\n🚗🚗🚗 x 🚗 = ?\n3 x 1 = ?", "🚗🚗🚗\n3", ["🚗🚗\n2", "🚗🚗🚗🚗\n4", "🚗\n1"]],
            ["Calcule a multiplicação de\n🍵🍵🍵 x 🍵 = ?\n3 x 1 = ?", "🍵🍵🍵\n3", ["🍵\n1", "🍵🍵🍵🍵\n4", "🍵🍵\n2"]],
            ["Calcule a multiplicação de\n👜👜👜👜 x 👜 = ?\n4 x 1 = ?", "👜👜👜👜\n4", ["👜👜\n2", "👜👜👜\n3", "👜👜👜👜👜\n5"]],
            ["Calcule a multiplicação de\n⏱️⏱️⏱️ x ⏱️⏱️ = ?\n3 x 2 = ?", "⏱️⏱️⏱⏱️⏱️⏱️\n6", ["⏱️⏱️⏱️\n3", "⏱️⏱️\n2", "⏱️⏱️⏱️⏱️⏱️\n5"]],
            ["Calcule a multiplicação de\n👜👜👜 x 👜 = ?\n3 x 1 = ?", "👜👜👜\n3", ["👜👜\n2", "👜👜👜👜\n4", "👜👜👜👜👜\n5"]],
            // APENAS NÚMEROS
            ["Resolva corretamente a multiplicação de\n3 x 2\n= ?", "6", ["3", "1", "2"]],
            ["Resolva corretamente a multiplicação de\n3 x 1\n= ?", "3", ["1", "2", "4"]],
            ["Resolva corretamente a multiplicação de\n2 x 2\n= ?", "4", ["2", "1", "3"]],
            ["Resolva corretamente a multiplicação de\n4 x 2\n= ?", "8", ["1", "3", "4"]],
            ["Calcule a multiplicação de\n2 x 3\n= ?", "6", ["5", "7", "9"]],
            ["Calcule a multiplicação de\n2 x 1\n= ?", "2", ["3", "4", "7"]],
            ["Calcule a multiplicação de\n3 x 0\n= ?", "0", ["1", "3", "2"]],
            ["Calcule a multiplicação de\n5 x 1\n= ?", "5", ["2", "1", "7"]],
        ];
    }

    private function getDivisions(): array
    {
        return [
            // APENAS OBJETOS
            ["Resolva corretamente a divisão de\n✏️️✏️✏️ ÷ ✏️✏️✏️\n= ?", "✏️", ["✏️✏️✏️✏️", "✏️✏️✏️", "✏️✏️"]],
            ["Resolva corretamente a divisão de\n📏📏📏📏📏📏 ÷ 📏📏📏\n= ?", "📏📏", ["📏📏📏", "📏", "📏📏📏📏"]],
            ["Resolva corretamente a divisão de\n🖌️🖌️🖌️🖌️ ÷ 🖌️🖌️\n= ?", "🖌️🖌️", ["🖌️", "🖌️🖌️🖌️🖌️", "🖌️🖌️🖌️"]],
            ["Resolva corretamente a divisão de\n🖋️🖋️🖋️ ÷ 🖋\n= ?️", "🖋️🖋️🖋️", ["🖋️🖋️🖋️🖋️", "🖋️🖋️", "🖋️"]],
            ["Calcule a divisão de\n📐📐📐📐📐📐📐📐 ÷ 📐📐\n= ?", "📐📐📐📐", ["📐", "📐📐", "📐📐📐"]],
            ["Calcule a divisão de\n📖📖 ÷ 📖📖\n= ?", "📖", ["📖📖📖", "📖📖📖📖", "📖📖"]],
            ["Calcule a divisão de\n✂️✂️✂️✂️✂️✂️ ÷ ✂️✂️\n= ?", "✂️✂️✂️", ["✂️", "✂️✂️✂️", "✂️✂️✂️✂️"]],
            ["Calcule a divisão de\n🎥🎥🎥🎥🎥🎥 ÷ 🎥🎥🎥\n= ?", "🎥🎥", ["🎥🎥🎥🎥", "🎥🎥", "🎥"]],
            // OBJETOS E NÚMEROS
            ["Resolva corretamente a divisão de\n✏️️✏️✏️ ÷ ✏️✏️✏️ = ?\n3 ÷ 3 = ?", "✏️\n1", ["✏️✏️✏️✏️\n4", "✏️✏️✏️\n3", "✏️✏️\n2"]],
            ["Resolva corretamente a divisão de\n📏📏📏📏📏📏 ÷ 📏📏📏 = ?\n6 ÷ 3 = ?", "📏📏\n2", ["📏📏📏\n3", "📏\n1", "📏📏📏📏\n4"]],
            ["Resolva corretamente a divisão de\n🖌️🖌️🖌️🖌️ ÷ 🖌️🖌️ = ?\n4 ÷ 2 = ?", "🖌️🖌️\n2", ["🖌️\n1", "🖌️🖌️🖌️🖌️\n4", "🖌️🖌️🖌️\n3"]],
            ["Resolva corretamente a divisão de\n🖋️🖋️🖋️ ÷ 🖋️ = ?\n 3 ÷ 1 = ?", "🖋️🖋️🖋️\n3", ["🖋️🖋️🖋️🖋️\n4", "🖋️🖋️\n2", "🖋️\n1"]],
            ["Calcule a divisão de\n📐📐📐📐📐📐📐📐 ÷ 📐📐 = ?\n8 ÷ 2 = ?", "📐📐📐📐\n4", ["📐\n1", "📐📐\n2", "📐📐📐\n3"]],
            ["Calcule a divisão de\n📖📖 ÷ 📖📖 = ?\n2 ÷ 2 = ?", "📖\n1", ["📖📖📖\n3", "📖📖📖📖\n4", "📖📖\n2"]],
            ["Calcule a divisão de\n✂️✂️✂️✂️✂️✂️ ÷ ✂️✂️ = ?\n6 ÷ 2 = ?", "✂️✂️✂️\n3", ["✂️\n1", "✂️✂️\n2", "✂️✂️✂️✂️\n4"]],
            ["Calcule a divisão de\n🎥🎥🎥🎥🎥🎥 ÷ 🎥🎥🎥 = ?\n6 ÷ 3 = ?", "🎥🎥\n2", ["🎥🎥🎥🎥\n4", "🎥🎥🎥\n2", "🎥\n1"]],
            // APENAS NÚMEROS
            ["Resolva corretamente a divisão de\n4 ÷ 2\n= ?", "2", ["3", "4", "5"]],
            ["Resolva corretamente a divisão de\n8 ÷ 2\n= ?", "4", ["3", "5", "2"]],
            ["Resolva corretamente a divisão de\n6 ÷ 6\n= ?", "1", ["4", "3", "6"]],
            ["Resolva corretamente a divisão de\n6 ÷ 3\n= ?", "2", ["3", "5", "1"]],
            ["Calcule a divisão de\n8 ÷ 2\n= ?", "4", ["3", "5", "1"]],
            ["Calcule a divisão de\n6 ÷ 3\n= ?", "2", ["1", "3", "4"]],
            ["Calcule a divisão de\n3 ÷ 3\n= ?", "1", ["3", "2", "4"]],
            ["Calcule a divisão de\n4 ÷ 2\n= ?", "2", ["4", "3", "1"]],
        ];
    }
}
