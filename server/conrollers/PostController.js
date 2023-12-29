import PostModel from '../models/Post.js'


export const getLastTags = async (req, res) => {
	try {
		const posts = await PostModel.find().limit(5).exec()
		const tags = posts.map(obj=>obj.tags).flat().slice(0,5);
		res.json(tags)
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: 'Не удалось получить статьи',
		})
	}
}

export const getPostAll = async (req, res) => {
	try {
		const posts = await PostModel.find().populate('user').exec()
		res.json(posts)
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: 'Не удалось получить статьи',
		})
	}
}

export const getPostOne = async (req, res) => {
	try {
		const postId = req.params.id

		const article = await PostModel.findById(postId)

		if (!article) {
			return res.status(404).json({ message: 'Статья не найдена' })
		}

		// Увеличиваем количество просмотров
		article.viewsCount += 1

		// Сохраняем обновленную статью в базе данных
		await article.save()

		// Отправляем статью с обновленным количеством просмотров клиенту
		res.json(article)
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: 'Не удалось получить статьи',
		})
	}
}

export const removePost = async (req, res) => {
	try {
		const postId = req.params.id
		PostModel.findOneAndDelete({ _id: postId }).then(doc => {
			if (!doc) {
				return res.status(404).json({
					message: 'Не удалось удалить',
				})
			}

			res.json(doc)
		})
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: 'Не удалось удалить',
		})
	}
}
export const updatePost = async (req, res) => {
	try {
		const postId = req.params.id
		await PostModel.updateOne(
			{
				_id: postId,
			},
			{
				title: req.body.title,
				text: req.body.text,
				imageUrl: req.body.imageUrl,
				user: req.userId,
				tags: req.body.tags,
			}
		)

		res.json({
			success: true,
		})
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: 'Обновить не удалось',
		})
	}
}

export const createPost = async (req, res) => {
	try {
		const doc = new PostModel({
			title: req.body.title,
			text: req.body.text,
			imageUrl: req.body.imageUrl,
			tags: req.body.tags,
			user: req.userId,
		})

		const post = await doc.save()

		res.json(post)
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: 'Не удалось создать статью',
		})
	}
}
