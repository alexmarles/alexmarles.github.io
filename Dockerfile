FROM node:argon

# Bundle app source
RUN mkdir -p /srv/www/alexmarles
WORKDIR /srv/www/alexmarles
COPY app/ .
