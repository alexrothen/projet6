//------------------------------------------SAUVEGARDE DES IMAGES

const multer = require("multer");

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

const storage = multer.diskStorage({

// Repertoire de destination
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {

// Les espaces contenus dans les noms d'images sont remplacés par des underscores    
    const name = file.originalname.split(" ").join("_");

// Formatage du nom de l'image
    const extension = MIME_TYPES[file.mimetype];
    cb(null, "sauce" + Date.now() + "." + extension);
  },
});

module.exports = multer({ storage: storage }).single("image");
