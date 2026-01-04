#!/bin/bash
# OpenVenture Clean Room Test Script
# Tests that the project can be built and run from a fresh environment

set -e

echo "============================================"
echo "OpenVenture Clean Room Test"
echo "============================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Docker is available
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Error: Docker is not installed${NC}"
    exit 1
fi

# Check if GEMINI_API_KEY is set
if [ -z "$GEMINI_API_KEY" ]; then
    echo -e "${YELLOW}Warning: GEMINI_API_KEY not set. Content generation will fail.${NC}"
fi

echo ""
echo "Step 1: Building Docker image..."
echo "--------------------------------------------"
docker build -t openventure-test . --no-cache

echo ""
echo -e "${GREEN}Step 1 Complete: Docker image built successfully${NC}"

echo ""
echo "Step 2: Running container..."
echo "--------------------------------------------"
CONTAINER_ID=$(docker run -d -p 3000:3000 openventure-test)
echo "Container ID: $CONTAINER_ID"

# Wait for server to start
echo "Waiting for server to start..."
sleep 10

echo ""
echo "Step 3: Testing endpoints..."
echo "--------------------------------------------"

# Test homepage
echo -n "Testing homepage (/)... "
if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/ | grep -q "200"; then
    echo -e "${GREEN}OK${NC}"
else
    echo -e "${RED}FAILED${NC}"
    docker stop $CONTAINER_ID
    docker rm $CONTAINER_ID
    exit 1
fi

# Test blog page
echo -n "Testing blog page (/blog)... "
if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/blog | grep -q "200"; then
    echo -e "${GREEN}OK${NC}"
else
    echo -e "${RED}FAILED${NC}"
    docker stop $CONTAINER_ID
    docker rm $CONTAINER_ID
    exit 1
fi

# Test about page
echo -n "Testing about page (/about)... "
if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/about | grep -q "200"; then
    echo -e "${GREEN}OK${NC}"
else
    echo -e "${RED}FAILED${NC}"
    docker stop $CONTAINER_ID
    docker rm $CONTAINER_ID
    exit 1
fi

echo ""
echo "Step 4: Cleanup..."
echo "--------------------------------------------"
docker stop $CONTAINER_ID
docker rm $CONTAINER_ID

echo ""
echo "============================================"
echo -e "${GREEN}All tests passed!${NC}"
echo "============================================"
