import "../App.css";
import SubmitButton from "./components/Button/SubmitButton";
import FormInput from "./components/Input/Input";
import LoginPage from "./pages/authPage/Login";
import RegisterForm from "./pages/authPage/Register";

function App() {
  return (
    <>
      <LoginPage />
      <RegisterForm />
    </>
  );
}

export default App;
