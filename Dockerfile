# Use official Node.js 24 LTS image
FROM node:24

# Author label
LABEL maintainer="kaungmyattnaing" \
      project="MyanmarExchangeRateApi"

# Set working directory
WORKDIR /app

# Copy dependency definitions
COPY package.json package-lock.json* ./

# Install dependencies (production only)
RUN npm ci --only=production || npm install --only=production

# Install PM2 globally
RUN npm install pm2 -g

# Copy app source code
COPY . .

ENV PORT=3000 \
    HOST="0.0.0.0"\
    NODE_ENV="production"\
    JWT_SECRET="e418bf6b497b5e39f7e5466b7f6fb8c9a3e796a1c864ab22696f3cd484cde76c"

# Expose port
EXPOSE 3000

# Start the application with PM2 in foreground
CMD ["pm2-runtime", "index.js"]
