import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
const [isOpen,setIsOpen]=useState(false);

const navLinks=[
{title:"Home",path:"#home"},
{title:"Features",path:"#features"},
{title:"Solution",path:"#solution"},
{title:"About",path:"#about"},
{title:"Contact",path:"#contact"},
];

return(
<nav className="fixed top-0 left-0 z-50 w-full border-b border-white/10 bg-[#010005] backdrop-blur-xl">
<div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10">

<Link to="/login" className="flex items-center gap-3">
<img src="/Softcenteric-logo.png" alt="Worknest" className="h-16 w-16 object-contain mt-0"/>
<h1 className="text-4xl font-bold text-white pt-[14px]">Work<span className="text-[#a3feff]">nest</span></h1>
</Link>

<ul className="hidden items-center gap-10 lg:flex">
{navLinks.map((item)=>(
<li key={item.title}>
<a href={item.path} className="text-[15px] font-medium text-[white] transition-all duration-300 hover:text-[#14bfc2]">{item.title}</a>
</li>
))}
</ul>

<div className="hidden items-center gap-4 lg:flex">
<Link to="/login" className="rounded-xl border border-[#016472] px-6 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:border-[#a3feff] hover:text-[#a3feff]">Login</Link>
<Link to="/signup" className="rounded-xl bg-[#016472] text-[white] font-bold-500 px-6 py-2.5 text-sm font-semibold rounded-xl bg-[#016472] bg-gradient-to-r from-[#016472] to-cyan-400 text-base">Sign Up</Link>
</div>

<button onClick={()=>setIsOpen(!isOpen)} className="text-white lg:hidden">
<Menu size={30}/>
</button>

</div>

{isOpen&&(
<div className="border-t border-white/10 bg-[#000304] lg:hidden">
<div className="flex flex-col px-6 py-5">
{navLinks.map((item)=>(
<a key={item.title} href={item.path} className="py-3 text-slate-300 transition-all duration-300 hover:text-[#a3feff]">{item.title}</a>
))}
<div className="mt-5 flex flex-col gap-3">
<Link to="/login" className="rounded-xl border border-[#016472] py-3 text-center font-semibold text-white">Login</Link>
<Link
to="/signup"
className="rounded-xl  px-8 py-4 font-semibold bg-gradient-to-r from-[#016472] to-cyan-400 text-base"
>
Sign Up
</Link>
</div>
</div>
</div>
)}
</nav>
);
}