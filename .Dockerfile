FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ARG COMMUNITY_API_KEY

ENV COMMUNITY_API_KEY=${COMMUNITY_API_KEY}

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
