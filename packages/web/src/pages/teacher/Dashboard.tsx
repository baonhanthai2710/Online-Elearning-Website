import { useAuthStore } from '../../stores/useAuthStore';
import { CourseCreateForm } from './components/CourseCreateForm';

export default function Dashboard() {
    const user = useAuthStore((state) => state.user);

    return (
        <section className="container mx-auto px-4 py-10 space-y-10">
            <header className="space-y-2">
                <h1 className="text-3xl font-bold text-slate-900">Bảng điều khiển giảng viên</h1>
                <p className="text-slate-600">
                    Theo dõi các khoá học, tạo mới nội dung và quản lý thông tin giảng dạy của bạn.
                </p>
            </header>

            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
                <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="text-xl font-semibold text-slate-900">Thông tin tài khoản</h2>
                    {user ? (
                        <ul className="mt-3 space-y-1 text-sm text-slate-600">
                            <li>Tên đăng nhập: {user.username}</li>
                            {user.firstName && user.lastName && (
                                <li>
                                    Họ tên: {user.firstName} {user.lastName}
                                </li>
                            )}
                            <li>Email: {user.email}</li>
                            <li>Quyền hạn: {user.role === 'TEACHER' ? 'Giảng viên' : user.role}</li>
                        </ul>
                    ) : (
                        <p className="mt-3 text-sm text-slate-500">Chưa có thông tin người dùng.</p>
                    )}
                </section>

                <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                    <CourseCreateForm />
                </section>
            </div>
        </section>
    );
}
