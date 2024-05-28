import axios from "axios";
import { useEffect, useState } from "react";
import { FaBan } from "react-icons/fa";
import "./manageruser.scss";

function ManageUser() {
  const [user, setUser] = useState<[]>([]);

  const handleBan = (id: number) => {
    axios
      .put("http://localhost:8080/api/user/ban-user", {
        UserID: id,
      })
      .then(() => {
        alert("Banned Success!");
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error banning user:", error);
      });
  };

  useEffect(() => {
    axios.get("http://localhost:8080/api/user/get-user").then((res) => {
      setUser(res.data);
    });
  }, []);

  return (
    <div className="outer-manager-container">
      <div className="bg-primary middle-manager-container">
        <h1 className="text-h1">Manage Users</h1>
        <table className="table1">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Status Account</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {user.map((user: any, index: number) => {
              return user.Role !== "Admin" ? (
                <tr key={index}>
                  <td>
                    {user.FirstName} {user.LastName}
                  </td>
                  <td>{user.Email}</td>
                  {user.AccountStatus === 1 ? (
                    <td>Active</td>
                  ) : (
                    <td>Inactive</td>
                  )}
                  {user.AccountStatus === 1 && (
                    <td>
                      <FaBan
                        className="banned-logo"
                        onClick={() => handleBan(user.UserID)}
                      />
                    </td>
                  )}
                </tr>
              ) : null;
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManageUser;
