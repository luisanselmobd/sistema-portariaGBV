import './Pessoas.css';
import Cadastros from '../Componentes Secundários/Cadastros'
import Tabelas from '../Componentes Secundários/Tabelas'
import {useState, useEffect} from 'react'



function Pessoas(props) {
  const pagina = props.pagina;
  const usuario = props.usuario;
  const [dados, setDados] = useState({dados: '', colunas: ''});
  const [colunas, setColunas] = useState(null);
  console.log(props)

  useEffect(() => {
    carregarDados();
  }, [props.pagina]);

  

  const carregarDados = () => {
  const filtroNomesTerceiros = []
  const filtroEmpresasTerceiros = []
  const filtroCrachasTerceiros = []
  const filtroPlacasTerceiros = []
  const filtroSolicitantesTerceiros = []
  const filtroMotivosTerceiros = []
  const filtroEntradasTerceiros = []
  const filtroSaidasTerceiros = []

    fetch('http://localhost:3001/terceiros')
      .then((response) => response.json())
      .then((json) => {
        const novosDados = json.map((dado) => {
          
          if(!filtroNomesTerceiros.find(filtro => filtro.value == dado.nome)) filtroNomesTerceiros.push({
            text: dado.nome,
            value: dado.nome,
          })
        
          if(!filtroEmpresasTerceiros.find(filtro => filtro.value == dado.empresa)) filtroEmpresasTerceiros.push({
            text: dado.empresa,
            value: dado.empresa,
          })
        
          if(!filtroCrachasTerceiros.find(filtro => filtro.value == dado.cracha)) filtroCrachasTerceiros.push({
            text: dado.cracha,
            value: dado.cracha,
          })
        
          if(!filtroPlacasTerceiros.find(filtro => filtro.value == dado.placaVeiculo)) filtroPlacasTerceiros.push({
            text: dado.placaVeiculo,
            value: dado.placaVeiculo,
          })
        
          if(!filtroSolicitantesTerceiros.find(filtro => filtro.value == dado.solicitante)) filtroSolicitantesTerceiros.push({
            text: dado.solicitante,
            value: dado.solicitante,
          })
        
          if(!filtroMotivosTerceiros.find(filtro => filtro.value == dado.motivo)) filtroMotivosTerceiros.push({
            text: dado.motivo,
            value: dado.motivo,
          })
      
          if(!filtroEntradasTerceiros.find(filtro => filtro.value == dado.entrada.momento)) filtroEntradasTerceiros.push({
            text: new Date(dado.entrada.momento).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'medium' }),
            value: dado.entrada.momento,
          })
      
          if(!filtroSaidasTerceiros.find(filtro => filtro.value == dado.saida.momento)) filtroSaidasTerceiros.push({
            text: new Date(dado.saida.momento).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'medium' }),
            value: dado.saida.momento,
          })
          
          
          return {
          key: dado.id,
          nome: dado.nome,
          empresa: dado.empresa,
          cracha: dado.cracha,
          placaVeiculo: dado.placaVeiculo,
          solicitante: dado.solicitante,
          motivo: dado.motivo,
          entrada: new Date(dado.entrada.momento).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'medium' }),
          saida: (dado.saida.momento == false ? "Não realizada" : new Date(dado.saida.momento).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'medium' })),
          entradaOriginal: dado.entrada.momento,
          saidaOriginal: dado.saida.momento,
          materiais: (dado.entrada.materiais || dado.saida.materiais) ? 'sim' : 'não',
          documento: dado.documento,
          foto: dado.foto,
          materiaisEntrada: dado.entrada.materiais,
          tipo: dado.tipo,
          materiaisSaida: dado.saida.materiais
        }
        
        
      });

      const novasColunas = [
        {
          title: 'Nome',
          fixed: 'left',
          dataIndex: 'nome',
          maxWidth: '130ch',
          filters: filtroNomesTerceiros.sort((a,b) => a.value.localeCompare(b.value)),
          onFilter: (value, record) => record.nome === value,
          filterSearch: true,
          sorter: (a, b) => a.nome.localeCompare(b.nome),
          sortDirections: ['ascend', 'descend'],
        },
        {
          title: 'Empresa',
          dataIndex: 'empresa',
          responsive: ['md'],
          width: 'auto',
          maxWidth: '05ch',
          filters: filtroEmpresasTerceiros.sort((a,b) => a.value.localeCompare(b.value)),
          onFilter: (value, record) => record.empresa === value,
          filterSearch: true,
          sorter: (a, b) => a.empresa.localeCompare(b.empresa),
          sortDirections: ['ascend', 'descend'],
        },
        {
          title: 'Crachá',
          dataIndex: 'cracha',
          width: 100,
          responsive: ['md'],
          filters: filtroCrachasTerceiros.sort((a,b) => a.value-b.value),
          onFilter: (value, record) => record.cracha === value,
          filterSearch: true,
          sorter: (a, b) => a.cracha - b.cracha,
          sortDirections: ['ascend', 'descend'],
        },
        {
          title: 'Placa',
          dataIndex: 'placaVeiculo',
          width: 120,
          responsive: ['md'],
          filters: filtroPlacasTerceiros.sort((a,b) => a.value.localeCompare(b.value)),
          onFilter: (value, record) => record.placaVeiculo === value,
          filterSearch: true,
          sorter: (a, b) => a.placaVeiculo.localeCompare(b.placaVeiculo),
          sortDirections: ['ascend', 'descend'],
        },
        {
          title: 'Solicitante',
          dataIndex: 'solicitante',
          filters: filtroSolicitantesTerceiros.sort((a,b) => a.value.localeCompare(b.value)),
          onFilter: (value, record) => record.solicitante === value,
          filterSearch: true,
          sorter: (a, b) => a.solicitante.localeCompare(b.solicitante),
          sortDirections: ['ascend', 'descend'],
        },
        {
          title: 'Motivo',
          dataIndex: 'motivo',
          filters: filtroMotivosTerceiros.sort((a,b) => a.value.localeCompare(b.value)),
          onFilter: (value, record) => record.motivo === value,
          filterSearch: true,
          sorter: (a, b) => a.motivo.localeCompare(b.motivo),
          sortDirections: ['ascend', 'descend'],
        },
        {
          title: 'Entrada',
          dataIndex: 'entrada',
          filters: filtroEntradasTerceiros.sort((a,b) => new Date(a.value) - new Date(b.value)),
          onFilter: (value, record) => record.entrada === new Date(value).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'medium' }),
          filterSearch: true,
          sorter: (a, b) => new Date(a.entradaOriginal) - new Date(b.entradaOriginal),
          sortDirections: ['ascend', 'descend'],
        },
        {
          title: 'Saída',
          dataIndex: 'saida',
          filters: filtroSaidasTerceiros.sort((a,b) => new Date(a.value) - new Date(b.value)),
          onFilter: (value, record) => record.saida === new Date(value).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'medium' }),
          filterSearch: true,
          sorter: (a, b) => new Date(a.saidaOriginal) - new Date(b.saidaOriginal),
          sortDirections: ['ascend', 'descend'],
        },
        {
          title: 'Materiais',
          dataIndex: 'materiais',
          filters: [
            {
              text: 'Sim',
              value: 'sim',
            },
            {
              text: 'Não',
              value: 'não',
            }
          ],
          onFilter: (value, record) => record.materiais == value,
          filterSearch: true,
          sorter: (a, b) => a.materiais.localeCompare(b.materiais),
          sortDirections: ['ascend', 'descend'],
        }
      ];

        setDados({dados: novosDados, colunas: novasColunas});


      });
  };

  return (
    <>
      {pagina === 'cadastroTerceiros' && <Cadastros pagina={pagina} atualizar={carregarDados} />}
      {(pagina === 'terceiros' || pagina === "tabelaTerceiros") && <Tabelas usuario={usuario} pagina={pagina} dados={dados} atualizar={carregarDados} />}
    </>
  );
}

