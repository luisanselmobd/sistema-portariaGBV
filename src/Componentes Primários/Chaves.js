import './Chaves.css';
import Cadastros from '../Componentes Secundários/Cadastros'
import Tabelas from '../Componentes Secundários/Tabelas'

import {useState, useEffect} from 'react'

function Chaves(props) {
  const pagina = props.pagina;
  const usuario = props.usuario;
  const [dados, setDados] = useState({dados: '', colunas: ''});

  useEffect(() => {
    carregarDados();
  }, [props.pagina]);

    const carregarDados = () => {

      const filtroNumerosChaves = []
      const filtroPortasChaves = []
      const filtroRetiradasChaves = []
      const filtroRetirantesChaves = []
      const filtroDevolucoesChaves = []
      const filtroDevolvedoresChaves = []


    fetch('http://localhost:3001/chaves')
      .then((response) => response.json())
      .then((json) => {
        const novosDados = json.map((dado) => {


          if(!filtroNumerosChaves.find(filtro => filtro.value == dado.numero)) filtroNumerosChaves.push({
            text: dado.numero,
            value: dado.numero,
          })
      
          if(!filtroPortasChaves.find(filtro => filtro.value == dado.porta)) filtroPortasChaves.push({
            text: dado.porta,
            value: dado.porta,
          })
      
          if(!filtroRetiradasChaves.find(filtro => filtro.value == dado.emprestimo.momento)) filtroRetiradasChaves.push({
            text: new Date(dado.emprestimo.momento).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'medium' }),
            value: dado.emprestimo.momento,
          })
      
          if(!filtroRetirantesChaves.find(filtro => filtro.value == dado.porta)) filtroRetirantesChaves.push({
            text: dado.emprestimo.responsavel,
            value: dado.emprestimo.responsavel,
          })
      
          if(!filtroDevolucoesChaves.find(filtro => filtro.value == dado.devolucao.momento)) filtroDevolucoesChaves.push({
            text: new Date(dado.devolucao.momento).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'medium' }),
              value: dado.devolucao.momento,
          })
      
          if(!filtroDevolvedoresChaves.find(filtro => filtro.value == dado.porta)) filtroDevolvedoresChaves.push({
            text: (dado.devolucao.responsavel == false ? "Indefinido" : dado.devolucao.responsavel),
            value: (dado.devolucao.responsavel == false ? "Indefinido" : dado.devolucao.responsavel),
          })

          return {
            key: dado.id,
            numeroChave: dado.numero,
            porta: dado.porta,
            retirada: new Date(dado.emprestimo.momento).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'medium' }),
            retiradaOriginal: dado.emprestimo.momento,
            retirante: dado.emprestimo.responsavel,
            devolucao: (dado.devolucao.momento == false ? "Não realizada" : new Date(dado.devolucao.momento).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'medium' })),
            devolucaoOriginal: dado.devolucao.momento,
            devolvedor: (dado.devolucao.responsavel == false ? "Indefinido" : dado.devolucao.responsavel),
            assinaturaEmprestimo: dado.emprestimo.assinatura,
            assinaturaDevolucao: dado.devolucao.assinatura,
            tipo: dado.tipo
          };
        });

        const novasColunas = [
          {
            title: 'Número',
            fixed: 'left',
            dataIndex: 'numeroChave',
            maxWidth: '130ch',
            filters: filtroNumerosChaves.sort((a,b) => a.value-b.value),
            onFilter: (value, record) => record.numeroChave === value,
            filterSearch: true,
            sorter: (a, b) => a.numeroChave - b.numeroChave,
            sortDirections: ['ascend', 'descend'],
          },
          {
            title: 'Porta',
            dataIndex: 'porta', 
            filters: filtroPortasChaves.sort((a,b) => a.value.localeCompare(b.value)),
            onFilter: (value, record) => record.porta === value,
            filterSearch: true,
            sorter: (a, b) => a.porta.localeCompare(b.porta),
            sortDirections: ['ascend', 'descend'], 
          },
          {
            title: 'Retirada',
            dataIndex: 'retirada',
            filters: filtroRetiradasChaves.sort((a,b) => new Date(a.value) - new Date(b.value)),
            onFilter: (value, record) => record.retirada === new Date(value).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'medium' }),
            filterSearch: true,
            sorter: (a, b) => new Date(a.retiradaOriginal) - new Date(b.retiradaOriginal),
            sortDirections: ['ascend', 'descend'],
          },
          {
            title: 'Retirante',
            dataIndex: 'retirante',
            responsive: ['md'],
            filters: filtroRetirantesChaves.sort((a,b) => a.value.localeCompare(b.value)),
            onFilter: (value, record) => record.retirante === value,
            filterSearch: true,
            sorter: (a, b) => a.retirante.localeCompare(b.retirante),
            sortDirections: ['ascend', 'descend'],
          },
          {
            title: 'Devolução',
            dataIndex: 'devolucao',
            filters: filtroDevolucoesChaves.sort((a,b) => new Date(a.value) - new Date(b.value)),
            onFilter: (value, record) => record.devolucao === new Date(value).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'medium' }),
            filterSearch: true,
            sorter: (a, b) => new Date(a.devolucaoOriginal) - new Date(b.devolucaoOriginal),
            sortDirections: ['ascend', 'descend'],
          },
          {
            title: 'Devolvedor',
            dataIndex: 'devolvedor',
            responsive: ['md'],
            filters: filtroDevolvedoresChaves.sort((a,b) => a.value.localeCompare(b.value)),
            onFilter: (value, record) => record.devolvedor === value,
            filterSearch: true,
            sorter: (a, b) => a.devolvedor.localeCompare(b.devolvedor),
            sortDirections: ['ascend', 'descend'],
          },
        
        ];

        setDados({dados: novosDados, colunas: novasColunas});
      });
  };

  return (
    <>
    {pagina == 'cadastroChaves' && <Cadastros pagina={pagina} /> }
    {(pagina == 'chaves' || pagina == 'tabelaChaves') && <Tabelas usuario={usuario} pagina={pagina} dados={dados} atualizar={carregarDados}/>}
    </>
    
  );
}

export default Chaves;



