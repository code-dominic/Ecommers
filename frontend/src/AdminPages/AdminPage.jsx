import axios from "axios";
import { useEffect, useState } from "react";

const BackendUrl = import.meta.env.VITE_APP_BackendUrl;

function AdminPage() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const res = await axios.get(`${BackendUrl}/dashboard/admin`);
        console.log("Server response:", res.data);
        setAdmins(res.data);
      } catch (error) {
        console.error("Error fetching Admins:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdmins();
  }, []);

  return (
    <>
      <h1>Current Admins</h1>

      {loading ? (
        <p>Loading admins...</p>
      ) : Array.isArray(admins) && admins.length > 0 ? (
        <ul>
          {admins.map((admin) => (
            <li key={admin._id || admin.email}>
              {admin.username} - {admin.email}
            </li>
          ))}
        </ul>
      ) : (
        <p>There are no current admins right now!!!</p>
      )}
    </>
  );
}

export default AdminPage;
