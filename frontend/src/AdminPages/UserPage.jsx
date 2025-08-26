import axios from "axios";
import { useEffect, useState } from "react";

const BackendUrl = import.meta.env.VITE_APP_BackendUrl;

function UserPage() {

    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`${BackendUrl}/dashboard/users`); // ✅ typo fixed here too
                console.log("Server response:", res.data);
                setUsers(res.data);
            } catch (error) {
                console.error("Error in fetching Users:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <>
            <h1>current users</h1>
            {Array.isArray(users) ? (
                <ul>
                    {users.map((user, index) => (
                        <li key={index}>{user.username} -  {user.email}</li>
                    ))}
                </ul>
            ) :
                <p>THERE ARE NOT CURRENT USERS RIGHT NOW!!!</p>
            }
        </>
    )

}

export default UserPage;