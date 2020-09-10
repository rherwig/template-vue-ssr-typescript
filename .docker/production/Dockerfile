FROM node:14

WORKDIR /app
EXPOSE 8080
CMD ["npm", "start"]

COPY package* ./
RUN npm ci
COPY . .
