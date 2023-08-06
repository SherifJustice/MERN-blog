import React, { useCallback, useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
	AiFillEye,
	AiOutlineMessage,
	AiTwotoneEdit,
	AiFillDelete,
} from 'react-icons/ai'
import Moment from 'react-moment'
import { toast } from 'react-toastify'

import axios from '../utils/axios'
import { removePost } from '../redux/features/post/postSlice'
import {
	createComment,
	getPostComments,
} from '../redux/features/comment/commentSlice'
import CommentItem from '../components/CommentItem'

const PostPage = () => {
	const [post, setPost] = useState(null)
	const [comment, setComment] = useState('')

	const { user } = useSelector((state) => state.auth)
	const { comments } = useSelector((state) => state.comment)
	const navigate = useNavigate()
	const dispatch = useDispatch()
	const params = useParams()

	const removePostHandler = () => {
		try {
			dispatch(removePost(params.id))
			toast('Пост был удалён')
			navigate('/posts')
		} catch (error) {
			console.log(error)
		}
	}

	const fetchPost = useCallback(async () => {
		const { data } = await axios.get(`/posts/${params.id}`)
		setPost(data)
	}, [params.id])

	const fetchComments = useCallback(async () => {
		try {
			dispatch(getPostComments(params.id))
		} catch (error) {
			console.log()
		}
	}, [params.id, dispatch])

	useEffect(() => {
		fetchPost()
	}, [fetchPost])

	useEffect(() => {
		fetchComments()
	}, [fetchComments])

	const handleSubmit = () => {
		try {
			const postId = params.id
			dispatch(createComment({ postId, comment }))
			setComment('')
		} catch (error) {
			console.log(error)
		}
	}

	if (!post) {
		return <div className="text-xl text-center text-white py-10">Loading..</div>
	}
	return (
		<div>
			<button className="flex justify-center items-center bg-gray-600 text-xs text-white rounded-sm py-2 px-4">
				<Link className="flex" to={'/'}>
					Назад
				</Link>
			</button>

			<div className="flex gap-10 py-8">
				<div className="w-2/3">
					<div className="flex flex-col basis-1/4 flex-grow">
						<div
							className={
								post.imgUrl ? 'flex rounded-sm h-80' : 'flex rounded-sm'
							}
						>
							{post.imgUrl && (
								<img
									src={`http://localhost:3002/${post.imgUrl}`}
									alt="img"
									className="object-cover w-full"
								/>
							)}
						</div>
					</div>
					<div className="flex justify-between items-center pt-2">
						<div className="text-xs text-white opacity-50">{post.userName}</div>
						<div className="text-xs text-white opacity-50">
							<Moment date={post.createdAt} format="D MMM YYYY" />
						</div>
					</div>
					<div className="text-white text-xl">{post.title}</div>
					<p className="text-white opacity-60 text-xs pt-4">{post.text}</p>

					<div className="flex gap-3 items-center mt-2 justify-between">
						<div className="flex gap-3 mt-4">
							<button className="flex items-center justify-center gap-2 text-xs text-white opacity-50">
								<AiFillEye /> <span>{post.views}</span>
							</button>
							<button className="flex items-center justify-center gap-2 text-xs text-white opacity-50">
								<AiOutlineMessage />
								<span>{post.comments?.length}</span>
							</button>
						</div>

						{user?._id === post.author && (
							<div className="flex gap-3 mt-4">
								<button className="flex items-center justify-center gap-2  text-white opacity-50">
									<Link to={`/${params.id}/edit`}>
										<AiTwotoneEdit />
									</Link>
								</button>
								<button
									onClick={removePostHandler}
									className="flex items-center justify-center gap-2  text-white opacity-50"
								>
									<AiFillDelete />
								</button>
							</div>
						)}
					</div>
				</div>

				<div className="w-1/3 p-8 bg-gray-700 flex flex-col gap-2 rounded-sm">
					<form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
						<input
							type="text"
							placeholder="Ваш комментарий.."
							value={comment}
							className="text-black w-full rounded-sm bg-gray-400 border p-2 outline-none placeholder:text-gray-700 text-xs"
							onChange={(e) => setComment(e.target.value)}
						/>
						<button
							type="submit"
							className="flex justify-center items-center bg-gray-600 text-xs text-white rounded-sm py-2 px-4"
							onClick={handleSubmit}
						>
							Отправить
						</button>
					</form>

					{comments?.map((cmt) => (
						<CommentItem key={cmt._id} cmt={cmt} />
					))}
				</div>
			</div>
		</div>
	)
}

export default PostPage
