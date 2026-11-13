import { useState } from "react"

export default function Authform(){
    const [isLogin, setIsLogin] = useState(true)
    return(
        <div className="container">
            <div className="form-container">
                <div className="form-toggle">
                    <button className={isLogin ? 'active' : ""} onClick={() => setIsLogin(true)}>Login</button>
                    <button className={!isLogin ? 'active' : ""} onClick={() => setIsLogin(false)}>SignUp</button>
                </div>
                {isLogin ? <>
                <form className="form" autoComplete="off" onSubmit={(event) => event.preventDefault()}>
                    <h2>Login Form</h2>
                    <input type='email' placeholder="Enter Email" />
                    <input type='password' placeholder="Enter Password" />
                    <a href="#">Forget Password</a>
                    <button>Login</button>
                    <p>Not a Member? <a href="#" onClick={() => setIsLogin(false)}>Signup now</a></p>
                </form>
                </>: <><div className="form">
                    <h2>Signin Form</h2>
                    <input type='email' placeholder="Enter Email" />
                    <input type='password' placeholder="Enter Password" />
                    <input type='password' placeholder="Conform Password" />
                    <button>FignUp</button>
                    </div></>}
            </div>
        </div>
    )
}
