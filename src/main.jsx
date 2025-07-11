import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from './routes/HomePage';
import LoginPage from './routes/LoginPage';
import PostListPage from './routes/PostListPage';
import RegisterPage from './routes/RegisterPage';
import SinglePostPage from './routes/SinglePostPage';
import Write from './routes/Write';
import MainLayout from './layouts/MainLayout';
import { ClerkProvider } from '@clerk/clerk-react';
import {
  QueryClient,
  QueryClientProvider,
  
} from '@tanstack/react-query'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const queryClient = new QueryClient()

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/posts",
        element: <PostListPage />,
      },
      {
        path: "/:slug",
        element: <SinglePostPage />,
      },
      {
        path: "/write",
        element: <Write />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/register",
        element: <RegisterPage />,
      },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ToastContainer position='bottom-right'/>

      </QueryClientProvider>
    
    </ClerkProvider>
     
    {/* <App /> */}
  </StrictMode>,
)
