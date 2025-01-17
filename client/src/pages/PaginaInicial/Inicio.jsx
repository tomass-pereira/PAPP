import React from "react";
import NavBar from "../../components/NavBar";
import SideBar from "../../components/SideBar";

export default function Inicio() {
  return (
    <>
      <div className="">
        <NavBar />
      </div>
      <div className="flex overflow-hidden ">
        <SideBar />
      </div>
    </>
  );
}
