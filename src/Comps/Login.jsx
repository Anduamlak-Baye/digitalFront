import { useState } from "react";
import "../Styles/Login.css";
import { Link,useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
    document.title = "Admin Login"
    const navigate = useNavigate()

    const URL  = import.meta.env.VITE_API_URL

    const [formData, setFormData] = useState({
        userName: "",
        password: ""
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();


        // backend request goes here

        axios.post(URL+ "/adminLogin",formData)
        .then(res => {
            const { token , restaurantId } = res.data
            localStorage.setItem('adminToken',token)
            localStorage.setItem('restaurantId',restaurantId)
            console.log(res.data)
            
            navigate('/admin-panel')

        })
        .catch(err => {
            alert(err)
            console.error(err)
        })
    };

    return (
        <div className="login-page">

            <form className="login-form" onSubmit={handleSubmit}>

                <h1>Admin Login</h1>

                <input
                    type="userName"
                    name="userName"
                    placeholder="Enter userName"
                    value={formData.userName}
                    onChange={handleChange}
                    required
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Enter Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />

            <Link><button onClick={handleSubmit}> Login</button></Link>


            </form>
        </div>
    );
}

export default Login;