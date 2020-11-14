FROM node:14

ARG DROPBOX_TOKEN=${DROPBOX_TOKEN}
ARG DBS=${DBS}
ARG CONTAINER=${CONTAINER}
ARG USERNAME=${USERNAME}

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

CMD ["npm", "start"]