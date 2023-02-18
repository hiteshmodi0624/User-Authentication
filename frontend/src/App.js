import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import EditEventPage from './pages/EditEvent';
import ErrorPage from './pages/Error';
import EventsRootLayout from './pages/EventsRoot';
import HomePage from './pages/Home';
import NewEventPage from './pages/NewEvent';
import RootLayout from './pages/Root';
import { action as manipulateEventAction } from './components/EventForm';
import NewsletterPage, { action as newsletterAction } from './pages/Newsletter';
import AuthenticationPage from './pages/Authentication';
import { action as authAction } from './pages/Authentication';
import { action as logout } from './components/Logout';
import { tokenLoader,checkAuthLoader } from './util/auth';
import { lazy, Suspense } from 'react';
import  { loader as eventDetailLoader,action as deleteEventAction } from './pages/EventDetail';

const EventsPage=lazy(()=>import('./pages/Events'))
const EventDetailPage=lazy(()=>import('./pages/EventDetail'))
const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    id:'root',
    loader: tokenLoader,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: 'events',
        element: <EventsRootLayout />,
        children: [
          {
            index: true,
            element: <Suspense fallback=<p>Loading...</p>><EventsPage /></Suspense>,
            loader: ()=>import('./pages/Events').then(module=>module.loader()),
          },
          {
            path: ':eventId',
            id: 'event-detail',
            loader: eventDetailLoader,
            children: [
              {
                index: true,
                element: <Suspense fallback=<p>Loading...</p>><EventDetailPage /></Suspense>,
                action: deleteEventAction,
              },
              {
                path: 'edit',
                element: <EditEventPage />,
                action: manipulateEventAction,
                loader: checkAuthLoader
              },
            ],
          },
          {
            path: 'new',
            element: <NewEventPage />,
            action: manipulateEventAction,
            loader: checkAuthLoader
          },
        ],
      },
      {
        path: 'newsletter',
        element: <NewsletterPage />,
        action: newsletterAction,
      },
      {
        path:'logout',
        action: logout
      },
      {
        path: "auth",
        element: <AuthenticationPage/>,
        action: authAction
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
