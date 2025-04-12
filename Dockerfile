FROM node

WORKDIR /app

COPY package*.json ./
COPY prisma/schema.prisma ./prisma/
COPY .env.production .

RUN npm install --force

RUN npx prisma generate --schema=prisma/schema.prisma

COPY . .

RUN npm run build

EXPOSE 80

CMD ["npm", "start"]
