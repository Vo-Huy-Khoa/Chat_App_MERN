import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App";
import GlobalStyle from "./components/globalStyle";
import { AuthProvider, ReceiverProvider } from "./providers";
import store from "./redux/store";
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <GlobalStyle>
        <AuthProvider>
          <ReceiverProvider>
            <App />
          </ReceiverProvider>
        </AuthProvider>
      </GlobalStyle>
    </Provider>
  </React.StrictMode>
);
