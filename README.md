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
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast, Bounce } from 'react-toastify';
import { io } from "socket.io-client";

const socket = io("http://127.0.0.1:5000")

export default function App() {
  const [selecteduser, setselecteduser] = useState(null)
  const [users, setusers] = useState([])
  const [messages, setmessages] = useState([])
  const token = localStorage.getItem("token")
  const navigate = useNavigate()
  let myid = token ? JSON.parse(atob(token.split(".")[1])).sub : null
  const [newMessage, setnewMessage] = useState("")

  useEffect(() => {
    const fetchusers = async () => {
      try {
        if (!token) {
          navigate("/login")
        }
        const res = await axios.get('http://127.0.0.1:5000/api/users', {
          headers: { Authorization: `Bearer ${token}` }
        })
        setusers(res.data)
      } catch (err) {
        toast.error("User didn't Load So Please Logout and try again!")
      }
    }
    fetchusers()
    if (myid) {
      socket.emit("join", { user_id: myid });
    }
    const handlenewMessage = (data) => {
      setmessages((prev)=>{return [...prev,data]})
    }
    socket.on('receive-message', handlenewMessage)
    return () => socket.off("receive-message", handlenewMessage)
  }, [myid])

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get(`http://127.0.0.1:5000/api/messages/${selecteduser.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setmessages(res.data)
      } catch (err) {
        console.error(err)
      }
    }
    fetchHistory()
  }, [selecteduser, token])

  const sendMessage = (e) => {
    e.preventDefault()
    if (!selecteduser && !newMessage) return;
    const data = {
      sender_id: myid,
      receiver_id: selecteduser.id,
      message: newMessage
    }

    socket.emit("send-message", data)
    setmessages((prev) => [...prev, data])
    setnewMessage("")

  }

  const logout = (e) => {
    e.preventDefault()
    localStorage.removeItem('token')
    socket.disconnect()
    toast.success("Logged out successfully!");
    setTimeout(() => {
      navigate("/login")
    }, 2000);
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

      <MDBContainer fluid className="py-5" style={{ backgroundColor: "#eee", height: "100vh" }}>
        <MDBRow style={{ height: "100%" }}>

          {/* LEFT SIDEBAR */}
          <MDBCol md="4" lg="4" xl="3" className="mb-4 mb-md-0">
            <h5 className="fw-bold mb-3 text-center text-lg-start d-flex justify-content-between">Members
              <button onClick={logout} style={{ border: "none" }}>Logout</button></h5>

            <MDBCard style={{ height: "80vh" }}>
              <MDBCardBody style={{ overflowY: "auto" }}>
                <MDBTypography listUnStyled className="mb-0">

                  {users.map((user, index) => (
                    <li key={user.id} className="p-2 border-bottom" style={{ backgroundColor: selecteduser?.id === user.id ? "#eee" : "transparent", cursor: "pointer" }} onClick={() => setselecteduser(user)}>
                      <div className="d-flex justify-content-between">
                        <div className="d-flex flex-row">
                          <div
                            className="rounded-circle d-flex align-items-center justify-content-center me-3 bg-primary text-white"
                            style={{ width: "60px", height: "60px", fontSize: "24px" }}
                          >
                            {user.username[0].toUpperCase()} {/* 👈 Pehla letter avatar ban jayega */}
                          </div>
                          <div className="pt-1">
                            <p className="fw-bold mb-0">{user.username}</p>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}


                </MDBTypography>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>

          {/* RIGHT CHAT AREA */}
          <MDBCol md="8" lg="8" xl="8">

            <MDBCard style={{ height: "90vh" }}>
              <h1 style={{ padding: "10px" }}>
                {selecteduser ? selecteduser.username : "Select a user"}
              </h1>

              {/* CHAT MESSAGES */}
              <MDBCardBody style={{ overflowY: "auto" }}>

                <MDBTypography listUnStyled>

                  {/* Lara Croft RIGHT */}
                  {messages.map((msg, index) => {
                    const isMe = String(msg.sender_id) === String(myid);
                    return (
                      <li key={index}
                        className={`d-flex mb-4 ${isMe ? "justify-content-end" : "justify-content-start"}`}>
                        <MDBCard style={{ maxWidth: "60%", backgroundColor: isMe ? "#dcf8c6" : "#fff" }}>
                          <MDBCardHeader className="d-flex justify-content-between p-2">
                            <p className="fw-bold mb-0">
                              {isMe ? "Me" : selecteduser?.username}
                            </p>
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
                  }
                  )
                  }


                </MDBTypography>

              </MDBCardBody>

              {/* CHAT INPUT */}
              <form onSubmit={sendMessage}>
                <div className="p-3 border-top d-flex justify-content-center gap-2">
                  <MDBTextArea label="Message" rows={1} value={newMessage} onChange={(e) => setnewMessage(e.target.value)} />
                  <MDBBtn color="info" className="mt-2 float-end" type="submit">
                    Send
                  </MDBBtn>
                </div>
              </form>

            </MDBCard>

          </MDBCol>

        </MDBRow>
      </MDBContainer >
    </>
  );
}