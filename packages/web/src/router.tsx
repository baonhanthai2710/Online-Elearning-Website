import { Navigate, Outlet, createBrowserRouter } from 'react-router-dom';
import { useAuthStore } from './stores/useAuthStore';

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

function HomePage() {
    return (
        <div className="container mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold">Trang chủ</h1>
        </div>
    );
}

function LoginPage() {
    return (
        <div className="container mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold">Đăng nhập</h1>
        </div>
    );
}

function RegisterPage() {
    return (
        <div className="container mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold">Đăng ký</h1>
        </div>
    );
}

function CourseDetailPage() {
    return (
        <div className="container mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold">Chi tiết khóa học</h1>
        </div>
    );
}

function DashboardPage() {
    return (
        <div className="container mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold">Bảng điều khiển</h1>
        </div>
    );
}

export const router = createBrowserRouter([
    {
        element: <MainLayout />,
        children: [
            {
                path: '/',
                element: <HomePage />,
            },
            {
                path: '/login',
                element: <LoginPage />,
            },
            {
                path: '/register',
                element: <RegisterPage />,
            },
            {
                path: '/courses/:id',
                element: <CourseDetailPage />,
            },
            {
                element: <ProtectedRoute />,
                children: [
                    {
                        path: '/dashboard',
                        element: <DashboardPage />,
                    },
                ],
            },
        ],
    },
]);
