import Post from '../models/Post.js'
import User from '../models/User.js'
import Comment from '../models/Comment.js'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'

// Create Post
export const createPost = async (req, res) => {
	try {
		const { title, text } = req.body
		const user = await User.findById(req.userId)

		if (req.files) {
			let fileName = Date.now().toString() + req.files.image.name // Дали имя картинке
			const __dirname = dirname(fileURLToPath(import.meta.url)) // Определили путь к текущей нашей папке (controllers)
			req.files.image.mv(path.join(__dirname, '..', 'uploads', fileName)) // Сохранили картинку в папку uploads

			const newPostWithImage = new Post({
				userName: user.userName,
				title,
				text,
				imgUrl: fileName,
				author: req.userId,
			})

			await newPostWithImage.save()
			await User.findByIdAndUpdate(req.userId, {
				$push: { posts: newPostWithImage },
			})

			return res.json(newPostWithImage)
		}

		const newPostWithoutImage = new Post({
			userName: user.userName,
			title,
			text,
			imgUrl: '',
			author: req.userId,
		})

		await newPostWithoutImage.save()
		await User.findByIdAndUpdate(req.userId, {
			$push: { posts: newPostWithoutImage },
		})
		return res.json(newPostWithoutImage)
	} catch (error) {
		res.json(error.message)
	}
}

// Get All Posts
export const getAll = async (req, res) => {
	try {
		const posts = await Post.find().sort('-createdAt')
		const popularPosts = await Post.find().limit(5).sort('-views')
		if (!posts) {
			return res.json({ message: 'Постов нет' })
		}

		res.json({ posts, popularPosts })
	} catch (error) {
		console.log(error.message)
	}
}

// Get Post By Id
export const getById = async (req, res) => {
	try {
		const post = await Post.findByIdAndUpdate(req.params.id, {
			$inc: { views: 1 },
		})
		res.json(post)
	} catch (error) {
		console.log(error.message)
	}
}

// Get My Posts By Id
export const getMyPosts = async (req, res) => {
	try {
		const user = await User.findById(req.userId)
		const list = await Promise.all(
			user.posts.map((post) => {
				return Post.findById(post._id)
			})
		)
		res.json(list)
	} catch (error) {
		console.log(error.message)
	}
}

// Remove Post
export const removePost = async (req, res) => {
	try {
		const post = await Post.findByIdAndDelete(req.params.id)
		if (!post) return res.json({ message: 'Такого поста не существует' })

		await User.findByIdAndUpdate(req.userId, {
			$pull: { posts: req.params.id },
		})
		res.json({ message: 'Пост был удалён' })
	} catch (error) {
		console.log(error.message)
	}
}

// Update Post
export const updatePost = async (req, res) => {
	try {
		const { title, text, id } = req.body
		const post = await Post.findById(id)

		if (req.files) {
			let fileName = Date.now().toString() + req.files.image.name
			const __dirname = dirname(fileURLToPath(import.meta.url))
			req.files.image.mv(path.join(__dirname, '..', 'uploads', fileName))
			post.imgUrl = fileName || ''
		}

		post.title = title
		post.text = text

		await post.save()

		res.json(post)
	} catch (error) {
		console.log(error.message)
	}
}

// Get Post Comments
export const getPostComments = async (req, res) => {
	try {
		const post = await Post.findById(req.params.id)
		const list = await Promise.all(
			post.comments.map((comment) => {
				return Comment.findById(comment)
			})
		)
		res.json(list)
	} catch (error) {
		console.log(error.message)
	}
}
