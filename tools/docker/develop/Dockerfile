FROM node:17.9-bullseye
RUN npm install --location=global npm@8.12.1
RUN npm install --location=global @akashic/akashic-cli
# Default powerline10k theme, no plugins installed
RUN sh -c "$(wget -O- https://github.com/deluan/zsh-in-docker/releases/download/v1.1.2/zsh-in-docker.sh)"
WORKDIR /prj/projects/smartball