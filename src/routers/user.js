const express = require("express");
const multer = require("multer");

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
	dest: "avatars"
});

router.post("/users/me/avatar", upload.single("avatar"), async (req, res, next) => {
	res.send();
});

module.exports = router;
