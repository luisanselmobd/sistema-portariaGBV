import "./Painel.css";
import { Collapse, Image, Descriptions, List, Typography, Form  } from "antd";
  const { Text } = Typography;


function Pessoas(props) {


  const dados = props.dados;
  const referencia = props.referencia;
  const conteudo = [];
  const { Panel } = Collapse;
  console.log(dados)

    if (referencia == "tabelaTerceiros" || referencia=="terceiros") {
      conteudo.push(
        <>
          <div className="conteudoExibicao">
            <div className="imagemExibicao">
              <Image
                alt={`Foto do ${dados.nome}`}
                className="fotoExibida"
                src={dados.foto}
              />
            </div>
            <div className="camposExibicao">
              <Descriptions className="camposTabela">
                <Descriptions.Item label="Nome">{dados.nome}</Descriptions.Item>
                <Descriptions.Item label="Documento">
                  {dados.documento}{" "}
                </Descriptions.Item>
                <Descriptions.Item label="Empresa">
                  {dados.empresa}
                </Descriptions.Item>
                <Descriptions.Item label="Crachá">
                  {dados.cracha}
                </Descriptions.Item>
                <Descriptions.Item label="Veículo">
                  {dados.placaVeiculo}
                </Descriptions.Item>
                <Descriptions.Item label="Solicitante">
                  {dados.solicitante}
                </Descriptions.Item>
                <Descriptions.Item label="Motivo">
                  {dados.motivo}
                </Descriptions.Item>
                <Descriptions.Item label="Entrada">
                  {dados.entrada}
                </Descriptions.Item>
                <Descriptions.Item label="Saída">
                  {dados.saida}
                </Descriptions.Item>
              </Descriptions>
            </div>
            <div className="movimentacaoExibicao">
              
              <div className="entradaExibicao">
                <Collapse ghost>
                  <Panel header="Registros da Entrada" key="1">
                    {dados.materiaisEntrada ? <List
                      grid={{
                        gutter: 16,
                        xs: 1,
                        sm: 2,
                        md: 2,
                        lg: 4,
                        xl: 6,
                        xxl: 3,
                      }}
                      dataSource={dados.materiaisEntrada}
                      renderItem={(item) => (
                        <List.Item>
                          <Image src={item} />
                        </List.Item>
                      )}
                    /> : <Text type="secondary">Não houve entrada de materiais.</Text>}
                  </Panel>
                </Collapse>
              </div>

              <div className="saidaExibicao">
                <Collapse ghost>
                  <Panel header="Registros da Saída" key="2">
                    {dados.materiaisSaida ? <List
                      grid={{
                        gutter: 16,
                        xs: 1,
                        sm: 2,
                        md: 2,
                        lg: 4,
                        xl: 6,
                        xxl: 3,
                      }}
                      dataSource={dados.materiaisSaida}
                      renderItem={(item) => (
                        <List.Item>
                          <Image src={item} />
                        </List.Item>
                      )}
                    /> : <Text type="secondary">Não houve saída de materiais.</Text> }
                  </Panel>
                </Collapse>
              </div>
            </div>
          </div>
        </>
      );
    } else {
      conteudo.push(
        <>
          <div className="conteudoExibicao">
            <div className="camposExibicao">
              <Descriptions className="camposTabela" column={{
        xxl: 3,
        xl: 3,
        lg: 3,
        md: 1,
        sm: 1,
        xs: 1,
      }}>
                <Descriptions.Item label="Chave">{dados.numeroChave}</Descriptions.Item>
                <Descriptions.Item label="Porta" span={2}>
                  {dados.porta}
                </Descriptions.Item>
                <Descriptions.Item label="Retirada">
                  {dados.retirada}
                </Descriptions.Item>
                <Descriptions.Item label="Retirante">
                  {dados.retirante}
                </Descriptions.Item>
                <Descriptions.Item label="Assinatura do Retirante">
                <Image style={{maxHeight: "80px"}} src={dados.assinaturaEmprestimo} />
                </Descriptions.Item>
                {dados.assinaturaDevolucao!=false ? 
                <>
                <Descriptions.Item label="Devolução">
                  {dados.devolucao}
                </Descriptions.Item>
                <Descriptions.Item label="Devolvedor">
                  {dados.devolvedor}
                </Descriptions.Item>
                <Descriptions.Item label="Assinatura do Devolvedor">
                <Image style={{maxHeight: "80px"}} src={dados.assinaturaDevolucao} />
                </Descriptions.Item>
                </> : <><Descriptions.Item span={3} className="avisoChave"><Text type="secondary">Não houve a devolução da chave.</Text></Descriptions.Item></>}
              </Descriptions>
              
            </div>
            
          </div>
          
        </>
      );
    }

  return (
    <>
      <div id="conteudo">{conteudo}</div>
    </>
  );
}

export default Pessoas;
