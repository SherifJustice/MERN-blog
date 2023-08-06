import User from '../models/User.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// Register user
export const register = async (req, res) => {
	try {
		const { userName, password } = req.body

		const isUsed = await User.findOne({ userName })

		if (isUsed) {
			return res.json({ message: 'Данное имя уже существует' })
		}

		const salt = bcrypt.genSaltSync(10)
		const hash = bcrypt.hashSync(password, salt)

		const newUser = await User({ userName, password: hash })

		const token = jwt.sign(
			{
				id: newUser._id,
			},
			process.env.JWT_SECRET,
			{ expiresIn: '30d' }
		)

		await newUser.save()

		res.json({ newUser, token, message: 'Регистрация прошла успешно' })
	} catch (err) {
		res.json(err.message)
	}
}

// Login user
export const login = async (req, res) => {
	try {
		const { userName, password } = req.body
		const user = await User.findOne({ userName })

		if (!user) {
			return res.json({ message: 'Такого пользователя не существует' })
		}

		const isPasswordCorrect = await bcrypt.compare(password, user.password)

		if (!isPasswordCorrect) {
			return res.json({ message: 'Пароль неверный' })
		}

		const token = jwt.sign(
			{
				id: user._id,
			},
			process.env.JWT_SECRET,
			{ expiresIn: '30d' }
		)

		res.json({ token, user, message: 'Вы вошли в систему' })
	} catch (err) {
		res.json(err.message)
	}
}

// Get me
export const getMe = async (req, res) => {
	try {
		const user = await User.findById(req.userId)
		if (!user) {
			return res.json({ message: 'Такого пользователя не существует' })
		}

		const token = jwt.sign(
			{
				id: user._id,
			},
			process.env.JWT_SECRET,
			{ expiresIn: '30d' }
		)

		res.json({ user, token })
	} catch (err) {
		console.log(err.message)
		return res.json({ message: 'Нет доступа' })
	}
}
