import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Send, Loader2, CheckCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { apiClient } from '../lib/api';
import { showSuccessAlert, showErrorAlert } from '../lib/sweetalert';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email) {
            showErrorAlert('Lỗi', 'Vui lòng nhập địa chỉ email');
            return;
        }

        setIsLoading(true);

        try {
            await apiClient.post('/password/forgot', { email });
            setIsSent(true);
            showSuccessAlert(
                'Email đã được gửi!',
                'Nếu tài khoản với email này tồn tại, chúng tôi đã gửi link đặt lại mật khẩu đến hộp thư của bạn.'
            );
        } catch (error: any) {
            const errorMessage = error.response?.data?.error || 'Không thể gửi email. Vui lòng thử lại.';
            showErrorAlert('Lỗi', errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    if (isSent) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
                <Card className="max-w-md w-full p-8 text-center shadow-2xl">
                    <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                        <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Email đã được gửi! ✅
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                        Chúng tôi đã gửi link đặt lại mật khẩu đến:
                    </p>
                    <p className="text-red-600 dark:text-red-400 font-semibold mb-6">
                        {email}
                    </p>
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 mb-6">
                        <p className="text-sm text-yellow-800 dark:text-yellow-200">
                            <strong>Lưu ý:</strong> Vui lòng kiểm tra hộp thư (bao gồm cả thư rác) và click vào link trong email. Link sẽ hết hạn sau <strong>1 giờ</strong>.
                        </p>
                    </div>
                    <div className="space-y-3">
                        <Link to="/login">
                            <Button className="w-full gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                                <ArrowLeft className="w-4 h-4" />
                                Quay lại đăng nhập
                            </Button>
                        </Link>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsSent(false);
                                setEmail('');
                            }}
                            className="w-full"
                        >
                            Gửi lại email
                        </Button>
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
                        <Mail className="w-8 h-8 text-red-600 dark:text-red-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Quên mật khẩu?
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Nhập địa chỉ email của bạn và chúng tôi sẽ gửi link đặt lại mật khẩu
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            <Mail className="w-4 h-4 inline mr-1" />
                            Địa chỉ email
                        </label>
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="email@example.com"
                            className="h-12"
                            disabled={isLoading}
                            required
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-12 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700"
                    >
                        {isLoading ? (
                            <div className="flex items-center gap-2">
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Đang gửi...
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Send className="w-5 h-5" />
                                Gửi link đặt lại mật khẩu
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

