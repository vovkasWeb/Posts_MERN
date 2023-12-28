import PostModel from '../models/Post.js'

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
        PostModel.findOneAndDelete({_id: postId}).then((doc) => {
        if (!doc) {
          return res.status(404).json({
            message: "Не удалось удалить",
          });
        }

        res.json(doc);
      })} catch (err) {
		console.log(err)
		res.status(500).json({
			message: 'Не удалось удалить',
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