export default Pessoas;
// import Cadastros from '../Componentes Secundários/Cadastros'
// import Tabelas from '../Componentes Secundários/Tabelas'
// import { useState, useEffect } from 'react'

// function Pessoas(props) {
//   const pagina = props.pagina;
//   const usuario = props.usuario;
//   const [dados, setDados] = useState([]);

//   useEffect(() => {
//     carregarDados();
//   }, []);

//   const carregarDados = () => {
//     const filtroNomesTerceiros = [];
//     const filtroEmpresasTerceiros = [];
//     const filtroCrachasTerceiros = [];
//     const filtroPlacasTerceiros = [];
//     const filtroSolicitantesTerceiros = [];
//     const filtroMotivosTerceiros = [];
//     const filtroEntradasTerceiros = [];
//     const filtroSaidasTerceiros = [];

//     fetch('http://localhost:3001/terceiros')
//       .then((response) => response.json())
//       .then((json) => {
//         const novosDados = json.map((dado) => {
//           // Criação dos filtros
//           if (!filtroNomesTerceiros.find(filtro => filtro.value === dado.nome)) {
//             filtroNomesTerceiros.push({
//               text: dado.nome,
//               value: dado.nome,
//             });
//           }

//           // Criação das demais constantes de filtro (empresas, crachás, etc.)

//           return {
//             key: dado.id,
//             nome: dado.nome,
//             empresa: dado.empresa,
//             cracha: dado.cracha,
//             placaVeiculo: dado.placaVeiculo,
//             solicitante: dado.solicitante,
//             motivo: dado.motivo,
//             entrada: new Date(dado.entrada.momento).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'medium' }),
//             saida: new Date(dado.saida.momento).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'medium' }),
//             entradaOriginal: dado.entrada.momento,
//             saidaOriginal: dado.saida.momento,
//             materiais: (dado.entrada.materiais || dado.saida.materiais) ? 'sim' : 'não',
//             documento: dado.documento,
//             foto: dado.foto,
//             materiaisEntrada: dado.entrada.materiais,
//             materiaisSaida: dado.saida.materiais
//           };
//         });

//         setDados(novosDados);

//         const colunasTerceiros = [
//           // Definição das colunas utilizando os filtros criados
//         ];

//         // Utilize as variáveis dados e colunasTerceiros conforme necessário
//       });
//   };

//   return (
//     <>
//       {pagina === 'cadastroTerceiros' && <Cadastros pagina={pagina} />}
//       {(pagina === 'terceiros' || pagina === "tabela