import React from 'react'
import * as n from '../styles/navbar.style.js'
import logo from '../logo.svg'
import { Outlet } from 'react-router-dom'

const NavbarCustom = ({ accounts }) => (
  <>
    <n.Nav>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
        <n.NavLink to="/">
          <img
            style={{ width: 50, height: 50, margin: 5 }}
            src={logo}
            alt="Logo"
          />
        </n.NavLink>
        <n.NavLink to="/">
          <n.MenuLink>Mint</n.MenuLink>
        </n.NavLink>
        <n.NavLink to="whitelist">
          <n.MenuLink>Whitelist</n.MenuLink>
        </n.NavLink>
        <n.NavLink to="admin">
          <n.MenuLink>Admin</n.MenuLink>
        </n.NavLink>
      </div>
      <n.NavbarAddress margin={10} style={{ color: 'white' }}>
        {accounts !== null && accounts[0]}
      </n.NavbarAddress>
    </n.Nav>
    <Outlet />
  </>
)

export default NavbarCustom