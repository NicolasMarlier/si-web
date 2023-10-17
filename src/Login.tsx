import React, { useState } from 'react'
import { useNavigate } from "react-router-dom";
import ApiClient from './ApiClient'

const Login:React.FC = () => {
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null as string | null)
    const [uuid, setUuid] = useState("")
    const navigate = useNavigate();

    const login = () => {
        setLoading(true)
        ApiClient
        .login(uuid)
        .then(() => {
            console.log("HELLO, YES!")
            navigate("/");
        })
        .catch((e) => {
            setErrorMessage("Oups")
            setLoading(false)
        })
    }
    
    return <div>
        <h3>Please login, dear hunter:</h3>
        <input value={uuid} onChange={e => setUuid(e.target.value)}/>
        <small>Your invader UID</small>

        <div className="btn" onClick={login}>LOGIN</div>
        { loading && <div>Loading...</div>}
        { errorMessage && <div>{ errorMessage }</div>}
    </div>
}

export default Login;