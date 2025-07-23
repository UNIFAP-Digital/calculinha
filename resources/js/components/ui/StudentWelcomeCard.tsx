"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Sparkles, Star, Heart } from "lucide-react"
import { Link } from "@inertiajs/react"

type StudentCardProps = {
  href: string;
}

const StudentWelcomeCard: React.FC<StudentCardProps> = ({ href }) => {

  return (
    <Link href={href}>
      <Card
        className="relative overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2 border-0 bg-gradient-to-br from-white to-blue-50 cursor-pointer group"      >
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400" />

        <CardContent className="p-8">
          <div className="text-center mb-6">
            <div className="relative mb-6">
              <div className="w-full h-72 bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 rounded-2xl flex items-center justify-center relative overflow-hidden group-hover:scale-[1.02] transition-transform duration-500">
                {/* Elementos matemáticos decorativos de fundo */}
                <div className="absolute inset-0">
                  <span className="absolute top-6 left-6 text-3xl font-bold text-white/30 animate-bounce">+</span>
                  <span className="absolute top-8 right-8 text-4xl font-bold text-white/30 animate-pulse">÷</span>
                  <span
                    className="absolute bottom-6 left-10 text-3xl font-bold text-white/30 animate-bounce"
                    style={{ animationDelay: "0.5s" }}
                  >
                    ×
                  </span>
                  <span
                    className="absolute bottom-8 right-6 text-2xl font-bold text-white/30 animate-pulse"
                    style={{ animationDelay: "1s" }}
                  >
                    −
                  </span>
                  <span
                    className="absolute top-16 left-1/2 text-2xl font-bold text-white/30 animate-bounce"
                    style={{ animationDelay: "1.5s" }}
                  >
                    =
                  </span>
                </div>

                {/* Círculo mágico de fundo */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-56 h-56 bg-white/20 rounded-full backdrop-blur-sm border-2 border-white/40 animate-pulse"></div>
                </div>

                {/* Avatar Principal - Unicórnio */}
                <div className="relative z-10 avatar-container">
                  <div className="relative">
                    {/* Halo mágico */}
                    <div className="absolute -inset-4 bg-gradient-to-r from-pink-300 via-purple-300 to-blue-300 rounded-full opacity-30 animate-ping"></div>

                    {/* Container do avatar */}
                    <div className="relative w-32 h-32 bg-white rounded-full p-4 shadow-2xl hover:shadow-3xl transition-all duration-500 group-hover:scale-110 animate-float">
                      <img
                        src="/unicorn-avatar.png"
                        alt="Imagem de um unicórnio mágico"
                        className="w-full h-full object-contain"
                      />
                    </div>

                    {/* Sparkles ao redor */}
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-pink-400 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 animate-bounce">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div
                      className="absolute -bottom-2 -left-2 w-6 h-6 bg-purple-400 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    >
                      <Star className="w-3 h-3 text-white fill-current" />
                    </div>
                    <div
                      className="absolute top-2 -left-4 w-5 h-5 bg-blue-400 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 animate-bounce"
                      style={{ animationDelay: "0.4s" }}
                    >
                      <Heart className="w-2 h-2 text-white fill-current" />
                    </div>

                    {/* Nome do personagem */}
                    <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-pink-100 to-purple-100 px-4 py-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <span className="text-sm font-bold text-purple-700">Luna ✨</span>
                    </div>

                    {/* Balão de fala */}
                    <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-2xl shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 border-2 border-pink-200">
                      <span className="text-xs font-medium text-gray-700">Vamos aprender juntos!</span>
                      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
                    </div>
                  </div>
                </div>

                {/* Partículas mágicas flutuantes */}
                <div className="absolute inset-0 pointer-events-none">
                  <div
                    className="absolute top-12 left-12 w-3 h-3 bg-pink-300 rounded-full animate-ping"
                    style={{ animationDelay: "0s" }}
                  ></div>
                  <div
                    className="absolute top-20 right-16 w-2 h-2 bg-purple-300 rounded-full animate-ping"
                    style={{ animationDelay: "1s" }}
                  ></div>
                  <div
                    className="absolute bottom-16 left-20 w-2.5 h-2.5 bg-blue-300 rounded-full animate-ping"
                    style={{ animationDelay: "2s" }}
                  ></div>
                  <div
                    className="absolute bottom-12 right-12 w-3 h-3 bg-yellow-300 rounded-full animate-ping"
                    style={{ animationDelay: "0.5s" }}
                  ></div>
                  <div
                    className="absolute top-1/2 left-8 w-1.5 h-1.5 bg-green-300 rounded-full animate-ping"
                    style={{ animationDelay: "1.5s" }}
                  ></div>
                  <div
                    className="absolute top-1/2 right-8 w-2 h-2 bg-orange-300 rounded-full animate-ping"
                    style={{ animationDelay: "2.5s" }}
                  ></div>
                </div>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-blue-600 mb-4 font-fredoka">Sou Aluno! 🎮</h2>
            <p className="text-gray-600 mb-8 font-nunito text-lg">
              Oi! Eu sou a Luna, seu unicórnio mágico! Vamos embarcar juntos numa aventura incrível pelo mundo da
              matemática! Prepare-se para descobrir a magia dos números! 🦄✨
            </p>

            <Button
              className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 hover:from-pink-600 hover:via-purple-600 hover:to-blue-600 text-white font-bold py-4 px-8 rounded-2xl text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 font-nunito"
              disabled
            >
              <span className="mr-2">🦄</span>
              Começar a Aventura com Luna!
              <span className="ml-2">✨</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

export default StudentWelcomeCard
