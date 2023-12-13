import { useState } from 'react'
import { useNavigate } from "react-router-dom";
import ApiClient from '../ApiClient'
import './LoginPage.scss'

const LoginPage = () => {
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null as string | null)
    const [uuid, setUuid] = useState("")
    const navigate = useNavigate();

    const login = () => {
        setLoading(true)
        ApiClient
        .login(uuid)
        .then(() => {
            navigate("/");
        })
        .catch((e) => {
            setErrorMessage("Oups")
            setLoading(false)
        })
    }
    
    return <div className="login-container">
        <div className="login-frame">
            <div className="logo-container"/>
            <div className="input-frame">
                <input value={uuid} data-form-type="password" onChange={e => setUuid(e.target.value)}/>
            </div>

            <div className="btn block" onClick={login}>
                <div className="text">CONNEXION</div>
            </div>
            { loading && <div>CHARGEMENT...</div>}
            { errorMessage && <div>{ errorMessage }</div>}
        </div>
    </div>
}

export default LoginPage;