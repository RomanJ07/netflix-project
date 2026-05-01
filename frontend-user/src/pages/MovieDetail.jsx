import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/layout/Footer";
import Button from "../components/common/Button";
import Breadcrumb from "../components/common/Breadcrumb";
import moviesData from "../../../data/movies.json";

function MovieDetail() {
	const { id } = useParams();
	const navigate = useNavigate();
	const [movie, setMovie] = useState(null);
	const [loading, setLoading] = useState(true);
	const [notification, setNotification] = useState(null);

	useEffect(() => {
		const timer = setTimeout(() => {
			const foundMovie = moviesData.find((item) => item.id === Number(id));
			setMovie(foundMovie || null);
			setLoading(false);
		}, 500);

		return () => clearTimeout(timer);
	}, [id]);

	const handleRent = () => {
		const user = localStorage.getItem("user");
		if (!user) {
			navigate("/login", { state: { from: `/movie/${id}` } });
			return;
		}

		const rental = {
			...movie,
			rentalDate: new Date().toISOString(),
			expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
		};

		const existingRentals = JSON.parse(localStorage.getItem("rentals") || "[]");
		const alreadyRented = existingRentals.some((item) => item.id === movie.id);

		if (alreadyRented) {
			setNotification({ type: "error", message: "Vous avez déjà loué ce film" });
			return;
		}

		localStorage.setItem("rentals", JSON.stringify([...existingRentals, rental]));
		setNotification({ type: "success", message: "Film loué avec succès !" });

		setTimeout(() => {
			navigate("/my-rentals");
		}, 2000);
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-black text-white">
				<Navbar />
				<div className="container mx-auto px-4 pt-32 pb-20 text-center text-gray-300">
					Recherche du film en cours...
				</div>
				<Footer />
			</div>
		);
	}

	if (!movie) {
		return (
			<div className="min-h-screen bg-black text-white">
				<Navbar />
				<div className="container mx-auto px-4 pt-32 pb-20 text-center">
					<h1 className="text-3xl font-bold mb-4">Film introuvable</h1>
					<p className="text-gray-400 mb-6">Ce film n'existe pas dans le catalogue.</p>
					<Button onClick={() => navigate("/")}>Retour à l'accueil</Button>
				</div>
				<Footer />
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-black text-white">
			{notification && (
				<div
					className={`fixed top-20 right-4 px-6 py-3 rounded-lg shadow-xl z-50 ${
						notification.type === "success" ? "bg-green-500" : "bg-red-500"
					}`}
				>
					{notification.message}
				</div>
			)}

			<Navbar />

			<div className="container mx-auto px-4 pt-24">
				<Breadcrumb
					items={[
						{ label: "Films", path: "/" },
						{ label: movie.genre, path: `/?genre=${movie.genre}` },
						{ label: movie.title },
					]}
				/>
			</div>

			<section className="relative min-h-[70vh]">
				<div className="absolute inset-0">
					<img src={movie.backdrop} alt={movie.title} className="w-full h-full object-cover" />
					<div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/40" />
					<div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30" />
				</div>

				<div className="relative container mx-auto px-4 py-10 md:py-16">
					<Button variant="secondary" onClick={() => navigate(-1)} className="mb-8">
						← Retour
					</Button>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
						<div className="md:col-span-1">
							<img
								src={movie.poster}
								alt={movie.title}
								className="w-full max-w-sm rounded-lg shadow-2xl"
							/>
						</div>

						<div className="md:col-span-2">
							<h1 className="text-4xl md:text-6xl font-bold mb-4">{movie.title}</h1>
							<div className="flex flex-wrap items-center gap-3 mb-6">
								<span className="bg-primary px-3 py-1 rounded text-sm font-bold">{movie.rating}/10</span>
								<span className="text-gray-300">{movie.year}</span>
								<span className="text-gray-300">{movie.duration} min</span>
								<span className="border border-gray-500 px-2 py-0.5 text-sm rounded">{movie.genre}</span>
							</div>

							<p className="text-lg text-gray-200 leading-relaxed mb-8">{movie.description}</p>

							<Button size="lg" onClick={handleRent} className="mb-8">
								🎬 Louer pour {movie.price}€
							</Button>
						</div>
					</div>
				</div>
			</section>

			<Footer />
		</div>
	);
}

export default MovieDetail;
