# Step 1: Use an official Node.js image from Docker Hub
FROM node:18-alpine

# Step 2: Set working directory inside the container (where your app's files will live)
WORKDIR /clash

# Step 3: Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Step 4: Install the dependencies defined in package.json
RUN npm install

# Step 5: Copy all the other files from your local machine to the container
COPY . .

# Step 6: Expose port 3000 (the port that Next.js runs on)
EXPOSE 3000

# Step 7: Start the app when the container runs
CMD ["npm", "run", "dev"]
