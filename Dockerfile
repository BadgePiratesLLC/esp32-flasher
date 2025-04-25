FROM nginx:alpine

# Copy custom config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy web app
COPY app /usr/share/nginx/html

# Copy firmware folders
COPY firmware /usr/share/nginx/html/firmware

EXPOSE 80
