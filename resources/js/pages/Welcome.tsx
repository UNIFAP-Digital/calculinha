import { Head, Link } from '@inertiajs/react'
import '../../css/welcome.css'
import VLibras from '@/components/vlibras/vlibras'

export default function Welcome() {
  return (
    <>
      <Head title="Bem-vindo à Calculinha">
        <link rel="preconnect" href="https://fonts.bunny.net" />
        <link href="https://fonts.bunny.net/css?family=fredoka:400,500,600|nunito:400,500,600,700" rel="stylesheet" />
      </Head>
      <div className="flex min-h-screen flex-col items-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6 text-gray-800 lg:justify-center lg:p-8 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950">
        <header className="animate-fade-in mb-8 w-full max-w-6xl text-center">
          <div className="mb-4 flex justify-center">
            <img src="/favicon.ico" alt="Logo Calculinha" className="h-20 transition-transform duration-700 hover:rotate-6" />
          </div>
          <h1 className="font-fredoka mb-2 text-4xl font-bold text-blue-600 dark:text-blue-400">Calculinha</h1>
          <p className="font-nunito text-xl text-gray-600 dark:text-gray-300">Escolha seu perfil para continuar</p>
        </header>

        {/* Container principal dos cards */}
        <div className="my-8 flex w-full max-w-5xl flex-col justify-center gap-10 md:flex-row md:gap-10">
          {/* Card "Sou Aluno" */}
          <div className="card-profile animate-fade-in overmodule-hidden flex w-full max-w-md flex-col rounded-xl bg-white shadow-md transition-all duration-500 hover:-translate-y-1 hover:shadow-xl dark:bg-gray-800">
            <div className="relative">
              {/* Imagem de fundo do card de aluno */}
              <div className="overmodule-hidden h-52 bg-gradient-to-br from-blue-400 via-indigo-400 to-purple-500">
                {/* Elementos matemáticos decorativos */}
                <div className="absolute h-full w-full">
                  <span className="animate-wiggle absolute top-8 left-6 text-4xl font-bold text-white/30">+</span>
                  <span className="animate-float absolute top-12 right-12 text-5xl font-bold text-white/30">÷</span>
                  <span className="animate-bounce-slow absolute bottom-4 left-20 text-5xl font-bold text-white/30">×</span>
                  <span className="absolute right-8 bottom-12 animate-pulse text-4xl font-bold text-white/30">−</span>
                  <span className="animate-ping-slow absolute top-20 left-32 text-3xl font-bold text-white/30">=</span>
                </div>

                <div className="relative flex h-full w-full items-center justify-center">
                  {/* Ícone de jogo para alunos */}
                  <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-white shadow-lg transition-transform hover:scale-105 hover:rotate-6">
                    <img src="/material/blackboard.png" alt="Joystick" />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-1 flex-col p-8 text-center">
              <h2 className="font-fredoka mb-4 text-3xl font-bold text-blue-600 dark:text-blue-400">Sou Aluno</h2>
              <p className="mb-6 flex-1 font-sans text-gray-600 dark:text-gray-300">
                Vamos jogar e aprender matemática juntos! Embarque nessa aventura divertida com a Calcuinha.
              </p>
              <Link
                href={route('invite')}
                className="btn-primary group focus:ring-opacity-50 inline-block w-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-3 font-bold text-white shadow-md transition-all duration-300 hover:shadow-lg hover:shadow-blue-300/50 focus:ring-2 focus:ring-blue-400 focus:outline-none dark:hover:shadow-blue-900/50"
                aria-label="Entrar como aluno"
              >
                <span className="flex items-center justify-center transition-transform group-hover:translate-x-1">
                  <svg className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Começar a Jogar!
                </span>
              </Link>
            </div>
          </div>

          {/* Card "Sou Professor" */}
          <div className="card-profile animate-fade-in-delay overmodule-hidden flex w-full max-w-md flex-col rounded-xl bg-white shadow-md transition-all duration-500 hover:-translate-y-1 hover:shadow-xl dark:bg-gray-800">
            <div className="relative">
              {/* Imagem de fundo do card de professor */}
              <div className="overmodule-hidden h-52 bg-gradient-to-r from-blue-700 to-indigo-800">
                <div className="absolute h-full w-full">
                  {/* Grade sutil de fundo */}
                  <div className="bg-grid-pattern absolute inset-0 opacity-10"></div>
                </div>

                <div className="relative flex h-full w-full items-center justify-center">
                  {/* Ícone de professor - chapéu de formatura */}
                  <div className="relative h-32 w-32 rounded-lg transition-transform duration-300 hover:-translate-y-1">
                    <img src="material/toga.png" className="object-contain" alt="toga" />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-1 flex-col p-8 text-center">
              <h2 className="mb-4 text-3xl font-bold text-blue-800 dark:text-blue-400">Sou Professor</h2>
              <p className="font-nunito mb-6 flex-1 text-gray-600 dark:text-gray-300">
                Acesse o painel de controle para gerenciar turmas, criar quizzes e acompanhar o progresso dos seus alunos.
              </p>
              <Link
                href={route('login')}
                className="btn-secondary group focus:ring-opacity-50 inline-block w-full rounded-md bg-blue-700 px-6 py-3 font-semibold text-white shadow-md transition-all duration-300 hover:bg-blue-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                aria-label="Entrar como professor"
              >
                <span className="flex items-center justify-center transition-transform group-hover:translate-x-1">
                  <svg className="mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Acessar Painel
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* Rodapé da página */}
        <footer className="font-nunito animate-fade-in-delay-long mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>© {new Date().getFullYear()} Calcuinha - Transformando o aprendizado de matemática em diversão</p>
          <a href="https://www.flaticon.com/free-stickers/homework" title="homework stickers" className="text-xs">
            Imagem do site Stickers - Flaticon
          </a>
        </footer>
      </div>
    </>
  )
}
