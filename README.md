# Multi-DB Demo Application

## Overview

This application demonstrates the use of **MongoDB**, **Redis**, and **Neo4j** in a modern Node.js/React web application. It features product management, user authentication/session handling, order analytics, and a simple user social network.

## Features

- Product CRUD and analytics (MongoDB)
- User authentication and session management (Redis)
- User social relationships and recommendations (Neo4j)
- Aggregation queries and dashboard

## Tech Stack

- **Frontend:** React
- **Backend:** Node.js + Express
- **Databases:** MongoDB, Redis, Neo4j
- **Containerization:** Docker, Docker Compose

## Prerequisites

- Docker and Docker Compose installed
- Node.js and npm (for local development)
- [Optional] Neo4j Desktop for visualizing data

## Setup Instructions

1. **Clone the repository:**
    ```bash
    git clone https://github.com/nmc2112/nosql_project.git
    ```

2. **Configure environment variables:**
    - Copy `.env.example` to `.env` (if available), or ensure Docker Compose env variables are set correctly (see `docker-compose.yml`).

3. **Start all services using Docker Compose:**
    ```bash
    docker-compose up --build
    ```

    This will start:
    - `frontend` (React on http://localhost:3000)
    - `backend` (API server on http://localhost:4000)
    - `mongodb` (data storage)
    - `redis` (caching & session)
    - `neo4j` (graph database)

4. **Access the application:**
    - Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Seed initial data (optional):**
    - Insert product, user, and order data using provided scripts, or by using the frontend/admin API endpoints.

## Key Endpoints

- `GET /api/mongo/item` — list all products
- `POST /api/redis/login` — user login (session handled via Redis)
- `GET /api/mongo/top-selling` — get top 5 best-selling products
- `GET /api/mongo/user-spending` — get total spending per user
- `GET /api/neo4j/friends/:userId` — get friends/followers for a user


## Data Seeding

To quickly set up sample data for all databases:

### MongoDB
- Run: `node backend/scripts/seedMongo.js`

### Redis
- Run: `node backend/scripts/seedRedis.js`

### Neo4j
- Open Neo4j Browser (http://localhost:7474)
- Paste & execute all Cypher in `backend/scripts/seedNeo4j.cypher`

