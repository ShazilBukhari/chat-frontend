import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast, Bounce } from 'react-toastify';


const Signup = () => {
  const [username, setusername] = useState("")
  const [phonenumber, setphonenumber] = useState("")
  const [password, setpassword] = useState("")
  const navigate = useNavigate()

  const handleSignup = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post("https://chat-backend-0b9w.onrender.com/api/signup", { username, phonenumber, password })
      toast.success(res.data.message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });

      setTimeout(() => {
        navigate("/login")
      }, 3000);
      console.log(res.data.message)

    } catch (err) {
      toast.error(err.response?.data.error, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
      console.error(err.response?.data.error)
    }
  }
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />
      <section
        style={{
          backgroundColor: "#eee",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          padding: "40px 0",
        }}
      >
        <div className="container">
          <div className="row d-flex justify-content-center align-items-center">
            <div className="col-lg-10 col-xl-9">
              <div
                className="card text-black"
                style={{ borderRadius: "20px" }}
              >
                <div className="card-body p-4">
                  <div className="row justify-content-center">

                    {/* Form */}
                    <div className="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">

                      <p className="text-center h2 fw-bold mb-4">
                        Sign up
                      </p>

                      <form onSubmit={handleSignup}>

                        <div className="mb-3">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Your Username"
                            value={username}
                            onChange={(e) => setusername(e.target.value)}
                          />
                        </div>

                        <div className="mb-3">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Your Phone Number"
                            value={phonenumber}
                            onChange={(e) => setphonenumber(e.target.value)}
                          />
                        </div>

                        <div className="mb-3">
                          <input
                            type="password"
                            className="form-control"
                            placeholder="Your Password"
                            value={password}
                            onChange={(e) => setpassword(e.target.value)}
                          />
                        </div>

                        <button
                          type="submit"
                          className="btn btn-primary w-100"
                        >
                          Register
                        </button>

                        <div class="text-center">
                          <p>If you a already member? <Link to="/login">Login</Link></p>
                        </div>
                      </form>
                    </div>

                    {/* Image */}
                    <div className="col-md-10 col-lg-6 col-xl-7 d-flex align-items-center justify-content-center order-1 order-lg-2">
                      <img
                        src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/draw1.webp"
                        className="img-fluid"
                        style={{ maxHeight: "350px" }}
                        alt="Sample"
                      />
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Signup;