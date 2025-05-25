#!/bin/bash

echo "🔗 Connecting to EventHub Database..."
echo "Available connection methods:"
echo "1. Docker container (recommended)"
echo "2. Local PostgreSQL"
echo "3. Connection string"
echo ""

read -p "Choose method (1-3): " method

case $method in
    1)
        echo "Connecting via Docker container..."
        docker exec -it postgres-loginapp psql -U postgres -d loginapp
        ;;
    2)
        echo "Connecting to local PostgreSQL..."
        PGPASSWORD=password psql -h localhost -p 5432 -U postgres -d loginapp
        ;;
    3)
        echo "Connecting via connection string..."
        psql "postgresql://postgres:password@localhost:5432/loginapp"
        ;;
    *)
        echo "Invalid option. Using Docker method..."
        docker exec -it postgres-loginapp psql -U postgres -d loginapp
        ;;
esac 