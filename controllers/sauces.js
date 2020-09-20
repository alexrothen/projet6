const Sauce = require('../models/sauce');
const fs = require('fs');
const sauce = require('../models/sauce');

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

exports.modifySauce = (req, res, next) => {
	const sauceObject = req.file
		? {
				...JSON.parse(req.body.sauce),
				imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
			}
		: { ...req.body };
	Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
		.then(() => res.status(200).json({ message: 'Sauce modifiée !' }))
		.catch((error) => res.status(400).json({ error }));
};

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
				Sauce.updateOne(
          { _id: req.params.id }, 
          { $push: { usersLiked: req.body.userId }, $inc: { likes: +1 } })
					.then(() => res.status(200).json({ message: 'Vous aimez cette sauce !' }))
					.catch((error) => res.status(400).json({ error }));
				break;

			case 0:
				if (Sauce.findOne({ usersLiked: { $in: req.params.id } })) {
					Sauce.updateOne(
						{ _id: req.params.id },
						{ $pull: { usersLiked: req.body.userId }, $inc: { likes: -1 } }
					)
						.then(() => res.status(200).json({ message: "Vous n'aimez plus cette sauce!" }))
						.catch((error) => res.status(400).json({ error }));
				} else {
					Sauce.updateOne(
						{ _id: req.params.id },
						{ $pull: { usersDisliked: req.body.userId }, $inc: { dislikes: -1 } }
					)
						.then(() => res.status(200).json({ message: 'Vous aimez finalement cette sauce !' }))
						.catch((error) => res.status(400).json({ error }));
				}
				break;
		}
};

// { $pull: { <field1>: <value|condition>, <field2>: <value|condition>, ... } }
//db.inventory.find( { qty: { $in: [ 5, 15 ] } } )

//{ $inc: { <field1>: <amount1>, <field2>: <amount2>, ... } }

//{ $push: { <field1>: { <modifier1>: <value1>, ... }, ... } }

/*db.collection.updateOne(
  <query>,
  { $set: { status: "D" }, $inc: { quantity: 2 } },
  ...
)*/

/*db.inventory.find
( { qty: { $in: [ 5, 15 ] } } )*/
