import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { 
    Users, 
    User, 
    Calendar, 
    TrendingUp, 
    DollarSign, 
    CheckCircle, 
    Clock,
    ArrowLeft,
    Mail,
    Award,
    BarChart3
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { apiClient } from '../../lib/api';

type EnrolledStudent = {
    enrollmentId: number;
    enrollmentDate: string;
    progress: number;
    completionDate: string | null;
    student: {
        id: number;
        username: string;
        email: string;
        fullName: string;
        joinedAt: string;
    };
    payment: {
        amount: number;
        status: string;
        paidAt: string;
    } | null;
};

type EnrollmentStats = {
    totalStudents: number;
    completedStudents: number;
    inProgress: number;
    averageProgress: number;
    totalRevenue: number;
    freeEnrollments: number;
    paidEnrollments: number;
};

export default function EnrolledStudents() {
    const { id } = useParams<{ id: string }>();
    const courseId = parseInt(id || '0', 10);

    // Fetch enrolled students
    const { data: students, isLoading: isLoadingStudents } = useQuery<EnrolledStudent[]>({
        queryKey: ['enrolled-students', courseId],
        queryFn: async () => {
            const { data } = await apiClient.get(`/courses/${courseId}/students`);
            return data;
        },
        enabled: !!courseId,
    });

    // Fetch enrollment stats
    const { data: stats, isLoading: isLoadingStats } = useQuery<EnrollmentStats>({
        queryKey: ['enrollment-stats', courseId],
        queryFn: async () => {
            const { data } = await apiClient.get(`/courses/${courseId}/enrollment-stats`);
            return data;
        },
        enabled: !!courseId,
    });

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatPrice = (price: number) => {
        if (price === 0) return 'Miễn phí';
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(price);
    };

    const getProgressColor = (progress: number) => {
        if (progress >= 80) return 'text-green-600 dark:text-green-400';
        if (progress >= 50) return 'text-yellow-600 dark:text-yellow-400';
        return 'text-red-600 dark:text-red-400';
    };

    if (isLoadingStudents || isLoadingStats) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">Đang tải danh sách học viên...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
            <div className="container mx-auto px-4 max-w-7xl">
                {/* Header */}
                <div className="mb-8">
                    <Link to="/dashboard">
                        <Button variant="ghost" className="mb-4 gap-2">
                            <ArrowLeft className="w-4 h-4" />
                            Quay lại Dashboard
                        </Button>
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Học viên đã đăng ký
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Quản lý và theo dõi học viên của khóa học
                    </p>
                </div>

                {/* Stats Cards */}
                {stats && (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
                        <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20 border-blue-200 dark:border-blue-800">
                            <div className="flex items-center gap-2 mb-2">
                                <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Tổng học viên</span>
                            </div>
                            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{stats.totalStudents}</div>
                        </Card>

                        <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/20 border-green-200 dark:border-green-800">
                            <div className="flex items-center gap-2 mb-2">
                                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                                <span className="text-sm font-medium text-green-700 dark:text-green-300">Đã hoàn thành</span>
                            </div>
                            <div className="text-2xl font-bold text-green-900 dark:text-green-100">{stats.completedStudents}</div>
                        </Card>

                        <Card className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950/30 dark:to-yellow-900/20 border-yellow-200 dark:border-yellow-800">
                            <div className="flex items-center gap-2 mb-2">
                                <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                                <span className="text-sm font-medium text-yellow-700 dark:text-yellow-300">Đang học</span>
                            </div>
                            <div className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">{stats.inProgress}</div>
                        </Card>

                        <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/20 border-purple-200 dark:border-purple-800">
                            <div className="flex items-center gap-2 mb-2">
                                <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Tiến độ TB</span>
                            </div>
                            <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">{stats.averageProgress}%</div>
                        </Card>

                        <Card className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/30 dark:to-emerald-900/20 border-emerald-200 dark:border-emerald-800">
                            <div className="flex items-center gap-2 mb-2">
                                <DollarSign className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Doanh thu</span>
                            </div>
                            <div className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                                {formatPrice(stats.totalRevenue)}
                            </div>
                        </Card>

                        <Card className="p-4 bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950/30 dark:to-indigo-900/20 border-indigo-200 dark:border-indigo-800">
                            <div className="flex items-center gap-2 mb-2">
                                <User className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">Miễn phí</span>
                            </div>
                            <div className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">{stats.freeEnrollments}</div>
                        </Card>

                        <Card className="p-4 bg-gradient-to-br from-rose-50 to-rose-100 dark:from-rose-950/30 dark:to-rose-900/20 border-rose-200 dark:border-rose-800">
                            <div className="flex items-center gap-2 mb-2">
                                <Award className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                                <span className="text-sm font-medium text-rose-700 dark:text-rose-300">Trả phí</span>
                            </div>
                            <div className="text-2xl font-bold text-rose-900 dark:text-rose-100">{stats.paidEnrollments}</div>
                        </Card>
                    </div>
                )}

                {/* Students Table */}
                <Card className="overflow-hidden">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                            Danh sách học viên ({students?.length || 0})
                        </h2>
                    </div>

                    {!students || students.length === 0 ? (
                        <div className="p-12 text-center">
                            <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                                Chưa có học viên nào
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Khóa học này chưa có học viên đăng ký.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                                <thead className="bg-gray-50 dark:bg-gray-900">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Học viên
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Email
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Ngày đăng ký
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Tiến độ
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Thanh toán
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Trạng thái
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Hành động
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                                    {students.map((enrollment) => (
                                        <tr key={enrollment.enrollmentId} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center text-white font-semibold">
                                                        {enrollment.student.fullName.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                            {enrollment.student.fullName}
                                                        </div>
                                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                                            @{enrollment.student.username}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                                    <Mail className="w-4 h-4" />
                                                    {enrollment.student.email}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4" />
                                                    {formatDate(enrollment.enrollmentDate)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex-1 w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                                        <div
                                                            className={`h-2 rounded-full transition-all ${
                                                                enrollment.progress >= 80
                                                                    ? 'bg-green-500'
                                                                    : enrollment.progress >= 50
                                                                    ? 'bg-yellow-500'
                                                                    : 'bg-red-500'
                                                            }`}
                                                            style={{ width: `${enrollment.progress}%` }}
                                                        />
                                                    </div>
                                                    <span className={`text-sm font-semibold ${getProgressColor(enrollment.progress)}`}>
                                                        {enrollment.progress.toFixed(1)}%
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {enrollment.payment ? (
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                            {formatPrice(enrollment.payment.amount)}
                                                        </div>
                                                        <div className={`text-xs ${
                                                            enrollment.payment.status === 'SUCCESSFUL'
                                                                ? 'text-green-600 dark:text-green-400'
                                                                : 'text-yellow-600 dark:text-yellow-400'
                                                        }`}>
                                                            {enrollment.payment.status === 'SUCCESSFUL' ? 'Đã thanh toán' : 'Chờ thanh toán'}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span className="text-sm text-gray-500 dark:text-gray-500">Miễn phí</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {enrollment.completionDate ? (
                                                    <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                                                        <CheckCircle className="w-4 h-4" />
                                                        <span>Đã hoàn thành</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2 text-sm text-yellow-600 dark:text-yellow-400">
                                                        <Clock className="w-4 h-4" />
                                                        <span>Đang học</span>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <Link to={`/courses/${courseId}/students/${enrollment.student.id}/performance`}>
                                                    <Button variant="outline" size="sm" className="gap-2">
                                                        <BarChart3 className="w-4 h-4" />
                                                        Xem hiệu suất
                                                    </Button>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
}

