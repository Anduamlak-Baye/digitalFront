import { useState } from "react";
import "../Styles/Login.css";
import { Link,useNavigate } from "react-router-dom";
import axios from "axios";

function SuperLogin() {
    const navigate = useNavigate()

    const URL  = import.meta.env.VITE_API_URL

    const [formData, setFormData] = useState({
        superPassword: ""
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

        axios.post(URL+ "/superLogin",formData)
        .then(res => {
            const { superToken  } = res.data
            localStorage.setItem('superToken', superToken)
            console.log(superToken)
            navigate('/super-admin-panel')

        })
        .catch(err => {
            alert(err)
            console.error(err)
        })
    };

    return (
        <div className="login-page">

            <form className="login-form" onSubmit={handleSubmit}>

                <h1>Welcome </h1>

                <input
                    type="password"
                    name="superPassword"
                    placeholder="Enter Password"
                    value={formData.superPassword}
                    onChange={handleChange}
                    required
                />

            <Link><button onClick={handleSubmit}> Login</button></Link>


            </form>
        </div>
    );
}

export default SuperLogin;