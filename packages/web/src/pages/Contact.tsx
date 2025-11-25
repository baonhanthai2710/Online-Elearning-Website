import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, MessageSquare } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { showSuccessAlert, showErrorAlert } from '../lib/sweetalert';
import { apiClient } from '../lib/api';

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            await apiClient.post('/contact', formData);
            showSuccessAlert(
                'Gửi thành công!', 
                'Chúng tôi đã nhận được yêu cầu hỗ trợ của bạn. Vui lòng kiểm tra email để xác nhận. Chúng tôi sẽ phản hồi trong vòng 24 giờ.'
            );
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (error: any) {
            const errorMessage = error.response?.data?.error || 'Không thể gửi yêu cầu hỗ trợ. Vui lòng thử lại sau.';
            showErrorAlert('Lỗi', errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const contactInfo = [
        {
            icon: Mail,
            title: 'Email',
            content: 'support@elearning.vn',
            description: 'Gửi email cho chúng tôi',
        },
        {
            icon: Phone,
            title: 'Hotline',
            content: '1900 1234',
            description: 'Thứ 2 - Thứ 7, 8:00 - 22:00',
        },
        {
            icon: MapPin,
            title: 'Địa chỉ',
            content: '123 Đường ABC, Quận 1',
            description: 'TP. Hồ Chí Minh, Việt Nam',
        },
        {
            icon: Clock,
            title: 'Giờ làm việc',
            content: '8:00 - 22:00',
            description: 'Thứ 2 - Thứ 7',
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            {/* Hero */}
            <section className="py-16 bg-gradient-to-br from-red-600 via-red-700 to-red-900">
                <div className="container mx-auto px-4 text-center text-white">
                    <MessageSquare className="h-16 w-16 mx-auto mb-6 opacity-80" />
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Liên hệ với chúng tôi</h1>
                    <p className="text-xl text-red-100 max-w-2xl mx-auto">
                        Bạn có câu hỏi hoặc cần hỗ trợ? Đội ngũ của chúng tôi luôn sẵn sàng giúp đỡ bạn.
                    </p>
                </div>
            </section>

            {/* Contact Info Cards */}
            <section className="py-12 -mt-8 relative z-10">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
                        {contactInfo.map((info) => (
                            <Card key={info.title} className="p-6 text-center bg-white dark:bg-gray-900 shadow-xl hover:shadow-2xl transition-shadow">
                                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                                    <info.icon className="h-6 w-6 text-red-600 dark:text-red-400" />
                                </div>
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{info.title}</h3>
                                <p className="text-red-600 dark:text-red-400 font-medium">{info.content}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{info.description}</p>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Form & Map */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
                        {/* Form */}
                        <Card className="p-8">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                                Gửi tin nhắn cho chúng tôi
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Họ và tên
                                        </label>
                                        <Input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="Nguyễn Văn A"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Email
                                        </label>
                                        <Input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            placeholder="email@example.com"
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Chủ đề
                                    </label>
                                    <Input
                                        type="text"
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        placeholder="Tôi cần hỗ trợ về..."
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Nội dung
                                    </label>
                                    <textarea
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        placeholder="Mô tả chi tiết vấn đề của bạn..."
                                        rows={5}
                                        required
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full h-12 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                                >
                                    {isSubmitting ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Đang gửi...
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <Send className="h-5 w-5" />
                                            Gửi tin nhắn
                                        </div>
                                    )}
                                </Button>
                            </form>
                        </Card>

                        {/* Map */}
                        <div className="space-y-6">
                            <Card className="overflow-hidden">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4946681025395!2d106.69877427486823!3d10.771596789387625!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f385570472f%3A0x1787491df0ed8d6a!2zQuG6v24gTmjDoCBSb25n!5e0!3m2!1svi!2s!4v1699000000000!5m2!1svi!2s"
                                    width="100%"
                                    height="350"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Vị trí văn phòng"
                                />
                            </Card>
                            <Card className="p-6 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/30 dark:to-red-900/20 border-red-200 dark:border-red-800">
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                                    Cần hỗ trợ gấp?
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-4">
                                    Gọi ngay hotline để được hỗ trợ nhanh nhất
                                </p>
                                <a href="tel:19001234">
                                    <Button className="bg-red-600 hover:bg-red-700">
                                        <Phone className="h-4 w-4 mr-2" />
                                        1900 1234
                                    </Button>
                                </a>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
