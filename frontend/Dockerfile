FROM node:18-alpine as builder

WORKDIR /app
COPY package.json yarn.lock ./

RUN yarn

COPY . .

RUN npm run build

FROM nginx:1.23-alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
