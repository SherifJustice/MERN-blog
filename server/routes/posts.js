import { Router } from 'express'
import { checkAuth } from '../utils/checkAuth.js'
import {
	createPost,
	getAll,
	getById,
	getMyPosts,
	removePost,
	updatePost,
	getPostComments,
} from '../controllers/posts.js'

const router = new Router()

// Create Post
// http://localhost:3002/api/posts
router.post('/', checkAuth, createPost)

// Get All Posts
// http://localhost:3002/api/posts
router.get('/', getAll)

// Get Posts By Id
// http://localhost:3002/api/posts/:id
router.get('/:id', getById)

// Get My Posts By Id
// http://localhost:3002/api/posts/user/me
router.get('/user/me', checkAuth, getMyPosts)

// Remove Post
// http://localhost:3002/api/posts/:id
router.delete('/:id', checkAuth, removePost)

// Update Post By Id
// http://localhost:3002/api/posts/:id
router.put('/:id', checkAuth, updatePost)

// Get Post Comments
// http://localhost:3002/api/posts/comments/:id
router.get('/comments/:id', getPostComments)

export default router
