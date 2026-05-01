import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/layout/Footer";

function Register() {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		confirmPassword: "",
	});
	const [errors, setErrors] = useState({});
	const [loading, setLoading] = useState(false);

	const validateForm = () => {
		const newErrors = {};

		if (!formData.name) {
			newErrors.name = "Nom requis";
		}

		if (!formData.email) {
			newErrors.email = "Email requis";
		} else if (!/\S+@\S+\.\S+/.test(formData.email)) {
			newErrors.email = "Email invalide";
		}

		if (!formData.password) {
			newErrors.password = "Mot de passe requis";
		} else if (formData.password.length < 6) {
			newErrors.password = "Au moins 6 caractères";
		}

		if (formData.password !== formData.confirmPassword) {
			newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
		}

		return newErrors;
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const newErrors = validateForm();
		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
			return;
		}

		setErrors({});
		setLoading(true);

		setTimeout(() => {
			localStorage.setItem(
				"user",
				JSON.stringify({
					name: formData.name,
					email: formData.email,
				}),
			);

			setLoading(false);
			navigate("/");
		}, 1000);
	};

	return (
		<div className="min-h-screen bg-black text-white">
			<Navbar />

			<main className="container mx-auto px-4 pt-28 pb-16">
				<div className="max-w-md mx-auto bg-gray-900/70 border border-gray-800 rounded-lg p-6">
					<h1 className="text-3xl font-bold mb-6">Inscription</h1>

					<form onSubmit={handleSubmit} className="space-y-4">
						<div>
							<label htmlFor="name" className="block text-sm text-gray-300 mb-1">
								Nom
							</label>
							<input
								id="name"
								name="name"
								value={formData.name}
								onChange={handleChange}
								className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-primary"
							/>
							{errors.name && <p className="text-sm text-red-400 mt-1">{errors.name}</p>}
						</div>

						<div>
							<label htmlFor="email" className="block text-sm text-gray-300 mb-1">
								Email
							</label>
							<input
								id="email"
								name="email"
								type="email"
								value={formData.email}
								onChange={handleChange}
								className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-primary"
							/>
							{errors.email && <p className="text-sm text-red-400 mt-1">{errors.email}</p>}
						</div>

						<div>
							<label htmlFor="password" className="block text-sm text-gray-300 mb-1">
								Mot de passe
							</label>
							<input
								id="password"
								name="password"
								type="password"
								value={formData.password}
								onChange={handleChange}
								className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-primary"
							/>
							{errors.password && <p className="text-sm text-red-400 mt-1">{errors.password}</p>}
						</div>

						<div>
							<label htmlFor="confirmPassword" className="block text-sm text-gray-300 mb-1">
								Confirmation du mot de passe
							</label>
							<input
								id="confirmPassword"
								name="confirmPassword"
								type="password"
								value={formData.confirmPassword}
								onChange={handleChange}
								className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-primary"
							/>
							{errors.confirmPassword && (
								<p className="text-sm text-red-400 mt-1">{errors.confirmPassword}</p>
							)}
						</div>

						<button
							type="submit"
							disabled={loading}
							className="w-full bg-primary hover:bg-primary-dark disabled:opacity-60 transition px-4 py-2 rounded font-semibold"
						>
							{loading ? "Inscription..." : "S'inscrire"}
						</button>
					</form>

					<p className="text-sm text-gray-400 mt-4">
						Déjà inscrit ?{" "}
						<Link to="/login" className="text-primary hover:underline">
							Connexion
						</Link>
					</p>
				</div>
			</main>

			<Footer />
		</div>
	);
}

export default Register;
