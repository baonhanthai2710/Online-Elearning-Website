import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, CheckCircle, ArrowLeft, Send, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { apiClient } from '../lib/api';
import { showSuccessAlert, showErrorAlert } from '../lib/sweetalert';

export default function ResendVerification() {
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
            await apiClient.post('/auth/resend-verification', { email });
            setIsSent(true);
            showSuccessAlert('Thành công', 'Email xác thực đã được gửi. Vui lòng kiểm tra hộp thư.');
        } catch (error: any) {
            const errorCode = error.response?.data?.code;
            const errorMessage = error.response?.data?.error;

            if (errorCode === 'ALREADY_VERIFIED') {
                showErrorAlert('Email đã xác thực', 'Email này đã được xác thực. Bạn có thể đăng nhập ngay.');
            } else if (error.response?.status === 404) {
                showErrorAlert('Không tìm thấy', 'Không tìm thấy tài khoản với email này.');
            } else {
                showErrorAlert('Lỗi', errorMessage || 'Không thể gửi email xác thực. Vui lòng thử lại.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (isSent) {
        return (
            <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center p-4">
                <Card className="max-w-md w-full p-8 text-center shadow-2xl">
                    <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
                        Email đã được gửi!
                    </h1>
                    <p className="text-zinc-600 dark:text-zinc-400 mb-2">
                        Chúng tôi đã gửi email xác thực đến:
                    </p>
                    <p className="text-violet-600 dark:text-violet-400 font-semibold mb-6">
                        {email}
                    </p>
                    <p className="text-sm text-zinc-500 dark:text-zinc-500 mb-6">
                        Vui lòng kiểm tra hộp thư (bao gồm cả thư rác) và click vào link xác thực trong email.
                    </p>
                    <div className="space-y-3">
                        <Button
                            onClick={() => setIsSent(false)}
                            variant="outline"
                            className="w-full"
                        >
                            Gửi lại với email khác
                        </Button>
                        <Link to="/login">
                            <Button variant="ghost" className="w-full gap-2">
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
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center p-4">
            <Card className="max-w-md w-full p-8 shadow-2xl">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-violet-100 dark:bg-violet-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Mail className="w-8 h-8 text-violet-600 dark:text-violet-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
                        Gửi lại email xác thực
                    </h1>
                    <p className="text-zinc-600 dark:text-zinc-400">
                        Nhập địa chỉ email đã đăng ký để nhận lại link xác thực
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
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
                        className="w-full h-12 bg-violet-600 hover:bg-violet-700"
                    >
                        {isLoading ? (
                            <div className="flex items-center gap-2">
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Đang gửi...
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Send className="w-5 h-5" />
                                Gửi email xác thực
                            </div>
                        )}
                    </Button>
                </form>

                <div className="mt-6 text-center">
                    <Link
                        to="/login"
                        className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-violet-600 dark:hover:text-violet-400 flex items-center justify-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Quay lại đăng nhập
                    </Link>
                </div>
            </Card>
        </div>
    );
}

