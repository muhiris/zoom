import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";
import { PeerProvider } from "./context/peerContext";
import { SocketProvider } from "./context/socketContext.jsx";
import { StreamProvider } from './context/streamContext.jsx';



ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <BrowserRouter>
    <Provider store={store}>
      <SocketProvider>
        <PeerProvider>
          <StreamProvider>
            <App />
          </StreamProvider>
        </PeerProvider>
      </SocketProvider>
    </Provider>
  </BrowserRouter>
  // </React.StrictMode>,
)
