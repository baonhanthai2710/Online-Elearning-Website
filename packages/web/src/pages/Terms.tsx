import { FileText, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';

export default function Terms() {
    const lastUpdated = '01/11/2024';

    const sections = [
        {
            title: '1. Giới thiệu',
            content: `Chào mừng bạn đến với E-Learning. Bằng việc truy cập và sử dụng trang web này, bạn đồng ý tuân thủ và chịu ràng buộc bởi các điều khoản và điều kiện sau đây. Nếu bạn không đồng ý với bất kỳ phần nào của các điều khoản này, vui lòng không sử dụng dịch vụ của chúng tôi.`,
        },
        {
            title: '2. Định nghĩa',
            content: `
• "E-Learning", "chúng tôi", "của chúng tôi" đề cập đến nền tảng học trực tuyến E-Learning và công ty vận hành.
• "Người dùng", "bạn" đề cập đến cá nhân hoặc tổ chức sử dụng dịch vụ của chúng tôi.
• "Nội dung" bao gồm video, tài liệu, bài giảng, bài kiểm tra và tất cả các tài liệu học tập khác.
• "Giảng viên" là các cá nhân hoặc tổ chức cung cấp nội dung khóa học trên nền tảng.`,
        },
        {
            title: '3. Tài khoản người dùng',
            content: `
• Bạn phải đủ 16 tuổi để tạo tài khoản. Người dưới 16 tuổi cần có sự đồng ý của phụ huynh/người giám hộ.
• Bạn có trách nhiệm bảo mật thông tin tài khoản và mật khẩu của mình.
• Bạn không được chia sẻ tài khoản với người khác hoặc cho phép người khác truy cập vào tài khoản của bạn.
• Chúng tôi có quyền đình chỉ hoặc xóa tài khoản nếu phát hiện vi phạm điều khoản.`,
        },
        {
            title: '4. Sử dụng dịch vụ',
            content: `
Bạn đồng ý:
• Sử dụng dịch vụ cho mục đích học tập hợp pháp.
• Không sao chép, phân phối, hoặc chia sẻ nội dung khóa học mà không có sự cho phép.
• Không sử dụng các phần mềm tự động để tải xuống hoặc truy cập nội dung.
• Không can thiệp vào hoạt động của hệ thống hoặc bảo mật của trang web.
• Không đăng tải nội dung vi phạm pháp luật, xúc phạm, hoặc spam.`,
        },
        {
            title: '5. Quyền sở hữu trí tuệ',
            content: `
• Tất cả nội dung trên E-Learning đều được bảo vệ bởi luật sở hữu trí tuệ.
• Khi mua khóa học, bạn được cấp quyền sử dụng cá nhân, không độc quyền, không chuyển nhượng.
• Bạn không được:
  - Sao chép hoặc ghi lại video, tài liệu
  - Phân phối hoặc bán lại nội dung
  - Sử dụng nội dung cho mục đích thương mại
  - Xóa hoặc thay đổi thông báo bản quyền`,
        },
        {
            title: '6. Thanh toán và hoàn tiền',
            content: `
• Giá khóa học được hiển thị bằng VND và có thể thay đổi.
• Sau khi thanh toán thành công, bạn sẽ có quyền truy cập vĩnh viễn vào khóa học (trừ khi có quy định khác).
• Chính sách hoàn tiền:
  - Yêu cầu hoàn tiền trong vòng 30 ngày kể từ ngày mua
  - Không hoàn tiền nếu đã hoàn thành hơn 30% nội dung khóa học
  - Hoàn tiền sẽ được xử lý trong vòng 7-14 ngày làm việc`,
        },
        {
            title: '7. Giới hạn trách nhiệm',
            content: `
• E-Learning cung cấp dịch vụ trên cơ sở "như hiện có" và "như có sẵn".
• Chúng tôi không đảm bảo dịch vụ sẽ không bị gián đoạn hoặc không có lỗi.
• Chúng tôi không chịu trách nhiệm về:
  - Thiệt hại gián tiếp, ngẫu nhiên hoặc hậu quả
  - Mất dữ liệu hoặc lợi nhuận
  - Nội dung do giảng viên bên thứ ba cung cấp`,
        },
        {
            title: '8. Thay đổi điều khoản',
            content: `
• Chúng tôi có quyền sửa đổi các điều khoản này bất cứ lúc nào.
• Thay đổi sẽ có hiệu lực ngay khi đăng tải trên trang web.
• Việc tiếp tục sử dụng dịch vụ sau khi thay đổi đồng nghĩa với việc bạn chấp nhận điều khoản mới.
• Chúng tôi sẽ thông báo cho bạn về các thay đổi quan trọng qua email.`,
        },
        {
            title: '9. Luật áp dụng',
            content: `
Các điều khoản này được điều chỉnh bởi pháp luật Việt Nam. Mọi tranh chấp phát sinh sẽ được giải quyết tại tòa án có thẩm quyền tại TP. Hồ Chí Minh, Việt Nam.`,
        },
        {
            title: '10. Liên hệ',
            content: `
Nếu bạn có câu hỏi về các điều khoản này, vui lòng liên hệ:
• Email: legal@elearning.vn
• Hotline: 1900 1234
• Địa chỉ: 123 Đường ABC, Quận 1, TP. Hồ Chí Minh`,
        },
    ];

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
            {/* Hero */}
            <section className="py-16 bg-violet-600">
                <div className="container mx-auto px-4 text-center text-white">
                    <FileText className="h-16 w-16 mx-auto mb-6 opacity-80" />
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Điều khoản dịch vụ</h1>
                    <p className="text-xl text-violet-100 max-w-2xl mx-auto">
                        Vui lòng đọc kỹ các điều khoản trước khi sử dụng dịch vụ
                    </p>
                </div>
            </section>

            {/* Content */}
            <section className="py-16">
                <div className="container mx-auto px-4 max-w-4xl">
                    {/* Last Updated Notice */}
                    <Card className="p-4 mb-8 bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800">
                        <div className="flex items-center gap-3">
                            <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-500" />
                            <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                Cập nhật lần cuối: <strong>{lastUpdated}</strong>
                            </p>
                        </div>
                    </Card>

                    {/* Sections */}
                    <div className="space-y-8">
                        {sections.map((section) => (
                            <Card key={section.title} className="p-6">
                                <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">
                                    {section.title}
                                </h2>
                                <div className="text-zinc-600 dark:text-zinc-400 whitespace-pre-line leading-relaxed">
                                    {section.content}
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

