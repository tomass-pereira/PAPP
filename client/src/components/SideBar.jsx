import React from "react";
import SideBarItem from "./SideBarItem";

function SideBar() {
  return (
    <div className=" h-screen  w-64 bg-indigo-600 text-white p-4 flex flex-col">
      <nav className="space-y-2 flex-1 overflow-hidden">
        <SideBarItem
          texto="Início"
          icone="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          destino="/Inicio"
        />
        <SideBarItem
          texto="Minhas sessões"
          icone="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          destino="/MinhasSessoes"
        />
        <SideBarItem
          texto="Agendar sessão"
          icone="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          destino="/AgendarSessao"
        />
        <SideBarItem
          texto="Exercícios"
          icone="M13 10V3L4 14h7v7l9-11h-7z"
          destino="/exercicios"
        />
        
      </nav>
    </div>

  );
}
export default SideBar;
