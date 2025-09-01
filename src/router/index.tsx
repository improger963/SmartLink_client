import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layout/MainLayout.tsx';
import DashboardPage from '../pages/DashboardPage.tsx';
import LoginPage from '../pages/LoginPage.tsx';
import RegisterPage from '../pages/RegisterPage.tsx';
import SitesPage from '../pages/SitesPage.tsx';
import CampaignsPage from '../pages/CampaignsPage.tsx';
import BalancePage from '../pages/BalancePage.tsx';
import ChatPage from '../pages/ChatPage.tsx';
import NewsPage from '../pages/NewsPage.tsx';
import ReviewsPage from '../pages/ReviewsPage.tsx';
import TicketsPage from '../pages/TicketsPage.tsx';
import ProfilePage from '../pages/ProfilePage.tsx';

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: '/', element: <DashboardPage /> },
      { path: '/sites', element: <SitesPage /> },
      { path: '/campaigns', element: <CampaignsPage /> },
      { path: '/balance', element: <BalancePage /> },
      { path: '/chat', element: <ChatPage /> },
      { path: '/news', element: <NewsPage /> },
      { path: '/reviews', element: <ReviewsPage /> },
      { path: '/tickets', element: <TicketsPage /> },
      { path: '/profile', element: <ProfilePage /> },
    ]
  },
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
]);

export default router;
