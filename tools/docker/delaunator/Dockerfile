FROM node:17.9-bullseye
# Default powerline10k theme, no plugins installed
RUN sh -c "$(wget -O- https://github.com/deluan/zsh-in-docker/releases/download/v1.1.2/zsh-in-docker.sh)"
RUN npm install --location=global npm@8.12.1
RUN npm install --location=global delaunator
ENV NODE_PATH "/usr/local/lib/node_modules"
WORKDIR /prj/tools/docker/delaunator