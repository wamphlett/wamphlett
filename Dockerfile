# FROM debian:latest AS build

# # Install flutter dependencies
# RUN apt-get update 
# RUN apt-get install -y curl git wget zip unzip libgconf-2-4 gdb libstdc++6 libglu1-mesa fonts-droid-fallback lib32stdc++6 python3 sed
# RUN apt-get clean

# # Get Flutter
# RUN git clone https://github.com/flutter/flutter.git /usr/local/flutter

# # Run flutter doctor and add to path
# ENV PATH="/usr/local/flutter/bin:/usr/local/flutter/bin/cache/dart-sdk/bin:${PATH}"
# RUN flutter doctor -v

# # Enable flutter web
# RUN flutter channel master
# RUN flutter upgrade

# # Copy files to the container and build
# RUN mkdir /usr/local/wamphlett
# COPY . /usr/local/wamphlett
# WORKDIR /usr/local/wamphlett
# RUN /usr/local/flutter/bin/flutter build web

# Start a new Caddy container and copy the build files to the web root
FROM caddy
COPY ./Caddyfile /etc/caddy/Caddyfile
COPY ./build/web /srv/wamphlett