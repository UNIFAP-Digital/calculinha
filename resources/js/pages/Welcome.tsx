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
      <div className="flex min-h-screen flex-col items-center justify-between bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4 text-gray-800 lg:p-6 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950">
        <header className="animate-fade-in w-full max-w-6xl text-center pt-2 sm:pt-4 lg:pt-6">
          <div className="mb-1 flex justify-center sm:mb-2 lg:mb-3">
            <img 
              src="/favicon.ico" 
              alt="Logo Calculinha" 
              className="h-10 w-10 transition-transform duration-700 hover:rotate-6 sm:h-14 sm:w-14 lg:h-16 lg:w-16" 
            />
          </div>
          <h1 className="font-fredoka mb-0.5 text-2xl font-bold text-blue-600 sm:mb-1 sm:text-3xl lg:mb-2 lg:text-4xl dark:text-blue-400">
            Calculinha
          </h1>
          <p className="font-nunito text-base text-gray-600 sm:text-lg lg:text-xl dark:text-gray-300">
            Escolha seu perfil para continuar
          </p>
        </header>

        {/* Container principal dos cards */}
        <div className="flex w-full max-w-5xl flex-col justify-center gap-4 py-2 sm:gap-6 md:flex-row md:gap-4 lg:gap-8 xl:gap-10">
          {/* Card "Sou Aluno" */}
          <div className="card-profile overflow-hidden animate-fade-in overmodule-hidden flex w-full max-w-md flex-col rounded-xl bg-white shadow-md transition-all duration-500 hover:-translate-y-1 hover:shadow-xl dark:bg-gray-800">
            <div className="relative ">
              {/* Imagem de fundo do card de aluno */}
              <div className="overmodule-hidden h-32 bg-gradient-to-br from-blue-400 via-indigo-400 to-purple-500 sm:h-36 lg:h-40">
                {/* Elementos matemáticos decorativos */}
                <div className="absolute h-full w-full">
                  <span className="animate-wiggle absolute top-3 left-3 text-xl font-bold text-white/30 sm:top-4 sm:left-4 sm:text-2xl lg:top-6 lg:left-6 lg:text-3xl">+</span>
                  <span className="animate-float absolute top-6 right-6 text-2xl font-bold text-white/30 sm:top-8 sm:right-8 sm:text-3xl lg:top-10 lg:right-10 lg:text-4xl">÷</span>
                  <span className="animate-bounce-slow absolute bottom-2 left-10 text-2xl font-bold text-white/30 sm:bottom-3 sm:left-12 sm:text-3xl lg:bottom-4 lg:left-16 lg:text-4xl">×</span>
                  <span className="absolute right-4 bottom-4 animate-pulse text-xl font-bold text-white/30 sm:right-6 sm:bottom-6 sm:text-2xl lg:right-8 lg:bottom-8 lg:text-3xl">−</span>
                  <span className="animate-ping-slow absolute top-10 left-16 text-xl font-bold text-white/30 sm:top-12 sm:left-20 sm:text-2xl lg:top-14 lg:left-24 lg:text-3xl">=</span>
                </div>

                <div className="relative flex h-full w-full items-center justify-center mix-blend-luminosity">
                  
                  <div className="relative h-full w-full items-center justify-center  bg-white">
                    <img src="/material/math_elements.png" alt="Joystick" className="object-cover h-full w-full object-center" />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-1 flex-col p-3 text-center sm:p-4 lg:p-6">
              <h2 className="font-fredoka mb-1.5 text-lg font-bold text-blue-600 sm:mb-2 sm:text-xl lg:mb-3 lg:text-2xl dark:text-blue-400">
                Sou Aluno
              </h2>
              <p className="mb-3 flex-1 text-sm text-gray-600 sm:mb-4 sm:text-base lg:mb-5 dark:text-gray-300">
                Vamos jogar e aprender matemática juntos! Embarque nessa aventura divertida com a Calcuinha.
              </p>
              <Link
                href={route('invite')}
                className="btn-primary group focus:ring-opacity-50 inline-block w-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 px-3 py-1.5 text-sm font-bold text-white shadow-md transition-all duration-300 hover:shadow-lg hover:shadow-blue-300/50 focus:ring-2 focus:ring-blue-400 focus:outline-none sm:px-4 sm:py-2 lg:px-5 lg:py-2.5 dark:hover:shadow-blue-900/50"
                aria-label="Entrar como aluno"
              >
                <span className="flex items-center justify-center transition-transform group-hover:translate-x-1">
                  <svg className="mr-1.5 h-4 w-4 transition-transform group-hover:scale-110 sm:h-4 sm:w-4 lg:h-5 lg:w-5" viewBox="0 0 20 20" fill="currentColor">
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
          <div className="card-profile overflow-hidden animate-fade-in-delay overmodule-hidden flex w-full max-w-md flex-col rounded-sm bg-white transition-all duration-500 hover:-translate-y-1 hover:shadow-xl dark:bg-gray-800">
            <div className="relative">
              {/* Imagem de fundo do card de professor */}
              <div className="overmodule-hidden h-32 bg-gradient-to-r from-blue-700 to-indigo-800 sm:h-36 lg:h-40">
                <div className="absolute h-full w-full">
                  {/* Grade sutil de fundo */}
                  <div className="bg-grid-pattern absolute inset-0 opacity-10"></div>
                </div>

                <div className="relative flex h-full w-full items-center justify-center">
                  {/* Ícone de professor - chapéu de formatura */}
                  <div className="relative h-16 w-16 rounded-lg transition-transform duration-300 hover:-translate-y-1 sm:h-20 sm:w-20 lg:h-24 lg:w-24">
                    <img src="material/toga.png" className="h-10 w-10 object-contain sm:h-12 sm:w-12 lg:h-16 lg:w-16" alt="toga" />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-1 flex-col p-3 text-center sm:p-4 lg:p-6">
              <h2 className="mb-1.5 text-lg font-bold text-blue-800 sm:mb-2 sm:text-xl lg:mb-3 lg:text-2xl dark:text-blue-400">
                Sou Professor
              </h2>
              <p className="font-nunito mb-3 text-sm text-gray-600 sm:mb-4 sm:text-base lg:mb-5 dark:text-gray-300">
                Acesse o painel de controle para gerenciar turmas, criar quizzes e acompanhar o progresso dos seus alunos.
              </p>
              <Link
                href={route('login')}
                className="btn-secondary group focus:ring-opacity-50 inline-block w-full rounded-md bg-blue-700 px-3 py-1.5 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:bg-blue-800 focus:ring-2 focus:ring-blue-500 focus:outline-none sm:px-4 sm:py-2 lg:px-5 lg:py-2.5"
                aria-label="Entrar como professor"
              >
                <span className="flex items-center justify-center transition-transform group-hover:translate-x-1">
                  <svg className="mr-1.5 h-4 w-4 sm:h-4 sm:w-4 lg:h-5 lg:w-5" viewBox="0 0 20 20" fill="currentColor">
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
        <footer className="font-nunito animate-fade-in-delay-long text-center text-xs text-gray-500 py-2 sm:py-3 lg:py-4 dark:text-gray-400">
          <p>© {new Date().getFullYear()} Calcuinha - Transformando o aprendizado de matemática em diversão</p>
          <a href="https://www.flaticon.com/free-stickers/homework" title="homework stickers" className="text-[10px] sm:text-xs">
            Imagem do site Stickers - Flaticon
          </a>
        </footer>
      </div>
    </>
  )
}
