import subscriptionData from "./Subscriptiondata.js";
import { Link } from "react-router-dom";


export default function SubscriptionTable() {
  return (
    <div className="bg-white rounded-xl shadow border border-gray-200 p-5 overflow-x-auto mt-[50px]">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        COMPANY SUBSCRIPTION MANAGEMENT
      </h2>

      <table className="w-full min-w-[1100px]">
        <thead className="border-b border-gray-200">
          <tr className="text-left text-sm text-gray-500">
            <th className="py-3">Company Name</th>
           
            <th>Current Plan</th>
            <th>Plan Duration</th>
            <th>Active Date</th>
            <th>Expire Date</th>
            <th>Account Owner</th>
            <th>Upgrade Action</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {subscriptionData.map((item) => (
            <tr
              key={item.id}
              className="border-b border-gray-100 hover:bg-gray-50"
            >
              
              <td className="py-4">
                <div className="flex items-center gap-3">
                  

                  <span className="font-medium text-gray-800">
                    {item.company}
                  </span>
                </div>
              </td>
              <td className="text-gray-700">{item.plan}</td>
              <td className="text-gray-700">{item.duration}</td>
              <td className="text-gray-700">{item.date}</td>
              <td className="text-gray-700">{item.date2}</td>
              <td>
                <div className="flex items-center gap-2">
                 

                  <span>{item.owner}</span>
                </div>
              </td>
              <td>
                <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg">
                  {item.action}
                </button>
              </td>
              <td>
             <div className="flex gap-3">
                  <button className="text-blue-600 font-medium hover:underline">
                    Manage
                  </button>

                  <Link to="/invoice">
                    <button className="bg-[#016472] text-white px-3 py-1 rounded-md hover:bg-[#01515c] transition">
                      Invoice
                    </button>
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-between items-center mt-6">
        <p className="text-gray-500 text-sm">1-2 of 2 Companies</p>

        <div className="flex gap-2">
          <button className="w-9 h-9 rounded border border-gray-300">
            &lt;
          </button>

          <button className="w-9 h-9 rounded bg-blue-600 text-white">
            <select>
                <option>1</option>
                <option>2</option>
            </select>
          </button>

          <button className="w-9 h-9 rounded border border-gray-300">
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
}