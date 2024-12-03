import React, { useState } from "react";

function RadioButtons(props) {
  const [sim, setSim] = useState(false);

  function handleradio(e) {
    e.target.value === "Sim" ? (
      setSim(true)
    ):setSim(false);
  }

  return (
    <div className="sm:col-span-2 ">
      <label className="block text-sm font-medium mb-2">{props.assunto}</label>
      <div className="flex gap-4">
        <label htmlFor="sim" className="flex items-center gap-2">
          <input
            type="radio"
            id={props.id}
            name={props.name}
            value="Sim"
            className="text-[#4f4fb9] focus:ring-[#4f4fb9]"
            onChange={handleradio}
            
          />
          <span>Sim</span>
        </label>

        <label htmlFor="nao" className="flex items-center gap-2">
          <input
            type="radio"
            id={props.id2}
            name={props.name}
            value="Não"
            className="text-[#4f4fb9] focus:ring-[#4f4fb9]"
            onChange={handleradio}
           
          />
          <span>Não</span>
        </label>
      </div>
      {sim ? (
        <>
          <textarea className=" p-3 bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f4fb9]" placeholder='Escreva aqui...'/>
        </>
      ) : null}
    </div>
  );
}

export default RadioButtons;
