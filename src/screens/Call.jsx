/* eslint-disable react/no-unknown-property */
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { usePeer } from '../context/peerContext';
import { useLocation, useNavigate } from "react-router-dom";
import MyStreamView from "../components/MyStreamView";
import RemotePeerStream from "../components/RemotePeerStream";
import { useSocket } from "../context/socketContext";
import { toast } from "react-toast";
import { BsFillMicMuteFill } from "react-icons/bs";
import Button from "../components/Button";
import { BsMicFill, BsCameraVideoFill, BsCameraVideoOffFill, BsPeopleFill } from 'react-icons/bs';
import { MdOutlineScreenShare, MdOutlineStopScreenShare } from 'react-icons/md';
import { GiSpeaker, GiSpeakerOff } from 'react-icons/gi';
import { joinMeet } from "../redux/slice/meet/meetAction";
import JoinCall from "./JoinCall";
import InMeetMessages from "../components/InMeetMessages";
import { MdChat } from "react-icons/md";
import ParticipantDrawer from "../components/ParticipantDrawer";
import { useStream } from "../context/streamContext";
import { ImCross } from "react-icons/im";





function Meet(props) {

  // ==========================================================================================================================================================//

  // get the socket instance
  const socket = useSocket();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { meetId, name, video, audio, hostId } = props.state;

  // selectors
  let { loading, error, userInfo, success } = useSelector((state) => state.user);

  // custom hooks
  let { peerData, addPeerData, removePeerData, removeAllPeerData, addPeerConnection, ChangeLoadingState } = usePeer();
  const { stream, localMediaStreamRef, displayMediaStreamRef, isScreenSharing, startLocalMediaStream, toggleScreenSharing, stopScreenSharing, destroyingMediaStream, toggleCamera, toggleMicrophone, toggleSound, camera, sound, microphone, toggleMuteByHost, toggleVideoPauseByHost } = useStream();

  // managing peer connections
  let remotePeers = useRef({});
  const [seePeerList, setPeerList] = useState([]);

  // managing sidebar
  const [sideBar, setSideBar] = useState(false);
  const [sideBarShow, setSideBarShow] = useState(null);

  // managing chat
  const [messages, setMessages] = useState([]);





  //=========================================================================================================================================================//


  // WEBRTC CONSTRAINTS
  let isVoiceOnly = (video === false && audio === true);


  // STUN AND TURN SERVERS
  let peerConstraints = {
    iceServers: [
      {
        urls: "stun:stun.l.google.com:19302",
      },
      {
        urls: "stun:stun1.l.google.com:19302"
      },
      {
        urls: "stun:stun.relay.metered.ca:80",
      },
      {
        urls: "turn:a.relay.metered.ca:80",
        username: "d9321e8efb56429ed954fb25",
        credential: "GQh8JhkiZQLqKbUu",
      },
      {
        urls: "turn:a.relay.metered.ca:80?transport=tcp",
        username: "d9321e8efb56429ed954fb25",
        credential: "GQh8JhkiZQLqKbUu",
      },
      {
        urls: "turn:a.relay.metered.ca:443",
        username: "d9321e8efb56429ed954fb25",
        credential: "GQh8JhkiZQLqKbUu",
      },
      {
        urls: "turn:a.relay.metered.ca:443?transport=tcp",
        username: "d9321e8efb56429ed954fb25",
        credential: "GQh8JhkiZQLqKbUu",
      },
    ],
  };

  // USEEFFECT TO UPDATE THE PEER LIST STATE SO RENDERING CAN BE DONE
  useEffect(() => {
    setPeerList(Object.keys(peerData));
    console.log("Peer Data FOR USER NAME: ", userInfo.name, ": ", peerData);
  }, [peerData]);


  // take user to join call page if refresh and show confirmation modal if user tries to leave the page
  useEffect(() => {

    const handleBeforeUnload = (e) => {
      handleEndCall();
      navigate(`/call/${meetId}`);
    }

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    }
  }, []);





  //=========================================================================================================================================================//
  //========================================================================== LOCAL STREAM HANDLERS ========================================================//


  const handleEndCall = () => {
    // destroyDataChannel();
    // destroyingMediaStream();
    cleanupConnections();

  }

  //=========================================================================================================================================================//
  // ===================================================================== REUSABLE FUNCTIONS ===============================================================//

  //SETUP NEW CONNECTION WITH PEER
  const setNewConnection = (socketId, name, userId) => {
    try {
      if (!remotePeers.current[userId]) {

        //* Creating a new RTCPeerConnection for the remote peer who joined the meet to store in our side
        remotePeers.current[userId] = new RTCPeerConnection(peerConstraints);

        //* CREATE DATA CHANNEL FOR THE USER
        remotePeers.current[userId].brodcastChannel = remotePeers.current[userId].createDataChannel("brodcast");

        //* EVENTS========================================

        remotePeers.current[userId].brodcastChannel.onopen = () => {
          console.log("Data Channel Opened");
        }

        remotePeers.current[userId].brodcastChannel.onmessage = (event) => {
          console.log("Data Channel Message: ", event.data);
          setMessages((prev) => [...prev, JSON.parse(event.data)]);
        }

        remotePeers.current[userId].brodcastChannel.onclose = () => {
          console.log("Data Channel Closed");
        }


        remotePeers.current[userId].ontrack = (event) => {
          addPeerData(socketId, event.streams[0], userId, name, true);
        }

        //* Once the Offer is created and set as the local description, the icecandidate event is fired
        remotePeers.current[userId].onicecandidate = (event) => {
          if (!event.candidate) { return; }
          socket.emit('ice-candidate', { iceCandidate: event.candidate, userId, meetId });
        }

        let offerMaking = false;
        remotePeers.current[userId].onnegotiationneeded = async (event) => {
          try {
            if (!offerMaking) {
              offerMaking = true;
              createAnOffer(userId);
            }

          } catch (err) {
            console.log("NEGOTIATION ERROR: ", err);
          }
          finally {
            offerMaking = false;
          }
        }


        localMediaStreamRef.current?.getTracks()?.forEach((track) => {
          remotePeers.current[userId].addTrack(track, localMediaStreamRef.current);
        });


        remotePeers.current[userId]?.addEventListener('iceconnectionstatechange', (event) => {
          if (remotePeers.current[userId]) {
            if (remotePeers.current[userId].iceConnectionState === "connected" || remotePeers.current[userId].iceConnectionState === "completed") {
              ChangeLoadingState(userId, false);
            }
            else if (remotePeers.current[userId].iceConnectionState === "failed") {
              if (remotePeers.current[userId]) {
                remotePeers.current[userId].close();
                delete remotePeers.current[userId];
              }
              setNewConnection(peerData[userId]?.socketId || null, peerData[userId]?.name || "UNKNOWN", userId);
            }
          } else {
            console.log("USER NOT FOUND");
          }
        });
      }
    }
    catch (err) {
      console.log(err);
    }
  }



  let sessionConstraints = {
    mandatory: {
      OfferToReceiveAudio: true,
      OfferToReceiveVideo: true,
      VoiceActivityDetection: true
    }
  };

  const createAnOffer = async (userId) => {
    try {
      const peer = remotePeers.current[userId];
      if (peer) {
        // Check the signaling state before creating an offer
        if (peer.signalingState === "stable") {
          const offerDescription = await peer.createOffer(sessionConstraints);
          if (offerDescription.type === "offer" && peer.signalingState === 'stable') {
            peer.setLocalDescription(offerDescription).then(() => {
              socket.emit('offer', { offerDescription: peer.localDescription, otherUserId: userId, myName: userInfo.name, myUserId: userInfo._id, meetId });
            }, (err) => {
              console.log("Error in set local description: ", err);
            })
          }
        } else {
          console.log("Signaling state is not stable. Current state:", peer.signalingState);
        }
      } else {
        console.log("Peer not found for socketId:");
      }
    } catch (err) {
      console.error("Error creating and setting offer:", err);
    }
  };

  const cleanupConnections = () => {
    try {
      // Close connections with all peers
      Object.keys(remotePeers.current)?.forEach((userId) => {
        handlePeerDisconnect(userId);
      });

      // Release the local media stream
      destroyingMediaStream();

      // Emit a "leave-room" event to notify the server
      socket.emit("leave-room", { meetId });

      // Navigate to a different screen or perform any necessary cleanup
      navigate('/');
      // window.location.reload();

    } catch (err) {
      console.log("Error in cleanupConnections: ", err);
    }
  };



  const handlePeerDisconnect = (userId) => {
    try {
      // Check if the remote peer exists in your current connections
      if (remotePeers.current[userId]) {
        // Close the RTCPeerConnection
        remotePeers.current[userId].close();
        // Remove the remote peer from your connections
        delete remotePeers.current[userId];
        // Remove the peer data (video stream, etc.) associated with this peer
        removePeerData(userId);
      }
    } catch (err) {
      console.log("Error handling peer disconnect: ", err);
    }
  };

  const brodCastMessage = (message, userId = null) => {
    try {
      let brodcastChannel = null;
      if (!userId) {
        console.log("BRODCASTING TO ALL");
        Object.keys(remotePeers.current)?.forEach((userId) => {
          brodcastChannel = remotePeers.current[userId].brodcastChannel;
          console.log("BRODCAST CHANNEL: ", brodcastChannel);
          if (brodcastChannel && brodcastChannel.readyState === "open") {
            brodcastChannel.send(JSON.stringify({ text: message, name: userInfo.name, time: new Date().toLocaleTimeString(), isMe: false }));
          }
        });
      } else {
        brodcastChannel = remotePeers.current[userId].brodcastChannel;
        if (brodcastChannel && brodcastChannel.readyState === "open") {
          brodcastChannel.send(JSON.stringify({ text: message, name: userInfo.name, time: new Date().toLocaleTimeString(), isMe: false }));
        }
      }
      setMessages((prev) => [...prev, { text: message, name: userInfo.name, time: new Date().toLocaleTimeString(), isMe: true }]);

    } catch (err) {
      console.log(err);
    }
  }


  //=========================================================================================================================================================//
  //================================================================== SOCKET LISTENERS =====================================================================//
  useEffect(() => {
    if (socket) {
      socket.on("inform-others-about-me", async ({ otherUserId, name, socketId }) => {
        try {

          addPeerData(socketId, null, otherUserId, name, true);
          //* SEND THE OFFER TO THE USER WHO JOINED THE MEET
          setNewConnection(socketId, name, otherUserId);

        } catch (err) {
          console.log(err);
        }
      })

      socket.on('offer', async ({ offerDescription, socketId, name, userId }) => {
        try {

          //* CREATE A NEW CONNECTION WITH THE USER WHO SENT THE OFFER
          if (!remotePeers.current[userId]) {
            remotePeers.current[userId] = new RTCPeerConnection(peerConstraints);


            //* If the user who sent the offer is the host, create a data channel for the user
            remotePeers.current[userId].ondatachannel = (event) => {
              remotePeers.current[userId].brodcastChannel = event.channel;
              remotePeers.current[userId].brodcastChannel.onopen = () => {
                console.log("Data Channel Opened");
              }

              remotePeers.current[userId].brodcastChannel.onmessage = (event) => {
                console.log("Data Channel Message: ", event.data);
                setMessages((prev) => [...prev, JSON.parse(event.data)]);
              }

              remotePeers.current[userId].brodcastChannel.onclose = () => {
                console.log("Data Channel Closed");
              }
            }

            //* EVENTS========================================

            remotePeers.current[userId].ontrack = (event) => {
              addPeerData(socketId, event.streams[0], userId, name, true);
            }

            //* Once the Offer is created and set as the local description, the icecandidate event is fired
            remotePeers.current[userId].onicecandidate = (event) => {
              if (!event.candidate) { return; }
              socket.emit('ice-candidate', { iceCandidate: event.candidate, userId, meetId });
            }

            console.log("Local Media Ref: ", localMediaStreamRef.cuurent);
            localMediaStreamRef.current?.getTracks()?.forEach((track) => {
              remotePeers.current[userId].addTrack(track, localMediaStreamRef.current);
            });

            remotePeers.current[userId]?.addEventListener('iceconnectionstatechange', (event) => {
              if (remotePeers.current[userId]) {
                if (remotePeers.current[userId].iceConnectionState === "connected" || remotePeers.current[userId].iceConnectionState === "completed") {
                  ChangeLoadingState(userId, false);
                }
                else if (remotePeers.current[userId].iceConnectionState === "failed") {
                  if (remotePeers.current[userId]) {
                    remotePeers.current[userId].close();
                    delete remotePeers.current[userId];
                  }
                  setNewConnection(peerData[userId]?.socketId || null, peerData[userId]?.name || "UNKNOW", userId);
                }
                else if (remotePeers.current[userId].iceConnectionState === "disconnected") {
                  console.log("USER DISCONNECTED")

                } else if (remotePeers.current[userId].iceConnectionState === "closed") {
                  console.log("CONNECTION WITH USER CLOSED")
                }
              } else {
                console.log("USER NOT FOUND")
              }
            });

          }

          if (remotePeers.current[userId].signalingState === 'stable') {
            //* setting the remote description with the offerDescription (of the user who sent the offer)
            remotePeers.current[userId].setRemoteDescription(new RTCSessionDescription(offerDescription)).then(
              async () => {

                // Check if there are buffered ICE candidates and add them
                if (remotePeers?.current[userId]?.iceCandidateBuffer) {
                  for (const bufferedCandidate of remotePeers.current[userId].iceCandidateBuffer) {
                    const iceCandidate = new RTCIceCandidate(bufferedCandidate);
                    remotePeers.current[userId].addIceCandidate(iceCandidate)
                      .then(() => {
                        console.log("Buffered ICE CANDIDATE ADDED TO: ", socketId, " BY SocketId: ", socket.id, " ICE CANDIDATE: ");
                      })
                      .catch((err) => {
                        console.log("Error in add buffered ice candidate: ", err);
                      });
                  }
                  // Clear the buffered ICE candidates
                  remotePeers.current[userId].iceCandidateBuffer = [];
                }


                if (remotePeers.current[userId].signalingState === 'have-remote-offer') {
                  //* creating an answer for the offer (of the user who sent the offer)
                  let answer = await remotePeers.current[userId].createAnswer();

                  //* also setting the local description with the answer (of the user who sent the offer in RTCPeerConnection object stored on our side fo that user)
                  await remotePeers.current[userId].setLocalDescription(answer)
                  //* sending the answer to the user who sent the offer
                  socket.emit('answer', { answerDescription: answer, userId, meetId });
                }
              },
              (err) => {
                console.log("Error while creating offer ", err)
              }
            );
          } else {
            console.log("Signaling state is not stable. Current state:", remotePeers.current[userId].signalingState);
          }
        } catch (err) {
          console.log("ERROR ON SOCKET OFFER: ", err);
        }
      });

      socket.on('answer', async ({ answerDescription, userId }) => {
        try {
          if (remotePeers.current[userId].signalingState === "have-local-offer") {
            //* setting the remote description with the answer (of the user who received the offer) as they sent the answer
            await remotePeers.current[userId].setRemoteDescription(new RTCSessionDescription(answerDescription));
            // Check if there are buffered ICE candidates and add them
            if (remotePeers?.current[userId]?.iceCandidateBuffer) {
              for (const bufferedCandidate of remotePeers.current[userId].iceCandidateBuffer) {
                const iceCandidate = new RTCIceCandidate(bufferedCandidate);
                remotePeers.current[userId].addIceCandidate(iceCandidate)
                  .then(() => {
                    console.log("Buffered ICE CANDIDATE ADDED TO: ", userId, " BY SocketId: ", socket.id, " ICE CANDIDATE ");
                  })
                  .catch((err) => {
                    console.log("Error in add buffered ice candidate: ", err);
                  });
              }
              // Clear the buffered ICE candidates
              remotePeers.current[userId].iceCandidateBuffer = [];
            }
          }

        } catch (err) {
          console.log("ERROR on SOCKET ANSWER: ", err);
        }
      });


      socket.on('ice-candidate', async ({ iceCandidate, userId }) => {
        //* Add the received ICE candidate to the peer connection object of the user who sent the ICE candidate
        let iceCandidateV = new RTCIceCandidate(iceCandidate);
        if (!remotePeers.current[userId].remoteDescription) {

          if (!remotePeers.current[userId].iceCandidateBuffer) {
            remotePeers.current[userId].iceCandidateBuffer = [];
          }
          remotePeers.current[userId].iceCandidateBuffer.push(iceCandidateV);
          return;

        }
        return remotePeers.current[userId].addIceCandidate(iceCandidateV).then(() => {

        }, (err) => {
          console.log("Error in add ice candidate: ", err);
        })

      })


      socket.on("user-leave-room", ({ userId }) => {
        try {
          // Call the function to handle peer disconnection
          handlePeerDisconnect(userId);
        } catch (err) {
          console.log("ERROR IN USER LEAVE ROOM: ", err);
        }
      });


      socket.on("mic", async ({ action }) => {
        if (action === "mute") {
          if (microphone) {
            toggleMuteByHost(true);
          }
          toast.warn("You have been muted by the host");
        }
        else if (action === "unmute") {
          toggleMuteByHost(false);
          toast.success("You have been unmuted by the host");
        }

      });

      socket.on("video", async ({ action }) => {
        if (action === "pause") {
          if (camera) {
            toggleVideoPauseByHost(true);
          }
          toast.warn("Your video has been paused by the host");
        }
        else if (action === "resume") {
          toggleVideoPauseByHost(false);
          toast.success("Your video has been resumed by the host");
        }
      });

    }

    return () => {
      if (socket) {
        socket.off("inform-others-about-me");
        socket.off("offer");
        socket.off("answer");
        socket.off("ice-candidate");
        socket.off("user-leave-room");
        socket.off("mic");
        socket.off("video");
      }

    }

  }, [socket]);


  //=========================================================================================================================================================//
  //================================================================= USEEFFECT TO START THE LOCAL MEDIA STREAM =============================================//
  useEffect(() => {

    if (meetId) {
      if (location.pathname.split('/')[1] === "call") {
        startLocalMediaStream(video, audio).then(() => {
          if (socket) {
            socket.emit("join-room", { name, userId: userInfo._id, meetId });
          } else {
            console.log("Some Issue occured connecting! reload the page");
          }
        })
      }
    }
    window.addEventListener('popstate', () => {
      cleanupConnections();
    })

    return () => {

      window.removeEventListener('popstate', () => {
        cleanupConnections();
      })

      if (socket) {
        socket.off("inform-others-about-me");
        socket.off("offer");
        socket.off("answer");
        socket.off("ice-candidate");
        socket.off("user-leave-room");
        socket.off("join-room");
        socket.off("leave-room");
        socket.off("mic");
        socket.off("video");
      }
    }
  }, [location.pathname]);

  //=========================================================================================================================================================//

  //functions to handle dragging of self video stream
  const divRef = useRef(null);
  let offsetX, offsetY;

  const handleDragStart = (e) => {
    if (seePeerList.length === 1) {
      e.dataTransfer.setDragImage(new Image(), 0, 0); // Prevent default drag image
      offsetX = e.clientX - divRef.current.getBoundingClientRect().left;
      offsetY = e.clientY - divRef.current.getBoundingClientRect().top;
    }
  };

  const handleDrag = (e) => {
    if (seePeerList.length === 1) {
      const newX = e.clientX;
      const newY = e.clientY;
      if (newX - offsetX >= 0 && newX - offsetX <= window.innerWidth - 200 && newY - offsetY >= 0 && newY - offsetY <= window.innerHeight - 230) {
        divRef.current.style.transform = `translate(${newX - offsetX}px, ${newY - offsetY}px)`; // Move element
      }
    }
  };

  const handleDragEnd = () => {

  };

  const handleSideBar = (sideBarName) => {

    if (sideBarShow === sideBarName) {
      setSideBarShow(null);
      setSideBar(!sideBar);
    } else if (sideBarShow !== sideBarName && sideBar) {
      setSideBarShow(sideBarName);
    } else if (sideBarShow !== sideBarName && !sideBar) {
      setSideBarShow(sideBarName);
      setSideBar(!sideBar);
    }
  }

  //=========================================================================================================================================================//

  const replaceTrackForPeers = (track) => {
    Object.keys(remotePeers.current).forEach((userId) => {
      remotePeers.current[userId].getSenders().forEach((sender) => {
        //replace video track in peer connection with video from display media
        if (sender.track.kind === 'video') {
          sender.replaceTrack(track.getVideoTracks()[0]);
        }

      });


    });
  }


  const handleToggleScreenShare = () => {

    toggleScreenSharing().then((s) => {
      try {
      
        if (s.sharing) {
          //* adding a listner to catch stop screen sharing event
          console.log("START SCREEN SHARING EVENT FIRED: ",s);
          s.stream.getVideoTracks()[0].addEventListener('ended', () => {
            console.log("STOP SCREEN SHARING EVENT FIRED");
            let re = stopScreenSharing();
            replaceTrackForPeers(re);

          });

        }

        replaceTrackForPeers(s.stream);

      } catch (err) {
        console.log(err);
      }
    }).catch((err) => {
      console.log(err);
    });
  }

  // =========================================================================================================================================================//
  // ======================================================================= RETURNS VIEW ====================================================================//



  return (

    <div className="flex flex-1 flex-col h-screen max-h-screen  overflow-hidden bg-[#272828]">
      <div className="flex flex-row flex-1 max-h-[90%] border-2">
        <div className={`flex-1 relative overflow-hidden grid ${seePeerList.length <= 1 ? 'grid-cols-1' : 'grid-cols-3'} grid-flow-row transition-all duration-200 ease-linear`}>
          <div
            ref={divRef}
            draggable={seePeerList.length === 1}
            onDragStart={handleDragStart}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
            style={{
              width: seePeerList.length == 1 ? "200px" : "100%",
              height: seePeerList.length == 1 ? "150px" : "100%",
              minHeight: seePeerList.length == 1 ? "150px" : (window.innerHeight * 0.9) / 2,
              position: seePeerList.length == 1 ? "absolute" : "relative",
              zIndex: 1,
              borderWidth: seePeerList.length == 1 ? "1px" : "0px",
              borderColor: "white",
            }}

            className={`bg-[#272828] ${seePeerList.length == 1 ? 'cursor-move' : 'cursor-default'}`}
          >
            <MyStreamView
              src={stream}
              speaker={sound}
              toggleSpeaker={toggleSound}
              microphone={microphone}
              toggleMicrophone={toggleMicrophone}
              camera={camera}
              toggleCamera={toggleCamera}
              screenShare={isScreenSharing}
              toggleScreenShare={handleToggleScreenShare}
              toggleParticipants={() => { setSideBar(!sideBar) }}
              endCall={handleEndCall}
              hideControls={true}
              style={{
                // height: "90%",
                // margin:20,
                padding: 20
              }}
              name={name}
            />
          </div>
          {
            seePeerList.map((item, index) =>
              <div
                key={index.toString()}
                style={{
                  height: "100%",
                  minHeight: (window.innerHeight * 0.9) / 2,
                  width: "100%",
                  maxWidth: "100%",
                }}
                className=" bg-black ">
                <RemotePeerStream style={{
                  borderWidth: 1,
                  borderColor: "white",
                }} sound={sound} key={item} src={peerData[item]?.stream} name={peerData[item]?.name} loading={peerData[item]?.loading} userId={
                  peerData[item]?.userId
                } />
              </div>
            )
          }
        </div>
        <div className={`z-[1] max-h-full flex flex-col transition-all duration-150 ease-linear bg-white ${sideBar && 'px-7 p-5 my-2 mx-2'} ${sideBar ? "lg:w-[25%] md:w-[30%] w-[40%]" : "w-0"} rounded-lg `}>
          {sideBar && <ImCross style={{
            alignSelf: "flex-end",
          }}
            onClick={() => { setSideBar(!sideBar); setSideBarShow(null) }}
          />}
          {sideBarShow === "Participants" ? <ParticipantDrawer
            // eslint-disable-next-line react/no-unknown-property
            participants={
              Object.keys(peerData).map((item) => {
                return {
                  userId: peerData[item]?.userId,
                  name: peerData[item]?.name,
                  socketId: peerData[item]?.socketId
                }
              })
            }
            isHost={userInfo?._id?.toString() === hostId?.toString()}
            hostId={hostId}
            meetId={meetId}
          />
            : sideBarShow === "Messages" ? <InMeetMessages messages={messages} handleSendMessage={brodCastMessage} />
              : null

          }
        </div>
      </div>

      <div className='bg-black flex items-center justify-between w-full h-[10%] max-h-[10%] border'>
        <div className='flex items-center gap-4 justify-center flex-1'>
          <div className='flex flex-col items-center'>
            {sound ?
              <GiSpeaker className='text-white text-2xl' onClick={toggleSound} /> :
              <GiSpeakerOff className='text-white text-2xl' onClick={toggleSound} />
            }
            <p className='text-lg text-white'>Speaker</p>
          </div>
          <div className='flex flex-col items-center'>
            {microphone ?
              <BsMicFill className='text-white text-2xl' onClick={toggleMicrophone} /> :
              <BsFillMicMuteFill className='text-white text-2xl' onClick={toggleMicrophone} />
            }
            <p className='text-lg text-white'>Microphone</p>
          </div>
          <div className='flex flex-col items-center'>
            {
              camera ?
                <BsCameraVideoFill className='text-white text-2xl' onClick={toggleCamera} /> :
                <BsCameraVideoOffFill className='text-white text-2xl' onClick={toggleCamera} />
            }
            <p className='text-lg text-white'>Camera</p>
          </div>
        </div>

        <div className='flex flex-1 items-center gap-4 justify-center'>
          <div className='flex flex-col items-center'>
            <BsPeopleFill className='text-white text-2xl' onClick={() => { handleSideBar('Participants') }} />
            <p className='text-lg text-white'>Participants</p>
          </div>
          <div className='flex flex-col items-center'>
            <MdChat className='text-white text-2xl' onClick={() => { handleSideBar('Messages') }} />
            <p className='text-lg text-white'>Messages</p>
          </div>
          <div className='flex flex-col items-center'>
            {
              isScreenSharing ?
                <MdOutlineStopScreenShare className='text-white text-2xl' onClick={handleToggleScreenShare} /> :
                <MdOutlineScreenShare className='text-white text-2xl' onClick={handleToggleScreenShare} />
            }
            <p className='text-lg text-white'>Screen Share</p>
          </div>
        </div>

        <div className='flex flex-1 items-center justify-center gap-4'>
          <Button style={{ backgroundColor: "red" }} text={"End Call"} onClick={handleEndCall} />

        </div>

      </div>




    </div>
  );
}


