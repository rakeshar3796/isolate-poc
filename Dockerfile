FROM --platform=linux/amd64 node:18.19-bullseye-slim

RUN apt-get update \
  && apt-get install -y --no-install-recommends \
    locales \
    locales-all \
    libcap-dev \
 && rm -rf /var/lib/apt/lists/*

# Bundle app source
COPY . /isolate
COPY ./default.cf /usr/local/etc/isolate

WORKDIR /isolate

CMD [ "node", "index.js" ]
