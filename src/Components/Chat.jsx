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
import { toast, ToastContainer, Bounce } from "react-toastify";
import axios from "axios";
import { io } from "socket.io-client";


const socket = io("https://chat-backend-0b9w.onrender.com")

export default function App() {
  const [users, setusers] = useState([])
  const token = localStorage.getItem('token')
  const [selecteduser, setselecteduser] = useState(null)
  const myId = token ? JSON.parse(atob(token.split(".")[1])).sub : null
  const [messages, setmessages] = useState([])
  const [newMessage, setnewMessage] = useState("")

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        if (!token) {
          toast.error("Your token is expiry Try Again with Login!")
          navigate("/login")
        }
        const res = await axios.get("https://chat-backend-0b9w.onrender.com/api/users", {
          headers: { Authorization: `Bearer ${token}` }
        })
        setusers(res.data)
      } catch (err) {
        toast.error("User didn't Load So Please Logout and try again!")
      }
    }
    fetchUsers()
    if(myId){
      socket.emit('join',{user_id:myId})
    }

    const handleMessage=()=>{
      setmessages((prev)=>{
        return [...prev,data]
      })
      socket.emit("receive-message",handleMessage)
      return ()=>socket.off("receive-message",handleMessage)
    }
  }, [token,myId])

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get(`https://chat-backend-0b9w.onrender.com/api/messages/${selecteduser.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setmessages(res.data)
      } catch (err) {
        console.error(err)
      }
    }
    fetchHistory()
  }, [selecteduser, token])

  const sendMessage = (e)=>{
    e.preventDefault()
    const data = {
      sender_id:myId,
      receiver_id:selecteduser.id,
      message:newMessage
    }
    socket.emit('send-message',(data))
    setmessages((prev)=>[...prev,data])
    setnewMessage("")
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

      <MDBContainer fluid className="py-5" style={{ backgroundColor: "#eee" }}>
        <MDBRow>
          {/* Members Section */}
          <MDBCol md="6" lg="5" xl="4" className="mb-4 mb-md-0">
            <h5 className="font-weight-bold mb-3 text-center text-lg-start">Members</h5>
            <MDBCard>
              <MDBCardBody className="p-0">
                <MDBTypography listUnStyled className="mb-0">
                  <div style={{ maxHeight: "400px", overflowY: "scroll" }}>
                    {users.map((user) => (
                      <li key={user.id} className="p-2 border-bottom" style={{ backgroundColor: selecteduser?.id === user.id ? "#eee" : "transparent", cursor: "pointer" }} onClick={() => setselecteduser(user)}>
                        <div className="d-flex justify-content-between">
                          <div className="d-flex flex-row">
                            <div
                              // src={user.username[0].toUpperCase()}
                              alt="avatar"
                              className="rounded-circle d-flex align-self-center me-3 shadow-1-strong d-flex justify-content-center align-items-center"
                              style={{ width: "60px", height: "60px", fontSize: "40px" }}
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

          <MDBCol md="6" lg="7" xl="8" style={{ display: "flex", flexDirection: "column", height: "450px" }}>
            <MDBTypography listUnStyled style={{ flex: 1, }}>
              <h1>{selecteduser ? selecteduser.username : "Select a User"}</h1>
              <div style={{ maxHeight: "350px", overflowY: "scroll" }}>
                {messages.map((msg) => {
                  const isMe = String(msg.sender_id) === String(myId)
                  return (
                    <li className={`d-flex mb-4 ${isMe ? "justify-content-end" : "justify-content-start"}`}>
                      <MDBCard style={{ maxWidth: "60%", minHeight: "80px" }}>
                        <MDBCardHeader className="d-flex justify-content-between p-3">
                          <p className="fw-bold mb-0">{isMe?"Me":selecteduser?.username}</p>
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


                
              </div>
            </MDBTypography>

            {/* Input Section */}
            <form onSubmit={sendMessage}>
            <div className="d-flex justify-content-between align-items-center gap-2">
              <li className="bg-white mb-3">
                <MDBTextArea label="Message" id="textAreaExample" rows={2} style={{ width: "48vw" }} value={newMessage} onChange={(e)=>setnewMessage(e.target.value)}/>
              </li>
              <MDBBtn color="info" rounded className="float-end" type="submit">
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