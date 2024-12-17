import React from "react";
import NavBar from "../../components/NavBar";
import Section from "../../components/Section";
import SideBar from "../../components/SideBar";
import Calendar from "../../components/Calendar2";

export default function AgendarSessao() {
  return (
    <>
      <div>
        <NavBar />
        <div className="flex">
          <SideBar />
          <div className="flex-grow p-7">
            <h1 className="font-semibold text-2xl mb-5">
              Agende aqui a sua sessão!
            </h1>

            <div className="mt-3">
                  <Calendar />






            </div>

          </div>
        </div>
      </div>
    </>

  );
}
