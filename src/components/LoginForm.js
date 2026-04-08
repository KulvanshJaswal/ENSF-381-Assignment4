import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
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

        if(username.length == 0){
            setMessage("Username cannot be empty");
            setMessageType("error");
            return;
        }

        if(password.length < 8){
            setMessage("Password must be atleast 8 characters");
            setMessageType("error");
            return;
        }

        try{
            let response = await fetch(`https://jsonplaceholder.typicode.com/users`);
            let data = await response.json();
            
            let foundUser = null;

            for(let user of data){
                if (user.username.toLowerCase() === username.toLowerCase()) {
                        foundUser = user;
                        break;
                }
            }
            if (!foundUser) {
                setMessage("Username not found");
                setMessageType("error");
            } else if (foundUser.email !== password) {
                setMessage("Incorrect password");
                setMessageType("error");
            } else {
                setMessage("Login successful! Redirecting...");
                setMessageType("success");
            }
            
        } catch (error){
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
            </form>
            <p>Forgot Password?</p>
            {message && <DisplayStatus type={messageType} message={message} />}
        </div>
    );
}

export default LoginForm;