const User = require("../models/userModel");
const router = require("express").Router();

router.post("/add", async (req, res) => {
    try {
        const { email, data } = req.body;
        const user = await User.findOne({ email });
        if (user) {
            const { likedMovies } = user;
            const movieAlreadyLiked = likedMovies.find(({ id }) => id === data.id);
            if (!movieAlreadyLiked) {
                await User.findByIdAndUpdate(
                    user._id,
                    {
                        likedMovies: [...user.likedMovies, data],
                    },
                    { new: true }
                );
            }
            else
                return res.json({ msg: "Movie already added to the liked list." });
        }
        else
            await User.create({ email, likedMovies: [data] });
        return res.json({ msg: "Movie successfully added to liked list." });
    } catch (error) {
        return res.json({ msg: "Error adding movie to the liked list" });
    }
});

router.get("/get/:email", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.email });
        if (user) {
            res.status(200).json(user.likedMovies);
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.put("/delete", async (req, res) => {
    try {
        const { email, movieId } = req.body;
        const user = await User.findOne({ email });
        if (user) {
            const movies = user.likedMovies;
            const movieIndex = movies.findIndex(({ id }) => id === movieId);
            movies.splice(movieIndex, 1);
            await User.findByIdAndUpdate(
                user._id,
                {
                    likedMovies: movies,
                },
                { new: true }
            );
            return res.json({ msg: "Movie successfully removed.", movies });
        } else
            return res.json({ msg: "User with given email not found." });
    } catch (error) {
        return res.json({ msg: "Error removing movie to the liked list" });
    }
})
module.exports = router;