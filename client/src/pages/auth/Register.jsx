import React,{useState} from 'react'
import { useNavigate } from 'react-router-dom';
import UserNavbar from '../../components/user/common/UserNavbar';
import AuthForm from '../../components/common/AuthForm';

const Register = () => {

    const navigate = useNavigate();
    const [show, setShow] = useState(false);

        const fields = [
            { name: "email", type: "email", placeholder: "example@gmail.com", required: true },
            { name: "password", type:"password" , placeholder: "password", required: true },
            { name: "Confirm password", type: show ? "text" : "password" , placeholder: "confirm Password", required: true },
        ];

        const socialProviders = [
            { label: "Google", onClick: () => alert("Login with SearchEngineCo") },
            { label: "Apple", onClick: () => alert("Login with SocialBook") },
        ];
        const handleSubmit = (e)=>{
            e.preventDefault();
            navigate('/')
        }
  return (
    <div className=''>
        <UserNavbar/>
        <AuthForm
          title="Create New Account"
          subtitle="Start Your Personalised shopping experience"
          fields={fields}
          onSubmit={handleSubmit}
          socialProviders={socialProviders}
          buttonLabel="Register"
          footerText="Already have an account?"
          footerLinkText="Login"
          footerLinkHref="/login"
        />
    </div>
  )
}

export default Register