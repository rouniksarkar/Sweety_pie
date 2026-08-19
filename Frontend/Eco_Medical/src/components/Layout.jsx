import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar at top */}
      <Navbar />

      {/* Main content grows to push footer */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer always at bottom */}
      <Footer />
    </div>
  )
}

export default Layout
