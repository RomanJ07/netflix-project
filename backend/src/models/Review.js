import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: [true, "L'utilisateur est requis"],
		},
		movie: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Movie",
			required: [true, "Le film est requis"],
		},
		rating: {
			type: Number,
			required: [true, "La note est requise"],
			min: [1, "La note doit être comprise entre 1 et 5"],
			max: [5, "La note doit être comprise entre 1 et 5"],
		},
		comment: {
			type: String,
			required: [true, "Le commentaire est requis"],
			trim: true,
			minlength: [3, "Le commentaire doit contenir au moins 3 caractères"],
			maxlength: [1000, "Le commentaire ne peut pas dépasser 1000 caractères"],
		},
	},
	{
		timestamps: true,
	},
);

reviewSchema.index({ user: 1, movie: 1 }, { unique: true });
reviewSchema.index({ movie: 1, rating: -1 });

reviewSchema.statics.calculateAverageRating = async function (movieId) {
	const result = await this.aggregate([
		{
			$match: {
				movie: new mongoose.Types.ObjectId(movieId),
			},
		},
		{
			$group: {
				_id: "$movie",
				averageRating: { $avg: "$rating" },
			},
		},
	]);

	const averageRating = result.length > 0 ? Number(result[0].averageRating.toFixed(1)) : 0;

	await mongoose.model("Movie").findByIdAndUpdate(movieId, {
		rating: averageRating,
	});
};

reviewSchema.post("save", async function () {
	await this.constructor.calculateAverageRating(this.movie);
});

reviewSchema.post("findOneAndUpdate", async function (doc) {
	if (!doc) {
		return;
	}
	await doc.constructor.calculateAverageRating(doc.movie);
});

reviewSchema.post("findOneAndDelete", async function (doc) {
	if (!doc) {
		return;
	}
	await doc.constructor.calculateAverageRating(doc.movie);
});

const Review = mongoose.model("Review", reviewSchema);

export default Review;
