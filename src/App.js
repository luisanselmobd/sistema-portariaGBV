import './App.css';
import Header from './Componentes Primários/Header'
import Pessoas from './Componentes Primários/Pessoas'
import Chaves from './Componentes Primários/Chaves'
import Login from './Componentes Primários/Login'
import Acessos from './Componentes Primários/Acessos'
import PaginaNaoEncontrada from './Componentes Primários/PaginaNaoEncontrada'
import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';

function App() {
  const [pagina, setPagina] = useState();
  const [logado, setLogado] = useState(false);
  const [usuario, setUsuario] = useState();

  const obterPagina = (pagina, ref) => {
    if (pagina !== 'sair') {
      setPagina(pagina);
    } else {
      setLogado(false)
      localStorage.setItem('statusLogin', 'deslogado');
      localStorage.setItem('perfilLogado', 'nenhum')
    }
  }

  const obterLogin = (status, chave) => {
    chave === "administrativo" ? setPagina('terceiros') : setPagina('cadastroTerceiros');
    setUsuario(chave);
    setLogado(status);
  }

  useEffect(() => {
    const verLogin = localStorage.getItem('statusLogin') === 'logado';
    if (verLogin) {
      setLogado(true);
      setUsuario(localStorage.getItem('perfilLogado'));
    } else {
      setLogado(false);
      setUsuario();
    }
  }, []);
  





  return (
    <Router>
      <>
        {logado && <Header usuario={usuario} pagina={pagina} obterPagina={obterPagina} />}
        <Routes>
          <Route index path="/" element={<>{!logado ? <Login obterLogin={obterLogin} /> : <Navigate to={usuario=="administrativo" ? "/terceiros" : "/cadastroTerceiros"}></Navigate>}</>} />
          <Route path="/terceiros" element={<>{logado && <Pessoas usuario={usuario} pagina={"terceiros"} />}</>} />
          <Route path="/cadastroTerceiros" element={<>{logado && <Pessoas usuario={usuario} pagina={"cadastroTerceiros"} />}</>} />
          <Route path="/tabelaTerceiros" element={<>{logado && <Pessoas usuario={usuario} pagina={"tabelaTerceiros"} />}</>} />
          <Route path="/chaves" element={<>{logado && <Chaves usuario={usuario} pagina={"chaves"} />}</>} />
          <Route path="/cadastroChaves" element={<>{logado && <Chaves usuario={usuario} pagina={"cadastroChaves"} />}</>} />
          <Route path="/tabelaChaves" element={<>{logado && <Chaves usuario={usuario} pagina={"tabelaChaves"} />}</>} />
          <Route path="/acessos" element={<>{logado && usuario=="administrativo" && <Acessos />}</>} />
          <Route path="/*" element={<PaginaNaoEncontrada />} />
        </Routes>
      </>
    </Router>
  );
}

export default App;
