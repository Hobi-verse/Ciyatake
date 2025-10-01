import React, { useState } from 'react'
import UserNavbar from '../../components/user/common/UserNavbar';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../../components/common/AuthForm';

const Login = () => {
    const navigate = useNavigate();
    const [show, setShow] = useState(false);

    const fields = [
      { name: "email", type: "email", placeholder: "example@gmail.com", required: true },
      { name: "password", type: show ? "text" : "password" , placeholder: "********", required: true },
    ];

  const socialProviders = [
    { label: "Google", onClick: () => alert("Login with SearchEngineCo") },
    { label: "Apple", onClick: () => alert("Login with SocialBook") },
  ];

    const handlelogin = (e)=>{
        e.preventDefault();
        localStorage.setItem("User1","Aman");
        navigate('/');
    }
  return (
    <div className=''>
        <UserNavbar/>
        <AuthForm
          title="Welcome back"
          subtitle="Sign in to continue your shopping journey."
          fields={fields}
          onSubmit={handlelogin}
          socialProviders={socialProviders}
          buttonLabel="Sign In"
          footerText="Don't have an account?"
          footerLinkText="Sign up"
          footerLinkHref="/signup"
          forgetPasswordText='Forget Password ?'
        />
    </div>
  )
}

export default Login;