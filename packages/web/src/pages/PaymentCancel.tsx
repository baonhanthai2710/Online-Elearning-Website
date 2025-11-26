import { Link } from 'react-router-dom';
import { XCircle, ArrowLeft, HelpCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';

export default function PaymentCancel() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
            <Card className="max-w-md w-full p-8 text-center shadow-2xl">
                <div className="mb-6">
                    <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <XCircle className="w-12 h-12 text-red-600 dark:text-red-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                        Thanh toán bị hủy
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">
                        Giao dịch thanh toán đã bị hủy hoặc không thành công. Bạn có thể thử lại hoặc chọn khóa học khác.
                    </p>
                </div>

                <div className="space-y-3">
                    <Link to="/courses" className="block">
                        <Button className="w-full gap-2 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900">
                            <ArrowLeft className="w-4 h-4" />
                            Quay lại danh sách khóa học
                        </Button>
                    </Link>
                    <Link to="/contact" className="block">
                        <Button variant="outline" className="w-full gap-2">
                            <HelpCircle className="w-4 h-4" />
                            Liên hệ hỗ trợ
                        </Button>
                    </Link>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-500 mt-6">
                    Nếu bạn gặp vấn đề, vui lòng liên hệ hỗ trợ để được giúp đỡ.
                </p>
            </Card>
        </div>
    );
}

