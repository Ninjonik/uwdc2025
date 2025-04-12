FROM node

WORKDIR /app

COPY package*.json ./

RUN npm install --force

RUN npx prisma generate

COPY . .

RUN npm run build

EXPOSE 80

CMD ["npm", "start"]
