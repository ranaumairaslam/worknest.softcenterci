import Sidebar from '../components/sidebar.jsx'
import Navbar from '../components/navbar.jsx'

import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-[#03181d] text-white">
      <Navbar onToggle={() => {}} />
      <Sidebar />
    </div>
  )
}

export default App