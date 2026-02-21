import { createBrowserRouter, Navigate, Outlet, Link } from "react-router";
import { Dashboard } from "./pages/Dashboard";
import { Footer } from "./components/Footer";

function RootLayout() {
  return (
    <>
      <Outlet />
      <Footer />
    </>
  );
}

function ErrorBoundary() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center p-8">
        <p className="text-6xl mb-4">⌐◨-◨</p>
        <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
        <p className="text-muted-foreground mb-6">Let's get you back home.</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    ErrorBoundary: ErrorBoundary,
    children: [
      {
        index: true,
        Component: Dashboard,
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);
