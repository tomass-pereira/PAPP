import React from "react";
import NavBar from "../../components/NavBar";
import SideBar from "../../components/SideBar";
import Calendario from "../../components/calendar";

export default function MinhasSessoes() {
  return (
    <>
      <NavBar />
      <div className="flex" >
      <SideBar/>
     <div className="flex-grow">
       <h1 className="m-7 font-semibold text-2xl">Veja aqui as suas sessões!</h1>

    
     </div>
      </div>

    </>
  );
}
