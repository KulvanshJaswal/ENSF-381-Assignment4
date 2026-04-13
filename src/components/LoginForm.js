import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import DisplayStatus from './DisplayStatus';

function LoginForm() {
const [username, setUsername] = useState("");
const [password, setPassword] = useState("");
const [message, setMessage] = useState("");
const [messageType, setMessageType] = useState("");
const navigate = useNavigate();

useEffect(() => {
if(messageType === "success"){
setTimeout(() => {
navigate('/flavors');
}, 2000);
}
}, [messageType]);

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
setMessage("Login successful! Redirecting...");
setMessageType("success");
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
<h2>Login</h2>
<form onSubmit={handleSubmit}>
<label>Username:</label>
<input
type="text"
value={username}
onChange={(e) => setUs7ername(e.target.value)}
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
</form>
<p>Forgot Password?</p> 
<p>Need an account? <Link to="/signup">Sign up</Link></p>
{message && <DisplayStatus type={messageType} message={message} />}
</div>
);
}

export default LoginForm;