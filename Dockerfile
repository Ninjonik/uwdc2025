FROM node

WORKDIR /app

COPY package*.json ./

RUN npm install --force

#RUN npx prisma generate --schema=./prisma/schema.prisma

COPY . .

RUN npm run build

EXPOSE 80
EXPOSE 3000

RUN npm run start

CMD ["npm", "start"]
