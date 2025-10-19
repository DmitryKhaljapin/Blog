FROM node:22-alpine
WORKDIR /opt/app
ADD package.json package.json
RUN npm install
ADD . .
RUN npx prisma generate
RUN npm run build
RUN npm prune --production
CMD ["npm", "run", "app"]