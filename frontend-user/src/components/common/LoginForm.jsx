import { useState } from "react";

function LoginForm() {
/* Todo : Créez la variable d’état pour stocker dans un objet le mail et le mot de passe et initialisez-la */
const [credentials, setCredentials] = useState({ email: "", password: "" });
/* Todo : Créez et codez la fonction déclenchée à la modification du mail ou du mot de passe et celle
déclenchée à la soumission du formulaire (affichage dans la console de l’objet complet)*/
const handleInputChange = (e) => {
  const { name, value } = e.target;
  setCredentials(prev => ({
    ...prev,
    [name]: value
  }));
};

const handleSubmit = (e) => {
  e.preventDefault();
  console.log(credentials);
};

 return (
 <form onSubmit={handleSubmit}>
 <input name="email" value={credentials.email} onChange={handleInputChange} />
 <input name="password" type="password" value={credentials.password} onChange={handleInputChange} />
 <button type="submit">Valider</button>
 </form>
 );
}
export default LoginForm;