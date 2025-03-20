import './App.css';
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useState } from "react";
import * as yup from "yup";
import Axios from 'axios';

import Register from "./Register"; 

function Login() {
  const [modo, setModo] = useState('login');
  const navigate = useNavigate();

  const handleClickCadastro = (values) => {
    Axios.post("http://localhost:3001/cadastro", {
      email: values.email,
      password: values.password,
    }).then((response) => {
      alert(response.data.msg);
    });
  };

  const handleClickLogin = (values) => {
    Axios.post("http://localhost:3001/login", {
      email: values.email,
      password: values.password,
    }).then((response) => {
      console.log(response);
      navigate("/register"); 
    });
  };

  const validationLogin = yup.object().shape({
    email: yup.string().email("E-mail inválido").required("Campo obrigatório"),
    password: yup.string().min(8, "Mínimo 8 caracteres").required("Campo obrigatório"),
  });

  const validationCadastro = yup.object().shape({
    email: yup.string().email("E-mail inválido").required("Campo obrigatório"),
    password: yup.string().min(8, "Mínimo 8 caracteres").required("Campo obrigatório"),
    confirmPassword: yup.string().oneOf([yup.ref("password"), null], "As senhas não coincidem"),
  });

  return (
    <div className="flex flex-row">
      <img src="/Bolasfundo.jpg" alt="imagem de agenda" className="w-[65%] h-screen" />

      <div className="flex-1 bg-black text-black flex justify-center items-center">
        <div className="flex flex-col gap-3 rounded-lg p-40">
          <div className="flex justify-center w-full h-fix mb-14">
            <img src="/LogoVaggon-removebg-preview.png" alt="logo" className="w-96" />
          </div>

          {modo === 'login' ? (
            <>
              <h1 className='font-bold text-4xl text-white text-center'>Login</h1>
              <Formik
                initialValues={{ email: '', password: '' }}
                onSubmit={handleClickLogin}
                validationSchema={validationLogin}
              >
                <Form className='flex flex-col gap-4'>
                  <div className="w-full">
                    <Field name="email" className="w-96 border shadow-md p-4 rounded-xl" placeholder="Email" />
                    <ErrorMessage component="span" name="email" className="text-red-500 text-sm block h-5" />
                  </div>

                  <div>
                    <Field type="password" name="password" className="w-full border shadow-md p-4 rounded-xl" placeholder="Senha" />
                    <ErrorMessage component="span" name="password" className="text-red-500 text-sm" />
                  </div>

                  <button type="submit" className='p-4 rounded-xl w-full bg-[#002C70] text-white'>Entrar</button>

                  <button onClick={() => setModo('cadastro')} className='text-blue-400 hover:underline'>Cadastre-se</button>
                </Form>
              </Formik>
            </>
          ) : (
            <>
              <h1 className='font-bold text-4xl text-center'>Cadastre-se</h1>
              <Formik
                initialValues={{ email: '', password: '', confirmPassword: '' }}
                onSubmit={handleClickCadastro}
                validationSchema={validationCadastro}
              >
                <Form className='flex flex-col gap-4'>
                  <div className="w-full">
                    <Field name="email" className="w-96 border shadow-md p-4 rounded-xl" placeholder="Email" />
                    <ErrorMessage component="span" name="email" className="text-red-500 text-sm block h-5" />
                  </div>

                  <div>
                    <Field type="password" name="password" className="w-full border shadow-md p-4 rounded-xl" placeholder="Senha" />
                    <ErrorMessage component="span" name="password" className="text-red-500 text-sm" />
                  </div>

                  <div>
                    <Field type="password" name="confirmPassword" className="w-full border shadow-md p-4 rounded-xl" placeholder="Confirme sua senha" />
                    <ErrorMessage component="span" name="confirmPassword" className="text-red-500 text-sm" />
                  </div>

                  <button type="submit" className='p-4 rounded-xl w-full bg-[#002C70] text-white'>Cadastre-se</button>
                  <button onClick={() => setModo('login')} className='text-blue-400 hover:underline'>Faça o Login</button>
                </Form>
              </Formik>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
