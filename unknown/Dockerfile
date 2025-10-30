FROM node:22-alpine

WORKDIR /app

COPY .. /app/

RUN npm install

RUN node seed.js

RUN node index.js

EXPOSE 5000

CMD ["node", "index.js"]