'use client';
import { useState } from 'react';

export default function StudentRegistrationPage() {
    const [formData, setFormData] = useState({
        fullName: '',
        studentId: '',
        birthDate: '',
        birthPlace: '',
        sessionCode: '',
        phone: '',
        email: '',
        registrationType: '',
        registrationPeriod: '',
        registrationStatus: '',
        fee: '',
        notes: ''
    });

    const [payments, setPayments] = useState([]);
    const [violations, setViolations] = useState([]);
    const [results, setResults] = useState([]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = () => {
        // Validate required fields
        if (!formData.fullName || !formData.studentId || !formData.birthDate ||
            !formData.birthPlace || !formData.sessionCode || !formData.phone || !formData.email) {
            alert('Đăng ký thất bại!\n\nVui lòng điền đầy đủ thông tin bắt buộc.');
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            alert('Đăng ký thất bại!\n\nEmail không đúng định dạng.');
            return;
        }

        // Validate phone number (basic check)
        if (formData.phone.length < 10) {
            alert('Đăng ký thất bại!\n\nSố điện thoại không hợp lệ.');
            return;
        }

        // Success
        console.log('Form submitted:', formData);
        alert('Xác nhận đăng ký thành công!\n\nThông tin của bạn đã được ghi nhận.');
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg">
                {/* Header */}
                <div className="bg-[#00c0ef] text-white p-4 rounded-t-lg">
                    <h1 className="text-2xl font-bold">Sinh viên</h1>
                    <p className="text-sm opacity-90">Chương trình tutor-mentee</p>
                </div>

                {/* Main Content */}
                <div className="p-6">
                    <div className="bg-blue-500 text-white px-4 py-2 rounded mb-6 inline-block">
                        Đăng ký tham gia chương trình
                    </div>

                    {/* Step 1: Registration Information */}
                    <div className="mb-8">
                        <div className="flex items-center mb-4">
                            <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold mr-3">
                                1
                            </div>
                            <h2 className="text-lg font-bold">Nhập thông tin đăng ký</h2>
                        </div>

                        <div className="ml-11 space-y-4">
                            {/* Registration Type Dropdown */}
                            <div className="bg-gray-50 p-4 rounded">
                                <div className="flex justify-between items-center">
                                    <div className="space-y-2">
                                        <div className="flex items-center">
                                            <span className="font-medium mr-4">Đợt đăng ký</span>
                                            <span className="text-gray-600">...</span>
                                        </div>
                                        <div className="flex items-center">
                                            <span className="font-medium mr-4">Mã đợt</span>
                                            <span className="text-gray-600">...</span>
                                        </div>
                                        <div className="flex items-center">
                                            <span className="font-medium mr-4">Thời gian đăng ký</span>
                                            <span className="text-gray-600">...</span>
                                        </div>
                                        <div className="flex items-center">
                                            <span className="font-medium mr-4">Tình trạng đăng ký</span>
                                            <span className="text-green-600 font-medium">Không tìm thấy đợt đăng ký</span>
                                        </div>
                                        <div className="flex items-center">
                                            <span className="font-medium mr-4">Lệ phí</span>
                                            <span className="text-gray-600">...</span>
                                        </div>
                                        <div className="flex items-center">
                                            <span className="font-medium mr-4">Ghi chú</span>
                                            <span className="text-gray-600">...</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Personal Information Form */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Họ và tên</label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Mã sinh viên</label>
                                    <input
                                        type="text"
                                        name="studentId"
                                        value={formData.studentId}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Ngày sinh</label>
                                    <input
                                        type="date"
                                        name="birthDate"
                                        value={formData.birthDate}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Nơi sinh</label>
                                    <input
                                        type="text"
                                        name="birthPlace"
                                        value={formData.birthPlace}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Mã Phiên</label>
                                    <input
                                        type="text"
                                        name="sessionCode"
                                        value={formData.sessionCode}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Điện thoại</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            {/* Submit Button */}

                            <button
                                onClick={handleSubmit}
                                className="bg-blue-400 text-white px-6 py-2 rounded hover:bg-blue-500 transition-colors"
                            >
                                Xác nhận đăng ký
                            </button>
                        </div>
                    </div>

                    {/* Step 2: Payment Voucher */}
                    <div className="mb-8">
                        <div className="flex items-center mb-4">
                            <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold mr-3">
                                2
                            </div>
                            <h2 className="text-lg font-bold">Phiếu đóng chờ thanh toán</h2>
                        </div>

                        <div className="ml-11">
                            <table className="w-full border-collapse border border-gray-300">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="border border-gray-300 px-4 py-2 text-left">#</th>
                                        <th className="border border-gray-300 px-4 py-2 text-left">Mã phiếu</th>
                                        <th className="border border-gray-300 px-4 py-2 text-left">Nội dung</th>
                                        <th className="border border-gray-300 px-4 py-2 text-left">Tình trạng</th>
                                        <th className="border border-gray-300 px-4 py-2 text-left">Ngày đăng ký</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {payments.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="border border-gray-300 px-4 py-8 text-center text-gray-500">
                                                Không có dữ liệu
                                            </td>
                                        </tr>
                                    ) : (
                                        payments.map((payment, index) => (
                                            <tr key={index}>
                                                <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                                                <td className="border border-gray-300 px-4 py-2">{payment.code}</td>
                                                <td className="border border-gray-300 px-4 py-2">{payment.content}</td>
                                                <td className="border border-gray-300 px-4 py-2">{payment.status}</td>
                                                <td className="border border-gray-300 px-4 py-2">{payment.date}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Step 3: Violation Voucher */}
                    <div className="mb-8">
                        <div className="flex items-center mb-4">
                            <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold mr-3">
                                3
                            </div>
                            <h2 className="text-lg font-bold">Phiếu đáng chờ xử lý</h2>
                        </div>

                        <div className="ml-11">
                            <table className="w-full border-collapse border border-gray-300">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="border border-gray-300 px-4 py-2 text-left">#</th>
                                        <th className="border border-gray-300 px-4 py-2 text-left">Mã phiếu</th>
                                        <th className="border border-gray-300 px-4 py-2 text-left">Nội dung</th>
                                        <th className="border border-gray-300 px-4 py-2 text-left">Tình trạng</th>
                                        <th className="border border-gray-300 px-4 py-2 text-left">Ngày đăng ký</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {violations.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="border border-gray-300 px-4 py-8 text-center text-gray-500">
                                                Không có dữ liệu
                                            </td>
                                        </tr>
                                    ) : (
                                        violations.map((violation, index) => (
                                            <tr key={index}>
                                                <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                                                <td className="border border-gray-300 px-4 py-2">{violation.code}</td>
                                                <td className="border border-gray-300 px-4 py-2">{violation.content}</td>
                                                <td className="border border-gray-300 px-4 py-2">{violation.status}</td>
                                                <td className="border border-gray-300 px-4 py-2">{violation.date}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Step 4: Results */}
                    <div className="mb-8">
                        <div className="flex items-center mb-4">
                            <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold mr-3">
                                4
                            </div>
                            <h2 className="text-lg font-bold">Nhận kết quả đăng ký</h2>
                        </div>

                        <div className="ml-11">
                            <table className="w-full border-collapse border border-gray-300">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="border border-gray-300 px-4 py-2 text-left">#</th>
                                        <th className="border border-gray-300 px-4 py-2 text-left">Mã phiếu</th>
                                        <th className="border border-gray-300 px-4 py-2 text-left">Nội dung</th>
                                        <th className="border border-gray-300 px-4 py-2 text-left">Tình trạng</th>
                                        <th className="border border-gray-300 px-4 py-2 text-left">Ngày trả kết quả</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {results.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="border border-gray-300 px-4 py-8 text-center text-gray-500">
                                                Không có dữ liệu
                                            </td>
                                        </tr>
                                    ) : (
                                        results.map((result, index) => (
                                            <tr key={index}>
                                                <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                                                <td className="border border-gray-300 px-4 py-2">{result.code}</td>
                                                <td className="border border-gray-300 px-4 py-2">{result.content}</td>
                                                <td className="border border-gray-300 px-4 py-2">{result.status}</td>
                                                <td className="border border-gray-300 px-4 py-2">{result.date}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}