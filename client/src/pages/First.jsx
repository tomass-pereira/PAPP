// First.jsx
import React from "react";
import NavBar from "../components/NavBar.jsx";
import Footer from "../components/Footer.jsx";

function First() {
  return (
    <>
      <NavBar style="fixed flex items-center justify-between bg-white py-4 px-8 border-b top-0 z-50 w-full" />

      <div id="inicio" className="flex pt-0">
        <section className="overflow-hidden bg-gray-50 sm:grid sm:grid-cols-2">
          <div className="p-8 md:p-12 lg:px-16 lg:py-24">
            <div className="mx-auto max-w-xl text-center ltr:sm:text-left rtl:sm:text-right">
              <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit
              </h2>

              <p className="hidden text-gray-500 md:mt-4 md:block">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Et,
                egestas tempus tellus etiam sed. Quam a scelerisque amet
                ullamcorper eu enim et fermentum, augue. Aliquet amet volutpat
                quisque ut interdum tincidunt duis.
              </p>

              <div className="mt-4 md:mt-8">
                <a
                  href="#"
                  className="inline-block rounded bg-[#4f4fb9] px-12 py-3 text-sm font-medium text-white transition hover:bg-[#3e3e9e]"
                >
                  Inicia sessão agora
                </a>
              </div>
            </div>
          </div>

          <img
            alt=""
            src="https://images.unsplash.com/photo-1464582883107-8adf2dca8a9f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
            className="h-56 w-full object-cover sm:h-full"
          />
        </section>
      </div>

      <div
        id="servicos"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-7 max-w-7xl mx-auto px-4 py-8 md:py-16 scroll-mt-20"
      >
       
      </div>

      <div id="contactos" className="block scroll-mt-20">
        <Footer />
      </div>
    </>
  );
}

export default First;
