FROM node:22.11.0-alpine

WORKDIR /app

ENV NODE_ENV=development

COPY package.json ./
COPY package-lock.json ./
RUN npm install

COPY . .

EXPOSE 3000
CMD ["npm", "run", "dev"]