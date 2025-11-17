import { Link, Navigate, Outlet, createBrowserRouter, useNavigate } from 'react-router-dom';
import { useAuthStore } from './stores/useAuthStore';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CourseDetail from './pages/CourseDetail';
import Dashboard from './pages/teacher/Dashboard';

function MainLayout() {
    const navigate = useNavigate();
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const user = useAuthStore((state) => state.user);
    const clearUser = useAuthStore((state) => state.clearUser);

    const displayName = [user?.firstName, user?.lastName].filter(Boolean).join(' ') || user?.username || user?.email;

    const handleLogout = () => {
        clearUser();
        navigate('/');
    };

    return (
        <div className="min-h-screen flex flex-col ...">
            <header className="border-b ...">
                <nav className="container mx-auto px-4 py-3 flex justify-between items-center">

                    <Link to="/" className="text-lg font-semibold">
                        E-Learning Platform
                    </Link>

                    {isAuthenticated ? (
                        <div className="flex items-center gap-4 text-sm">
                            {displayName && <span className="font-medium text-slate-700">{displayName}</span>}
                            {user?.role === 'TEACHER' && (
                                <Link
                                    to="/dashboard"
                                    className="px-4 py-2 rounded-md font-medium text-white bg-emerald-600 hover:bg-emerald-500"
                                >
                                    Teacher Dashboard
                                </Link>
                            )}
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="px-4 py-2 rounded-md font-medium border border-slate-200 hover:bg-slate-100"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="space-x-4 text-sm">
                            <Link to="/login" className="px-4 py-2 rounded-md font-medium hover:bg-slate-100">
                                Log In
                            </Link>
                            <Link
                                to="/register"
                                className="px-4 py-2 rounded-md font-medium bg-slate-900 text-white hover:bg-slate-700"
                            >
                                Register
                            </Link>
                        </div>
                    )}

                </nav>
            </header>

            <main className="flex-1">
                <Outlet />
            </main>

            <footer>
                footer
            </footer>
        </div>
    );
}

function ProtectedRoute() {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const user = useAuthStore((state) => state.user);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (user?.role !== 'TEACHER') {
        return <Navigate to="/" replace />;
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
