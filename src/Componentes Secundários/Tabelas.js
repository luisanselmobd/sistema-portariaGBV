import { Table, Button, Space, Modal, Form, Input, Upload, Switch, DatePicker } from 'antd';
import {useState, useEffect} from 'react'
import Painel from './Painel'
import './Tabelas.css'; 
import './Cadastros.css';
import { UploadOutlined } from '@ant-design/icons';
import moment from 'moment';








const App = (props) => {
  const [infosMostradas, setinfosMostradas] = useState(false);
  const [conteudoExibicao, setConteudoExibicao] = useState(null);
  const [tipoPainel, setTipoPainel] = useState();
  const colunasTabela = [...props.dados.colunas];
  const [conteudoEdicao, setConteudoEdicao] = useState(null);
  const [dadosTabela, setDadosTabela] = useState(props.dados.dados)
  const [colTabela, setColTabela] = useState(props.dados.colunas)

  useEffect(() => {
  const data = props.dados.dados;
  const colunas = props.dados.colunas;
  if (props.usuario === 'portaria' && colunas) {
    if (colunas[colunas.length - 1].title !== "Ações") {
      colunas.push({
        title: 'Ações',
        key: 'acoes',
        render: (record) => (
          <>
            <Space direction="vertical">
              <Button type="primary" onClick={() => { exibirInfos(record, 'edicao'); setTipoPainel('edicao') }}>Editar</Button>
              <Button type="primary" onClick={() => {
                const paginaUrl = (pagina === 'tabelaTerceiros') ? 'terceiros' : 'chaves';
                const idUrl = record.key;
                const url = `http://localhost:3001/${paginaUrl}/${idUrl}`;
                console.log(url);
                fetch(`${url}`, {
                  method: 'DELETE',
                })
                  .then(() => { props.atualizar(); });
              }} danger>Excluir</Button>
            </Space>
          </>
        ),
      });
    }
  }
  setColTabela(colunas)
  setDadosTabela(data)
}, [props.dados]);

  


  const [ocultarPlaca, setOcultarPlaca] = useState(true);
  const [ocultarEntrada, setOcultarEntrada] = useState(true)
  const [ocultarEntradaMateriais, setOcultarEntradaMateriais] = useState(true)
  const [ocultarSaida, setOcultarSaida] = useState(true)
  const [ocultarSaidaMateriais, setOcultarSaidaMateriais] = useState(true)
  const [ocultarEmprestimo, setOcultarEmprestimo] = useState(true);
  const [ocultarDevolucao, setOcultarDevolucao] = useState(true);
  const [form] = Form.useForm();
  

  const pagina = props.pagina;
  


  const normFile = (e) => {
    alert()
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    console.log(e?.fileList)
    return e?.fileList;
  };


      
    const registrarVeiculo = (checked) => {
      setOcultarPlaca(!checked)
    };
  
    const registrarSaida = () => {
      setOcultarSaida(!ocultarSaida)
          if(ocultarSaida != true) form.setFieldsValue({momentoSaida: null})
      else form.setFieldsValue({momentoSaida: moment()})
    }
  
    const registrarEntradaMateriais = () => {
      setOcultarEntradaMateriais(!ocultarEntradaMateriais)
    }
  
    const registrarSaidaMateriais = () => {
      setOcultarSaidaMateriais(!ocultarSaidaMateriais)
    }

    const registrarEmprestimo = () => {
      setOcultarEmprestimo(!ocultarEmprestimo)
      if(ocultarEmprestimo != true) form.setFieldsValue({momentoEntrada: null})
      else form.setFieldsValue({momentoEntrada: moment()})
    }
    
    const registrarDevolucao = () => {
      setOcultarDevolucao(!ocultarDevolucao)
          if(ocultarDevolucao != true) form.setFieldsValue({momentoDevolucao: null})
      else form.setFieldsValue({momentoDevolucao: moment()})
    }


  const ocultarInfos = () => {
    setinfosMostradas(false);
    form.resetFields();
    props.atualizar();
    if(!ocultarDevolucao) registrarDevolucao();
  };

  
  

  const onFinish = (values) => {

    console.log('VALORES', values)

    if(pagina == 'tabelaTerceiros') {

      fetch(`http://localhost:3001/terceiros/${values.id}`, {
  method: 'PUT',
  body: JSON.stringify({
          
    entrada: {
        momento: values.momentoEntrada._d,
        materiais: (values.registroEntradaMateriais == undefined ? false : values.registroEntradaMateriais.map(registro => registro.url ? registro.url : registro.thumbUrl))
    },
    saida: {
        momento: (values.momentoSaida == undefined ? false : values.momentoSaida._d),
        materiais: (values.registroSaidaMateriais == undefined ? false : values.registroSaidaMateriais.map(registro => typeof registro.url ? registro.url : registro.thumbUrl))
    },
    foto: typeof values.fotoPerfil == "string" ? values.fotoPerfil : values.fotoPerfil[0].thumbUrl,
    nome: values.nome,
    documento: values.documento,
    empresa: values.empresa,
    cracha: values.cracha,
    solicitante: values.solicitanteVisita,
    motivo: values.motivoVisita,
    tipo: "novo",
    placaVeiculo: (values.placaVeiculo == undefined ? 'Sem Veículo' : values.placaVeiculo),        
  }),
  headers: {
    'Content-type': 'application/json; charset=UTF-8',
  },
})
  .then((response) => response.json())
  .then((json) => console.log(json.solicitante));


    } else {

      fetch(`http://localhost:3001/chaves/${values.id}`, {
  method: 'PUT',
  body: JSON.stringify({
    tipo: 'novo',
    numero: values.chave,
    porta: values.porta,
    emprestimo: {
      responsavel: values.emprestador,
      momento: values.momentoEmprestimo._d,
      assinatura: (values.assinaturaEmprestador[0].thumbUrl ? values.assinaturaEmprestador.map(foto => foto.thumbUrl) : [values.assinaturaEmprestador[0]]),        
      
    },
    devolucao: {
      responsavel: (values.devolvedor == undefined ? false : values.devolvedor),
      momento: (values.momentoDevolucao == undefined ? false : values.momentoDevolucao._d),
      assinatura: (values.assinaturaDevolvedor == undefined ? false : (values.assinaturaDevolvedor[0].thumbUrl ? values.assinaturaDevolvedor.map(foto => foto.thumbUrl) : [values.assinaturaDevolvedor[0]]))
    }
  }),
  headers: {
    'Content-type': 'application/json; charset=UTF-8',
  },
})
  .then((response) => response.json())
  .then((json) => console.log(json));

    
    }

    console.log('Received values of form: ', values);
    }






  
  const definirExibicao = (dadosPassados, tipo) => {
    return (<><Painel dados={dadosPassados} tipo={tipo} referencia={props.pagina}/></>)
  }

  const exibirInfos = async (record, tipo) => {
      if(tipo == 'edicao') {
        
      if(pagina == "tabelaTerceiros"){

        console.log(record)
        

form.setFieldsValue({
'id': record.key,
'fotoPerfil': {url: record.foto}, 
'nome': record.nome, 
'documento': record.documento, 
'cracha': record.cracha, 
'empresa': record.empresa, 
'verificacaoVeiculo': record.placaVeiculo == "Sem Veículo" ? false : true, 
'placaVeiculo': record.placaVeiculo == "Sem Veículo" ? undefined : record.placaVeiculo, 
'solicitanteVisita': record.solicitante, 
'motivoVisita' : record.motivo, 
'momentoEntrada': moment(record.entrada, "DD/MM/YYYY, HH:mm:ss"),
'verificacaoEntradaMateriais': record.materiaisEntrada ? true : false,
'registroEntradaMateriais': record.materiaisEntrada ? record.materiaisEntrada.map((foto, indice) => ({uid: indice, url: foto})) : undefined 
})
if(record.placaVeiculo == "Sem Veículo") setOcultarPlaca(true)
else setOcultarPlaca(false)
if(record.materiaisEntrada) setOcultarEntradaMateriais(false);
else setOcultarEntradaMateriais(true);
if(record.saida != "Não Realizada") {
  form.setFieldsValue({
    'momentoSaida': moment(record.saida, "DD/MM/YYYY, HH:mm:ss"),
    'verificacaoSaidaMateriais': record.materiaisSaida ? true : false,
    'registroSaidaMateriais': record.materiaisSaida ? record.materiaisSaida.map((foto, indice) => ({uid: indice, url: foto})) : undefined
  });

  if(record.materiaisSaida) setOcultarSaidaMateriais(false);
else setOcultarSaidaMateriais(true);
}
      
        setConteudoEdicao('éeeee')
      } else {
        console.log(record)



        form.setFieldsValue({'id': record.key, 'chave': record.numeroChave, 'porta': record.porta, 'momentoEmprestimo': moment(record.retirada, "DD/MM/YYYY, HH:mm:ss"),'emprestador': record.retirante, 'assinaturaEmprestador': [record.assinaturaEmprestimo]})
        if(record.assinaturaDevolucao) {
          setOcultarDevolucao(!ocultarDevolucao)
          form.setFieldsValue({'devolvedor': record.devolvedor, 'momentoDevolucao': moment(record.devolucao, "DD/MM/YYYY, HH:mm:ss"), 'assinaturaDevolvedor': [record.assinaturaDevolucao]})
        } else {
          
        }
      }

      
      } else {
        setConteudoExibicao(definirExibicao(record, tipo))
        
      }
      setinfosMostradas(true);

  };

  


  return (
  <>
  <Table
    size="middle"
    columns={colTabela}
    dataSource={dadosTabela}
    pagination={{
      showSizeChanger: true,
      pageSizeOptions: [5,10]
    }}
    scroll={{
      y: '70vh',
      x: 1280,
    }}
    onRow={(record, rowIndex) => {
      return {
        onClick: (event) => { if(event.target.tagName != 'BUTTON' && event.target.tagName != 'SPAN') {
          exibirInfos(record, 'exibicao');
          setTipoPainel('exibicao')
        }
        }
      }
    }}
  />
<Modal
  bodyStyle={{ maxHeight: '80vh', overflowY: 'scroll' }}
  open={infosMostradas}
  width={'80vw'}
  centered
  footer={null}
  onCancel={ocultarInfos}
>
{tipoPainel == 'edicao'  ? 

<>
{pagina=="tabelaChaves" && <Form
          name="formularioChaves"
          form={form}
          onFinish={onFinish}
        >
          
              <Form.Item
              hidden={true}
            label="id"
            name="id"
          >
            <Input  />
          </Form.Item>
          
              <Form.Item
            label="Número da Chave"
            name="chave"
            rules={[{ required: true, message: 'Por favor, informe o número da chave!' }]}
          >
            <Input  />
          </Form.Item>
          
          
              <Form.Item
            label="Porta"
            name="porta"
            rules={[{ required: true, message: 'Por favor, informe a porta!' }]}
          >
            <Input />
          </Form.Item>
      
                  <Form.Item 
                  name="momentoEmprestimo" 
                  label="Momento do Empréstimo"
                  rules={[{ required: true, message: 'Por favor, informe o momento do empréstimo!' }]}>
            <DatePicker showTime format="DD-MM-YYYY, HH:mm:ss" />
          </Form.Item>
      
                  <Form.Item
    
            label="Responsável pelo empréstimo"
            name="emprestador"
            rules={[{ required: true, message: 'Por favor, informe o responsável pelo empréstimo!' }]}
          >
            <Input />
          </Form.Item>
          
      
      
          <Form.Item
            name="assinaturaEmprestador"
            label="Assinatura do Responsável pelo Empréstimo"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            rules={[{ required: true, message: 'Por favor, faça o envio da assinatura do responsável pelo empréstimo!' }]}
          >
            <Upload name="logo" action="/upload.do" listType="picture" beforeUpload={() => false} maxCount={1}>
              <Button icon={<UploadOutlined />}>Enviar assinatura</Button>
            </Upload>
          </Form.Item>
      
      
          
      
          
            <Form.Item hidden={!ocultarDevolucao} onClick={registrarDevolucao}>
              <Button>Registrar a Devolução</Button>
            </Form.Item>
    
            <Form.Item hidden={ocultarDevolucao} onClick={registrarDevolucao}>
              <Button danger>Cancelar o Registro da Devolução</Button>
            </Form.Item>
      
                  <Form.Item 
                  name="momentoDevolucao" 
                  hidden={ocultarDevolucao}
                  label="Momento da Devolução"
                  rules={[{ required: !ocultarDevolucao, message: 'Por favor, informe o momento da saída!' }]}>
            <DatePicker format="DD-MM-YYYY, HH:mm:ss" />
          </Form.Item>
      
                      <Form.Item
                        hidden={ocultarDevolucao}
            label="Responsável pela devolução"
            name="devolvedor"
            rules={[{ required: !ocultarDevolucao, message: 'Por favor, informe o responsável pela devolução!' }]}
          >
            <Input />
          </Form.Item>
      
          <Form.Item
            hidden={ocultarDevolucao}
            name="assinaturaDevolvedor"
            label="Assinatura do Responsável pela Devolução"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            rules={[{ required: !ocultarDevolucao, message: 'Por favor, faça o envio da assinatura do responsável pela devolução!' }]}
          >
            <Upload name="logo" action="/upload.do" listType="picture" maxCount={1} beforeUpload={() => false}>
              <Button icon={<UploadOutlined />}  >Enviar assinatura</Button>
            </Upload>
            </Form.Item>
          
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
              <Button htmlType="reset">reset</Button>
            </Space>
          </Form.Item>
        </Form>} 
        {pagina=="tabelaTerceiros" && <Form
            name="formularioTerceiros"
            form={form}
            onFinish={onFinish}
          >
                          <Form.Item
              hidden={true}
            label="id"
            name="id"
          >
            <Input  />
          </Form.Item>
            <Form.Item
              name="fotoPerfil"
              label="Foto de Perfil"
              valuePropName="fotoPerfil"
              getValueFromEvent={normFile}
              rules={[{ required: true, message: 'Por favor, faça o envio da foto de perfil!'}]}
              
            >
              <Upload name="uploadFotoPerfil" beforeUpload={()=>
          false } action="" maxCount={1} listType="picture-circle">
                Enviar Foto
              </Upload>
            </Form.Item>
                        
                <Form.Item
              label="Nome"
              name="nome"
              rules={[{ required: true, message: 'Por favor, informe o nome!' }]}
            >
              <Input />
            </Form.Item>
            
                <Form.Item
              label="Documento"
              name="documento"
              rules={[{ required: true, message: 'Por favor, informe o documento!' }]}
            >
              <Input />
            </Form.Item>
            
                <Form.Item
              label="Crachá"
              name="cracha"
              rules={[{ required: true, message: 'Por favor, informe o crachá!' }]}
            >
              <Input />
            </Form.Item>
            
                <Form.Item
              label="Empresa"
              name="empresa"
              rules={[{ required: true, message: 'Por favor, informe a empresa!' }]}
            >
              <Input />
            </Form.Item>
            
        <Form.Item name="verificacaoVeiculo" label="Entrada com veículo?" valuePropName="checked">
                <Switch checkedChildren="Sim" unCheckedChildren="Não" onChange={registrarVeiculo} />
              </Form.Item>
            
            
                <Form.Item
                  hidden={ocultarPlaca}
              label="Placa do Veículo"
              name="placaVeiculo"
              rules={[{ required: !ocultarPlaca, message: 'Por favor, informe a placa do veículo!' }]}
            >
              <Input />
            </Form.Item>
      
            <Form.Item
              label="Solicitante da Visita"
              name="solicitanteVisita"
              rules={[{ required: true, message: 'Por favor, informe o solicitante da visita!' }]}
            >
              <Input />
            </Form.Item>
            
                <Form.Item
              label="Motivo da visita"
              name="motivoVisita"
              rules={[{ required: true, message: 'Por favor, informe o motivo da visita!' }]}
            >
              <Input />
            </Form.Item>
      
        
                <Form.Item 
                name="momentoEntrada" 
                label="Momento da Entrada" 
                initialValue={moment()}
                rules={[{ required: true, message: 'Por favor, informe o momento da entrada!' }]}
                >
              <DatePicker showTime format="DD-MM-YYYY, HH:mm:ss" />
            </Form.Item>
        
            <Form.Item name="verificacaoEntradaMateriais" label="Entrada com materiais?" valuePropName="checked">
                <Switch checkedChildren="Sim" unCheckedChildren="Não" onChange={registrarEntradaMateriais} />
              </Form.Item>
      
            <Form.Item
              hidden={ocultarEntradaMateriais}
              name="registroEntradaMateriais"
              label="Registros dos Materiais"
              valuePropName="fileList"
              getValueFromEvent={normFile}
              rules={[{ required: !ocultarEntradaMateriais, message: 'Por favor, faça o envio dos registros dos materiais!' }]}
            >
              <Upload name="ASDASD" action="/upload.do" beforeUpload={() => false} listType="picture">
                <Button icon={<UploadOutlined />}>Enviar Registros</Button>
              </Upload>
            </Form.Item>
        
        
            
        
            
              <Form.Item hidden={!ocultarSaida} onClick={registrarSaida}>
                <Button>Registrar a Saída</Button>
              </Form.Item>
      
              
              <Form.Item hidden={ocultarSaida} onClick={registrarSaida}>
                <Button danger>Cancelar o Registro da Saída</Button>
              </Form.Item>
        
                    <Form.Item 
                    hidden={ocultarSaida}
                    name="momentoSaida" 
                    label="Momento da Saída" 
                    rules={[{ required: !ocultarSaida, message: 'Por favor, informe o momento da saída!' }]}
                >
              <DatePicker showTime format="DD-MM-YYYY, HH:mm:ss" />
            </Form.Item>
        
                <Form.Item name="verificacaoSaidaMateriais" label="Saída com materiais?" valuePropName="checked" hidden={ocultarSaida}>
                <Switch checkedChildren="Sim" unCheckedChildren="Não" onChange={registrarSaidaMateriais} />
              </Form.Item>
        
            <Form.Item
              hidden={ocultarSaidaMateriais}
              name="registroSaidaMateriais"
              label="Registros dos Materiais"
              valuePropName="fileList"
              getValueFromEvent={normFile}
              rules={[{ required: !ocultarSaidaMateriais, message: 'Por favor, faça o envio dos registros dos materiais!' }]}
              >
              <Upload beforeUpload={() => false} name="logo" action="/upload.do" listType="picture">
                <Button icon={<UploadOutlined />}>Enviar Registros</Button>
              </Upload>
              </Form.Item>
            
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
                <Button htmlType="reset">reset</Button>
              </Space>
            </Form.Item>
          </Form>}</> : conteudoExibicao}
  
  
</Modal>


    </>)
};

export default App;
