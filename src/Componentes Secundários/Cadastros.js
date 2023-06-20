import './Cadastros.css';
import Cartao from './Cartão';
import {useState} from 'react'
import { Button, Modal, Form, Input, Space, Upload, Switch, DatePicker, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import moment from 'moment';
import { teal } from '@mui/material/colors';




function Cadastros(props) {


  const [ocultarPlaca, setOcultarPlaca] = useState(true);
  const [ocultarEntradaMateriais, setOcultarEntradaMateriais] = useState(true)
  const [ocultarSaida, setOcultarSaida] = useState(true)
  const [ocultarSaidaMateriais, setOcultarSaidaMateriais] = useState(true)
  const [ocultarDevolucao, setOcultarDevolucao] = useState(true);
  const [form] = Form.useForm();
  const [infosMostradas, setinfosMostradas] = useState(false);
  const [cartoes, setCartoes] = useState();

  const pagina = props.pagina;




  const normFile = (e) => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    console.log(e?.fileList)
    return e?.fileList;
  };


      
    const registrarVeiculo = (checked) => {
      if(checked) form.setFieldValue('placaVeiculo', '');
      setOcultarPlaca(!checked)
    };


    const registrarSaida = () => {
      setOcultarSaida(!ocultarSaida)
      if(ocultarSaida != true) {
        if(form.getFieldValue('verificacaoSaidaMateriais') == true) registrarSaidaMateriais();
        form.setFieldsValue({momentoSaida: null, verificacaoSaidaMateriais: false, registroSaidaMateriais: undefined })
      }
      else form.setFieldsValue({momentoSaida: moment()})
    }
  
    const registrarEntradaMateriais = () => {
      setOcultarEntradaMateriais(!ocultarEntradaMateriais)
    }
  
    const registrarSaidaMateriais = () => {
      setOcultarSaidaMateriais(!ocultarSaidaMateriais)
    }
  
    
    const registrarDevolucao = () => {
      setOcultarDevolucao(!ocultarDevolucao)
          if(ocultarDevolucao != true) form.setFieldsValue({momentoDevolucao: null})
      else form.setFieldsValue({momentoDevolucao: moment()})
    }


  const exibirInfos = () => {
    setinfosMostradas(true)
  };

  const ocultarInfos = () => {
    alert();
    setinfosMostradas(false);
    if(!ocultarPlaca) registrarVeiculo()
    form.resetFields();
  };

  // const organizarCartoes = (dados) => {
    // Exibir os cadastros ainda não finalizados na tela, permitindo que seja finalizado mais rapidamente
  // }


  const onFinish = (values) => {
    console.log('Received values of form: ', values);

    if(pagina == 'cadastroTerceiros') {

      fetch('http://localhost:3001/terceiros', {
  method: 'POST',
  body: JSON.stringify({
          
    entrada: {
        momento: values.momentoEntrada._d,
        materiais: (values.registroEntradaMateriais == undefined ? false : values.registroEntradaMateriais.map(registro => registro.thumbUrl))
    },
    saida: {
        momento: (values.momentoSaida == undefined ? false : values.momentoSaida._d),
        materiais: (values.registroSaidaMateriais == undefined ? false : values.registroSaidaMateriais.map(registro => registro.thumbUrl))
    },
    foto: values.fotoPerfil[0].thumbUrl,
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

      fetch('http://localhost:3001/chaves', {
  method: 'POST',
  body: JSON.stringify({
    tipo: 'novo',
    numero: values.chave,
    porta: values.porta,
    emprestimo: {
      responsavel: values.emprestador,
      momento: values.momentoEmprestimo._d,
      assinatura: values.assinaturaEmprestador.map(foto => foto.thumbUrl)
    },
    devolucao: {
      responsavel: (values.devolvedor == undefined ? false : values.devolvedor),
      momento: (values.momentoDevolucao == undefined ? false : values.momentoDevolucao._d),
      assinatura: (values.assinaturaDevolvedor == undefined ? false : values.assinaturaDevolvedor.map(foto => foto.thumbUrl))
    }
  }),
  headers: {
    'Content-type': 'application/json; charset=UTF-8',
  },
})
  .then((response) => response.json())
  .then((json) => console.log(json));

    
    }
    message.success("Cadastro realizado com sucesso!");
    ocultarInfos();
    }

    const formularioTerceiros = [
      <Form
      name="formularioTerceiros"
      form={form}
      onFinish={onFinish}
    >
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
        <Upload name="logo" action="/upload.do" beforeUpload={() => false} listType="picture">
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
    </Form>
    ]
  
    const formularioChaves = [
      <Form
      name="formularioChaves"
      form={form}
      onFinish={onFinish}
    >
      
          <Form.Item
        label="Número da Chave"
        name="chave"
        rules={[{
          validator(rule, value){
            return new Promise((resolve, reject) => {
              if(isNaN(value)) {
                reject('Por favor, insira apenas numerais!')
              }
              else {
                resolve()
              }
            })
          } 
        }, {required: true, message: 'Por favor, informe o número da chave!'}]}
        
      >
        <Input />
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
              initialValue={moment()}
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
    </Form>
    ];

  return (
    <>
    <Button type="primary" shape="circle" size="large" onClick={() => exibirInfos()}>
        +
      </Button>
    <p style={{color: 'gray'}}>Em construção</p>
    
    <Modal
  bodyStyle={{ maxHeight: '80vh', overflowY: 'scroll' }}
  open={infosMostradas}
  width={'80vw'}
  centered
  footer={null}
  onCancel={ocultarInfos}
>
<div id="conteudo">{pagina == 'cadastroTerceiros' ? formularioTerceiros : formularioChaves}</div>
  
  
</Modal>

  {cartoes}
    
    </>

  );
}

export default Cadastros;



