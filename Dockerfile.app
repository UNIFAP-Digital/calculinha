FROM php:8.3-fpm-alpine AS app_builder

WORKDIR /var/www/html


RUN apk add --no-cache git unzip nodejs npm \
    postgresql-dev postgresql-client \
    && docker-php-ext-install pdo_pgsql

# Install Composer globally by copying from the official Composer image
COPY --from=composer:latest /usr/bin/composer /usr/local/bin/composer

# Copy the entire application code into the builder stage
# This ensures 'artisan' and other files are available for Composer scripts and asset compilation
COPY . .

# Ensure 'artisan' is executable, crucial for Composer's post-autoload-dump scripts
RUN chmod +x artisan

# Copy composer.json and composer.lock before installing dependencies to leverage Docker's build cache
COPY composer.json composer.lock ./
# Install PHP production dependencies (excluding dev dependencies)
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Copy package.json and bun.lock for frontend dependency management
COPY package.json bun.lock ./
# Install Bun globally for efficient frontend dependency management and building
RUN npm install -g bun

# Install Node.js production dependencies using Bun
RUN bun install --frozen-lockfile

# Build frontend assets with Vite for production
# This command is crucial for React/Vite assets to be served correctly by Nginx
RUN bun run build

# Set appropriate permissions for Laravel storage and bootstrap/cache directories
# These directories need to be writable by the web server (www-data user)
RUN chown -R www-data:www-data storage bootstrap/cache public/build \
    && chmod -R 775 storage bootstrap/cache \
    && chmod -R 755 public/build

# Copy the entrypoint script into the container and make it executable
# This is done here as part of the builder stage, but will need to be re-copied
# into the final app image as it's outside the /var/www/html directory.
COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh


# Stage 2: Final PHP-FPM Application Image
# This stage creates the lean PHP-FPM image, copying only the necessary application files
FROM php:8.3-fpm-alpine AS app_final

# Set the working directory
WORKDIR /var/www/html

# Install only the necessary runtime dependencies for the final app image
# postgresql-dev: for pdo_pgsql extension
# postgresql-client: for pg_isready in entrypoint.sh
# pdo_pgsql: PHP extension for PostgreSQL connection
RUN apk add --no-cache postgresql-dev postgresql-client \
    && docker-php-ext-install pdo_pgsql

# Copy only the necessary application files (including compiled assets) from the app_builder stage
COPY --from=app_builder /var/www/html /var/www/html

# Copy the entrypoint script again to the final app image, as it's needed at runtime
COPY --from=app_builder /usr/local/bin/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# Expose port 9000 for PHP-FPM to communicate with Nginx
EXPOSE 9000

# Set the entrypoint to our custom script
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]

# The default command to run after the entrypoint
CMD ["php-fpm"]


# Stage 3: Nginx Service Image
# This stage creates the Nginx image, responsible for serving static assets and proxying PHP requests
FROM nginx:stable-alpine AS nginx_final

# Copy the compiled frontend assets from the 'app_builder' stage
# This ensures Nginx serves the assets that were built within the Docker build process
COPY --from=app_builder /var/www/html/public /var/www/html/public

# Copy the Nginx configuration file into the Nginx container
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 of Nginx for external access
EXPOSE 80

# Default command to start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
