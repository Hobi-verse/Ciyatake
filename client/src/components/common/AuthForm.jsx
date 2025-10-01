// AuthForm.jsx
import React, { useState } from "react";
import Button from "./Button"; // Reusable button component we made earlier
import { useNavigate } from "react-router-dom";

const AuthForm = ({
  title = "Welcome back",
  subtitle = "Sign in to continue your shopping journey.",
  fields = [],
  onSubmit,
  socialProviders = [],
  buttonLabel = "Sign In",
  footerText = "Don't have an account?",
  footerLinkText = "Sign up",
  footerLinkHref = "#",
  forgetPasswordText = ""
}) => {
  
  const [show, setShow] = useState(false);
  const navigate = useNavigate()
  const [formData, setFormData] = useState(
    fields.reduce((acc, field) => {
      acc[field.name] = "";
      return acc;
    }, {})
  );

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    navigate('/')
  };

  return (
    <div className="flex items-center justify-center h-[calc(100vh-64px)] bg-green-300/0"> {/* Adjusted height, assuming navbar is 64px */}
      <div className="w-full max-w-md p-6  bg-white/10 backdrop-blur-lg 
               border border-white/20 shadow-xl rounded-2xl overflow-y-auto"> {/* Reduced padding from p-8 to p-6 */}
        <h2 className="text-center text-white text-2xl font-bold">{title}</h2>
        <p className="text-center text-green-500 mt-1">{subtitle}</p>

        {/* Form */}
          <form onSubmit={handleSubmit} className="mt-4 space-y-3"> {/* Reduced spacing */}
            {fields.map((field, idx) => (
              <div key={idx}>
                <div className="relative">
            <input
              type={field.type === "password" ? (show ? "text" : "password") : field.type}
              name={field.name}
              placeholder={field.placeholder}
              value={formData[field.name]}
              onChange={handleChange}
              required={field.required}
              className="w-full text-green-300 border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-green-300 focus:border-green-500 outline-none"
            />
            {field.type === "password" && field.placeholder==="confirm Password" && (
              <button
                type="button"
                onClick={() => setShow(!show)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {show ? "Hide" : "Show"}
              </button>
            )}
                </div>
              </div>
            ))}

            <div className="text-right text-sm">
              <a onClick={()=>navigate('/forget-password')} className="text-green-600 cursor-pointer hover:underline">
                {forgetPasswordText}
              </a>
            </div>

            <Button
              type="submit"
              className="w-full bg-green-600 text-white"
              onClick = {onSubmit}
            >
              {buttonLabel}
            </Button>
          </form>

          {/* Divider */}
        <div className="flex items-center my-4"> 
          <hr className="flex-grow border-gray-300" />
          <span className="px-2 text-gray-500 text-sm">Or sign in with</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        {/* Social Buttons */}
        <div className="flex space-x-3">
          {socialProviders.map((provider, idx) => (
            <Button
              key={idx}
              className="flex-1 border border-gray-300 bg-green-300/0 text-white-700 cursor-pointer"
              onClick={provider.onClick}
            >
              Continue with {provider.label}
            </Button>
          ))}
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-4">
          {footerText}{" "}
          <a href={footerLinkHref} className="text-green-600 font-medium hover:underline">
            {footerLinkText}
          </a>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
