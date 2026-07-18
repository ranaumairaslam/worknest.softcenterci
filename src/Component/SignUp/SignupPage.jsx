import Logo from "../../assets/Softcenteric-logo.png";
import { Link } from "react-router-dom";

export default function Signup() {
  return (
    <>
      <div className="w-full mt-10 flex justify-center items-center px-4 min-h-screen bg-gradient-to-br from-[#f0f7f8] via-white to-[#e8f2f3]">
        <div className="w-full max-w-[600px] flex flex-col items-center bg-white rounded-2xl shadow-xl shadow-gray-200/70 border border-gray-100 py-8 px-4">
          <div className="w-full sm:w-[75%] flex items-center justify-center px-3 py-2 bg-[#d4e5e7] rounded-t-lg shadow-sm">
            <img
              src={Logo}
              className="w-8 h-8 sm:w-8 sm:h-8 object-contain drop-shadow-sm"
            />
            <h2 className="text-[30px] sm:text-4xl lg:text-6xl mt-5 font-bold font-sans text-gray-800 tracking-tight">
              WorkNest
            </h2>
          </div>

          <h1 className="text-3xl sm:text-[40px] text-black text-center mt-4 font-semibold">
            Create Your Account
          </h1>

          <div className="mt-4 w-full sm:w-[75%] flex flex-col gap-[5px] items-center">
            <div className="flex flex-col sm:flex-row w-full gap-4">
              <div className="flex flex-col items-start gap-[5px] flex-1">
                <p className="text-black text-[20px] font-medium">First Name</p>
                <input
                  className="border border-black rounded-[5px] h-[38px] text-black pl-[10px] w-full focus:outline-none focus:ring-2 focus:ring-[#016472] focus:border-[#016472] transition-all duration-200 hover:border-[#016472]"
                  type="text"
                />
              </div>

              <div className="flex flex-col items-start gap-[5px] flex-1">
                <p className="text-black text-[20px] font-medium">Last Name</p>
                <input
                  required
                  className="border border-black rounded-[5px] h-[38px] text-black pl-[10px] w-full focus:outline-none focus:ring-2 focus:ring-[#016472] focus:border-[#016472] transition-all duration-200 hover:border-[#016472]"
                  type="text"
                />
              </div>
            </div>

            <div className="flex flex-col items-start mt-2 w-full gap-[5px]">
              <p className="text-black text-[20px] font-medium">Email</p>
              <input
                className="border border-black w-full rounded-[5px] h-[38px] text-black pl-[10px] focus:outline-none focus:ring-2 focus:ring-[#016472] focus:border-[#016472] transition-all duration-200 hover:border-[#016472]"
                type="text"
              />
            </div>

            <div className="flex flex-col mt-2 items-start gap-[5px] w-full">
              <p className="text-black text-[20px] font-medium">Password</p>
              <input
                className="border border-black w-full rounded-[5px] h-[38px] text-black pl-[10px] focus:outline-none focus:ring-2 focus:ring-[#016472] focus:border-[#016472] transition-all duration-200 hover:border-[#016472]"
                type="password"
              />
            </div>

            <div className="flex flex-col mt-2 items-start gap-[5px] w-full">
              <p className="text-black text-[20px] font-medium">Confirm Password</p>
              <input
                className="border border-black w-full rounded-[5px] h-[38px] text-black pl-[10px] focus:outline-none focus:ring-2 focus:ring-[#016472] focus:border-[#016472] transition-all duration-200 hover:border-[#016472]"
                type="password"
              />
            </div>
          </div>

          <div className="mt-[10px]">
            <p className="text-center text-sm text-gray-500 mt-4">
              Already have an account?{" "}
              <Link to="/login" className="text-[#0056ab] font-medium hover:underline transition-colors duration-200 hover:text-[#0066CC]">
                Log in
              </Link>
            </p>
          </div>

          <button
            type="submit"
            className="w-full sm:w-[76%] mt-[20px] h-12 bg-[#016472] text-white text-base sm:text-lg font-semibold rounded-lg hover:bg-[#46787e] active:scale-[0.98] transition-all duration-300 cursor-pointer shadow-md shadow-[#016472]/30 hover:shadow-lg hover:shadow-[#016472]/40">Sign Up
          </button>
        </div>
      </div>
    </>
  );
}