# Step 1: Use the official Node.js image as the base
FROM node:16

# Step 2: Set the working directory inside the container
WORKDIR /usr/src/app

# Step 3: Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Step 4: Install Node.js dependencies
RUN npm install

# Step 5: Copy the rest of the application code to the container
COPY . .

# Step 6: Expose the port the app runs on
EXPOSE 3000

# Step 7: Start the application
CMD ["npm", "start"]
