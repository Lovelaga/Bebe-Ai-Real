FROM node:18-alpine
WORKDIR /app
RUN apk add --no-cache dumb-init
COPY package*.json ./
RUN npm install
COPY . .
ENV NODE_ENV=production
EXPOSE 3001
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 CMD wget --no-verbose --tries=1 --spider http://localhost:3001/api/health || exit 1
USER node
ENTRYPOINT ["dumb-init", "--"]
CMD ["npm", "start"]
