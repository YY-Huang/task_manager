const express = require("express");
const multer = require("multer");
const sharp = require("sharp");

const router = new express.Router();
const User = require("../models/user");
const authMiddleware = require("../middleware/auth");

router.get("/test", (req, res) => {
	res.send("From a new file");
});

router.post("/users", async (req, res) => {
	const user = new User(req.body);

	try {
		await user.save();
		const token = await user.generateAuthToken();

		res.status(200).send({ user, token });
	} catch (e) {
		res.status(400).send(e);
	}
});

router.post("/users/login", async (req, res) => {
	try {
		const user = await User.findByCredentials(req.body.email, req.body.password);
		const token = await user.generateAuthToken();

		res.send({ user, token });
	} catch (e) {
		console.log("error is", e);
		res.status(400).send();
	}
});

router.post("/users/logout", authMiddleware, async (req, res) => {
	try {
		req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token);

		await req.user.save();
		res.send();
	} catch (e) {
		res.status(500).send();
	}
});

router.post("/users/logoutall", authMiddleware, async (req, res) => {
	try {
		req.user.tokens = [];

		await req.user.save();
		res.send();
	} catch (e) {
		res.status(500).send();
	}
});

router.get("/users/me", authMiddleware, async (req, res) => {
	res.send(req.user);

	// try {
	// 	const users = await User.find({})
	// 	res.send(users)
	// } catch (e) {

	// 	res.status(500).send()
	// }
});

router.get("/users/:id", async (req, res) => {
	const _id = req.params.id;

	try {
		const findByID = await User.findById(_id);

		if (!findByID) {
			return res.status(404).send();
		}

		res.send(findByID);
	} catch (e) {
		res.status(500).send();
	}
});


router.patch("/users/me", authMiddleware, async (req, res) => {
	// console.log('current user', req.user)
	// console.log('req.body', req.body)
	const updates = Object.keys(req.body);
	const allowedUsersUpdate = ["name", "age", "email", "password"];
	const isValid = updates.every((value) => allowedUsersUpdate.includes(value));
  
	if (!isValid) {
		return res.status(400).send({ error: "Invalid upates" });
	}
  
	try {
		updates.forEach((update) => req.user[update] = req.body[update]);
    
		await req.user.save();
		res.send(req.user);
	} catch (e) {
		res.status(400).send(e);
	}
});

router.delete("/users/me", authMiddleware, async (req, res) => {
	try {
		await req.user.remove(); // removes user authenticated from mongoose model
    
		res.send(req.user);
	} catch (e) {
		res.status(500).send();
	}
});

const upload = multer({
	limits:  {
		fileSize:  1000000
	}, 
	fileFilter(req, file, cb) {
		if (file.originalname.match(/\.(jpg|jpeg|png)$/gm)) {
			return cb(undefined,  true);
		}
		return cb(new Error("File must be jpg, jpeg, or png"));
	}
});

router.post("/users/me/avatar", authMiddleware, upload.single("avatar"), async (req, res, next) => {
	const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer();
	req.user.avatar = buffer;
	await req.user.save();
	res.send();
}, (err, req, res, next) => {
	res.status(400).send({ error: err.message });
});

router.delete("/users/me/avatar", authMiddleware, async (req, res) => {
	req.user.avatar = undefined;
	await req.user.save();
	res.send();
});

router.get("/users/:id/avatar", async (req, res)  => {
	try {
		const user =  await User.findById(req.params.id);

		if (!user || !user.avatar) {
			throw new Error();
		}

		res.set("Content-Type", "image/png");
		res.send(user.avatar);
	} catch(e) {
		res.status(404).send();
	}
});

module.exports = router;
