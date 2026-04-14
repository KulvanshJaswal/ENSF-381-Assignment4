import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import DisplayStatus from './DisplayStatus';

function LoginForm() {
const [username, setUsername] = useState("");
const [password, setPassword] = useState("");
const [message, setMessage] = useState("");
const [messageType, setMessageType] = useState("");
const navigate = useNavigate();


const handleSubmit = async (e) => {
e.preventDefault();

if(username.length === 0){
setMessage("Username cannot be empty");
setMessageType("error");
return;
}

if(password.length < 8){
setMessage("Password must be at least 8 characters");
setMessageType("error");
return;
}

try {
let response = await fetch("http://localhost:5000/login", {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({ username: username, password: password })
});
let data = await response.json();

if (data.success) {
localStorage.setItem("userId", data.userId);
localStorage.setItem("username", data.username);
setMessage("Login successful");
setMessageType("success");
setTimeout(() => {
        window.location.href = '/flavors';
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
<form onSubmit={handleSubmit}>
<h2>Login</h2>
<label>Username:</label>
<input
type="text"
value={username}
onChange={(e) => setUsername(e.target.value)}
/>
<br/>
<label>Password:</label>
<input
type="password"
value={password}
onChange={(e) => setPassword(e.target.value)}
/>
<br/>
<button type="submit">Login</button>
<br></br>

<a href="#">Forgot Password?</a>
<p>Need an account? <Link to="/signup">Sign up</Link></p>
{message && <DisplayStatus type={messageType} message={message} />}
</form>
</div>
);
}

export default LoginForm;