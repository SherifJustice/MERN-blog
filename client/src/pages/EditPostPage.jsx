import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

import axios from '../utils/axios'
import { updatePost } from '../redux/features/post/postSlice'

const EditPostPage = () => {
	const [title, setTitle] = useState('')
	const [text, setText] = useState('')
	const [oldImage, setOldImage] = useState('')
	const [newImage, setNewImage] = useState('')

	const dispatch = useDispatch()
	const navigate = useNavigate()
	const params = useParams()

	const fetchPost = useCallback(async () => {
		const { data } = await axios.get(`/posts/${params.id}`)
		setTitle(data.title)
		setText(data.text)
		setOldImage(data.imgUrl)
	}, [params.id])

	const submitHandler = () => {
		try {
			const updatedPost = new FormData()
			updatedPost.append('title', title)
			updatedPost.append('text', text)
			updatedPost.append('id', params.id)
			updatedPost.append('image', newImage)
			dispatch(updatePost(updatedPost))
			navigate('/posts')
		} catch (error) {
			console.log(error)
		}
	}

	const clearFormHandler = () => {
		setText('')
		setTitle('')
	}

	useEffect(() => {
		fetchPost()
	}, [fetchPost])

	return (
		<form className="w-1/3 mx-auto py-10" onSubmit={(e) => e.preventDefault()}>
			<label className="text-gray-300 bg-gray-600 py-2 text-xs mt-2 flex items-center justify-center border-2 border-dotted cursor-pointer">
				Прикрепить изображение:
				<input
					type="file"
					className="hidden"
					onChange={(e) => {
						setNewImage(e.target.files[0])
						setOldImage('')
					}}
				/>
			</label>
			<div className="flex object-cover py-2">
				{oldImage && (
					<img src={`http://localhost:3002/${oldImage}`} alt={oldImage.name} />
				)}
				{newImage && (
					<img src={URL.createObjectURL(newImage)} alt={newImage.name} />
				)}
			</div>

			<label className="text-xs text-white opacity-70">
				Заголовок поста:
				<input
					type="text"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					className="mt-1 text-black w-full rounded-lg bg-gray-400 border py-1 px-2 text-xs outline-none placeholder:text-gray-700"
					placeholder="Заголовок"
				/>
			</label>

			<label className="text-xs text-white opacity-70">
				Текст поста:
				<textarea
					onChange={(e) => setText(e.target.value)}
					value={text}
					className="mt-1 text-black w-full rounded-lg bg-gray-400 border py-1 px-2 text-xs outline-none resize-none h-40 placeholder:text-gray-700"
					placeholder="Текст поста"
				/>
			</label>

			<div className="flex gap-8 justify-center mt-4 items-center">
				<button
					className="flex items-center bg-gray-600 text-xs text-white rounded-sm py-2 px-4"
					onClick={submitHandler}
				>
					Обновить
				</button>
				<button
					className="flex items-center bg-red-500 text-xs text-white rounded-sm py-2 px-4"
					onClick={clearFormHandler}
				>
					Отменить
				</button>
			</div>
		</form>
	)
}

export default EditPostPage
