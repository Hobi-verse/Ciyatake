import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "../../components/common/AuthForm";
import UserNavbar from "../../components/user/common/UserNavbar";

const Login = () => {
  const navigate = useNavigate();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const fields = [
    {
      name: "phoneNumber",
      type: "tel",
      placeholder: "Enter the Mobile Number",
      required: true,
      autoComplete: "tel",
    },
    {
      name: "password",
      type: isPasswordVisible ? "text" : "password",
      placeholder: "Enter the Password",
      required: true,
      autoComplete: "current-password",
      helperText: "Use the password you created during registration.",
      render: ({ value = "", setValue, inputClasses }) => (
        <div className="space-y-2">
          <label
            htmlFor="login-password"
            className="block text-sm font-medium text-emerald-100"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="login-password"
              name="password"
              type={isPasswordVisible ? "text" : "password"}
              placeholder="Enter the Password"
              value={value}
              onChange={(event) => setValue(event.target.value)}
              className={`${inputClasses} pr-24`}
              required
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setIsPasswordVisible((previous) => !previous)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold uppercase tracking-wide text-emerald-200/80"
            >
              {isPasswordVisible ? "Hide" : "Show"}
            </button>
          </div>
        </div>
      ),
    },
  ];

  const socialProviders = [
    { label: "Google", onClick: () => alert("Login with Google") },
  ];

  const handleLogin = (formValues) => {
    localStorage.setItem("User1", formValues.phoneNumber ?? "");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#07150f]">
      <UserNavbar />
      <AuthForm
        title="Welcome back"
        subtitle="Sign in to continue your shopping journey."
        fields={fields}
        onSubmit={handleLogin}
        socialProviders={socialProviders}
        buttonLabel="Sign In"
        footerText="Don't have an account?"
        footerLinkText="Sign up"
        footerLinkHref="/signup"
        forgetPasswordText="Forget Password?"
      />
    </div>
  );
};

export default Login;
