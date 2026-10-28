import React, { useState } from 'react';
import { BrandLogo } from './BrandLogo';
import { Customer } from '../types';
import { Calendar, Ticket, Bike, ArrowRight, UserCheck, ShieldCheck } from 'lucide-react';

interface AuthGateProps {
  onLoginSuccess: (customer: Customer, remember: boolean) => void;
  onContinueAsGuest: () => void;
  existingCustomers: Customer[];
  onToast: (msg: string) => void;
}

export const AuthGate: React.FC<AuthGateProps> = ({
  onLoginSuccess,
  onContinueAsGuest,
  existingCustomers,
  onToast,
}) => {
  const [tab, setTab] = useState<'login' | 'register'>('login');

  // Login form
  const [loginIdentity, setLoginIdentity] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberLogin, setRememberLogin] = useState(true);

  // Register form
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirm, setRegConfirm] = useState('');
  const [rememberRegister, setRememberRegister] = useState(true);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const idClean = loginIdentity.trim().toLowerCase();
    const user = existingCustomers.find(
      (c) =>
        (c.email.toLowerCase() === idClean || c.phone.trim().toLowerCase() === idClean) &&
        c.password === loginPassword
    );

    if (!user) {
      onToast('Email / Số điện thoại hoặc mật khẩu chưa chính xác');
      return;
    }

    if (!user.memberCode) {
      user.memberCode = 'TTTV-' + Math.random().toString(36).slice(2, 7).toUpperCase();
    }

    onLoginSuccess(user, rememberLogin);
    onToast(`Chào mừng trở lại, ${user.name}! 👋`);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (regPassword !== regConfirm) {
      onToast('Mật khẩu nhập lại chưa khớp');
      return;
    }

    const emailClean = regEmail.trim().toLowerCase();
    const phoneClean = regPhone.trim();

    if (
      existingCustomers.some(
        (c) => c.email.toLowerCase() === emailClean || c.phone === phoneClean
      )
    ) {
      onToast('Email hoặc số điện thoại đã được đăng ký');
      return;
    }

    const newCustomer: Customer = {
      id: 'KH' + Date.now().toString().slice(-6),
      memberCode: 'TTTV-' + Math.random().toString(36).slice(2, 7).toUpperCase(),
      name: regName.trim(),
      email: emailClean,
      phone: phoneClean,
      password: regPassword,
      address: '',
    };

    onLoginSuccess(newCustomer, rememberRegister);
    onToast(`Đăng ký thành công! Mã thành viên của bạn là ${newCustomer.memberCode} ✨`);
  };

  return (
    <section className="min-h-screen grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] bg-[#fbf8f1] text-[#15221b]">
      {/* Visual side */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#093c2b] via-[#0e563f] to-[#147250] text-white p-8 sm:p-12 lg:p-16 flex flex-col justify-between">
        {/* Subtle decorative circles & warm golden glow */}
        <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full border border-white/10 pointer-events-none" />
        <div className="absolute -right-12 top-28 w-72 h-72 rounded-full border border-white/15 pointer-events-none" />
        <div className="absolute right-10 bottom-20 w-80 h-80 rounded-full bg-[#f59e0b]/20 blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <BrandLogo whiteText size="lg" />
        </div>

        <div className="relative z-10 my-10 max-w-lg">
          <div className="text-xs uppercase tracking-widest font-extrabold text-[#fde68a] mb-3 inline-flex items-center gap-2 bg-black/25 px-3.5 py-1.5 rounded-full backdrop-blur-xs border border-white/15">
            <span>✨</span>
            <span>Đặt trước thông minh · Giao nóng đúng giờ</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-[1.12] mb-5">
            Buổi trưa chưa tới,
            <br />
            <span className="text-[#f59e0b]">cơm đã tới rồi!</span>
          </h1>
          <p className="text-[#d8eae0] text-base leading-relaxed">
            Đặt trước thật dễ dàng. Bữa trưa nóng hổi, chuẩn vị gia đình được Tới Trưa chuẩn bị chu đáo và giao tận nơi đúng giờ hẹn 09:00 - 11:30 mỗi ngày.
          </p>
        </div>

        <div className="relative z-10 space-y-3.5 max-w-md">
          <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-[#f59e0b]">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm">Thực đơn công bố trước 3 ngày</div>
              <div className="text-xs text-[#cce9d8]">Chủ động lên lịch ăn uống lành mạnh cả tuần</div>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-[#f59e0b]">
              <Ticket className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm">Mã thành viên riêng & Quản lý thẻ ăn</div>
              <div className="text-xs text-[#cce9d8]">Giảm ngay 20% mỗi phần cơm khi dùng gói suất ăn</div>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-[#f59e0b]">
              <Bike className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm">Chủ động đặt cơm, giao đúng khung giờ</div>
              <div className="text-xs text-[#cce9d8]">Miễn phí giao hàng nội thành TP. Hồ Chí Minh</div>
            </div>
          </div>
        </div>
      </div>

      {/* Form side */}
      <div className="flex items-center justify-center p-6 sm:p-10 lg:p-14">
        <div className="w-full max-w-[450px] bg-white rounded-3xl p-7 sm:p-9 border border-[#ede4d4] shadow-[0_18px_50px_rgba(14,86,63,0.06)]">
          {/* Tabs */}
          <div className="grid grid-cols-2 p-1 bg-[#ede8dc] rounded-xl mb-6">
            <button
              type="button"
              onClick={() => setTab('login')}
              className={`py-2 text-sm font-bold rounded-lg transition-all cursor-pointer ${
                tab === 'login'
                  ? 'bg-white text-[#0e563f] shadow-sm'
                  : 'text-[#5e6f66] hover:text-[#15221b]'
              }`}
            >
              Đăng nhập
            </button>
            <button
              type="button"
              onClick={() => setTab('register')}
              className={`py-2 text-sm font-bold rounded-lg transition-all cursor-pointer ${
                tab === 'register'
                  ? 'bg-white text-[#0e563f] shadow-sm'
                  : 'text-[#5e6f66] hover:text-[#15221b]'
              }`}
            >
              Đăng ký
            </button>
          </div>

          {tab === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <h2 className="text-2xl font-black text-[#15221b] tracking-tight">Chào mừng trở lại 👋</h2>
                <p className="text-xs text-[#5e6f66] mt-1">Đăng nhập để tiếp tục đặt bữa trưa ngon miệng.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5e6f66] mb-1.5">
                  Email hoặc số điện thoại
                </label>
                <input
                  type="text"
                  autoComplete="username"
                  required
                  value={loginIdentity}
                  onChange={(e) => setLoginIdentity(e.target.value)}
                  placeholder="email@example.com hoặc số điện thoại"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#ede4d4] focus:border-[#0e563f] focus:ring-2 focus:ring-[#0e563f]/20 outline-none text-sm transition-all bg-[#fbf8f1] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5e6f66] mb-1.5">
                  Mật khẩu
                </label>
                <input
                  type="password"
                  autoComplete="current-password"
                  required
                  minLength={6}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Nhập mật khẩu (ít nhất 6 ký tự)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#ede4d4] focus:border-[#0e563f] focus:ring-2 focus:ring-[#0e563f]/20 outline-none text-sm transition-all bg-[#fbf8f1] focus:bg-white"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="rememberLoginCheckbox"
                  checked={rememberLogin}
                  onChange={(e) => setRememberLogin(e.target.checked)}
                  className="w-4 h-4 rounded text-[#0e563f] accent-[#0e563f] cursor-pointer"
                />
                <label htmlFor="rememberLoginCheckbox" className="text-xs text-[#5e6f66] select-none cursor-pointer">
                  Ghi nhớ đăng nhập trên thiết bị này
                </label>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-3 px-4 rounded-xl bg-[#0e563f] hover:bg-[#12694d] active:scale-[0.99] text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-md shadow-[#0e563f]/20 transition-all cursor-pointer"
              >
                <span>Đăng nhập và vào trang chủ</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div>
                <h2 className="text-2xl font-black text-[#15221b] tracking-tight">Tạo tài khoản mới ✨</h2>
                <p className="text-xs text-[#5e6f66] mt-1">Đăng ký để nhận mã thành viên và ưu đãi suất ăn.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5e6f66] mb-1">
                  Họ và tên
                </label>
                <input
                  type="text"
                  autoComplete="name"
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="Nguyễn Văn An"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#ede4d4] focus:border-[#0e563f] focus:ring-2 focus:ring-[#0e563f]/20 outline-none text-sm bg-[#fbf8f1] focus:bg-white transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#5e6f66] mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    autoComplete="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#ede4d4] focus:border-[#0e563f] focus:ring-2 focus:ring-[#0e563f]/20 outline-none text-sm bg-[#fbf8f1] focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#5e6f66] mb-1">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    required
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="09xx xxx xxx"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#ede4d4] focus:border-[#0e563f] focus:ring-2 focus:ring-[#0e563f]/20 outline-none text-sm bg-[#fbf8f1] focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5e6f66] mb-1">
                  Mật khẩu (ít nhất 6 ký tự)
                </label>
                <input
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={6}
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Tạo mật khẩu an toàn"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#ede4d4] focus:border-[#0e563f] focus:ring-2 focus:ring-[#0e563f]/20 outline-none text-sm bg-[#fbf8f1] focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5e6f66] mb-1">
                  Nhập lại mật khẩu
                </label>
                <input
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={6}
                  value={regConfirm}
                  onChange={(e) => setRegConfirm(e.target.value)}
                  placeholder="Xác nhận lại mật khẩu"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#ede4d4] focus:border-[#0e563f] focus:ring-2 focus:ring-[#0e563f]/20 outline-none text-sm bg-[#fbf8f1] focus:bg-white transition-all"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="rememberRegisterCheckbox"
                  checked={rememberRegister}
                  onChange={(e) => setRememberRegister(e.target.checked)}
                  className="w-4 h-4 rounded text-[#0e563f] accent-[#0e563f] cursor-pointer"
                />
                <label htmlFor="rememberRegisterCheckbox" className="text-xs text-[#5e6f66] select-none cursor-pointer">
                  Ghi nhớ đăng nhập trên thiết bị này
                </label>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-3 px-4 rounded-xl bg-[#0e563f] hover:bg-[#12694d] active:scale-[0.99] text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-md shadow-[#0e563f]/20 transition-all cursor-pointer"
              >
                <span>Tạo tài khoản và vào trang chủ</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Guest Mode option */}
          <div className="mt-5 pt-4 border-t border-[#ede4d4] text-center space-y-2">
            <button
              type="button"
              onClick={onContinueAsGuest}
              className="text-xs font-bold text-[#0e563f] hover:text-[#12694d] inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Dạo xem thực đơn trước với vai trò Khách</span>
            </button>
            <p className="text-[11px] text-[#5e6f66] leading-relaxed">
              Dữ liệu được lưu trong trình duyệt cục bộ của bạn. An toàn và tiện lợi để trải nghiệm ngay.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

