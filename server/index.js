import express, { json } from 'express'
import mongoose from 'mongoose'
import multer from 'multer'

import {registerValidation, loginValidation, postCreateValidation} from './validations.js'
import {UserController,PostController} from './conrollers/index.js';
import {cheackAuth,handleValidationErrors} from './utils/index.js'

mongoose
	.connect(
		'mongodb+srv://admin:12345@cluster0.wmcrxrh.mongodb.net/blog?retryWrites=true&w=majority'
	)
	.then(() => {
		console.log('DB ok')
	})
	.catch(err => {
		console.log('DB error', err)
	})

const app = express()

const storage = multer.diskStorage({
	destination: (_, __, cb) => {
		cb(null, 'uploads')
	},
	filename: (_, file, cb) => {
		cb(null, file.originalname)
	},
})

const upload = multer({ storage })

app.use(json())
app.use('/uploads', express.static('uploads'))

app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login)
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register)
app.get('/auth/me', cheackAuth, UserController.getMe)

app.post('/upload', cheackAuth, upload.single('image'), (req, res) => {
	res.json({
		url: `/uploads/${req.file.originalname}`,
	})
})

app.get('/posts', PostController.getPostAll)
app.get('/posts/:id', PostController.getPostOne)
app.post('/posts', cheackAuth, postCreateValidation,handleValidationErrors, PostController.createPost)
app.delete('/posts/:id', cheackAuth, PostController.removePost)
app.patch('/posts/:id', cheackAuth, postCreateValidation,handleValidationErrors, PostController.updatePost)

app.listen(4444, err => {
	if (err) {
		return console.log(err)
	}
	console.log('Server OK')
})
