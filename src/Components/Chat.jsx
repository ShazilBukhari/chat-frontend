import React, { useEffect, useState } from "react";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBIcon,
  MDBBtn,
  MDBTypography,
  MDBTextArea,
  MDBCardHeader,
} from "mdb-react-ui-kit";
import logo from "../assets/images/logo.png";
import send from "../assets/images/send.png"
import { toast, ToastContainer, Bounce } from "react-toastify";
import axios from "axios";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";


const socket = io("https://chat-backend-0b9w.onrender.com")

export default function App() {
  const [users, setusers] = useState([])
  const token = localStorage.getItem('token')
  const [selecteduser, setselecteduser] = useState(null)
  const myId = token ? JSON.parse(atob(token.split(".")[1])).sub : null
  const [messages, setmessages] = useState([])
  const [newMessage, setnewMessage] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        if (!token) {
          navigate("/login")
          return;
        }
        const res = await axios.get("https://chat-backend-0b9w.onrender.com/api/users", {
          headers: { Authorization: `Bearer ${token}` }
        })
        setusers(res.data)
      } catch (err) {
        // AGAR TOKEN EXPIRE HUA (Backend 401 bhejega)
        if (err.response && err.response.status === 401) {
          localStorage.removeItem('token'); // Token saaf karo
          toast.error("Session expired! Please login again.");
          navigate("/login"); // Redirect to login
        } else {
          toast.error("User didn't Load!");
        }
      }
    }
    fetchUsers()
    if (myId) {
      socket.emit('join', { user_id: myId })
    }
  }, [token, myId])

  useEffect(() => {
    const handleMessage = (data) => {
      // Check karo ki message usi user se aaya hai jo currently selected hai
      // Ya fir sender main khud hoon (optional, depend karta hai backend kaise handle kar raha)
      if (String(data.sender_id) === String(selecteduser?.id) || String(data.sender_id) === String(myId)) {
        setmessages((prev) => [...prev, data]);
      }
    };

    socket.on("receive-message", handleMessage);

    // Cleanup: Jab component unmount ho ya user change ho toh purana listener hata do
    return () => {
      socket.off("receive-message", handleMessage);
    };
  }, [selecteduser, myId]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get(`https://chat-backend-0b9w.onrender.com/api/messages/${selecteduser.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setmessages(res.data)
      } catch (err) {
        if (err.response && err.response.status === 401) {
          localStorage.removeItem('token');
          navigate("/login");
        }
      }
    }
    fetchHistory()
  }, [selecteduser, token])

  const sendMessage = (e) => {
    e.preventDefault()
    if (!newMessage) return;
    const data = {
      sender_id: myId,
      receiver_id: selecteduser.id,
      message: newMessage,
      timestamp: new Date().toISOString()
    }
    socket.emit('send-message', (data))
    setmessages((prev) => [...prev, data])
    setnewMessage("")
  }

  const logout = (e) => {
    e.preventDefault()
    navigate("/login")
    localStorage.removeItem("token")
    socket.disconnect()
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

      <MDBContainer fluid className="py-5" style={{ backgroundColor: "#eee", }}>
        <MDBRow>
          {/* Members Section */}
          <MDBCol md="4" lg="4" xl="4" className="mb-4 mb-md-0">
            <div className="d-flex  justify-content-between">
              <h5 className="font-weight-bold mb-3 text-center text-lg-start">Members</h5>
              <button style={{ border: "none" }} onClick={logout}>Logout</button>
            </div>
            <MDBCard>
              <MDBCardBody className="p-0">
                <MDBTypography listUnStyled className="mb-0">
                  <div style={{ height: "400px", overflowY: "scroll" }}>
                    {users.map((user) => (
                      <li key={user.id} className="p-2 border-bottom" style={{ backgroundColor: selecteduser?.id === user.id ? "#eee" : "transparent", cursor: "pointer" }} onClick={() => setselecteduser(user)}>
                        <div className="d-flex justify-content-between">
                          <div className="d-flex flex-row">
                            <div
                              // src={user.username[0].toUpperCase()}
                              alt="avatar"
                              className="rounded-circle d-flex align-self-center me-3 shadow-1-strong d-flex justify-content-center align-items-center"
                              style={{ width: "60px", height: "60px", fontSize: "40px", color: "green" }}
                            >
                              {user.username[0].toUpperCase()}
                            </div>
                            <div className="pt-1">
                              <p className="fw-bold mb-0">{user.username}</p>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}



                  </div>
                </MDBTypography>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>

          {/* Chat Section */}

          <MDBCol md="7" lg="7" xl="7" style={{ display: "flex", flexDirection: "column", height: "445px" }}>
            <MDBTypography listUnStyled style={{ flex: 1, }}>
              <h1>{selecteduser ? selecteduser.username : ""}</h1>
              <div style={{ maxHeight: "300px", overflowY: "scroll", width: "65vw" }}>
                {messages.map((msg) => {
                  const isMe = String(msg.sender_id) === String(myId)
                  return (
                    <li className={`d-flex mb-2 ${isMe ? "justify-content-end" : "justify-content-start"}`} style={{ margin: "10px" }}>
                      <MDBCard
                        style={{
                          backgroundColor: isMe ? "#DCF8C6" : "white",
                          maxWidth: "60%", minHeight: "50px"
                        }}
                      >
                        <MDBCardHeader className="d-flex justify-content-between p-3 gap-5">
                          <p className="fw-bold mb-0">{isMe ? "Me" : selecteduser?.username}</p>
                          <p className="text-muted small mb-0">
                            <MDBIcon far icon="clock" /> {msg.timestamp}
                          </p>
                        </MDBCardHeader>
                        <MDBCardBody>
                          <p className="mb-0">
                            {msg.message}
                          </p>
                        </MDBCardBody>
                      </MDBCard>
                    </li>
                  )
                })}

                {/* this is a images messaging section */}
                {!selecteduser && (
                  <div style={{
                    borderRadius: "16px",
                    height: "25vw",
                    width: "54vw",
                    border: "5px solid #c9cfc8",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                    margin: "auto" // Center mein rakhne ke liye
                  }}>
                    <img src={logo} alt="Messaging" style={{ height: "60px" }} />
                    <p>Start Chat. <span style={{ color: "green" }}>Build</span> Connections. 💬</p>
                  </div>
                )}

              </div>
            </MDBTypography>

            {/* Input Section */}
            <form onSubmit={sendMessage}>
              <div className="d-flex justify-content-between align-items-center gap-2">
                <li className="bg-white mb-3">
                  <MDBTextArea label="Message" id="textAreaExample" style={{ width: "58vw", padding: "1vw" }} value={newMessage} onChange={(e) => setnewMessage(e.target.value)} />
                </li>
                <MDBBtn type="submit" style={{ display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "green" }}>
                  Send
                </MDBBtn>
              </div>
            </form>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </>
  );
}