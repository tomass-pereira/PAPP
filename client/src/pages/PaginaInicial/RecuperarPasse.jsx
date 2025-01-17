import React from "react";
import NavBar from "../../components/NavBar";
import Inputs from "../../components/Inputs";
import Buttons from "../../components/botoes";
export default function RecuperarPasse() {
  return (
    <>
      <NavBar />
  

      <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-lg">
          <h1 className="text-center text-2xl font-bold text-indigo-600 sm:text-3xl">
          Recupere a sua password
          </h1>

          <p className="mx-auto mt-4 max-w-md text-center text-gray-500">
          Digite o seu endereço de email e iremos enviar-lhe um link para recuperar a sua password
          </p>

          <form
            action="#"
            className="mb-0 mt-6 space-y-4 rounded-lg p-4 shadow-lg sm:p-6 lg:p-8"
          >
            <p className="text-center text-lg font-medium">
              Digite o seu endereço de email
            </p>

            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>

              <div className="relative">
              <Inputs
                  id="email"
                  label="Endereço email"
                  type="email"
                  placeholder="@"
                />


              
              </div>
            </div>

            <div>
             
            </div>

            <button
              type="submit"
              className="block w-full rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white"
            >
              Enviar email
              </button>

           
          </form>
        </div>
      </div>
    </>
  );
}
