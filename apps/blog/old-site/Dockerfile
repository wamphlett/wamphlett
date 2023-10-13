FROM node:13.12.0-alpine as builder
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json ./
COPY package-lock.json ./
RUN npm ci --silent
RUN npm install react-scripts@3.4.1 -g --silent
COPY . ./
RUN npm run build

# Start a new Caddy container and copy the build files to the web root
FROM caddy
COPY ./Caddyfile /etc/caddy/Caddyfile
COPY --from=builder /app/build /srv/blog