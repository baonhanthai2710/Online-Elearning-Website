import { Shield, AlertCircle, Lock, Eye, Database, Bell, Trash2, Globe } from 'lucide-react';
import { Card } from '@/components/ui/card';

export default function Privacy() {
    const lastUpdated = '01/11/2024';

    const highlights = [
        { icon: Lock, title: 'Bảo mật dữ liệu', description: 'Mã hóa SSL/TLS tiêu chuẩn ngân hàng' },
        { icon: Eye, title: 'Không theo dõi', description: 'Không bán dữ liệu cho bên thứ ba' },
        { icon: Database, title: 'Quyền kiểm soát', description: 'Bạn có toàn quyền với dữ liệu của mình' },
        { icon: Bell, title: 'Thông báo minh bạch', description: 'Luôn cập nhật về thay đổi chính sách' },
    ];

    const sections = [
        {
            title: '1. Thông tin chúng tôi thu thập',
            content: `
**Thông tin bạn cung cấp:**
• Thông tin đăng ký: tên, email, mật khẩu
• Thông tin hồ sơ: ảnh đại diện, tiểu sử, liên kết mạng xã hội
• Thông tin thanh toán: được xử lý an toàn qua cổng thanh toán của bên thứ ba
• Nội dung bạn tạo: bình luận, đánh giá, câu hỏi

**Thông tin tự động thu thập:**
• Thông tin thiết bị: loại thiết bị, hệ điều hành, trình duyệt
• Thông tin sử dụng: trang đã xem, thời gian học, tiến độ khóa học
• Địa chỉ IP và vị trí địa lý (ở cấp quốc gia/thành phố)
• Cookie và công nghệ tương tự`,
        },
        {
            title: '2. Cách chúng tôi sử dụng thông tin',
            content: `
Chúng tôi sử dụng thông tin của bạn để:
• Cung cấp và cải thiện dịch vụ
• Cá nhân hóa trải nghiệm học tập và đề xuất khóa học phù hợp
• Xử lý thanh toán và giao dịch
• Gửi thông báo quan trọng về tài khoản và khóa học
• Gửi bản tin và thông tin khuyến mãi (nếu bạn đăng ký)
• Phân tích và cải thiện chất lượng dịch vụ
• Phát hiện và ngăn chặn gian lận, lạm dụng
• Tuân thủ các yêu cầu pháp lý`,
        },
        {
            title: '3. Chia sẻ thông tin',
            content: `
**Chúng tôi KHÔNG:**
• Bán thông tin cá nhân của bạn
• Chia sẻ thông tin với bên thứ ba cho mục đích quảng cáo

**Chúng tôi có thể chia sẻ thông tin với:**
• Nhà cung cấp dịch vụ: xử lý thanh toán, hosting, phân tích (họ chỉ được sử dụng thông tin để cung cấp dịch vụ cho chúng tôi)
• Giảng viên: tên và tiến độ học của bạn trong khóa học của họ
• Cơ quan pháp luật: khi được yêu cầu theo quy định pháp luật
• Đối tác kinh doanh: trong trường hợp sáp nhập, mua lại (với thông báo trước)`,
        },
        {
            title: '4. Bảo mật dữ liệu',
            content: `
Chúng tôi áp dụng các biện pháp bảo mật nghiêm ngặt:
• Mã hóa SSL/TLS cho tất cả kết nối
• Mã hóa dữ liệu nhạy cảm khi lưu trữ
• Kiểm tra bảo mật định kỳ
• Kiểm soát truy cập nghiêm ngặt cho nhân viên
• Sao lưu dữ liệu thường xuyên
• Giám sát 24/7 phát hiện xâm nhập

Tuy nhiên, không có phương pháp truyền tải qua Internet hoặc lưu trữ điện tử nào an toàn 100%. Chúng tôi khuyến khích bạn sử dụng mật khẩu mạnh và bật xác thực 2 lớp.`,
        },
        {
            title: '5. Cookie và công nghệ theo dõi',
            content: `
**Cookie cần thiết:**
• Duy trì phiên đăng nhập
• Ghi nhớ tùy chọn của bạn
• Đảm bảo bảo mật

**Cookie phân tích (có thể từ chối):**
• Hiểu cách bạn sử dụng trang web
• Cải thiện trải nghiệm người dùng

**Cookie quảng cáo (có thể từ chối):**
• Hiển thị quảng cáo phù hợp
• Đo lường hiệu quả quảng cáo

Bạn có thể quản lý cookie trong cài đặt trình duyệt hoặc qua banner cookie của chúng tôi.`,
        },
        {
            title: '6. Quyền của bạn',
            content: `
Bạn có quyền:
• **Truy cập**: Yêu cầu bản sao thông tin cá nhân của bạn
• **Chỉnh sửa**: Cập nhật hoặc sửa thông tin không chính xác
• **Xóa**: Yêu cầu xóa tài khoản và dữ liệu của bạn
• **Hạn chế**: Yêu cầu hạn chế xử lý dữ liệu
• **Di chuyển**: Nhận dữ liệu của bạn ở định dạng có thể đọc được
• **Phản đối**: Phản đối một số loại xử lý dữ liệu
• **Rút lại đồng ý**: Rút lại đồng ý bất cứ lúc nào

Để thực hiện quyền của bạn, liên hệ: privacy@elearning.vn`,
        },
        {
            title: '7. Lưu giữ dữ liệu',
            content: `
• Thông tin tài khoản: Lưu giữ trong suốt thời gian tài khoản hoạt động
• Sau khi xóa tài khoản: Dữ liệu sẽ được xóa trong vòng 30 ngày, ngoại trừ:
  - Hồ sơ giao dịch (theo yêu cầu pháp luật kế toán)
  - Dữ liệu cần thiết để giải quyết tranh chấp
• Dữ liệu phân tích ẩn danh có thể được lưu giữ lâu hơn`,
        },
        {
            title: '8. Bảo vệ trẻ em',
            content: `
• E-Learning không dành cho trẻ em dưới 13 tuổi
• Người dùng từ 13-16 tuổi cần có sự đồng ý của phụ huynh
• Nếu phát hiện đã vô tình thu thập thông tin của trẻ dưới 13 tuổi, chúng tôi sẽ xóa ngay lập tức
• Phụ huynh có thể liên hệ để yêu cầu xóa thông tin con em`,
        },
        {
            title: '9. Chuyển giao quốc tế',
            content: `
Dữ liệu của bạn có thể được xử lý tại các máy chủ nằm ngoài Việt Nam. Khi chuyển giao dữ liệu quốc tế, chúng tôi đảm bảo các biện pháp bảo vệ thích hợp theo quy định pháp luật.`,
        },
        {
            title: '10. Thay đổi chính sách',
            content: `
• Chúng tôi có thể cập nhật chính sách này định kỳ
• Thay đổi quan trọng sẽ được thông báo qua email
• Ngày cập nhật cuối cùng luôn hiển thị ở đầu trang
• Tiếp tục sử dụng dịch vụ sau thay đổi đồng nghĩa bạn chấp nhận chính sách mới`,
        },
        {
            title: '11. Liên hệ',
            content: `
Nếu có câu hỏi về chính sách bảo mật, vui lòng liên hệ:

**Bộ phận Bảo mật Dữ liệu**
• Email: privacy@elearning.vn
• Hotline: 1900 1234
• Địa chỉ: 123 Đường ABC, Quận 1, TP. Hồ Chí Minh, Việt Nam

Chúng tôi sẽ phản hồi trong vòng 30 ngày làm việc.`,
        },
    ];

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
            {/* Hero */}
            <section className="py-16 bg-violet-600">
                <div className="container mx-auto px-4 text-center text-white">
                    <Shield className="h-16 w-16 mx-auto mb-6 opacity-80" />
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Chính sách bảo mật</h1>
                    <p className="text-xl text-violet-100 max-w-2xl mx-auto">
                        Chúng tôi cam kết bảo vệ quyền riêng tư của bạn
                    </p>
                </div>
            </section>

            {/* Highlights */}
            <section className="py-12 -mt-8 relative z-10">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
                        {highlights.map((item) => (
                            <Card key={item.title} className="p-6 text-center bg-white dark:bg-zinc-900 shadow-xl">
                                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
                                    <item.icon className="h-6 w-6 text-violet-600 dark:text-violet-400" />
                                </div>
                                <h3 className="font-semibold text-zinc-900 dark:text-white mb-1">{item.title}</h3>
                                <p className="text-sm text-zinc-600 dark:text-zinc-400">{item.description}</p>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="py-16">
                <div className="container mx-auto px-4 max-w-4xl">
                    {/* Last Updated Notice */}
                    <Card className="p-4 mb-8 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
                        <div className="flex items-center gap-3">
                            <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-500" />
                            <p className="text-sm text-blue-800 dark:text-blue-200">
                                Cập nhật lần cuối: <strong>{lastUpdated}</strong>. Vui lòng đọc kỹ để hiểu cách chúng tôi thu thập, sử dụng và bảo vệ thông tin của bạn.
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
                                <div className="text-zinc-600 dark:text-zinc-400 whitespace-pre-line leading-relaxed prose prose-sm dark:prose-invert max-w-none">
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

