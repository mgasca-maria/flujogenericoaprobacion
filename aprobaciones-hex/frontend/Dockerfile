FROM node:18-alpine
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci || npm install
COPY index.html ./
COPY vite.config.js ./
COPY postcss.config.js ./
COPY tailwind.config.js ./
COPY src ./src
COPY src/styles/index.css ./src/styles/index.css
EXPOSE 5173
CMD ["npm","run","dev","--","--host","0.0.0.0"]
