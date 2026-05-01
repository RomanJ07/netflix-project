import Movie from "../models/Movie.js";
// @desc    Obtenir tous les films
// @route   GET /api/movies
// @access  Public
export const getAllMovies = async (req, res, next) => {
  try {
    // Récupérer les paramètres de requête
    const page = Number.parseInt(req.query.page || "1", 10);
    const limit = Number.parseInt(req.query.limit || "10", 10);
    const sortBy = req.query.sortBy || "createdAt";
    const order = req.query.order === "asc" ? 1 : -1;

    const query = {};
    if (req.query.genre) query.genre = req.query.genre;
    if (req.query.search) {
      query.title = { $regex: req.query.search, $options: "i" };
    }

    const sortOption = { [sortBy]: order };

    // Pagination
    const skip = (page - 1) * limit;

    // Exécution de la requête
    const movies = await Movie.find(query).sort(sortOption).skip(skip).limit(limit);

    // Comptage total pour la pagination
    const total = await Movie.countDocuments(query);

    return res.status(200).json({
      success: true,
      count: movies.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: movies,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtenir un film par ID
// @route   GET /api/movies/:id
// @access  Public
export const getMovieById = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Film non trouvé",
      });
    }

    return res.status(200).json({
      success: true,
      data: movie,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtenir des films similaires
// @route   GET /api/movies/:id/similar
// @access  Public
export const getSimilarMovies = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Film non trouvé",
      });
    }

    const similarMovies = await Movie.find({
      genre: { $in: movie.genre },
      _id: { $ne: movie._id },
      isAvailable: true,
    })
      .sort({ rating: -1 })
      .limit(6);

    return res.status(200).json({
      success: true,
      count: similarMovies.length,
      data: similarMovies,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Créer un nouveau film
// @route   POST /api/movies
// @access  Private/Admin
export const createMovie = async (req, res, next) => {
    try {
        const movie = await Movie.create({
            title: req.body.title,
            description: req.body.description,
            poster: req.body.poster,
            backdrop: req.body.backdrop,
            genre: req.body.genre,
            year: req.body.year,
            duration: req.body.duration,
            price: req.body.price,
            rating: req.body.rating
        });
        return res.status(201).json({
            success: true,
            data: movie
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Modifier un film
// @route   PUT /api/movies/:id
// @access  Private/Admin
export const updateMovie = async (req, res, next) => {
    try {
        const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!movie) {
            return res.status(404).json({
                success: false,
                message: "Film non trouvé"
            });
        }
        return res.status(200).json({
            success: true,
            data: movie
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Supprimer un film
// @route   DELETE /api/movies/:id
// @access  Private/Admin
export const deleteMovie = async (req, res, next) => {
    try {
        const movie = await Movie.findByIdAndDelete(req.params.id);
        if (!movie) {
            return res.status(404).json({
                success: false,
                message: "Film non trouvé"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Film supprimé avec succès"
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Obtenir les statistiques des films
// @route   GET /api/movies/stats
// @access  Private/Admin
export const getMovieStats = async (req, res, next) => {
  try {
    const totalMovies = await Movie.countDocuments();
    const availableMovies = await Movie.countDocuments({ isAvailable: true });

    const aggregation = await Movie.aggregate([
      {
        $group: {
          _id: null,
          avgRating: { $avg: "$rating" },
          avgPrice: { $avg: "$price" },
          totalRentals: { $sum: "$rentalCount" },
        },
      },
    ]);

    const byGenre = await Movie.aggregate([
      { $unwind: "$genre" },
      { $group: { _id: "$genre", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const stats = aggregation[0] || { avgRating: 0, avgPrice: 0, totalRentals: 0 };

    return res.status(200).json({
      success: true,
      data: {
        totalMovies,
        availableMovies,
        avgRating: Math.round(stats.avgRating * 10) / 10,
        avgPrice: Math.round(stats.avgPrice * 100) / 100,
        totalRentals: stats.totalRentals,
        byGenre,
      },
    });
  } catch (error) {
    next(error);
  }
};

