import React from "react";
import SideBar from "../../components/SideBar";
import CalendarApp from "../../components/Calendar/CalendarX";

export default function AgendarSessao() {
  return (
    <>
    <div className="flex min-h-screen bg-gray-50">
      <SideBar />
      <main >
        <CalendarApp/>
      </main>
    </div>
    </>

  );
}
