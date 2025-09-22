# Project-Work---Deploying-your-API

A backend API for creating and viewing social media posts using Node.js and Express. Data is stored in posts.json.

Features:
	•	Create a post (POST /api/posts)
	•	Required: content, author
	•	Optional: tags (up to 5)
	•	Auto-generated: postId, createdAt, likes, status
	•	Get all posts (GET /api/posts)
	•	Returns all posts sorted by newest first
	•	Handles file errors
	•	CORS enabled

Project Structure:
	•	data/posts.json
	•	server.js
	•	package.json
	•	README.md

Run Locally:
	1.	Clone repo
	2.	npm install
	3.	npm start
	4.	Test in Postman or browser:
	•	GET http://localhost:3000/api/posts
	•	POST http://localhost:3000/api/posts

Deployment on Render:
	1.	Push code to GitHub
	2.	Create new web service on Render
	3.	Set environment: Node, build: npm install, start: npm start
	4.	API URL: https://social-api-yourname.onrender.com/api/posts

Submission:
	•	server.js
	•	data/posts.json
	•	package.json
	•	README.md
	•	screenshots.pdf