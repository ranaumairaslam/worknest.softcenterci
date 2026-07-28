import Logo from "../../assets/Softcenteric-logo.png";
import { Link,useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Signup() {
  const initialvalue={firstname:"",secondname:"",email:"",password:"",confirmpassword:""}
  const [formdata,setformdata]=useState(initialvalue);
  const [error,seterror]=useState(initialvalue);
  const navigate = useNavigate();
  
  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setformdata(prev => ({
      ...prev,[name]: value
    }));

    
  };
      const handleSubmit = (e) => {
      e.preventDefault();
      const newErrors = validate();
      seterror(newErrors);
      if (Object.keys(newErrors).length === 0) {
      navigate("/login");
  }
    };
      const nameRegex = /^[A-Za-z]+$/;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
      const validate=()=>{
      let newErrors={};
      
      if (!formdata.firstname) {
      newErrors.firstname = "*First name is required";}
       else if (!nameRegex.test(formdata.firstname)) {
       newErrors.firstname = "*Only alphabets allowed";
  
}
        if (!formdata.secondname) {
          newErrors.secondname = "*Last name is required";
        } else if (!nameRegex.test(formdata.secondname)) {
          newErrors.secondname = "Only alphabets allowed";
        }
        if (!formdata.email) {
          newErrors.email = "*Email is required";
        } else if (!emailRegex.test(formdata.email)) {
          newErrors.email = "*Pleaz Enter Valid Email";
        }
        if (!formdata.password) {
          newErrors.password = "*Password is required";
        } else if (!passwordRegex.test(formdata.password)) {
          newErrors.password = "*Password must have 8+ characters, a letter, a digit, and a special character";
        }
        if (!formdata.confirmpassword) {
          newErrors.confirmpassword = "*Please confirm your password";
        } else if (formdata.confirmpassword !== formdata.password) {
          newErrors.confirmpassword = "*Passwords do not match";
        }
      return newErrors;
}
  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-gradient-to-br from-[#f0f7f8] via-white to-[#e8f2f3] px-4 py-8 sm:px-6">
      <div className="flex w-full max-w-[560px] flex-col items-center rounded-2xl border border-gray-100 bg-white px-4 py-8 shadow-xl shadow-gray-200/70 sm:px-8">
        <div className="mb-6 flex w-full items-center justify-center gap-3 rounded-xl bg-[#d4e5e7] px-4 py-3 shadow-sm">
          <img
            src={Logo}
            alt="WorkNest logo"
            className="h-10 w-10 shrink-0 object-contain drop-shadow-sm sm:h-12 sm:w-12"/>
          <h2 className="text-2xl font-bold tracking-tight text-gray-800 sm:text-3xl">
            WorkNest
          </h2>
        </div>

        <h1 className="text-center text-2xl font-semibold text-black sm:text-3xl">
          Create Your Account
        </h1>

        <form onSubmit={handleSubmit} className="mt-6 flex w-full flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5 text-left">
              <span className="text-sm font-medium text-gray-800 sm:text-base">
                First Name
              </span>
              <input
                className="h-11 w-full rounded-md border border-gray-300 px-3 text-black transition-all duration-200 hover:border-[#016472] focus:border-[#016472] focus:outline-none focus:ring-2 focus:ring-[#016472]/30"
                type="text"
                name="firstname"
                value={formdata.firstname}
                onChange={handleChange}
                autoComplete="given-name"/>
                {error.firstname && (
                    <p className="text-red-500 text-sm">{error.firstname}</p>
                  )}
            </label>

            <label className="flex flex-col gap-1.5 text-left">
              <span className="text-sm font-medium text-gray-800 sm:text-base">
                Last Name
              </span>
              <input
                
                className="h-11 w-full rounded-md border border-gray-300 px-3 text-black transition-all duration-200 hover:border-[#016472] focus:border-[#016472] focus:outline-none focus:ring-2 focus:ring-[#016472]/30"
                type="text"
                name="secondname"
                value={formdata.secondname}
                onChange={handleChange}
                autoComplete="family-name"/>
                 {error.secondname && (
                    <p className="text-red-500 text-sm">{error.secondname}</p>
                  )}
              
            </label>
          </div>

          <label className="flex flex-col gap-1.5 text-left">
            <span className="text-sm font-medium text-gray-800 sm:text-base">
              Email
            </span>
            <input
              className="h-11 w-full rounded-md border border-gray-300 px-3 text-black transition-all duration-200 hover:border-[#016472] focus:border-[#016472] focus:outline-none focus:ring-2 focus:ring-[#016472]/30"
              type="email"
              name="email"
               value={formdata.email}
                onChange={handleChange}
              autoComplete="email"/>
            {error.email && (
                    <p className="text-red-500 text-sm">{error.email}</p>
                  )}
          </label>

          <label className="flex flex-col gap-1.5 text-left">
            <span className="text-sm font-medium text-gray-800 sm:text-base">
              Password
            </span>
            <input
              className="h-11 w-full rounded-md border border-gray-300 px-3 text-black transition-all duration-200 hover:border-[#016472] focus:border-[#016472] focus:outline-none focus:ring-2 focus:ring-[#016472]/30"
              type="password"
              name="password"
               value={formdata.password}
               onChange={handleChange}
              autoComplete="new-password"
            />
             {error.password && (
                    <p className="text-red-500 text-sm">{error.password}</p>
                  )}
          </label>

          <label className="flex flex-col gap-1.5 text-left">
            <span className="text-sm font-medium text-gray-800 sm:text-base">
              Confirm Password
            </span>
            <input
              className="h-11 w-full rounded-md border border-gray-300 px-3 text-black transition-all duration-200 hover:border-[#016472] focus:border-[#016472] focus:outline-none focus:ring-2 focus:ring-[#016472]/30"
              type="password"
              name="confirmpassword"
              value={formdata.confirmpassword}
              onChange={handleChange}

              autoComplete="new-password"
            />
             {error.confirmpassword && (
                    <p className="text-red-500 text-sm">{error.confirmpassword}</p>
                  )}
          </label>

          
          <button
            type="submit"
            className="mt-2 h-12 w-full rounded-lg bg-[#016472] text-base font-semibold text-white shadow-md shadow-[#016472]/30 transition-all duration-300 hover:bg-[#46787e] hover:shadow-lg hover:shadow-[#016472]/40 active:scale-[0.98]">
            Sign Up
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-[#0056ab] transition-colors duration-200 hover:text-[#0066CC] hover:underline"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

