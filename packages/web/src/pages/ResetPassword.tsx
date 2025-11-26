import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle, XCircle, Loader2, ArrowLeft } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { apiClient } from '../lib/api';
import { showSuccessAlert, showErrorAlert } from '../lib/sweetalert';

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<'form' | 'success' | 'error'>('form');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (!token) {
            setStatus('error');
            setErrorMessage('Link đặt lại mật khẩu không hợp lệ. Vui lòng yêu cầu link mới.');
        }
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!password || !confirmPassword) {
            showErrorAlert('Lỗi', 'Vui lòng nhập đầy đủ thông tin');
            return;
        }

        if (password.length < 6) {
            showErrorAlert('Lỗi', 'Mật khẩu phải có ít nhất 6 ký tự');
            return;
        }

        if (password !== confirmPassword) {
            showErrorAlert('Lỗi', 'Mật khẩu xác nhận không khớp');
            return;
        }

        if (!token) {
            return;
        }

        setIsLoading(true);

        try {
            await apiClient.post('/password/reset', { token, password });
            setStatus('success');
            showSuccessAlert('Thành công!', 'Mật khẩu đã được đặt lại. Bạn có thể đăng nhập ngay.');
            
            // Redirect to login after 3 seconds
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (error: any) {
            const errorCode = error.response?.data?.code;
            const errorMessage = error.response?.data?.error || 'Không thể đặt lại mật khẩu. Vui lòng thử lại.';

            if (errorCode === 'TOKEN_EXPIRED') {
                setStatus('error');
                setErrorMessage('Link đặt lại mật khẩu đã hết hạn. Vui lòng yêu cầu link mới.');
            } else if (errorCode === 'INVALID_TOKEN') {
                setStatus('error');
                setErrorMessage('Link đặt lại mật khẩu không hợp lệ. Vui lòng yêu cầu link mới.');
            } else {
                showErrorAlert('Lỗi', errorMessage);
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (status === 'success') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
                <Card className="max-w-md w-full p-8 text-center shadow-2xl">
                    <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                        <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Đặt lại mật khẩu thành công! 🎉
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Mật khẩu của bạn đã được đặt lại. Bạn có thể đăng nhập ngay bây giờ.
                    </p>
                    <Link to="/login">
                        <Button className="w-full gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                            Đi đến trang đăng nhập
                        </Button>
                    </Link>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-4">
                        Tự động chuyển hướng sau 3 giây...
                    </p>
                </Card>
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
                <Card className="max-w-md w-full p-8 text-center shadow-2xl">
                    <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                        <XCircle className="w-12 h-12 text-red-600 dark:text-red-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Lỗi
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        {errorMessage}
                    </p>
                    <div className="space-y-3">
                        <Link to="/forgot-password">
                            <Button className="w-full gap-2 bg-gradient-to-r from-red-600 to-rose-600">
                                Yêu cầu link mới
                            </Button>
                        </Link>
                        <Link to="/login">
                            <Button variant="outline" className="w-full gap-2">
                                <ArrowLeft className="w-4 h-4" />
                                Quay lại đăng nhập
                            </Button>
                        </Link>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
            <Card className="max-w-md w-full p-8 shadow-2xl">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Lock className="w-8 h-8 text-red-600 dark:text-red-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Đặt lại mật khẩu
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Nhập mật khẩu mới cho tài khoản của bạn
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            <Lock className="w-4 h-4 inline mr-1" />
                            Mật khẩu mới
                        </label>
                        <div className="relative">
                            <Input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                                className="h-12 pr-11"
                                disabled={isLoading}
                                required
                                minLength={6}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Xác nhận mật khẩu mới
                        </label>
                        <div className="relative">
                            <Input
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Nhập lại mật khẩu mới"
                                className="h-12 pr-11"
                                disabled={isLoading}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-12 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700"
                    >
                        {isLoading ? (
                            <div className="flex items-center gap-2">
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Đang xử lý...
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Lock className="w-5 h-5" />
                                Đặt lại mật khẩu
                            </div>
                        )}
                    </Button>
                </form>

                <div className="mt-6 text-center">
                    <Link 
                        to="/login" 
                        className="text-sm text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 flex items-center justify-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Quay lại đăng nhập
                    </Link>
                </div>
            </Card>
        </div>
    );
}

