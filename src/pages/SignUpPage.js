import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

function SignupPage() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Frontend validation
        if (username.length < 3 || username.length > 20) {
            setMessage("Username must be between 3 and 20 characters");
            setMessageType("error");
            return;
        }

        if (!/^[a-zA-Z]/.test(username)) {
            setMessage("Username must start with a letter");
            setMessageType("error");
            return;
        }

        if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
            setMessage("Username can only contain letters, numbers, underscores, and hyphens");
            setMessageType("error");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setMessage("Invalid email format");
            setMessageType("error");
            return;
        }

        if (password.length < 8) {
            setMessage("Password must be at least 8 characters");
            setMessageType("error");
            return;
        }

        if (!/[A-Z]/.test(password)) {
            setMessage("Password must contain at least one uppercase letter");
            setMessageType("error");
            return;
        }

        if (!/[a-z]/.test(password)) {
            setMessage("Password must contain at least one lowercase letter");
            setMessageType("error");
            return;
        }

        if (!/[0-9]/.test(password)) {
            setMessage("Password must contain at least one number");
            setMessageType("error");
            return;
        }

        if (!/[^a-zA-Z0-9]/.test(password)) {
            setMessage("Password must contain at least one special character");
            setMessageType("error");
            return;
        }

        if (password !== confirmPassword) {
            setMessage("Passwords do not match");
            setMessageType("error");
            return;
        }

        try {
            let response = await fetch("http://localhost:5000/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: username, email: email, password: password })
            });
            let data = await response.json();

            if (data.success) {
                setMessage("Registration successful! Redirecting to login...");
                setMessageType("success");
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else {
                setMessage(data.message);
                setMessageType("error");
            }
        } catch (error) {
            console.log("Error:", error);
        }
    };

    return (
        <div>
            <Header />
            <div className="login-form">
                <form onSubmit={handleSubmit}>
                    <h2 className="login-title">Signup</h2>

                    <label>Username</label>
                    <input
                        className="login-input"
                        type="text"
                        placeholder="Username"
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <br/>

                    <label>Email</label>
                    <input
                        className="login-input"
                        type="text"
                        placeholder="Email"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <br/>

                    <label>Password</label>
                    <input
                        className="login-input"
                        type="password"
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <br/>

                    <label>Confirm Password</label>
                    <input
                        className="login-input"
                        type="password"
                        placeholder="Confirm Password"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <br/>

                    <button className="login-button" type="submit">Signup</button>

                    <p>Already have an account? <Link to="/login">Login</Link></p>

                    {message && <p style={{ color: messageType === "error" ? "red" : "green" }}>{message}</p>}
                </form>
            </div>
            <Footer />
        </div>
    );
}

export default SignupPage;