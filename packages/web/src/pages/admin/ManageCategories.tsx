import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Plus, Edit, Trash2, Save, X, Loader2 } from 'lucide-react';
import { apiClient } from '../../lib/api';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { showSuccessAlert, showErrorAlert } from '../../lib/sweetalert';
import Swal from 'sweetalert2';

type Category = {
    id: number;
    name: string;
};

export default function ManageCategories() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [isAdding, setIsAdding] = useState(false);
    const [newName, setNewName] = useState('');
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editName, setEditName] = useState('');

    const { data: categories = [], isLoading } = useQuery<Category[]>({
        queryKey: ['categories'],
        queryFn: async () => {
            const { data } = await apiClient.get('/categories');
            return data;
        },
    });

    const createMutation = useMutation({
        mutationFn: async (name: string) => {
            await apiClient.post('/admin/categories', { name });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            setIsAdding(false);
            setNewName('');
            showSuccessAlert('Thêm danh mục thành công!', '');
        },
        onError: (error: any) => {
            showErrorAlert('Lỗi', error.response?.data?.error || 'Không thể tạo danh mục');
        },
    });

    const updateMutation = useMutation({
        mutationFn: async ({ id, name }: { id: number; name: string }) => {
            await apiClient.put(`/admin/categories/${id}`, { name });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            setEditingId(null);
            showSuccessAlert('Cập nhật thành công!', '');
        },
        onError: (error: any) => {
            showErrorAlert('Lỗi', error.response?.data?.error || 'Không thể cập nhật');
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            await apiClient.delete(`/admin/categories/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            showSuccessAlert('Xóa thành công!', '');
        },
        onError: (error: any) => {
            showErrorAlert('Lỗi', error.response?.data?.error || 'Không thể xóa danh mục');
        },
    });

    const handleDelete = async (id: number, name: string) => {
        const result = await Swal.fire({
            title: 'Xác nhận xóa?',
            html: `Xóa danh mục <strong>"${name}"</strong>?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc2626',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy',
        });
        if (result.isConfirmed) deleteMutation.mutate(id);
    };

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <Button
                    variant="ghost"
                    onClick={() => navigate('/admin')}
                    className="mb-4"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Quay lại Dashboard
                </Button>

                <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-8">
                    Quản lý Danh mục
                </h1>

                {/* Add Form */}
                {!isAdding ? (
                    <Card className="p-4 border-dashed border-2 mb-6">
                        <Button onClick={() => setIsAdding(true)} variant="ghost" className="w-full">
                            <Plus className="h-5 w-5 mr-2" />
                            Thêm danh mục mới
                        </Button>
                    </Card>
                ) : (
                    <Card className="p-4 mb-6">
                        <div className="flex gap-2">
                            <Input
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                placeholder="Tên danh mục..."
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') createMutation.mutate(newName);
                                    if (e.key === 'Escape') {
                                        setIsAdding(false);
                                        setNewName('');
                                    }
                                }}
                                autoFocus
                            />
                            <Button
                                onClick={() => createMutation.mutate(newName)}
                                disabled={!newName.trim() || createMutation.isPending}
                                className="bg-violet-600"
                            >
                                {createMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                            </Button>
                            <Button onClick={() => { setIsAdding(false); setNewName(''); }} variant="outline">
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </Card>
                )}

                {/* Categories List */}
                <div className="space-y-3">
                    {isLoading ? (
                        <Card className="p-8 text-center">
                            <Loader2 className="h-8 w-8 animate-spin mx-auto text-zinc-400" />
                        </Card>
                    ) : categories.length === 0 ? (
                        <Card className="p-8 text-center">
                            <p className="text-zinc-500">Chưa có danh mục nào</p>
                        </Card>
                    ) : (
                        categories.map((cat) => (
                            <Card key={cat.id} className="p-4">
                                {editingId === cat.id ? (
                                    <div className="flex gap-2">
                                        <Input
                                            value={editName}
                                            onChange={(e) => setEditName(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') updateMutation.mutate({ id: cat.id, name: editName });
                                                if (e.key === 'Escape') setEditingId(null);
                                            }}
                                            autoFocus
                                        />
                                        <Button
                                            onClick={() => updateMutation.mutate({ id: cat.id, name: editName })}
                                            disabled={!editName.trim() || updateMutation.isPending}
                                            className="bg-blue-600"
                                        >
                                            {updateMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                        </Button>
                                        <Button onClick={() => setEditingId(null)} variant="outline">
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium text-zinc-900 dark:text-white">{cat.name}</span>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => {
                                                    setEditingId(cat.id);
                                                    setEditName(cat.name);
                                                }}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-violet-600"
                                                onClick={() => handleDelete(cat.id, cat.name)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

