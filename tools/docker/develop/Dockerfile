FROM node:18.1.0-alpine3.15
RUN apk --no-cache add tzdata && \
    cp /usr/share/zoneinfo/Asia/Tokyo /etc/localtime && \
    apk del tzdata
RUN npm install -g npm@8.12.1
RUN npm install -g @akashic/akashic-cli
WORKDIR /prj/projects/smartball