import { Link } from 'react-router-dom'

const NavBar = () => {
  return (
    <>
      <nav> 
        <div id="nav-left"><Link to="/">Taiwan Explorers</Link></div>
        <div id="nav-center">
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/destinations">Destinations</Link></li>
            <li><Link to="/interests">Interests</Link></li>
          </ul>
        </div>
        <div id="nav-right">Search</div>
      </nav>
    </>
  )
}

export default NavBar
