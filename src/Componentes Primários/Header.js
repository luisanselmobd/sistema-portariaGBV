import './Header.css';
import { TeamOutlined, LogoutOutlined, KeyOutlined, LockOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import { useState } from 'react';
import {Link, useNavigate} from 'react-router-dom'

function Header(props) {

  const usuario = props.usuario

  let itens = [
    {
      label: 'Terceiros',
      key: 'terceiros',
      icon: <TeamOutlined />,
    },
    {
      label: 'Chaves',
      key: 'chaves',
      icon: <KeyOutlined />,
    },
    {
      label: 'Sair',
      key: 'sair',
      icon: <LogoutOutlined />,
    }
  ];

  if(usuario == "administrativo") {
    const acessos = {
      label: 'Acessos',
      key: 'acessos',
      icon: <LockOutlined />
    }
    itens.splice(2,0, acessos)
  } 

  if(usuario === 'portaria') {
    itens[0].children = [
      {
      label:'Cadastros pendentes',
      key: 'cadastroTerceiros'
    },
    {label: 'Todos os cadastros',
  key: 'tabelaTerceiros'}
    ];
    itens[1].children = [
      {
      label:'Cadastros pendentes',
      key: 'cadastroChaves'
    },
    {label: 'Todos os cadastros',
    key: 'tabelaChaves'}
    ];
  }
  const navigate = useNavigate();

  const onClick = (e) => {
    props.obterPagina(e.key, e.keyPath);
    if(e.key != "sair") navigate(`/${e.key}`)
    else {
      navigate("/")
    }
  };

  return (
    <header className="Header">
      <img className="logoGBV" src='./grupo.png' alt="logo do Grupo Bons Ventos" />
      <Menu className="menuHeader" onClick={onClick}  mode="horizontal" items={itens} />
    </header>
  );
}

export default Header;





