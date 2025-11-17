import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { apiClient } from '../../lib/api';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { showSuccessAlert, showErrorAlert } from '../../lib/sweetalert';

export default function AdminEditCourse() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: 0,
        categoryId: 0,
        teacherId: 0,
    });

    const { data: course, isLoading } = useQuery({
        queryKey: ['admin-course', id],
        queryFn: async () => {
            const { data } = await apiClient.get(`/admin/courses/${id}`);
            return data;
        },
        enabled: !!id,
    });

    const { data: categories = [] } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const { data } = await apiClient.get('/categories');
            return data;
        },
    });

    const { data: teachers = [] } = useQuery({
        queryKey: ['teachers'],
        queryFn: async () => {
            const { data } = await apiClient.get('/admin/users?role=TEACHER');
            return data;
        },
    });

    useEffect(() => {
        if (course) {
            setFormData({
                title: course.title,
                description: course.description,
                price: course.price,
                categoryId: course.categoryId,
                teacherId: course.teacherId,
            });
        }
    }, [course]);

    const updateMutation = useMutation({
        mutationFn: async (data: typeof formData) => {
            await apiClient.put(`/admin/courses/${id}`, data);
        },
        onSuccess: () => {
            showSuccessAlert('Thành công', 'Đã cập nhật khóa học');
            navigate('/admin/courses');
        },
        onError: (error: any) => {
            showErrorAlert('Lỗi', error.response?.data?.error || 'Không thể cập nhật khóa học');
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title || !formData.description || !formData.categoryId || !formData.teacherId) {
            showErrorAlert('Lỗi', 'Vui lòng điền đầy đủ thông tin');
            return;
        }
        updateMutation.mutate(formData);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-8 flex items-center justify-center">
                <div className="text-center">Đang tải...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-8">
            <div className="container mx-auto max-w-3xl">
                <Button variant="ghost" onClick={() => navigate('/admin/courses')} className="mb-4">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Quay lại
                </Button>
                <Card className="p-6">
                    <h1 className="text-2xl font-bold mb-6">Chỉnh sửa khóa học</h1>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Tên khóa học</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700"
                                placeholder="Nhập tên khóa học"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Mô tả</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700"
                                placeholder="Nhập mô tả khóa học"
                                rows={5}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Giá (VND)</label>
                            <input
                                type="number"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700"
                                placeholder="0"
                                min="0"
                                step="1"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Danh mục</label>
                            <select
                                value={formData.categoryId}
                                onChange={(e) => setFormData({ ...formData, categoryId: Number(e.target.value) })}
                                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700"
                                required
                            >
                                {categories.map((category: any) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Giảng viên</label>
                            <select
                                value={formData.teacherId}
                                onChange={(e) => setFormData({ ...formData, teacherId: Number(e.target.value) })}
                                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700"
                                required
                            >
                                {teachers.map((teacher: any) => (
                                    <option key={teacher.id} value={teacher.id}>
                                        {teacher.firstName} {teacher.lastName} (@{teacher.username})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex gap-3 pt-4">
                            <Button
                                type="submit"
                                disabled={updateMutation.isPending}
                                className="bg-red-600 hover:bg-red-700 text-white"
                            >
                                {updateMutation.isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => navigate('/admin/courses')}
                            >
                                Hủy
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
}

