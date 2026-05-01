import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/layout/Footer";
import Button from "../components/common/Button";

function MyRentals() {
	const navigate = useNavigate();
	const [rentals] = useState(() => JSON.parse(localStorage.getItem("rentals") || "[]"));

	return (
		<div className="min-h-screen bg-black text-white">
			<Navbar />

			<main className="container mx-auto px-4 pt-28 pb-16">
				<h1 className="text-3xl md:text-4xl font-bold mb-8">Mes locations</h1>

				{rentals.length === 0 ? (
					<div className="bg-gray-900/60 border border-gray-800 rounded-lg p-8 text-center">
						<p className="text-gray-300 mb-6">Vous n'avez pas encore loué de film.</p>
						<Button onClick={() => navigate("/")}>Découvrir les films</Button>
					</div>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
						{rentals.map((rental) => (
							<article key={rental.id} className="bg-gray-900/70 border border-gray-800 rounded-lg p-4">
								<img
									src={rental.poster}
									alt={rental.title}
									className="w-full h-72 object-cover rounded mb-4"
								/>
								<h2 className="text-xl font-semibold mb-2">{rental.title}</h2>
								<p className="text-sm text-gray-300 mb-1">Genre : {rental.genre}</p>
								<p className="text-sm text-gray-300 mb-1">
									Loué le : {new Date(rental.rentalDate).toLocaleDateString("fr-FR")}
								</p>
								<p className="text-sm text-gray-300">
									Expire le : {new Date(rental.expiryDate).toLocaleDateString("fr-FR")}
								</p>
							</article>
						))}
					</div>
				)}
			</main>

			<Footer />
		</div>
	);
}

export default MyRentals;
