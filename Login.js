import './Login.css';
import { Button, Checkbox, Form, Input, message } from 'antd';
import { useState, useEffect } from 'react';

function Login(props) {

  const [dados, setDados] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/senhas')
      .then((response) => response.json())
      .then((json) => setDados(json));
  }, []);

  

  const [form] = Form.useForm();

  const verificarLogin = (login) => {
    let logado = false;
    dados.forEach(dado =>  {
      if(dado.usuario == login.usuario && dado.senha == login.senha) {
        localStorage.setItem('statusLogin', `logado`)
        localStorage.setItem('perfilLogado', `${dado.perfil}`)
        props.obterLogin(true, dado.perfil);
        logado = true;
        message.success('Login bem sucedido!')
              
      };
    })
    if(logado == false) onFinishFailed(false);
  }
  
const onFinish = (values) => {
  verificarLogin(values)
};

const onFinishFailed = (errorInfo) => {
  if(errorInfo == false) {message.error("Usuário e/ou senha não encontrados."); form.resetFields();}
};

  return (
    <main>
  <img className="logoGBV-login" src='./grupo.png' alt="logo do Grupo Bons Ventos" />
<Form
    name="loginApp"
    form={form}
    labelCol={{
      span: 8,
    }}
    wrapperCol={{
      span: 16,
    }}
    style={{
      maxWidth: 600,
    }}
    initialValues={{
      remember: true,
    }}
    onFinish={onFinish}
    onFinishFailed={onFinishFailed}
    autoComplete="off"
  >
    <Form.Item
      label="Usuário"
      name="usuario"

      rules={[{required: true, message: "Por favor, insira o usuário!"}]}
    >
      <Input />
    </Form.Item>

    

    <Form.Item
      label="Senha"
      name="senha"
      rules={[
        {
          required: true,
          message: 'Por favor, insira a senha!',
        },
      ]}
    >
      <Input.Password />
    </Form.Item>

    <Form.Item
      name="salvar"
      valuePropName="checked"
      wrapperCol={{
        offset: 8,
        span: 16,
      }}
    >
      <Checkbox>Salvar a senha</Checkbox>
    </Form.Item>

    <Form.Item
      wrapperCol={{
        offset: 8,
        span: 16,
      }}
    >
      <Button type="primary" htmlType="submit">
        Entrar
      </Button>
    </Form.Item>
  </Form>
  </main>

    
  );
}

export default Login;