const Call = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  let { loading, error, userInfo, success } = useSelector((state) => state.user);
  const { state } = useLocation();
  // const { meetId, name, video, audio, hostId } = state;
  const [data, setData] = useState({
    meetId: state?.meetId || null,
    name: state?.name || null,
    video: state?.video || null,
    audio: state?.audio || null,
    hostId: state?.hostId || null
  });



  const handleJoinMeeting = (payload, camera, microphone, sound) => {
    //* Type is set Internal here because we are joining a meeting by id so doesnot matter if it was a scheduled one or not
    dispatch(joinMeet(payload)).then((res) => {
      if (joinMeet.fulfilled.match(res)) {
        if (res.payload.data.access) {
          // navigate(`/call/${res?.payload?.data?.meet?._id}`, { state: { video: camera, audio: microphone, meetId: payload.meetId, name: e.target.name.value, hostId: res?.payload?.data?.meet?.host } });
          setData({
            meetId: res?.payload?.data?.meet?._id,
            name: payload.name,
            video: camera,
            audio: microphone,
            hostId: res?.payload?.data?.meet?.host
          })
        } else {
          toast.error('You are not allowed to join this meeting');
        }
      }
    })
  }

  useEffect(() => {

    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      navigate('/login');
    }

  }, [userInfo?._id])

  return (

    data?.meetId ?
      <Meet state={data} />
      :
      <JoinCall from={"Call"} joinMeeting={handleJoinMeeting} meetId={location.pathname.split('/')[2]} />

  )

}



export default Call;



