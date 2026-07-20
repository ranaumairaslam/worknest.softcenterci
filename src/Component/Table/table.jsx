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
      <div className="mt-[20px] w-full overflow-x-auto">
             <table className="min-w-[900px] w-full border-collapse">
             <thead>
                <tr>
                    
            <th className="w-[20%] text-base bg-[#f2f2f2] text-black p-[15px] text-center border-b border-[#ccc] first:rounded-tl-[20px">Company</th>
            <th className="w-[30%] text-base bg-[#f2f2f2] text-black p-[15px] text-center border-b border-[#ccc]">Contact Email</th>
            <th className="w-[20%] text-base bg-[#f2f2f2] text-black p-[15px] text-center border-b border-[#ccc]">Register</th>
            <th className="w-[20%] text-base bg-[#f2f2f2] text-black p-[15px] text-center border-b border-[#ccc]">Plan</th>
            <th className="w-[10%] text-base bg-[#f2f2f2] text-black p-[15px] text-center border-b border-[#ccc]">Active</th>
            <th className="w-[10%] text-base bg-[#f2f2f2] text-black p-[15px] text-center border-b border-[#ccc]">Suspend</th>
            <th className="w-[10%] text-base bg-[#f2f2f2] text-black p-[15px] text-center border-b border-[#ccc]">Terminate</th>
            </tr>
            </thead>
        
        <tbody>{
            data.map((item,index)=>(

                <tr key={index}>
                    <td className="h-[40px] text-center text-sm pt-5 border-b border-black">{item.companyName}</td>
                    <td className="h-[40px] text-center text-sm pt-5 border-b border-black">{item.companyEmail}</td>
                    <td className="h-[40px] text-center text-sm pt-5 border-b border-black">{item.companyregister}</td>
                    <td className="h-[40px] text-center text-sm pt-5 border-b border-black">{item.Plan}</td>
                    <td className="check-box text-center pt-5 border-b border-black"><input className="w-[18px] h-[18px]" type="checkbox" /></td>
                    <td className="check-box text-center  pt-5 border-b border-black"><input className="w-[18px] h-[18px]" type="checkbox" /></td>
                    <td className="check-box text-center  pt-5 border-b border-black"><input className="w-[18px] h-[18px]" type="checkbox" /></td>
                    
                    
                    
                </tr>
            ))
            
           
        }
        
        </tbody>
        </table>
          
     
     </div>
     </div>
   
   </>)
}