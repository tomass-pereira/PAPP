import { useState } from "react";
import NavBar from "../components/NavBar.jsx";
import Section from "../components/Section.jsx";
import Inputs from "../components/Inputs.jsx";
import RadioButton from "../components/RadioButton.jsx";
import { p } from "framer-motion/client";
import Buttons from "../components/botoes.jsx";

function CreateAccount() {
  const [edificio, setEdificio] = useState(false);
  const [concelhos, setConcelhos] = useState([]);

  function handleEdificio(e) {
    setEdificio(e.target.value === "edificio");
  }
  function handleConcelho(e) {
   
    const distritoSelecionado = e.target.value;
    updateconcelhos(distritoSelecionado);

  }
  function updateconcelhos(distritoSelecionado) {
    let novosConcelhos = [];

    if (distritoSelecionado === "porto") {
      novosConcelhos = [
        { valor: "porto", texto: "Porto" },
        { valor: "matosinhos", texto: "Matosinhos" },
        { valor: "gaia", texto: "Vila Nova de Gaia" },
      ];
    } else if (distritoSelecionado === "aveiro") {
      novosConcelhos = [
        { valor: "aveiro", texto: "Aveiro" },
        { valor: "ilhavo", texto: "Ílhavo" },
        { valor: "espinho", texto: "Espinho" },
      ];
    }

    setConcelhos(novosConcelhos);

  }


  return (
    <>
      <NavBar />
      <form action="/Home">
      <div className="max-w-7xl mx-auto px-8 py-10 bg-white rounded-lg mt-3">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold flex justify-center items-center gap-2">
            Bem-vindo! <span>👋</span>
          </h1>
          <p className="text-indigo-600">
            Precisamos de recolher algumas informações
          </p>
        </div>

        <Section title="Informação Pessoal">
          <Inputs
            id="nome"
            label="Nome Completo"
            type="text"
            placeholder="ex:Tomás Jesus Pereira"
          />
          <Inputs
            id="telefone"
            label="Número de telefone"
            type="text"
            placeholder="+351"
          />
          <Inputs
            id="email"
            label="Endereço email"
            type="email"
            placeholder="@"
          />
          <Inputs id="data" label="Data de nascimento" type="date" />
          <Inputs id="password" label="Palavra-passe" type="password" />

          <Inputs
            id="conf-password"
            label="Confirmação da palavra-passe"
            type="password"
          />
        </Section>
        <Section title="Informação Médica">
          <Inputs id="queixa" label="Queixa principal" type="text" />
          <Inputs
            id="inicio-sintomas"
            label="Inicio dos sintomas"
            type="text"
          />
          <RadioButton
            name="radio-condicao"
            assunto="Possui alguma condição médica?"
            id='sim-condicao'
            id2='nao-condicao'
          />
          <RadioButton
            name="radio-cirugias"
            assunto="Tem lesões ou cirugias anteriores?"
            id='sim-cirugia'
            id2='nao-cirugia'
          />
          <RadioButton
            name="radio-diagonostico"
            assunto="Tem algum diagonóstico médico relevante?"
            id='sim-diago'
            id2='nao-diago'
          />
          <RadioButton
            name="radio-alergias"
            assunto="Tem alergias a medicamentos ou outros tratamentos?"
            id='sim-alergia'
            id2='nao-alergia'
          />
        </Section>
        <Section title="Morada">
          <div className="distrito">
            <label htmlFor="distrito" className="block text-sm font-medium mb-2">Distrito</label>

            <select id="distrito" onChange={handleConcelho} className="w-full h-12 p-0 bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f4fb9]"
            >
              <option selected value="selecionar">Selecione um distrito</option>
              <option value="porto">Porto</option>
              <option value="aveiro">Aveiro</option>
            </select>
          </div>
          <div className="Concelho">
            <label htmlFor="concelho" className="block text-sm font-medium mb-2">Concelho</label>

            <select id="concelho" className="w-full h-12 p-0 bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f4fb9]">
              <option disabled selected value="selecionar">Selecione um distrito</option>
              {concelhos.map((concelho) => (
                <option key={concelho.valor} value={concelho.valor}>{concelho.texto}</option>
              ))}
            </select>
          </div>
          <Inputs
            id="rua"
            label="Rua"
            type="text"
            placeholder="Rua 123"
          />
          <Inputs
            id="codpostal"
            label="Código-postal"
            type='text'
            maxlength="8"
             pattern="\d{4}-\d{3}"
            placeholder=""
          />
          <RadioButton
          name='radio=domicilio'
          assunto='Vive num apartamento?'
                    
          />
        </Section>
        <Buttons
        style='py-4 px-8 mt-0 bg-[#4f4fb9] text-white rounded-md text-base hover:bg-[#3e3e9e] float-right '
        legenda='Criar Conta'
        />

        

      </div>
      </form>
    </>
  );
}

export default CreateAccount;
