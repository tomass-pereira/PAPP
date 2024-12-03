import NavBar from "../components/NavBar.jsx";
import { Link } from "react-router-dom";
import Inputs from "../components/Inputs.jsx";
import  Buttons from "../components/botoes.jsx"


function LoginPage() {
  return (
    <>
      <NavBar titulo='Tomás'/>
      <div className="container flex gap-[150px] max-w-[1200px] mx-auto p-5">
      <div>
                <div class="mt-20 relative w-96 h-96">
                    <div class="relative top-10 left-6 w-96 h-96 rounded-full overflow-hidden">
                        <img src="../imgs/logo2.png" alt="Profile Image" class="absolute z-20 w-full h-full rounded-full"/>
                    </div>                   
                </div>
            </div>

        <div className="form-section mt-[150px] flex-1 w-[600px]  p-5 rounded-lg h-auto ">
        <h1 className="text-3xl font-bold flex justify-center items-center gap-2 mb-6">
            Olá, outra vez! <span>👋</span>
          </h1>          
          <form>
            <div className="form-group mb-6">
             <Inputs
             id='email'
             label='Email'
             type='email'
                        
             />
            </div>

            <div className="form-group mb-6">
            <Inputs
             id='password'
             label='Password'
             type='password'
                        
             />
            </div>

            <div className="forgot-password text-right mb-8">
              <a href="#" className="text-indigo-600 text-sm">
                Esqueceu-se da palavra-passe?
              </a>
            </div>

            <Buttons
            style="login-button w-full p-3 bg-indigo-600 text-white rounded-md text-sm cursor-pointer mb-4 hover:bg-[#5558DD]"
            legenda='Iniciar Sessão'
            
            />
          </form>
        </div>
      </div>
    </>
  );
}
export default LoginPage;
