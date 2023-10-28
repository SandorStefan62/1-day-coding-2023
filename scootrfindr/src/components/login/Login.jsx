import { useState } from "react";
import axios from "axios";

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userRole, setUserRole] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.get(`http://localhost:3000/users?email=${email}&password=${password}`);
            const user = response.data;
            setUserRole(user.role);

            if (user.role === 'admin') {
                window.location.href = '/admin';
            } else {
                window.location.href = '/user';
            }
        } catch (error) {
            console.error('Error during login:', error);
        }
    };
    return (
        <>
            <h1>Login Page</h1>
            <h1>start of an epic app</h1>
            <h1>scootrfindr ✔</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button type="submit">Login</button>
            </form>
        </>
    )
}

export default Login