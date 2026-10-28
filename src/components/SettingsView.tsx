import React, { useState } from 'react';
import { Customer, Language, PageId } from '../types';
import { Camera, Lock, Globe, ArrowLeft, CheckCircle2 } from 'lucide-react';

interface SettingsViewProps {
  activeCustomer: Customer | null;
  onUpdateAvatar: (avatarDataUrl: string) => void;
  onChangePassword: (oldPass: string, newPass: string) => boolean;
  language: Language;
  onSetLanguage: (lang: Language) => void;
  onNavigate: (page: PageId) => void;
  onToast: (msg: string) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  activeCustomer,
  onUpdateAvatar,
  onChangePassword,
  language,
  onSetLanguage,
  onNavigate,
  onToast,
}) => {
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  const defaultAvatar = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120"><rect width="120" height="120" rx="60" fill="#eaf5ee"/><circle cx="60" cy="43" r="22" fill="#0e563f"/><path d="M20 112c3-25 19-38 40-38s37 13 40 38" fill="#0e563f"/></svg>'
  )}`;

  const handleAvatarFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      onToast('Dung lượng ảnh tối đa 2 MB');
      e.target.value = '';
      return;
    }

    if (!/^image\/(png|jpeg|webp)$/.test(file.type)) {
      onToast('Vui lòng chọn tệp ảnh định dạng PNG, JPG hoặc WebP');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onUpdateAvatar(reader.result);
        onToast('Đã cập nhật ảnh đại diện thành công!');
      }
    };
    reader.readAsDataURL(file);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCustomer) {
      onToast('Vui lòng đăng nhập để đổi mật khẩu');
      return;
    }

    if (currentPass !== activeCustomer.password) {
      onToast('Mật khẩu hiện tại chưa chính xác');
      return;
    }

    if (newPass.length < 6) {
      onToast('Mật khẩu mới cần ít nhất 6 ký tự');
      return;
    }

    if (newPass !== confirmPass) {
      onToast('Xác nhận mật khẩu mới chưa khớp');
      return;
    }

    const ok = onChangePassword(currentPass, newPass);
    if (ok) {
      setCurrentPass('');
      setNewPass('');
      setConfirmPass('');
      onToast('Cập nhật mật khẩu mới thành công!');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-[#15221b] tracking-tight">Cài đặt</h2>
          <p className="text-sm text-[#5e6f66] mt-1">
            Tuỳ chỉnh ảnh đại diện, bảo mật tài khoản và ngôn ngữ ứng dụng Tới Trưa.
          </p>
        </div>
        <span className="self-start sm:self-auto text-xs font-black tracking-wider bg-[#fef6e7] text-[#8c4e06] px-3.5 py-1.5 rounded-full border border-[#fed7aa]">
          CÁ NHÂN HOÁ
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.9fr] gap-6 items-start">
        {/* Main Panel */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#ede4d4] shadow-[0_8px_30px_rgba(14,86,63,0.04)] space-y-6">
          {/* Avatar Section */}
          <div>
            <h3 className="text-lg font-black text-[#15221b] mb-4 flex items-center gap-2">
              <Camera className="w-5 h-5 text-[#0e563f]" />
              <span>Ảnh đại diện</span>
            </h3>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
              <div className="relative group">
                <img
                  src={activeCustomer?.avatar || defaultAvatar}
                  alt="Ảnh đại diện"
                  className="w-24 h-24 rounded-full object-cover bg-[#eaf5ee] border-4 border-white shadow-lg"
                />
              </div>

              <div className="flex-1 text-center sm:text-left space-y-2">
                <div className="font-extrabold text-sm text-[#15221b]">
                  {activeCustomer?.name || 'Ảnh đại diện của bạn'}
                </div>
                <p className="text-xs text-[#5e6f66] leading-relaxed">
                  Chọn ảnh đại diện định dạng JPG, PNG hoặc WebP (tối đa 2MB). Ảnh được lưu an toàn trong bộ nhớ thiết bị.
                </p>

                <label className="inline-block px-4 py-2 rounded-xl bg-[#eaf5ee] hover:bg-[#d8ecdf] text-[#0e563f] font-bold text-xs cursor-pointer transition-colors border border-[#cbe3d4]">
                  <span>Tải ảnh từ máy tính</span>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleAvatarFile}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          <hr className="border-t border-[#ede4d4]" />

          {/* Password Change Form */}
          <div>
            <h3 className="text-lg font-black text-[#15221b] mb-4 flex items-center gap-2">
              <Lock className="w-5 h-5 text-[#0e563f]" />
              <span>Đổi mật khẩu tài khoản</span>
            </h3>

            {activeCustomer ? (
              <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md">
                <div>
                  <label className="block text-xs font-bold text-[#5e6f66] mb-1.5">
                    Mật khẩu hiện tại *
                  </label>
                  <input
                    type="password"
                    required
                    value={currentPass}
                    onChange={(e) => setCurrentPass(e.target.value)}
                    placeholder="Nhập mật khẩu hiện tại"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#ede4d4] focus:border-[#0e563f] text-sm outline-none bg-[#fbf8f1] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#5e6f66] mb-1.5">
                    Mật khẩu mới (ít nhất 6 ký tự) *
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    placeholder="Nhập mật khẩu mới"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#ede4d4] focus:border-[#0e563f] text-sm outline-none bg-[#fbf8f1] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#5e6f66] mb-1.5">
                    Xác nhận lại mật khẩu mới *
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                    placeholder="Nhập lại mật khẩu mới"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#ede4d4] focus:border-[#0e563f] text-sm outline-none bg-[#fbf8f1] focus:bg-white"
                  />
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#0e563f] hover:bg-[#12694d] active:scale-95 text-white font-extrabold text-xs transition-all shadow-sm cursor-pointer"
                >
                  Cập nhật mật khẩu mới
                </button>
              </form>
            ) : (
              <p className="text-xs text-[#5e6f66]">
                Bạn đang ở chế độ Khách. Vui lòng đăng nhập để sử dụng tính năng đổi mật khẩu.
              </p>
            )}
          </div>
        </div>

        {/* Aside Panel */}
        <aside className="bg-white rounded-3xl p-6 border border-[#ede4d4] shadow-[0_8px_30px_rgba(14,86,63,0.04)] space-y-4">
          <h3 className="font-black text-lg text-[#15221b] flex items-center gap-2">
            <Globe className="w-5 h-5 text-[#0e563f]" />
            <span>Ngôn ngữ giao diện</span>
          </h3>

          <p className="text-xs text-[#5e6f66] leading-relaxed">
            Chọn ngôn ngữ hiển thị cho các tiêu đề điều hướng, thực đơn và thông tin dịch vụ.
          </p>

          <div className="space-y-2">
            <label
              onClick={() => onSetLanguage('vi')}
              className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                language === 'vi'
                  ? 'border-[#0e563f] bg-[#eaf5ee] font-bold text-[#0e563f]'
                  : 'border-[#ede4d4] text-[#5e6f66] hover:bg-[#f5efe3]'
              }`}
            >
              <div className="flex items-center gap-2 text-xs">
                <span>🇻🇳</span>
                <span>Tiếng Việt (Mặc định)</span>
              </div>
              {language === 'vi' && <CheckCircle2 className="w-4 h-4 text-[#0e563f]" />}
            </label>

            <label
              onClick={() => onSetLanguage('en')}
              className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                language === 'en'
                  ? 'border-[#0e563f] bg-[#eaf5ee] font-bold text-[#0e563f]'
                  : 'border-[#ede4d4] text-[#5e6f66] hover:bg-[#f5efe3]'
              }`}
            >
              <div className="flex items-center gap-2 text-xs">
                <span>🇬🇧</span>
                <span>English (International)</span>
              </div>
              {language === 'en' && <CheckCircle2 className="w-4 h-4 text-[#0e563f]" />}
            </label>
          </div>

          <div className="p-3.5 rounded-xl bg-[#fbf8f1] border border-[#ede4d4] text-xs text-[#5e6f66] leading-relaxed">
            Cài đặt được lưu trong trình duyệt hiện tại để ghi nhớ tùy chọn của bạn trong các lần ghé thăm tiếp theo.
          </div>

          <button
            type="button"
            onClick={() => onNavigate('account')}
            className="w-full py-2.5 rounded-xl border border-[#ede4d4] hover:border-[#0e563f] hover:text-[#0e563f] text-[#5e6f66] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Quay lại trang tài khoản</span>
          </button>
        </aside>
      </div>
    </div>
  );
};

