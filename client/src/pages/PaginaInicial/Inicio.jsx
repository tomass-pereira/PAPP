import React, { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import SideBar from "../../components/SideBar";
import WeeklyCalendar from "../../components/Calendar2";

export default function Inicio() {
  const navigate = useNavigate();
  const utente = JSON.parse(localStorage.getItem('utente'));

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/LoginPage');
    }
  }, [navigate]);

  return (
    <>
      <div className="">
        
      </div>
      <div className="flex overflow-hidden">
        <SideBar nome={utente?.nome} foto={utente?.profileImage} />  {/* Passando como prop normal */}
      </div>
      
    </>
  );
}