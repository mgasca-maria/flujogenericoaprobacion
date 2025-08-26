FROM node:18-alpine
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev || npm install --omit=dev
COPY src ./src
COPY .env.example .env
EXPOSE 4000
CMD ["node","src/server.js"]
