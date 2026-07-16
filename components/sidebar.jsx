import React from "react";
import logo from "../src/assets/Softcenteric-logo.png";
import { navigation } from "./navigation";
import { Settings, LogOut } from "lucide-react";

export default function Sidebar({
  role = "teamMember", 
  company = "WorkNest",
}) {
  const menu = navigation[role] || [];

  return (
   <aside
  className="
    fixed
    left-0
    top-0
    z-50
    flex
    h-screen
    w-72
    flex-col
    justify-between
    border-r
    border-[#0d4f5b]
    bg-gradient-to-b
    from-[#000304]
    via-[#03181d]
    to-[#016472]
    text-white
    shadow-2xl
    
  "
>
      
      
      <div className="p-6">
      
          <div className="flex items-center gap-4 mb-10">

          
        <div className="w-14 h-14 rounded-xl bg-white shadow-lg flex items-center justify-center">
            <img
              src={logo}
              alt="WorkNest Logo"
              className="h-10 w-10 object-contain"
            />
          </div>

          <div>
                 <h2 className="text-xl font-bold tracking-wide text-white">
              {company}  
            </h2>
                 <p className="text-xs text-[#A3FEFF]">

              Project Management
            </p>
          </div>

        </div>

       
        <ul className="space-y-2">
          {menu.map((item) => {
            const Icon = item.icon;

            return (
              <li key={item.title}>
              <button
  className="
    group
    flex
    w-full
    items-center
    gap-4
    rounded-xl
    px-4
    py-3

    text-[#d8ffff]

    transition-all
    duration-300

    hover:bg-[#016472]
    hover:text-white
    hover:shadow-lg
     active:scale-95
  "
>

                  <Icon size={20}
                          className="text-[#A3FEFF] group-hover:text-white"
                    />
                  <span>{item.title}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Bottom */}
     <div className="border-t border-[#0b4c56] p-5 space-y-2">

        <button
className="
flex
w-full
items-center
gap-4

rounded-xl

px-4
py-3

text-[#A3FEFF]

transition-all

hover:bg-[#016472]
hover:text-white
 active:scale-95
"
>
          <Settings size={20} />
          <span>Settings</span>
        </button>
<button
  className="
    group
    relative

    flex
    w-full
    items-center
    gap-4

    rounded-2xl

    border
    border-red-500/20

    bg-red-500/5

    px-4
    py-3.5

    text-red-400

    transition-all
    duration-300
    ease-in-out

    hover:border-red-500/40
    hover:bg-red-500/15
    hover:text-red-300
    hover:shadow-lg
    hover:shadow-red-500/10

    active:scale-95
  "
>
  <LogOut
    size={20}
    className="
      transition-transform
      duration-300
      group-hover:translate-x-1
    "
  />

  <span className="font-medium tracking-wide">
    Logout
  </span>

  <div
    className="
      ml-auto

      opacity-0

      transition-opacity
      duration-300

      group-hover:opacity-100
    "
  >
    →
  </div>
</button>
        

      </div>
    </aside>
  );
}