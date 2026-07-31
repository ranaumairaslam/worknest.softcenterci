

import { Link,useNavigate } from "react-router-dom";
import { useState } from "react";
export default function Login() {
  const initialvalue={email:"",passowrd:""}
  const [formdata,setformdata]=useState(initialvalue);
  const [error,seterror]=useState(initialvalue);
  const navigate = useNavigate();

  const handleChange=(e)=>{
    const name=e.target.name;
    const value=e.target.value;
    setformdata(prev=>({
      ...prev,[name]:value
    }))

  }
   const handleSubmit = (e) => {
      e.preventDefault();
      const newError = validate();
      seterror(newError);
      if (Object.keys(newError).length === 0) {
      navigate("/login");
      }
   }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
  const validate=()=>{
    let newError={};
    if(formdata.email){
      newError.email = "*Email is required";}
    else if(!emailRegex.test(formdata.email)){
      newError.email="*Enter A valid Email"
    }
    if(!formdata.passowrd){
      newError.passowrd="*Enter A Password";
    }
    else if(!passwordRegex.test(formdata.passowrd)){
        newError.passowrd = "*Password must have 8+ characters, a letter, a digit, and a special character";

    }
    return newError;
  }
  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-gradient-to-br from-[#f0f7f8] via-white to-[#e8f2f3] px-4 py-8 sm:px-6">
      <div className="flex w-full max-w-[560px] flex-col items-center rounded-2xl border border-gray-100 bg-white px-4 py-8 shadow-xl shadow-gray-200/70 sm:px-8">
        <div className="mb-6 flex w-full items-center justify-center gap-3 rounded-xl bg-[#d4e5e7] px-4 py-3 shadow-sm">
          <img
            src="/Softcenteric-logo.png"
            alt="WorkNest logo"
            className="h-10 w-10 shrink-0 object-contain drop-shadow-sm sm:h-12 sm:w-12"
          />
          <h2 className="text-2xl font-bold tracking-tight text-gray-800 sm:text-3xl">
            WorkNest
          </h2>
        </div>

        <h1 className="text-center text-2xl font-semibold text-black sm:text-3xl">
          Access Your Account
        </h1>

        <form onSubmit={handleSubmit} className="mt-6 flex w-full flex-col gap-4">
          <label className="flex flex-col gap-1.5 text-left">
            <span className="text-sm font-medium text-gray-800 sm:text-base">
              Email
            </span>
            <input
              className="h-11 w-full rounded-md border border-gray-300 px-3 text-black transition-all duration-200 hover:border-[#016472] focus:border-[#016472] focus:outline-none focus:ring-2 focus:ring-[#016472]/30"
              type="email"
              autoComplete="email"
              name="email"
              value={formdata.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
            {error.email &&(<p className="text-red-500 text-sm">{error.email}</p>)}

          </label>

          <label className="flex flex-col gap-1.5 text-left">
            <span className="text-sm font-medium text-gray-800 sm:text-base">
              Password
            </span>
            <input
              className="h-11 w-full rounded-md border border-gray-300 px-3 text-black transition-all duration-200 hover:border-[#016472] focus:border-[#016472] focus:outline-none focus:ring-2 focus:ring-[#016472]/30"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              name="passowrd"
              value={formdata.passowrd}
              onChange={handleChange}
            />
            {error.passowrd &&(<p className="text-red-500 text-sm">{error.passowrd}</p>)}
          </label>

          <button
            type="submit"
            className="mt-2 h-12 w-full rounded-lg bg-[#016472] text-base font-semibold text-white shadow-md shadow-[#016472]/30 transition-all duration-300 hover:bg-[#448187] hover:shadow-lg hover:shadow-[#016472]/40 active:scale-[0.98]"
          >
            Login
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-gray-500">
          Don&apos;t have an account?{" "}
          <Link
            to="/Signup"
            className="font-medium text-[#0066CC] transition-colors duration-200 hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
