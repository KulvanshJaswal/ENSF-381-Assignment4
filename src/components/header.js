import { Link } from "react-router-dom";

function Header() {
    const userId = localStorage.getItem("userId");
    const handleLogout = () => {
        localStorage.removeItem("userId");
        localStorage.removeItem("username");
        window.location.href = "/";
    };
  return (
    <>
      <header>
        <img src="/images/logo.webp" alt="Sweet Scoop" />
        <h1>Sweet Scoop Ice Cream Shop</h1>
        {userId ? ( <button onClick={handleLogout}>Logout</button>) : (<Link to="/login">Login</Link>
        )}
      </header>

      <div className="navbar">
        <Link to="/">Home</Link>
        <Link to="/flavors">Flavors</Link>
        <Link to="/orderHistory">Order History</Link>
      </div>
    </>
  );
}

export default Header;