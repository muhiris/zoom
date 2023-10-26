import React, { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import imgCall from "../assets/imgCall.png";
import { useDispatch, useSelector } from "react-redux";
import { usePeer } from '../context/peerContext';
import { socket } from '../socket/socket'
import { useLocation, useNavigate } from "react-router-dom";
import MyStreamView from "../components/MyStreamView";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import RemotePeerStream from "../components/RemotePeerStream";


function Call() {

  // STATES
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  let { loading, error, userInfo, success } = useSelector((state) => state.user);
  const {state} = useLocation();
  const { meetId, name, video, audio } = state;
  const [sound, setSound] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(video);
  const [facingMode, setFacingMode] = useState('user');
  const [mediaSource, setMediaSource] = useState('camera');
  const [isMuted, setIsMuted] = useState(!audio);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [localMediaStream, setLocalMediaStream] = useState();
  const locaMediaRef = useRef();
  let remotePeers = useRef({});
  const [seePeerList, setPeerList] = useState([]);
  let { peerData, addPeerData, removePeerData, removeAllPeerData, addPeerConnection, ChangeLoadingState } = usePeer();
  const remotePeersViewRef = useRef();



  // WEBRTC CONSTRAINTS
  let isVoiceOnly = (video === false && audio === true);
  let isFrontCamera = true;
  let cameraCount = 0;
  let mediaConstraints = {
    audio: { 'echoCancellation': true, deviceId: 'default' },
    video: {
      frameRate: 30,
      facingMode: facingMode,
      mediaSource: mediaSource,
      width:{min:640,ideal:1280,max:1920},
      height:{min:480,ideal:720,max:1080}
    }
  };


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


  //=========================================================================================================================================================//
  //========================================================================== LOCAL STREAM HANDLERS ========================================================//

  // START THE LOCAL MEDIA STREAM
  const startLocalMediaStram = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia(mediaConstraints);
      if (isVoiceOnly) {
        let videoTrack = mediaStream.getVideoTracks()[0];
        videoTrack.enabled = false;
        setIsCameraOn(false);
      }
      else {
        setIsCameraOn(true);
      }

      setLocalMediaStream(mediaStream);
      locaMediaRef.current = mediaStream;

    } catch (err) {
      console.log(err);
    }

  }

  //DESTROY THE LOCAL MEDIA STREAM
  const destroyingMediaStream = () => {
    localMediaStream?.getTracks()?.forEach(
      track => track.stop()
    );
    locaMediaRef.current?.getTracks()?.forEach(
      track => track.stop()
    );
    setLocalMediaStream(null);
    locaMediaRef.current = null;
  }

  const toggleActiveMicrophone = async () => {

    try {
      const audioTrack = localMediaStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
      }
      setIsMuted(!isMuted);
    } catch (err) {
      console.log(err);
    };
  }




  const handleSpeakerToggle = () => {
    try {

      const audioTracks = localMediaStream.getAudioTracks();
      if (audioTracks.length > 0) {
        const audioTrack = audioTracks[0];
        audioTrack.enabled = !audioTrack.enabled;
      }
      setSound(!sound);
    } catch (err) {
      console.log(err);
    }
  }


  const toggleCamera = async () => {
    try {
      const videoTracks = await localMediaStream.getVideoTracks();
      if (videoTracks.length > 0) {
        const videoTrack = videoTracks[0];
        videoTrack.enabled = !videoTrack.enabled;
      }
      setIsCameraOn(!isCameraOn);
    } catch (err) {
      console.log(err);
    }
  }
  const flipCamera = async () => {
    try {
      const videoTracks = await localMediaStream.getVideoTracks();
      if (videoTracks.length > 0) {
        const videoTrack = videoTracks[0];
        videoTrack._switchCamera()
        setFacingMode(facingMode === 'user' ? 'environment' : 'user');
      }
    } catch (err) {
      console.log(err);
    };

  }

  const toggleScreenCapture = async () => {
    try {


      if (!isScreenSharing) {
        setIsCameraOn(false);
        setIsScreenSharing(true);
        const mediaStream = await mediaDevices.getDisplayMedia();
        setLocalMediaStream(mediaStream);
        locaMediaRef.current = mediaStream;
        Object.keys(remotePeers.current).forEach((userId) => {
          remotePeers.current[userId].getSenders().forEach((sender) => {
            sender.replaceTrack(mediaStream.getTracks()[0]);
          });
        });
      } else {
        setIsScreenSharing(false);
        setIsCameraOn(true);
        await startLocalMediaStram();
        localMediaStream.removeTrack(localMediaStream.getTracks()[0]);
        locaMediaRef.current.removeTrack(locaMediaRef.current.getTracks()[0]);
        Object.keys(remotePeers.current).forEach((userId) => {
          remotePeers.current[userId].getSenders().forEach((sender) => {
            sender.replaceTrack(locaMediaRef.current.getTracks()[0]);
          });
        });
      }



    } catch (err) {
      console.log(err);
    }
  }

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

        //* EVENTS========================================

        remotePeers.current[userId].ontrack = (event) => {
          addPeerData(socketId, event.streams[0], userId, name, true);
        }

        //* Once the Offer is created and set as the local description, the icecandidate event is fired
        remotePeers.current[userId].onicecandidate = (event) => {
          if (!event.candidate) { return; };
          socket.emit('ice-candidate', { iceCandidate: event.candidate, userId });
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

        locaMediaRef.current.getTracks().forEach((track) => {
          remotePeers.current[userId].addTrack(track, locaMediaRef.current);
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
              socket.emit('offer', { offerDescription: peer.localDescription, otherUserId: userId, myName: userInfo.name, myUserId: userInfo._id });
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
      Object.keys(remotePeers.current).forEach((userId) => {
        handlePeerDisconnect(userId);
      });

      // Release the local media stream
      destroyingMediaStream();

      // Emit a "leave-room" event to notify the server
      socket.emit("leave-room", { meetId });

      // Navigate to a different screen or perform any necessary cleanup
      navigate('/');
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

  //=========================================================================================================================================================//
  //================================================================== SOCKET LISTENERS =====================================================================//
  useEffect(() => {
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

          //* EVENTS========================================

          remotePeers.current[userId].ontrack = (event) => {
            addPeerData(socketId, event.streams[0], userId, name, true);
          }

          //* Once the Offer is created and set as the local description, the icecandidate event is fired
          remotePeers.current[userId].onicecandidate = (event) => {
            if (!event.candidate) { return; };
            socket.emit('ice-candidate', { iceCandidate: event.candidate, userId });
          }

          locaMediaRef.current.getTracks().forEach((track) => {
            remotePeers.current[userId].addTrack(track, locaMediaRef.current);
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
                socket.emit('answer', { answerDescription: answer, userId });
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

    return () => {
      socket.off("inform-others-about-me");
      socket.off("offer");
      socket.off("answer");
      socket.off("ice-candidate");
      socket.off("user-leave-room");

    }

  }, []);


  //=========================================================================================================================================================//
  //================================================================= USEEFFECT TO START THE LOCAL MEDIA STREAM =============================================//
  useEffect(() => {

    if (location.pathname === "/call") {
      startLocalMediaStram().then(() => {
        socket.emit("join-room", { name, userId: userInfo._id, meetId });
      })
    }

    return () => {
      socket.off("inform-others-about-me");
      socket.off("offer");
      socket.off("answer");
      socket.off("ice-candidate");
      socket.off("user-leave-room");
      socket.off("join-room");
      socket.off("leave-room");
    }
  }, [location.pathname]);



  // =========================================================================================================================================================//
  // ======================================================================= RETURNS VIEW ====================================================================//

  return (
    <>
      <Navbar />
      {/* <img src={imgCall} alt="" className="m-auto my-10" /> */}
      <div className="flex flex-1 flex-col">
        {/* Participants Streams */}
        <div ref={remotePeersViewRef} className="flex w-full items-center overflow-y-hidden">
          <AiOutlineLeft className="text-3xl text-gray-500 cursor-pointer" onClick={()=>{
            remotePeersViewRef.current.scrollLeft-=100;
          }} />
          <div className="flex flex-1 items-center">
            {
              seePeerList.map((item) =>
                <RemotePeerStream src={peerData[item]?.stream} name={peerData[item]?.name} loading={peerData[item]?.loading} userId={
                  peerData[item]?.userId
                } />
              )
            }
          </div>
          <AiOutlineRight className="text-3xl text-gray-500 cursor-pointer" onClick={()=>{
            remotePeersViewRef.current.scrollLeft-=100;
          }}  />
        </div>
        {/* My Stream */}
        <MyStreamView
          src={localMediaStream}
          microphone={!isMuted}
          toggleMicrophone={toggleActiveMicrophone}
          camera={isCameraOn}
          toggleCamera={toggleCamera}
          screenShare={isScreenSharing}
          toggleScreenShare={toggleScreenCapture}
          toggleParticipants={() => { }}
          endCall={handleEndCall}
        />
      </div>
      <Footer />
    </>
  );
}

export default Call;
