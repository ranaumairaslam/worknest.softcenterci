import "./Table.css"
export default function Tables(){
   const data=[
    {
    companyName:"SoftCentirc",
    companyEmail:"softcentirc@gmail.com",
    companyregister:"AI/ML Team",
    Plan:"Plan Sot"
    },
     {
    companyName:"SoftCentirc",
    companyEmail:"softcentirc@gmail.com",
    companyregister:"AI/ML Team",
    Plan:"Plan Sot"
    },
     {
    companyName:"SoftCentirc",
    companyEmail:"softcentirc@gmail.com",
    companyregister:"AI/ML Team",
    Plan:"Plan Sot"
    },
     {
    companyName:"SoftCentirc",
    companyEmail:"softcentirc@gmail.com",
    companyregister:"AI/ML Team",
    Plan:"Plan Sot"
    },
     {
    companyName:"SoftCentirc",
    companyEmail:"softcentirc@gmail.com",
    companyregister:"AI/ML Team",
    Plan:"Plan Sot"
    },
     {
    companyName:"SoftCentirc",
    companyEmail:"softcentirc@gmail.com",
    companyregister:"AI/ML Team",
    Plan:"Plan Sot"
    },
     {
    companyName:"SoftCentirc",
    companyEmail:"softcentirc@gmail.com",
    companyregister:"AI/ML Team",
    Plan:"Plan Sot"
    },
     {
    companyName:"SoftCentirc",
    companyEmail:"softcentirc@gmail.com",
    companyregister:"AI/ML Team",
    Plan:"Plan Sot"
    },
    

   ]
   return(<>
     

     <div className="bg-[#fbfbfb] mt-[20px] text-[#000000] py-[5px] px-3 rounded-md text-[12px]">
        <div className="flex flex-col items-center sm:flex-row sm:items-center gap-3 mb-5">
        <h2>Tenant Company Registry</h2>
        <span className="w-fit bg-[#016472] text-[#a3feff] py-[5px] px-3 rounded-md text-[11px] sm:text-[12px]">FR-4.4</span>
        </div>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm mt-5 overflow-x-auto">
             <table className="min-w-[900px] w-full border-collapse">
             <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                    
            <th className="px-5 py-3.5 text-xs font-semibold text-[black] uppercase tracking-wider whitespace-nowrap">Company</th>
            <th className="px-5 py-3.5 text-xs font-semibold text-[black] uppercase tracking-wider whitespace-nowrap">Contact Email</th>
            <th className="px-5 py-3.5 text-xs font-semibold text-[black] uppercase tracking-wider whitespace-nowrap">Register</th>
            <th className="px-5 py-3.5 text-xs font-semibold text-[black] uppercase tracking-wider whitespace-nowrap">Plan</th>
            <th className="px-5 py-3.5 text-xs font-semibold text-[black] uppercase tracking-wider whitespace-nowrap">Active</th>
            <th className="px-5 py-3.5 text-xs font-semibold text-[black] uppercase tracking-wider whitespace-nowrap">Suspend</th>
            <th className="px-5 py-3.5 text-xs font-semibold text-[black] uppercase tracking-wider whitespace-nowrap">Terminate</th>
            </tr>
            </thead>
        
        <tbody>{
            data.map((item,index)=>(

                <tr className="border-b border-gray-50 last:border-0 hover:bg-gray-50/70 transition-colors duration-150" key={index}>
                    <td className="px-5 py-3.5 text-sm font-medium text-gray-800 whitespace-nowrap">{item.companyName}</td>
                    <td className="px-5 py-3.5 text-sm font-medium text-gray-800 whitespace-nowrap">{item.companyEmail}</td>
                    <td className="px-5 py-3.5 text-sm font-medium text-gray-800 whitespace-nowrap">{item.companyregister}</td>
                    <td className="px-5 py-3.5 text-sm font-medium text-gray-800 whitespace-nowrap">{item.Plan}</td>
                    <td className="px-5 py-3.5 text-sm font-medium  whitespace-nowrap"><input className="w-[18px] h-[18px]" type="checkbox" /></td>
                    <td className="px-5 py-3.5 text-sm font-medium  whitespace-nowrap"><input className="w-[18px] h-[18px]" type="checkbox" /></td>
                    <td className="px-5 py-3.5 text-sm font-medium  whitespace-nowrap"><input className="w-[18px] h-[18px]" type="checkbox" /></td>
                    
                    
                    
                </tr>
            ))
            
           
        }
        
        </tbody>
        </table>
          
     
     </div>
     </div>
   
   </>)
}