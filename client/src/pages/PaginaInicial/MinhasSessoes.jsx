import React,{useEffect}  from "react";
import { useNavigate } from 'react-router-dom';

import SideBar from "../../components/SideBar";
import CalendarApp from "../../components/Calendar/CalendarX";

export default function MinhasSessoes() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/LoginPage');
    }
  }, [navigate]);
  return (
    <>
     <div className="flex min-h-screen bg-gray-50">
      <SideBar />
      <main className="flex-1 overflow-auto">
        <CalendarApp/>
      </main>
    </div>

    </>
  );
}
