FROM node:14

MAINTAINER Rico Herwig <rherwig4711@gmail.com>

WORKDIR /app

COPY . .

RUN npm ci

EXPOSE 8080
EXPOSE 9229

CMD ["npm", "start"]
