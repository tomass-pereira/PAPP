  import React from "react";
  import NavBar from "../components/NavBar";
  import SideBar from "../components/SideBar";
  import Calendario from "../components/calendar";

  export default function Home() {
    return (
      <>
        <NavBar />

        <div className="flex" >
        <SideBar/>
       <div className="flex-grow">

        <Calendario />
       </div>
        </div>
  
      </>
    );
  }
