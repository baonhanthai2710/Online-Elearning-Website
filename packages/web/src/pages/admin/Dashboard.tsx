import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Users, BookOpen, GraduationCap, FolderTree, TrendingUp, UserCheck, UserCog } from 'lucide-react';
import { apiClient } from '../../lib/api';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';

type AdminStats = {
    totalUsers: number;
    totalCourses: number;
    totalEnrollments: number;
    totalCategories: number;
    usersByRole: {
        STUDENT?: number;
        TEACHER?: number;
        ADMIN?: number;
    };
    recentUsers: Array<{
        id: number;
        username: string;
        email: string;
        role: string;
        createdAt: string;
    }>;
};

export default function AdminDashboard() {
    const { data: stats, isLoading } = useQuery<AdminStats>({
        queryKey: ['admin-stats'],
        queryFn: async () => {
            const { data } = await apiClient.get('/admin/stats');
            return data;
        },
    });

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
                <p className="text-gray-600 dark:text-gray-400">Đang tải...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                        Admin Dashboard
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Quản lý toàn bộ hệ thống E-Learning
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card className="p-6 border-gray-200 dark:border-gray-800">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Tổng người dùng</p>
                                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                    {stats?.totalUsers || 0}
                                </p>
                            </div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600">
                                <Users className="h-6 w-6 text-white" />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6 border-gray-200 dark:border-gray-800">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Tổng khóa học</p>
                                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                    {stats?.totalCourses || 0}
                                </p>
                            </div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-green-600">
                                <BookOpen className="h-6 w-6 text-white" />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6 border-gray-200 dark:border-gray-800">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Tổng đăng ký</p>
                                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                    {stats?.totalEnrollments || 0}
                                </p>
                            </div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-purple-600">
                                <GraduationCap className="h-6 w-6 text-white" />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6 border-gray-200 dark:border-gray-800">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Danh mục</p>
                                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                    {stats?.totalCategories || 0}
                                </p>
                            </div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-600">
                                <FolderTree className="h-6 w-6 text-white" />
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Users by Role */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    <Card className="p-6 border-gray-200 dark:border-gray-800">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/30">
                                <UserCheck className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Học viên</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {stats?.usersByRole?.STUDENT || 0}
                                </p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6 border-gray-200 dark:border-gray-800">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 dark:bg-green-900/30">
                                <UserCog className="h-6 w-6 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Giảng viên</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {stats?.usersByRole?.TEACHER || 0}
                                </p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6 border-gray-200 dark:border-gray-800">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 dark:bg-red-900/30">
                                <TrendingUp className="h-6 w-6 text-red-600 dark:text-red-400" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Quản trị viên</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {stats?.usersByRole?.ADMIN || 0}
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <Link to="/admin/users">
                        <Button className="w-full h-20 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white">
                            <Users className="mr-2 h-5 w-5" />
                            Quản lý người dùng
                        </Button>
                    </Link>

                    <Link to="/admin/courses">
                        <Button className="w-full h-20 bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 text-white">
                            <BookOpen className="mr-2 h-5 w-5" />
                            Quản lý khóa học
                        </Button>
                    </Link>

                    <Link to="/admin/categories">
                        <Button className="w-full h-20 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white">
                            <FolderTree className="mr-2 h-5 w-5" />
                            Quản lý danh mục
                        </Button>
                    </Link>

                    <Link to="/">
                        <Button
                            variant="outline"
                            className="w-full h-20 border-2 border-gray-300 dark:border-gray-700"
                        >
                            <TrendingUp className="mr-2 h-5 w-5" />
                            Xem website
                        </Button>
                    </Link>
                </div>

                {/* Recent Users */}
                <Card className="p-6 border-gray-200 dark:border-gray-800">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                        Người dùng mới nhất
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200 dark:border-gray-700">
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">
                                        Username
                                    </th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">
                                        Email
                                    </th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">
                                        Role
                                    </th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">
                                        Ngày tạo
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats?.recentUsers?.map((user) => (
                                    <tr
                                        key={user.id}
                                        className="border-b border-gray-100 dark:border-gray-800"
                                    >
                                        <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                                            {user.username}
                                        </td>
                                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                                            {user.email}
                                        </td>
                                        <td className="py-3 px-4">
                                            <span
                                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                    user.role === 'ADMIN'
                                                        ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                                        : user.role === 'TEACHER'
                                                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                                                }`}
                                            >
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                                            {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </div>
    );
}

