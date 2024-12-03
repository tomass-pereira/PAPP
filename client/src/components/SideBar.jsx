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
        <div className="bottom-20">
          <h3 class="px-4 text-sm font-medium text-indigo-200 uppercase tracking-wider ">
            Meu perfil
          </h3>
          <a
            href="#"
            className=" flex items-center  space-x-3 px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span>Definições</span>
          </a>
        </div>
      </nav>
    </div>

  );
}
export default SideBar;
