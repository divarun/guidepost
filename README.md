# Guidepost
College application platform that guides parents and students


## 🚀 Quick Start Guide

1. Install Dependencies
``` bash  
cd guidepost
npm install
   ``` 
2. Set Up Database

``` bash
# Copy environment variables
   cp .env.example .env

# Edit .env with your PostgreSQL credentials
# DATABASE_URL="postgresql://user:password@localhost:5432/guidepost"

# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed database
npm run db:seed

```
3. Set Up Ollama
```bash
# Install Ollama
curl https://ollama.ai/install.sh | sh

# Pull model
ollama pull llama3

# Start Ollama (runs in background)
ollama serve
```
4. Run Development Server

```bash 
npm run dev
```
Visit http://localhost:3000
