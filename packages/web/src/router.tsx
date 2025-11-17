import { Navigate, Outlet, createBrowserRouter } from 'react-router-dom';
import { useAuthStore } from './stores/useAuthStore';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CourseDetail from './pages/CourseDetail';
import Dashboard from './pages/teacher/Dashboard';

function MainLayout() {
    return (
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
            <header className="border-b border-slate-200 shadow-sm">
                <nav className="container mx-auto px-4 py-3">
                    {/* TODO: Navbar content */}
                    <div className="text-lg font-semibold">Navbar</div>
                </nav>
            </header>

            <main className="flex-1">
                <Outlet />
            </main>

            <footer className="border-t border-slate-200">
                <div className="container mx-auto px-4 py-6 text-sm text-slate-500">
                    {/* TODO: Footer content */}
                    Footer
                </div>
            </footer>
        </div>
    );
}

function ProtectedRoute() {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}

export const router = createBrowserRouter([
    {
        element: <MainLayout />,
        children: [
            {
                path: '/',
                element: <Home />,
            },
            {
                path: '/login',
                element: <Login />,
            },
            {
                path: '/register',
                element: <Register />,
            },
            {
                path: '/courses/:id',
                element: <CourseDetail />,
            },
            {
                element: <ProtectedRoute />,
                children: [
                    {
                        path: '/dashboard',
                        element: <Dashboard />,
                    },
                ],
            },
        ],
    },
]);
