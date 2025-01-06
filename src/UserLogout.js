import React from 'react';
import axios from 'axios';

const Logout = ({ handleLogout }) => {
  const handleLogoutClick = async () => {
    try {
      const response = await axios.post('/logout');
      if (response.status === 200) {
      
        handleLogout(); 
      } else {
        alert("Logout failed, please try again.");
      }
    } catch (error) {
      console.error("Logout error:", error);
      alert("Logout failed, please try again.");
    }
  };
  return (
    <div>
      <button className="btn btn-danger" onClick={handleLogoutClick}>Logout</button>
    </div>
  );
};

export default Logout;
