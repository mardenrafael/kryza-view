FROM node:22.11.0-alpine AS builder

WORKDIR /app

COPY package.json ./

RUN npm install
COPY . .


RUN npm run build

FROM node:22.11.0-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/package.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma/migrations ./prisma/migrations
COPY --from=builder /app/dist/src ./src/
COPY --from=builder /app/prisma/schema.prisma ./prisma/schema.prisma

RUN npm install --only=production
RUN npx prisma generate


EXPOSE 3000
CMD ["npm", "run", "start"]