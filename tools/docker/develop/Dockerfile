FROM node:18.1.0-alpine3.15
RUN apk --no-cache add tzdata && \
    cp /usr/share/zoneinfo/Asia/Tokyo /etc/localtime && \
    apk del tzdata
WORKDIR /prj/projects/smartball