import express, { json } from 'express'
import mongoose from 'mongoose'

import {
	registerValidation,
	loginValidation,
	postCreateValidation,
} from './validations.js'
import cheackAuth from './utils/cheackAuth.js'
import { getMe, login, register } from './conrollers/UserController.js'
import { createPost, getPostAll,getPostOne,removePost } from './conrollers/PostController.js'

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

app.use(json())

app.post('/auth/login', loginValidation, login)
app.post('/auth/register', registerValidation, register)
app.get('/auth/me', cheackAuth, getMe)

app.get('/posts', getPostAll)
app.get('/posts/:id', getPostOne)
app.post('/posts', cheackAuth, postCreateValidation, createPost)
app.delete('/posts/:id',cheackAuth, removePost)
//app.patch('/posts/:id',cheackAuth, updatePost)

app.listen(4444, err => {
	if (err) {
		return console.log(err)
	}
	console.log('Server OK')
})
