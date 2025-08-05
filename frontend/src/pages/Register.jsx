import axios from "axios";
import { useState , useEffect} from "react";
import { useNavigate } from "react-router-dom";

function Register( {token , setToken}) {

    const navigate = useNavigate();

    const [username , setUserName] = useState("");
    const [email , setEmail] = useState("");
    const [password , setPassword] = useState("");

     useEffect(() => {
            if (token) {
                navigate('/');
            }
        }, [token, navigate]);


    const handleSubmit = async() =>{
        try{
            const res = await axios.post('http://localhost:5000/register' , {username , email , password});
            console.log(res.data.token);
            setToken(res.data.token);

        }catch(error){
            console.error("There is some problem:" , error);
        }
        
        
    }

    return (
        <div className="container-fluid" style={{
            display: "flex",
            justifyContent: "center",
            alignContent: "center"
        }}>
            <div className="card" style={{ width: "36rem" }}>
                <div className="card-header" style={{ textAlign: "center" }}>
                    register Page
                </div>
                <div className="card-body">
                    <div className="form-floating mb-3">
                        <input type="text" className="form-control" id="floatingUsername" placeholder="User Name" value={username} onChange={(e)=> setUserName(e.target.value)}/>
                        <label htmlFor="floatingUsername">User Name</label>
                    </div>
                    <div className="form-floating mb-3">
                        <input type="email" className="form-control" id="floatingEmail" placeholder="name@example.com" value={email} onChange={(e)=> setEmail(e.target.value)}/>
                        <label htmlFor="floatingEmail">Email address</label>
                    </div>
                    <div className="form-floating">
                        <input type="password" className="form-control" id="floatingPassword" placeholder="Password" value={password} onChange={(e)=> setPassword(e.target.value) } />
                        <label htmlFor="floatingPassword">Password</label>
                    </div>

                    <button type="button" class="btn btn-outline-info" onClick={handleSubmit}>Submit</button>
                </div>
            </div>
        </div>
    );
}

export default Register;
