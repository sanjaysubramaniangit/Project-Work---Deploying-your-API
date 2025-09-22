const express = require('express');
const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

const dataDir = path.join(__dirname, 'data');
const postsFile = path.join(dataDir, 'posts.json');

app.use(express.json());
app.use(cors());


async function ensureDataFile() {
  try {
    await fsPromises.mkdir(dataDir, { recursive: true });
    const raw = await fsPromises.readFile(postsFile, 'utf8');
    JSON.parse(raw);
  } catch (err) {
    
    await fsPromises.writeFile(postsFile, '[]', 'utf8');
    console.log('Created/Reset posts.json');
  }
}

async function readPosts() {
  try {
    const data = await fsPromises.readFile(postsFile, 'utf8');
    return JSON.parse(data || '[]');
  } catch (err) {
    console.error('readPosts error:', err);
    return [];
  }
}

async function writePosts(posts) {
  await fsPromises.writeFile(postsFile, JSON.stringify(posts, null, 2), 'utf8');
}


app.post('/api/posts', async (req, res) => {
  try {
    const { content, author, tags } = req.body;

   
    if (typeof content !== 'string' || content.trim().length === 0) {
      return res.status(400).json({ error: 'Content is required' });
    }
    if (content.length < 1 || content.length > 280) {
      return res.status(400).json({ error: 'Content must be 1-280 characters' });
    }
    if (typeof author !== 'string' || author.trim().length === 0) {
      return res.status(400).json({ error: 'Author is required' });
    }
    if (tags !== undefined) {
      if (!Array.isArray(tags)) {
        return res.status(400).json({ error: 'Tags must be an array of strings' });
      }
      if (tags.length > 5) {
        return res.status(400).json({ error: 'Maximum 5 tags allowed' });
      }
      if (!tags.every(t => typeof t === 'string')) {
        return res.status(400).json({ error: 'Each tag must be a string' });
      }
    }

    const newPost = {
      postId: Date.now(),
      content,
      author,
      tags: tags || [],
      createdAt: new Date().toISOString(),
      likes: 0,
      status: 'published'
    };

    const posts = await readPosts();
    posts.unshift(newPost); 
    await writePosts(posts);

    return res.status(201).json(newPost);
  } catch (err) {
    console.error('POST /api/posts error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});


app.get('/api/posts', async (req, res) => {
  try {
    const posts = await readPosts();
    posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return res.json(posts);
  } catch (err) {
    console.error('GET /api/posts error:', err);
    return res.status(500).json({ error: 'Failed to read posts' });
  }
});


app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Server error' });
});


ensureDataFile()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('Failed to initialize data file:', err);
    process.exit(1);
  });