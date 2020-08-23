FROM debian:buster
RUN apt-get update
RUN apt-get -y install nginx
WORKDIR /var/www/html/
EXPOSE 80/tcp
COPY . .
CMD ["nginx", "-g", "daemon off;"]