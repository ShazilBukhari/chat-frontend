import React, { useState } from "react";
import "./home.css";
import { Link } from "react-router-dom";

const Home = () => {
  const [sidebar, setSidebar] = useState(false);

  const openSidebar = () => setSidebar(true);
  const closeSidebar = () => setSidebar(false);

  return (
    <div>

      {/* Sidebar */}
      <div className={sidebar ? "sidebar active" : "sidebar"}>

        <div className="sidebar-header">
          <h3>ChatApp</h3>
          <span className="close-btn" onClick={closeSidebar}>✕</span>
        </div>

        <ul>
          <li><Link to="/" style={{ color: "white", textDecoration: "none" }}>Home</Link></li>
          <li><Link to="/signup" style={{ color: "white", textDecoration: "none" }}>Signup</Link></li>
        </ul>

      </div>

      {/* Navbar */}
      <div className="navbar">

        <span className="hamburger" onClick={openSidebar}>
          ☰
        </span>

        <h1 className="heading"></h1>

      </div>

      {/* Hero Section */}
      <div className="hero container">

        <div className="row align-items-center">

          <div className="col-md-6 hero-text">

            <h2>Connect With Friends Instantly</h2>

            <p>
              Our chat application allows you to communicate with friends
              and teams in real-time. Fast, secure and modern messaging
              experience designed for everyone.
            </p>

            <Link to = "/signup" className="btn btn-primary btn-lg mt-3">
              Start Chatting
            </Link>

          </div>

          <div className="col-md-6 hero-img">
            <img
              src="https://cdn-icons-png.flaticon.com/512/9068/9068675.png"
              className="img-fluid floating"
              alt="chat"
            />
          </div>

        </div>

      </div>

      {/* Features */}
      <div className="features container text-center">

        <h2 className="mb-5">Awesome Features</h2>

        <div className="row">

          <div className="col-md-4">
            <div className="feature-card">
              <h4>Real Time Chat</h4>
              <p>Instant messaging with lightning fast performance.</p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="feature-card">
              <h4>Secure Messages</h4>
              <p>End-to-end secure communication.</p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="feature-card">
              <h4>Modern UI</h4>
              <p>Clean and user-friendly interface.</p>
            </div>
          </div>

        </div>

      </div>

      {/* Footer */}
      <footer className="footer">
        <p>© 2026 Chat Application | Built with React</p>
      </footer>

    </div>
  );
};

export default Home;