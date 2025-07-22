#!/bin/sh

# entrypoint.sh

# Remove o arquivo 'public/hot' para garantir que o Laravel/Vite opere em modo de produção.
# Este arquivo é criado pelo servidor de desenvolvimento do Vite e causa problemas em produção.
rm -f public/hot

# Exporta variáveis de ambiente (opcional, o bloco 'environment' do Docker Compose já lida com DB_HOST)
export DB_CONNECTION=pgsql
export DB_HOST=db
export DB_PORT=5432
export DB_DATABASE=${DB_DATABASE}
export DB_USERNAME=${DB_USERNAME}
export DB_PASSWORD=${DB_PASSWORD}

# Espera o PostgreSQL estar pronto
echo "Waiting for PostgreSQL to be ready..."
until pg_isready -h db -p 5432 -U ${DB_USERNAME}; do
  echo "PostgreSQL is unavailable - sleeping"
  sleep 1
done
echo "PostgreSQL is up and running!"

# Executa as migrações do Laravel.
# Alterado: migrate:fresh para migrate. Não apagamos dados de produção.
echo "Running Laravel migrations..."
php artisan migrate --seed --force

# Nota: Se você precisar de seeding em produção, use php artisan migrate --seed --force
# Se o seeding for feito, certifique-se de que os seeders são seguros para produção.

# Limpa e faz cache das configurações para otimização de produção.
echo "Optimizing Laravel configuration and routes..."
php artisan optimize:clear
php artisan config:cache
php artisan route:cache

# Executa o comando principal do contêiner (php-fpm neste caso)
exec php-fpm
