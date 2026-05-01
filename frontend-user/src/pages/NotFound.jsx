import { Link } from "react-router-dom";

function NotFound() {
	return (
		<div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
			<div className="text-center">
				<p className="text-primary text-6xl font-black mb-4">404</p>
				<h1 className="text-3xl md:text-4xl font-bold mb-4">Page introuvable</h1>
				<p className="text-gray-400 mb-8">La page demandée n'existe pas ou a été déplacée.</p>
				<div className="flex flex-col sm:flex-row gap-3 justify-center">
					<Link
						to="/"
						className="px-5 py-3 rounded bg-primary hover:bg-primary-dark transition font-semibold"
					>
						Retour à l'accueil
					</Link>
					<Link
						to="/my-rentals"
						className="px-5 py-3 rounded border border-gray-600 hover:border-white transition"
					>
						Mes locations
					</Link>
				</div>
			</div>
		</div>
	);
}

export default NotFound;
