import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema(
	{
		userName: {
			type: String,
			required: true,
			uniqe: true,
		},
		password: {
			type: String,
			required: true,
		},
		posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
	},
	{ timestamps: true }
)

export default mongoose.model('User', UserSchema)
