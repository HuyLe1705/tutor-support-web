// page.tsx
'use client';
import { useState, useEffect } from 'react';

interface StudentData {
    personalInfo: {
        studentId: string;
        lastName: string;
        firstName: string;
        dateOfBirth: string;
        gender: string;
        idNumber: string;
        idIssueDate: string;
        idIssuePlace: string;
    };
    contactInfo: {
        phone: string;
        studentEmail: string;
        contactEmail: string;
        backupEmail: string;
    };
    educationInfo: {
        faculty: string;
        managementUnit: string;
        classCode: string;
        enrollmentDate: string;
        curriculumYear: string;
        extensionSemesters: string;
        reducedSemesters: string;
        standardSemesters: string;
        maxSemesters: string;
        startingSemester: string;
        standardEndSemester: string;
        maxEndSemester: string;
        standardGraduationDate: string;
        maxGraduationDate: string;
        degreeLevel: string;
        trainingSystem: string;
        major: string;
        trainingType: string;
        program: string;
        campus: string;
        location: string;
        session: string;
        status: string;
    };
    graduationInfo: {
        major: string;
        academicYear: string;
        decisionNumber: string;
        decisionDate: string;
    };
    accountInfo: {
        bknetAccount: string;
        bankAccountNumber: string;
        bankName: string;
        ocbCif: string;
    };
    otherInfo: {
        notes: string;
    };
}

