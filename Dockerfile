FROM node:21-alpine

LABEL maintainer="hchsu"

RUN apk add git python3 zlib build-base libsodium libsodium-dev libtool autoconf automake --no-cache && \
    git clone https://github.com/hhhhhojeihsu/gidis.git && \
    cd gidis && \
    ln -s /config/config.json config.json && \
    npm install && \
    apk del python3 build-base autoconf automake

VOLUME ["/config"]

CMD cd gidis && git pull --no-rebase && while npm start; sleep 300; do :; done;

