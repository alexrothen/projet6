// Logique métier des différentes routes
const Sauce = require('../models/sauce');
const fs = require('fs');

// Création d'une sauce (POST)
exports.createSauce = (req, res, next) => {
	const sauceObject = JSON.parse(req.body.sauce);
	const sauce = new Sauce({
		...sauceObject,
		imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
	});
	sauce
		.save()
		.then(() => res.status(201).json({ message: 'Sauce enregistrée !' }))
		.catch((error) => res.status(400).json({ error }));
};

// Récupération d'une sauce (GET)
exports.getOneSauce = (req, res, next) => {
	Sauce.findOne({
		_id: req.params.id
	})
		.then((sauce) => {
			res.status(200).json(sauce);
		})
		.catch((error) => {
			res.status(404).json({
				error: error
			});
		});
};

// Modification d'une sauce (PUT)
exports.modifySauce = (req, res, next) => {
	const sauceObject = req.file ? (
				  // Si la modification contient une image
				  Sauce.findOne({ _id: req.params.id }).then((sauce) => {
					// On supprime l'ancienne image du serveur
					const filename = sauce.imageUrl.split('/images/')[1]
					fs.unlinkSync(`images/${filename}`)
				  }),
				{...JSON.parse(req.body.sauce),
				imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`})
			
		: ({...req.body });
	Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
		.then(() => res.status(200).json({ message: 'Sauce modifiée !' }))
		.catch((error) => res.status(400).json({ error }));
};

// Suppression d'une sauce (DELETE)
exports.deleteSauce = (req, res, next) => {
	Sauce.findOne({ _id: req.params.id })
		.then((sauce) => {
			const filename = sauce.imageUrl.split('/images/')[1];
			fs.unlink(`images/${filename}`, () => {
				Sauce.deleteOne({ _id: req.params.id })
					.then(() => res.status(200).json({ message: 'Sauce supprimée !' }))
					.catch((error) => res.status(400).json({ error }));
			});
		})
		.catch((error) => res.status(500).json({ error }));
};

// Récupération des sauces (GET)
exports.getAllSauces = (req, res, next) => {
	Sauce.find()
		.then((sauces) => {
			res.status(200).json(sauces);
		})
		.catch((error) => {
			res.status(400).json({
				error: error
			});
		});
};

// Gestion des likes (POST)
exports.likeSauce = (req, res, next) => {
	switch (req.body.like) {
		case -1:
			Sauce.updateOne(
				{ _id: req.params.id },
				{ $push: { usersDisliked: req.body.userId }, $inc: { dislikes: +1 } }
			)
				.then(() => res.status(200).json({ message: "Vous n'aimez pas cette sauce !" }))
				.catch((error) => res.status(400).json({ error }));
			break;

		case 1:
			Sauce.updateOne({ _id: req.params.id }, { $push: { usersLiked: req.body.userId }, $inc: { likes: +1 } })
				.then(() => res.status(200).json({ message: 'Vous aimez cette sauce !' }))
				.catch((error) => res.status(400).json({ error }));
			break;

		case 0:
			Sauce.findOne({ _id: req.params.id }).then((sauce) => {
				if (sauce.usersLiked.includes(req.body.userId)) {
					Sauce.updateOne(
						{ _id: req.params.id },
						{ $pull: { usersLiked: req.body.userId }, $inc: { likes: -1 } }
					)
						.then(() => res.status(200).json({ message: "Vous changez d'avis...dommage" }))
						.catch((error) => res.status(400).json({ error }));
					console.log("Vous changez d'avis...dommage");
				} else if (sauce.usersDisliked.includes(req.body.userId)) {
					Sauce.updateOne(
						{ _id: req.params.id },
						{ $pull: { usersDisliked: req.body.userId }, $inc: { dislikes: -1 } }
					)
						.then(() => res.status(200).json({ message: "Il fallait juste le temps de s'y habituer" }))
						.catch((error) => res.status(400).json({ error }));
					console.log("Il fallait juste le temps de s'y habituer");
				}
			});
			break;
	}
};
