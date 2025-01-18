import React from "react";
import SideBar from "../../components/SideBar";
import CalendarApp from "../../components/CalendarX";

export default function MinhasSessoes() {
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
