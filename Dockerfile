FROM node:18.12.1-buster

RUN apt-get update

RUN apt-get install -y \
    qpdf jq

# COPY package.json /
# RUN npm install

CMD ["bash"]