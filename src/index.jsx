import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import MyAuth0Provider from './contexts/MyAuth0Provider';
import { UserProvider } from './contexts/User.context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const root = ReactDOM.createRoot(document.getElementById('root'));
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => error.response?.status !== 404 && failureCount < 2
    },
  },
})
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <MyAuth0Provider>
        <QueryClientProvider client={queryClient}>
          <UserProvider>
            <App />
          </UserProvider>
        </QueryClientProvider >
      </MyAuth0Provider>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
