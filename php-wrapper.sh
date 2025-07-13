#!/bin/sh

# Build new argument list without -d flag and its value
new_args=""
skip_next=0

for arg in "$@"; do
    if [ "$skip_next" = "1" ]; then
        skip_next=0
        continue
    fi
    
    if [ "$arg" = "-d" ]; then
        skip_next=1
        continue
    fi
    
    # Add argument to new list (with proper quoting)
    if [ -z "$new_args" ]; then
        new_args="$arg"
    else
        new_args="$new_args $arg"
    fi
done

# Execute frankenphp with filtered arguments
eval "set -- $new_args"
/usr/local/bin/frankenphp php-cli "$@"