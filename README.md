# Overview do Projeto
Este é um projeto Full-Stack desenvolvido utilizando o Laravel no backend e o React no frontend. A aplicação utiliza Inertia.js para uma integração perfeita entre as duas partes, permitindo a construção de uma aplicação de página única (SPA) com as rotas e controladores do Laravel. O projeto também incorpora TypeScript para um desenvolvimento seguro e Tailwind CSS para estilização.

Requisitos Locais
Para rodar a aplicação localmente, você precisará ter os seguintes requisitos instalados:

PHP (Versão 8.2 ou superior recomendada)

Composer

Node.js (e npm ou yarn)

Banco de Dados (MySQL, PostgreSQL ou SQLite)

# Instalação e Execução (Desenvolvimento)
Siga os passos abaixo para configurar e rodar a aplicação em seu ambiente de desenvolvimento.

1. Configuração do Ambiente
Crie uma cópia do arquivo de exemplo .env e configure suas variáveis de ambiente, incluindo as credenciais do banco de dados e a chave da aplicação:

cp .env.example .env
php artisan key:generate

2. Instalação das Dependências
Instale as dependências do PHP e do JavaScript:

Instale as dependências do Laravel com o Composer:

composer install

Instale as dependências do Node.js (incluindo o React e o Inertia) usando yarn:

yarn install

3. Configuração do Banco de Dados
Rode as migrações para configurar o banco de dados:

php artisan migrate

4. Execução da Aplicação
Inicie o servidor de desenvolvimento do frontend (Vite) e do backend (Laravel):

Inicie o servidor Vite para compilar os assets e habilitar o hot reload:

yarn dev

Em um terminal separado, inicie o servidor do Laravel:

php artisan serve

A aplicação estará disponível em http://127.0.0.1:8000.

# Execução em Produção (Docker)
Neccesário adicionar env.prod

O projeto é containerizado usando Docker e Docker Compose, o que facilita a execução em ambientes de produção. Certifique-se de ter o Docker instalado e rodando em sua máquina.

Construa e inicie os containers da aplicação, do banco de dados e do Nginx:

docker-compose up --build -d

Após os containers subirem a aplicação deve estar acessível em http://localhost:8000.