const StudentProfilePage = () => {
    const [studentData, setStudentData] = useState<StudentData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // import thay fetch api 
                const module = await import('../../../../data/sampleProfile.json');
                const data = module.default as StudentData;
                setStudentData(data);
            } catch (error) {
                console.error('Error loading student data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-lg">Đang tải...</div>
            </div>
        );
    }

    if (!studentData) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-lg text-red-600">Không thể tải dữ liệu sinh viên</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto bg-white shadow-lg">
                {/* Header */}
                <div className="px-6 py-2 text-right text-xs text-gray-500 border-b">
                    Thời điểm cập nhật gần nhất: 27/08/2023 08:17:07
                </div>

                {/* Personal Information Section */}
                <div className="bg-[#00c0ef] text-white px-6 py-2 mb-6 font-semibold">
                    Thông tin cá nhân
                </div>

                <div className="grid grid-cols-5 gap-x-8 gap-y-4 px-6 pb-6">
                    <div>
                        <img src="/Image/rr.png" alt="Avatar" className="w-24 h-24 rounded-full mb-4" />
                    </div>
                    <div>
                        <div className="font-semibold text-sm mb-1">Mã số sinh viên</div>
                        <div className="text-sm">{studentData.personalInfo.studentId}</div>
                    </div>

                    <div>
                        <div className="font-semibold text-sm mb-1">Họ và tên lót</div>
                        <div className="text-sm">{studentData.personalInfo.lastName}</div>
                    </div>

                    <div>
                        <div className="font-semibold text-sm mb-1">Tên</div>
                        <div className="text-sm">{studentData.personalInfo.firstName}</div>
                    </div>

                    <div>
                        <div className="font-semibold text-sm mb-1">Ngày sinh</div>
                        <div className="text-sm">{studentData.personalInfo.dateOfBirth}</div>
                    </div>

                    <div>
                        <div className="font-semibold text-sm mb-1">Giới tính</div>
                        <div className="text-sm">{studentData.personalInfo.gender}</div>
                    </div>

                    <div>
                        <div className="font-semibold text-sm mb-1">Số CMND</div>
                        <div className="text-sm">{studentData.personalInfo.idNumber}</div>
                    </div>

                    <div>
                        <div className="font-semibold text-sm mb-1">Ngày cấp CMND</div>
                        <div className="text-sm">{studentData.personalInfo.idIssueDate}</div>
                    </div>

                    <div>
                        <div className="font-semibold text-sm mb-1">Nơi cấp CMND</div>
                        <div className="text-sm">{studentData.personalInfo.idIssuePlace}</div>
                    </div>
                </div>

                {/* Contact Information Section */}
                <div className="bg-[#00c0ef] text-white px-6 py-2 font-semibold">
                    Thông tin liên lạc
                </div>

                <div className="grid grid-cols-4 gap-x-8 gap-y-4 p-6">
                    <div>
                        <div className="font-semibold text-sm mb-1">Số điện thoại</div>
                        <div className="text-sm">{studentData.contactInfo.phone}</div>
                    </div>

                    <div>
                        <div className="font-semibold text-sm mb-1">Email sinh viên</div>
                        <div className="text-sm">{studentData.contactInfo.studentEmail}</div>
                    </div>

                    <div>
                        <div className="font-semibold text-sm mb-1">Email liên lạc</div>
                        <div className="text-sm">{studentData.contactInfo.contactEmail}</div>
                    </div>

                    <div>
                        <div className="font-semibold text-sm mb-1">Email dự phòng</div>
                        <div className="text-sm">{studentData.contactInfo.backupEmail}</div>
                    </div>
                </div>

                {/* Education Information Section */}
                <div className="bg-[#00c0ef] text-white px-6 py-2 font-semibold">
                    Thông tin đào tạo
                </div>

                <div className="grid grid-cols-4 gap-x-8 gap-y-4 p-6">
                    <div>
                        <div className="font-semibold text-sm mb-1">Khoa</div>
                        <div className="text-sm">{studentData.educationInfo.faculty}</div>
                    </div>

                    <div>
                        <div className="font-semibold text-sm mb-1">Đơn vị quản lý</div>
                        <div className="text-sm">{studentData.educationInfo.managementUnit}</div>
                    </div>

                    <div>
                        <div className="font-semibold text-sm mb-1">Mã lớp</div>
                        <div className="text-sm">{studentData.educationInfo.classCode}</div>
                    </div>

                    <div>
                        <div className="font-semibold text-sm mb-1">Thời điểm nhập học</div>
                        <div className="text-sm">{studentData.educationInfo.enrollmentDate}</div>
                    </div>

                    <div>
                        <div className="font-semibold text-sm mb-1">Năm CTĐT</div>
                        <div className="text-sm">{studentData.educationInfo.curriculumYear}</div>
                    </div>

                    <div>
                        <div className="font-semibold text-sm mb-1">Số học kỳ gia hạn</div>
                        <div className="text-sm">{studentData.educationInfo.extensionSemesters}</div>
                    </div>

                    <div>
                        <div className="font-semibold text-sm mb-1">Số học kỳ giảm</div>
                        <div className="text-sm">{studentData.educationInfo.reducedSemesters}</div>
                    </div>

                    <div>
                        <div className="font-semibold text-sm mb-1">Số HK đào tạo (chuẩn)</div>
                        <div className="text-sm">{studentData.educationInfo.standardSemesters}</div>
                    </div>

                    <div>
                        <div className="font-semibold text-sm mb-1">Số HK đào tạo (tối đa)</div>
                        <div className="text-sm">{studentData.educationInfo.maxSemesters}</div>
                    </div>

                    <div>
                        <div className="font-semibold text-sm mb-1">HK bắt đầu</div>
                        <div className="text-sm">{studentData.educationInfo.startingSemester}</div>
                    </div>

                    <div>
                        <div className="font-semibold text-sm mb-1">Đào tạo đến HK (chuẩn)</div>
                        <div className="text-sm">{studentData.educationInfo.standardEndSemester}</div>
                    </div>

                    <div>
                        <div className="font-semibold text-sm mb-1">Đào tạo đến HK (tối đa)</div>
                        <div className="text-sm">{studentData.educationInfo.maxEndSemester}</div>
                    </div>

                    <div>
                        <div className="font-semibold text-sm mb-1">Thời điểm tốt nghiệp (chuẩn)</div>
                        <div className="text-sm">{studentData.educationInfo.standardGraduationDate}</div>
                    </div>

                    <div>
                        <div className="font-semibold text-sm mb-1">Thời điểm tốt nghiệp (tối đa)</div>
                        <div className="text-sm">{studentData.educationInfo.maxGraduationDate}</div>
                    </div>

                    <div>
                        <div className="font-semibold text-sm mb-1">Bậc đào tạo</div>
                        <div className="text-sm">{studentData.educationInfo.degreeLevel}</div>
                    </div>

                    <div>
                        <div className="font-semibold text-sm mb-1">Hệ đào tạo</div>
                        <div className="text-sm">{studentData.educationInfo.trainingSystem}</div>
                    </div>

                    <div className="col-span-2">
                        <div className="font-semibold text-sm mb-1">Ngành đào tạo</div>
                        <div className="text-sm">{studentData.educationInfo.major}</div>
                    </div>

                    <div>
                        <div className="font-semibold text-sm mb-1">Loại hình đào tạo</div>
                        <div className="text-sm">{studentData.educationInfo.trainingType}</div>
                    </div>

                    <div>
                        <div className="font-semibold text-sm mb-1">Chương trình</div>
                        <div className="text-sm">{studentData.educationInfo.program}</div>
                    </div>

                    <div className="col-span-2">
                        <div className="font-semibold text-sm mb-1">Đào tạo ở Cơ sở</div>
                        <div className="text-sm">{studentData.educationInfo.campus}</div>
                    </div>

                    <div>
                        <div className="font-semibold text-sm mb-1">Đào tạo ở Địa phương</div>
                        <div className="text-sm">{studentData.educationInfo.location}</div>
                    </div>

                    <div>
                        <div className="font-semibold text-sm mb-1">Buổi đào tạo</div>
                        <div className="text-sm">{studentData.educationInfo.session}</div>
                    </div>

                    <div>
                        <div className="font-semibold text-sm mb-1">Tình trạng sinh viên</div>
                        <div className="text-sm">{studentData.educationInfo.status}</div>
                    </div>
                </div>

                {/* Graduation Information Section */}
                <div className="bg-[#00c0ef] text-white px-6 py-2 font-semibold">
                    Thông tin tốt nghiệp
                </div>

                <div className="grid grid-cols-4 gap-x-8 gap-y-4 p-6">
                    <div>
                        <div className="font-semibold text-sm mb-1">Ngành</div>
                        <div className="text-sm">{studentData.graduationInfo.major}</div>
                    </div>

                    <div>
                        <div className="font-semibold text-sm mb-1">Năm học, học kỳ</div>
                        <div className="text-sm">{studentData.graduationInfo.academicYear}</div>
                    </div>

                    <div>
                        <div className="font-semibold text-sm mb-1">Số quyết định</div>
                        <div className="text-sm">{studentData.graduationInfo.decisionNumber}</div>
                    </div>

                    <div>
                        <div className="font-semibold text-sm mb-1">Ngày quyết định</div>
                        <div className="text-sm">{studentData.graduationInfo.decisionDate}</div>
                    </div>
                </div>

                {/* Account Information Section */}
                <div className="bg-[#00c0ef] text-white px-6 py-2 font-semibold">
                    Thông tin tài khoản
                </div>

                <div className="grid grid-cols-4 gap-x-8 gap-y-4 p-6">
                    <div>
                        <div className="font-semibold text-sm mb-1">Tài khoản BKNET</div>
                        <div className="text-sm">{studentData.accountInfo.bknetAccount}</div>
                    </div>

                    <div>
                        <div className="font-semibold text-sm mb-1">Số tài khoản ngân hàng</div>
                        <div className="text-sm">{studentData.accountInfo.bankAccountNumber}</div>
                    </div>
                    Chỉnh sửa nội dụng
                    <div>
                        <div className="font-semibold text-sm mb-1">Tên ngân hàng</div>
                        <div className="text-sm">{studentData.accountInfo.bankName}</div>
                    </div>

                    <div>
                        <div className="font-semibold text-sm mb-1">OCB CIF</div>
                        <div className="text-sm">{studentData.accountInfo.ocbCif}</div>
                    </div>
                </div>

                {/* Other Information Section */}
                <div className="bg-[#00c0ef] text-white px-6 py-2 font-semibold">
                    Thông tin khác
                </div>

                <div className="p-6">
                    <div>
                        <div className="font-semibold text-sm mb-1">Ghi chú</div>
                        <div className="text-sm">{studentData.otherInfo.notes}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentProfilePage;