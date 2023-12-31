/* eslint-disable react/no-unknown-property */
import React, { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import imgCall from "../assets/imgCall.png";
import { useDispatch, useSelector } from "react-redux";
import { usePeer } from '../context/peerContext';
import { useLocation, useNavigate } from "react-router-dom";
import MyStreamView from "../components/MyStreamView";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import RemotePeerStream from "../components/RemotePeerStream";
import { useSocket } from "../context/socketContext";
import { toast } from "react-toast";
import { IoIosAddCircle, } from "react-icons/io";
import { BsFillMicFill, BsFillMicMuteFill, BsFillCameraVideoFill, BsFillCameraVideoOffFill } from "react-icons/bs";
import Button from "../components/Button";
import Button2 from "../components/Button2";
import { BsMicFill, BsCameraVideoFill, BsCameraVideoOffFill, BsPeopleFill } from 'react-icons/bs';
import { MdOutlineScreenShare, MdOutlineStopScreenShare } from 'react-icons/md';
import { GiSpeaker, GiSpeakerOff } from 'react-icons/gi';
import { joinMeet } from "../redux/slice/meet/meetAction";
import JoinCall from "./JoinCall";
import InMeetMessages from "../components/InMeetMessages";
import { MdChat } from "react-icons/md";
import ParticipantDrawer from "../components/ParticipantDrawer";



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

  // managing camera and audio controls
  const [sound, setSound] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(video);

  // managing camera
  const cameraRef = useRef(video);
  const [facingMode, setFacingMode] = useState('user');
  const [mediaSource, setMediaSource] = useState('camera');

  // managing audio
  const [isMuted, setIsMuted] = useState(!audio);
  const isMutedRef = useRef(!audio);

  // managing screen sharing
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  // stream references for local and display media
  const [localMediaStream, setLocalMediaStream] = useState();
  const locaMediaRef = useRef(null);
  const displayMediaRef = useRef(null);

  // managing peer connections
  let remotePeers = useRef({});
  const [seePeerList, setPeerList] = useState([]);

  // managing sidebar
  const [sideBar, setSideBar] = useState(false);
  const [sideBarShow, setSideBarShow] = useState(null);

  // managing chat
  const [messages, setMessages] = useState([]);

  //for host controls
  const mutedByHost = useRef(false);
  const videoPausedByHost = useRef(false);



  //=========================================================================================================================================================//


  // WEBRTC CONSTRAINTS
  let isVoiceOnly = (video === false && audio === true);
  let isFrontCamera = true;
  let cameraCount = 0;
  let mediaConstraints = {
    audio: { echoCancellation: true, suppressLocalAudioPlayback: true, noiseSuppression: true, sampleRate: 44100 },
    video: {
      frameRate: 30,
      facingMode: 'user',
      // mediaSource: 'camera',
      width: { ideal: 1280 },
      height: { ideal: 720 },
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


  // DEVICE CHANGE HANDLER INITIALIZATION
  useEffect(() => {
    let hasDeviceChangeOccurred = false;

    const handleDeviceChange = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        let audioInputDeviceId;
        let audioOutputDeviceId;
        console.log('Available devices:', devices);

        devices.forEach((device) => {
          if (device.kind === 'audioinput') {
            audioInputDeviceId = device.deviceId === 'default' ? undefined : device.deviceId;
          }
          if (device.kind === 'audiooutput') {
            audioOutputDeviceId = device.deviceId === 'default' ? undefined : device.deviceId;
          }
        });

        // Check if there is a change in audio input or output devices
        if (
          audioInputDeviceId !== mediaConstraints.audio.inputDeviceId
          || audioOutputDeviceId !== mediaConstraints.audio.outputDeviceId
        ) {
          hasDeviceChangeOccurred = true;
          mediaConstraints.audio.inputDeviceId = audioInputDeviceId;
          mediaConstraints.audio.outputDeviceId = audioOutputDeviceId;
          console.log('Audio device change detected. Updating media constraints:', mediaConstraints);
        }
      } catch (error) {
        console.error('Error handling device change:', error);
      }

      // Trigger renegotiation after handling device change
      handleRenegotiation();
    };

    const handleRenegotiation = async () => {
      if (hasDeviceChangeOccurred) {
        // Replace the tracks in the local media stream
        const newMediaStream = await navigator.mediaDevices.getUserMedia(mediaConstraints);
        newMediaStream.getTracks().forEach((track) => {
          locaMediaRef.current.getTracks().forEach((oldTrack) => {
            if (oldTrack.kind === track.kind) {
              locaMediaRef.current.removeTrack(oldTrack);
            }
          });
          locaMediaRef.current.addTrack(track);
        });
        setLocalMediaStream(locaMediaRef.current);

        // Replace the tracks in the remote media streams
        Object.keys(remotePeers.current).forEach((userId) => {
          remotePeers.current[userId].getSenders().forEach((sender) => {
            newMediaStream.getTracks().forEach((track) => {
              if (track.kind === sender.track.kind) {
                sender.replaceTrack(track);
              }
            });
          });
        });


        hasDeviceChangeOccurred = false;
      }
    };

    // Initial device enumeration
    handleDeviceChange();

    // Listen for device changes
    navigator.mediaDevices.addEventListener('devicechange', handleDeviceChange);

    // Cleanup: Remove the event listener when the component unmounts
    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', handleDeviceChange);
    };
  }, []); // No dependencies, so it runs once on mount



  const setMediaConstraints = async () => {
    try {

      navigator.mediaDevices.enumerateDevices()
        .then(devices => {
          const hasCamera = devices.some(device => device.kind === 'videoinput');

          if (!hasCamera) {
            // If the user doesn't have a camera, adjust constraints
            mediaConstraints.video = false;  // Disable video for users without a camera
          }

          const hasMicrophone = devices.some(device => device.kind === 'audioinput');

          if (!hasMicrophone) {
            // If the user doesn't have a microphone, adjust constraints
            mediaConstraints.audio = false;  // Disable audio for users without a microphone
          }

        })
        .catch(error => {
          console.error('Error enumerating media devices:', error);
        });

    } catch (err) {
      console.log(err);
    }
  };



  //=========================================================================================================================================================//
  //========================================================================== LOCAL STREAM HANDLERS ========================================================//


  const applyStream = (mediaStream) => {
    if (isVoiceOnly) {
      let videoTrack = mediaStream.getVideoTracks()[0];
      videoTrack.enabled = false;
      setIsCameraOn(false);
    }
    else {
      setIsCameraOn(true);
    }

    locaMediaRef.current = mediaStream;
    setLocalMediaStream(mediaStream);
  }

  // START THE LOCAL MEDIA STREAM
  const startLocalMediaStream = async () => {
    try {
      await setMediaConstraints();
      navigator.mediaDevices.getUserMedia(mediaConstraints).then((mediaStream) => {
        applyStream(mediaStream);
      }).catch((error) => {
        console.error('Error accessing media devices:', error);
        if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {

          if (mediaConstraints.video) {
            // If video is requested, continue without video
            delete mediaConstraints.video;
          }

          navigator.mediaDevices.getUserMedia(mediaConstraints)
            .then(stream => {
              applyStream(stream);
            })
            .catch(innerError => {
              // Handle the second error
              alert('You have denied access to your media devices. Please allow access to your microphone atleast to join the call.');
            });
        }
      });


    } catch (error) {
      console.error('Error accessing media devices:', error);
    }

  }

  //DESTROY THE LOCAL MEDIA STREAM
  const destroyingMediaStream = () => {

    console.log("DESTROYING MEDIA STREAM: ", locaMediaRef.current);
    locaMediaRef?.current?.getTracks()?.forEach(
      track => track.stop()
    );
    locaMediaRef.current = null;

    console.log("DESTROYING MEDIA STREAM: ", locaMediaRef.current);


    // localMediaStream?.getTracks()?.forEach(
    //   track => track.stop()
    // );
    // setLocalMediaStream(null);
    setLocalMediaStream(null);

  }

  const toggleActiveMicrophone = async (stream = undefined) => {

    try {
      if (!mutedByHost.current) {
        let audioTrack;
        if (stream) {
          audioTrack = stream.getAudioTracks()[0];
          console.log("AUDIO TRACK: ", audioTrack);
        } else {
          audioTrack = localMediaStream.getAudioTracks()[0];
          console.log("AUDIO TRACK: ", audioTrack);
        }
        if (audioTrack) {
          audioTrack.enabled = !audioTrack.enabled;
        }
        isMutedRef.current = !isMutedRef.current;
        setIsMuted(isMutedRef.current);
      }
    } catch (err) {
      console.log(err);
    }
  }




  const handleSpeakerToggle = () => {
    try {

      // const audioTracks = localMediaStream.getAudioTracks();
      // if (audioTracks.length > 0) {
      //   const audioTrack = audioTracks[0];
      //   audioTrack.enabled = !audioTrack.enabled;
      // }
      setSound(!sound);
    } catch (err) {
      console.log(err);
    }
  }


  const toggleCamera = async (stream = undefined) => {
    try {
      if (!videoPausedByHost.current) {
        let videoTracks;
        if (stream) {
          videoTracks = stream.getVideoTracks();
        } else {
          videoTracks = await localMediaStream.getVideoTracks();
        }
        if (videoTracks.length > 0) {
          const videoTrack = videoTracks[0];
          videoTrack.enabled = !videoTrack.enabled;
        }
        cameraRef.current = !cameraRef.current;
        setIsCameraOn(cameraRef.current);
      }
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
    }

  }

  const toggleScreenCapture = async () => {
    try {

      if (videoPausedByHost.current) { return; }
      if (!isScreenSharing) {



        // display media with microphone audio
        displayMediaRef.current = await navigator.mediaDevices.getDisplayMedia();

        setIsCameraOn(false);
        setIsScreenSharing(true);

        //merge audio tracks form display media and local media
        const audioTracks = locaMediaRef.current.getAudioTracks();
        if (audioTracks.length > 0) {
          displayMediaRef.current.addTrack(audioTracks[0]);
        }

        setLocalMediaStream(displayMediaRef.current);

        Object.keys(remotePeers.current).forEach((userId) => {
          remotePeers.current[userId].getSenders().forEach((sender) => {

            //replace video track in peer connection with video from display media
            if (sender.track.kind === 'video') {
              sender.replaceTrack(displayMediaRef.current.getVideoTracks()[0]);
            }

          });

        });

        //Listen for stop screen sharing event
        displayMediaRef.current.getVideoTracks()[0].addEventListener('ended', () => {
          setIsScreenSharing(false);
          setIsCameraOn(true);



          //remove audio track from display media
          displayMediaRef.current.removeTrack(displayMediaRef.current.getAudioTracks()[0]);
          displayMediaRef.current.getTracks().forEach((track) => {
            //if track is not audio track
            if (track.kind !== 'audio') {
              track.stop();
            }
          });
          displayMediaRef.current = null;

          setLocalMediaStream(locaMediaRef.current);

          Object.keys(remotePeers.current).forEach((userId) => {
            remotePeers.current[userId].getSenders().forEach((sender) => {

              //replace video track in peer connection with video from display media
              if (sender.track.kind === 'video') {
                sender.replaceTrack(locaMediaRef.current.getVideoTracks()[0]);
              }

            });

          });
        });


      } else {
        setIsScreenSharing(false);
        setIsCameraOn(true);

        //remove audio track from display media
        displayMediaRef.current.removeTrack(displayMediaRef.current.getAudioTracks()[0]);
        displayMediaRef.current.getTracks().forEach((track) => {
          //if track is not audio track
          if (track.kind !== 'audio') {
            track.stop();
          }
        });
        displayMediaRef.current = null;

        setLocalMediaStream(locaMediaRef.current);

        Object.keys(remotePeers.current).forEach((userId) => {
          remotePeers.current[userId].getSenders().forEach((sender) => {

            //replace video track in peer connection with video from display media
            if (sender.track.kind === 'video') {
              sender.replaceTrack(locaMediaRef.current.getVideoTracks()[0]);
            }

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

        //* CREATE DATA CHANNEL FOR THE USER
        remotePeers.current[userId].brodcastChannel = remotePeers.current[userId].createDataChannel("brodcast");

        //* EVENTS========================================

        remotePeers.current[userId].brodcastChannel.onopen = () => {
          console.log("Data Channel Opened");
        }

        remotePeers.current[userId].brodcastChannel.onmessage = (event) => {
          console.log("Data Channel Message: ", event.data);
          setMessages((prev) => [...prev,JSON.parse(event.data)]);
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
    try{
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
  
    }catch(err){
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

            console.log("Local Media Ref: ", locaMediaRef.current);
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
          if (!isMutedRef.current) {
            if (locaMediaRef.current) {
              await toggleActiveMicrophone(locaMediaRef.current);
            }
          }
          mutedByHost.current = true;
          toast.warn("You have been muted by the host");
        }
        else if (action === "unmute") {
          mutedByHost.current = false;
          toast.success("You have been unmuted by the host");
        }

      });

      socket.on("video", async ({ action }) => {
        if (action === "pause") {
          if (cameraRef.current) {
            if (locaMediaRef.current) {
              await toggleCamera(locaMediaRef.current);
            }
          }
          videoPausedByHost.current = true;
          toast.warn("Your video has been paused by the host");
        }
        else if (action === "resume") {
          videoPausedByHost.current = false;
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
        startLocalMediaStream().then(() => {
          if (socket) {
            socket.emit("join-room", { name, userId: userInfo._id, meetId });
          } else {
            console.log("Some Issue occured connecting! reload the page");
          }
        })
      }
    }
    window.addEventListener('popstate', () => {
      locaMediaRef.current?.getTracks()?.forEach(
        track => track.stop()
      );
      locaMediaRef.current = null;
      cleanupConnections();
    })

    return () => {

      window.removeEventListener('popstate', () => {
        console.log("POPSTATE EVENT FIRED");
        locaMediaRef?.getTracks()?.forEach(
          track => track.stop()
        );
        locaMediaRef.current = null;
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
              src={localMediaStream}
              speaker={sound}
              toggleSpeaker={handleSpeakerToggle}
              microphone={!isMuted}
              toggleMicrophone={() => toggleActiveMicrophone()}
              camera={isCameraOn}
              toggleCamera={() => toggleCamera()}
              screenShare={isScreenSharing}
              toggleScreenShare={toggleScreenCapture}
              toggleParticipants={() => { setSideBar(!sideBar) }}
              endCall={handleEndCall}
              hideControls={true}
              style={{
                // height: "90%",
                // margin:20,
                padding: 20
              }}
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
              <GiSpeaker className='text-white text-2xl' onClick={handleSpeakerToggle} /> :
              <GiSpeakerOff className='text-white text-2xl' onClick={handleSpeakerToggle} />
            }
            <p className='text-lg text-white'>Speaker</p>
          </div>
          <div className='flex flex-col items-center'>
            {!isMuted ?
              <BsMicFill className='text-white text-2xl' onClick={() => toggleActiveMicrophone()} /> :
              <BsFillMicMuteFill className='text-white text-2xl' onClick={() => toggleActiveMicrophone()} />
            }
            <p className='text-lg text-white'>Microphone</p>
          </div>
          <div className='flex flex-col items-center'>
            {
              isCameraOn ?
                <BsCameraVideoFill className='text-white text-2xl' onClick={() => toggleCamera()} /> :
                <BsCameraVideoOffFill className='text-white text-2xl' onClick={() => toggleCamera()} />
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
                <MdOutlineStopScreenShare className='text-white text-2xl' onClick={toggleScreenCapture} /> :
                <MdOutlineScreenShare className='text-white text-2xl' onClick={toggleScreenCapture} />
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



