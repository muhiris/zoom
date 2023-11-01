import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";
import { PeerProvider } from "./context/peerContext";
import { SocketProvider } from "./context/socketContext.jsx";


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <SocketProvider>
        <PeerProvider>
        <App />
        </PeerProvider>
        </SocketProvider>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>,
)
