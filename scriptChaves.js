import dadosChaves from './dados/dados-chaves.js';


let main = document.getElementsByTagName('main');
let itensCabecalho = ['Chave','Porta', 'Data - Empréstimo', 'Hora - Empréstimo', 'Responsável - Empréstimo','Data - Devolução', 'Hora - Devolução', 'Responsável - Devolução'];
let celulas = [];
let linhas = [];


let criarCabecalho = itensCabecalho => {
  let linhaCabecalho = itensCabecalho.map(item => `<th scope="col">${item}<i class="fa-solid fa-circle-down iconeMenuOpcoes"></i></th>`)
  let cabecalho = `<thead><tr>${linhaCabecalho.join('')}</tr></thead>`;
  return cabecalho;
}

function gerarTabela() {
    let cabecalho = criarCabecalho(itensCabecalho);
    let celulasCorpoTabela = prepararCelulasPorLinha(dadosChaves);
    let linhasCorpoTabela = criarLinha(celulasCorpoTabela);
    let body = criarBody(linhasCorpoTabela);
    main[0].innerHTML += `<div id="areaTabela"><table>${cabecalho}${body}</table></div>`
}

function atualizarTabela(celulas) {
    let celulasCorpoTabela = celulas;
    let linhasCorpoTabela = criarLinha(celulasCorpoTabela);
    let body = criarBody(linhasCorpoTabela);
    let tbody = document.getElementsByTagName('tbody');
    tbody[0].innerHTML = body;
}

let prepararCelulasPorLinha = (dados) => {
  let celulasBody = [];
  dadosChaves.forEach((ficha) => {
    let celulasPorLinha = [ficha.numero, ficha.porta, ficha.emprestimo.data, ficha.emprestimo.hora, ficha.emprestimo.responsavel, ficha.emprestimo.data, ficha.emprestimo.hora, ficha.emprestimo.responsavel];
    celulasBody.push(celulasPorLinha);
  })
  celulas = [...celulasBody];
  return celulasBody;
}

let criarLinha = (conjuntoCelulas) => {
  let linhasBody = [];
  conjuntoCelulas.forEach(celulasDeUmaLinha => {
    let celulasDeUmaLinhaFormatadas = celulasDeUmaLinha.map(celula => `<td>${celula}</td>`)
    let linha = `<tr>${celulasDeUmaLinhaFormatadas.join('')}</tr>`;
    linhasBody.push(linha);
  });
  linhas = [...linhasBody];
  return linhasBody;
}

let criarBody = linhas => {
  let body = `<tbody>${linhas.join('')}</tbody>`;
  return body;
}

gerarTabela()


function ocultarPainel() {
  let painel = document.querySelector('.painelTeste');
  main[0].removeChild(painel);
}

document.addEventListener('click', (e) => {
  let painel = document.querySelector('.painelTeste');
  if(painel) {
    if(!painel.contains(e.target)) ocultarPainel();
  }
  if(Array.from(iconeMenuOpcoes).includes(e.target)) exibirPainel(e, Array.from(iconeMenuOpcoes).indexOf(e.target));
  

})
let iconeMenuOpcoes = document.getElementsByClassName('iconeMenuOpcoes');

function criarPainel(e, id) {
  let painel = document.createElement("div");
  painel.classList.add('painelTeste')
  painel.id=`${id}`
  painel.style.top = `${e.y}px`;
  painel.style.left = `${e.x}px`;
  return painel;
}

function exibirPainel(e, id) {
  let painel = criarPainel(e, id);
  painel.innerHTML = `<div><ul><li class="menuOpcoes" id="crescente">A-Z</li><li class="menuOpcoes" id="decrescente">Z-A</li></ul></div>`;
  main[0].appendChild(painel);
  let menuOpcoes = document.getElementsByClassName('menuOpcoes');
  Array.from(menuOpcoes).forEach(opcao => opcao.addEventListener('click', () => {
    ordenar(painel.id, opcao.id);
    }));
  console.log(celulas);
}


function ordenar(indice, ordem = 'crescente') {
  if(indice == 1 || indice == 3) {
    celulas.sort(function (a,b) {
      let novoA = transformarDatas(a[indice]);
      let novoB = transformarDatas(b[indice]);
      if (novoA < novoB) return -1;
      else if (novoA > novoB) return 1;
      else return 0;
    });
  } else {
    celulas.sort((a,b) => a[indice].localeCompare(b[indice]));
  }
  if(ordem == 'decrescente') celulas.reverse();
  atualizarTabela(celulas);
  ocultarPainel();
}

function transformarDatas(dataEscrita) {
  let data = dataEscrita;
  let partesData = data.split('/');
  let novaData = new Date(partesData[2], partesData[1] - 1, partesData[0]); 
  return novaData;
}

