import { Link } from 'react-router-dom';
import { 
    Headphones, 
    MessageCircle, 
    Mail, 
    Phone, 
    BookOpen, 
    FileText, 
    HelpCircle,
    Clock,
    CheckCircle,
    ArrowRight,
    Search
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

export default function Support() {
    const [searchQuery, setSearchQuery] = useState('');

    const supportChannels = [
        {
            icon: MessageCircle,
            title: 'Live Chat',
            description: 'Trò chuyện trực tiếp với đội ngũ hỗ trợ',
            availability: 'Online 8:00 - 22:00',
            action: 'Bắt đầu chat',
            color: 'from-green-500 to-emerald-600',
        },
        {
            icon: Mail,
            title: 'Email',
            description: 'Gửi email và nhận phản hồi trong 24h',
            availability: 'support@elearning.vn',
            action: 'Gửi email',
            href: 'mailto:support@elearning.vn',
            color: 'from-blue-500 to-indigo-600',
        },
        {
            icon: Phone,
            title: 'Hotline',
            description: 'Gọi điện để được hỗ trợ nhanh nhất',
            availability: '1900 1234',
            action: 'Gọi ngay',
            href: 'tel:19001234',
            color: 'from-red-500 to-rose-600',
        },
    ];

    const quickLinks = [
        {
            icon: HelpCircle,
            title: 'Câu hỏi thường gặp',
            description: 'Tìm câu trả lời cho các thắc mắc phổ biến',
            link: '/faq',
        },
        {
            icon: BookOpen,
            title: 'Hướng dẫn sử dụng',
            description: 'Tìm hiểu cách sử dụng các tính năng',
            link: '/faq',
        },
        {
            icon: FileText,
            title: 'Chính sách & Điều khoản',
            description: 'Đọc các quy định và chính sách của chúng tôi',
            link: '/terms',
        },
    ];

    const commonIssues = [
        { title: 'Không thể đăng nhập vào tài khoản', category: 'Tài khoản' },
        { title: 'Cách đặt lại mật khẩu', category: 'Tài khoản' },
        { title: 'Không xem được video khóa học', category: 'Khóa học' },
        { title: 'Cách tải chứng chỉ hoàn thành', category: 'Khóa học' },
        { title: 'Yêu cầu hoàn tiền khóa học', category: 'Thanh toán' },
        { title: 'Lỗi thanh toán không thành công', category: 'Thanh toán' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            {/* Hero */}
            <section className="py-16 bg-gradient-to-br from-red-600 via-red-700 to-red-900">
                <div className="container mx-auto px-4 text-center text-white">
                    <Headphones className="h-16 w-16 mx-auto mb-6 opacity-80" />
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Trung tâm hỗ trợ</h1>
                    <p className="text-xl text-red-100 max-w-2xl mx-auto mb-8">
                        Chúng tôi luôn sẵn sàng giúp đỡ bạn. Chọn cách liên hệ phù hợp nhất với bạn.
                    </p>
                    
                    {/* Search */}
                    <div className="max-w-xl mx-auto relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                            type="text"
                            placeholder="Tìm kiếm câu hỏi hoặc vấn đề..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-12 h-14 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                        />
                    </div>
                </div>
            </section>

            {/* Support Channels */}
            <section className="py-12 -mt-8 relative z-10">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        {supportChannels.map((channel) => (
                            <Card key={channel.title} className="p-6 bg-white dark:bg-gray-900 shadow-xl hover:shadow-2xl transition-all group">
                                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${channel.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                    <channel.icon className="h-7 w-7 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                    {channel.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-3">
                                    {channel.description}
                                </p>
                                <p className="text-sm text-red-600 dark:text-red-400 font-medium mb-4">
                                    {channel.availability}
                                </p>
                                {channel.href ? (
                                    <a href={channel.href}>
                                        <Button className={`w-full bg-gradient-to-r ${channel.color}`}>
                                            {channel.action}
                                        </Button>
                                    </a>
                                ) : (
                                    <Button className={`w-full bg-gradient-to-r ${channel.color}`}>
                                        {channel.action}
                                    </Button>
                                )}
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Quick Links & Common Issues */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
                        {/* Quick Links */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                                Truy cập nhanh
                            </h2>
                            <div className="space-y-4">
                                {quickLinks.map((item) => (
                                    <Link key={item.title} to={item.link}>
                                        <Card className="p-5 hover:shadow-lg transition-all group cursor-pointer border-l-4 border-l-red-500">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center group-hover:bg-red-200 dark:group-hover:bg-red-900/50 transition-colors">
                                                    <item.icon className="h-6 w-6 text-red-600 dark:text-red-400" />
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                                                        {item.title}
                                                    </h3>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                        {item.description}
                                                    </p>
                                                </div>
                                                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-red-600 group-hover:translate-x-1 transition-all" />
                                            </div>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Common Issues */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                                Vấn đề thường gặp
                            </h2>
                            <Card className="divide-y divide-gray-100 dark:divide-gray-800">
                                {commonIssues.map((issue, index) => (
                                    <Link
                                        key={index}
                                        to="/faq"
                                        className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <CheckCircle className="h-5 w-5 text-green-500" />
                                            <span className="text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                                                {issue.title}
                                            </span>
                                        </div>
                                        <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                                            {issue.category}
                                        </span>
                                    </Link>
                                ))}
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            {/* Response Time */}
            <section className="py-16 bg-white dark:bg-gray-900">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <Clock className="h-12 w-12 mx-auto mb-4 text-red-600" />
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            Thời gian phản hồi
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-8">
                            Chúng tôi cam kết phản hồi nhanh chóng và giải quyết vấn đề của bạn hiệu quả nhất
                        </p>
                        <div className="grid grid-cols-3 gap-6">
                            <Card className="p-6 border-2 border-green-200 dark:border-green-800">
                                <div className="text-3xl font-bold text-green-600 mb-2">&lt; 5 phút</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">Live Chat</div>
                            </Card>
                            <Card className="p-6 border-2 border-blue-200 dark:border-blue-800">
                                <div className="text-3xl font-bold text-blue-600 mb-2">&lt; 24 giờ</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">Email</div>
                            </Card>
                            <Card className="p-6 border-2 border-red-200 dark:border-red-800">
                                <div className="text-3xl font-bold text-red-600 mb-2">Ngay lập tức</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">Hotline</div>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <Card className="max-w-4xl mx-auto p-8 bg-gradient-to-r from-red-600 to-red-700 text-white text-center">
                        <h2 className="text-2xl font-bold mb-4">Vẫn cần hỗ trợ?</h2>
                        <p className="text-red-100 mb-6">
                            Nếu bạn không tìm thấy câu trả lời, hãy liên hệ trực tiếp với chúng tôi
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link to="/contact">
                                <Button size="lg" className="bg-white text-red-600 hover:bg-red-50">
                                    <Mail className="h-5 w-5 mr-2" />
                                    Gửi yêu cầu hỗ trợ
                                </Button>
                            </Link>
                            <Link to="/faq">
                                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                                    <HelpCircle className="h-5 w-5 mr-2" />
                                    Xem FAQ
                                </Button>
                            </Link>
                        </div>
                    </Card>
                </div>
            </section>
        </div>
    );
}

