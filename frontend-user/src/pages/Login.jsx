import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/layout/Footer";
import { useAuth } from "../context/AuthProvider";

function Login() {
	const navigate = useNavigate();
	const { login } = useAuth();
	const [formData, setFormData] = useState({ email: "", password: "" });
	const [errors, setErrors] = useState({});
	const [apiError, setApiError] = useState("");
	const [loading, setLoading] = useState(false);

	const validateForm = () => {
		const newErrors = {};

		if (!formData.email) {
			newErrors.email = "Email requis";
		} else if (!/\S+@\S+\.\S+/.test(formData.email)) {
			newErrors.email = "Email invalide";
		}

		if (!formData.password) {
			newErrors.password = "Mot de passe requis";
		}

		return newErrors;
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
		setApiError("");
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const newErrors = validateForm();
		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
			return;
		}

		setErrors({});
		setApiError("");
		setLoading(true);

		// Simulation de connexion
		const result = await login(formData.email, formData.password);
		if (result.success) {
			navigate("/");
		} else {
			setApiError(result.error || "Erreur de connexion");
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-black text-white">
			<Navbar />

			<main className="container mx-auto px-4 pt-28 pb-16">
				<div className="max-w-md mx-auto bg-gray-900/70 border border-gray-800 rounded-lg p-6">
					<h1 className="text-3xl font-bold mb-6">Connexion</h1>

					<form onSubmit={handleSubmit} className="space-y-4">
						{apiError && <p className="text-sm text-red-400">{apiError}</p>}

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

						<button
							type="submit"
							disabled={loading}
							className="w-full bg-primary hover:bg-primary-dark disabled:opacity-60 transition px-4 py-2 rounded font-semibold"
						>
							{loading ? "Connexion..." : "Se connecter"}
						</button>
					</form>

					<p className="text-sm text-gray-400 mt-4">
						Pas encore de compte ?{" "}
						<Link to="/register" className="text-primary hover:underline">
							Inscription
						</Link>
					</p>
				</div>
			</main>

			<Footer />
		</div>
	);
}

export default Login;
