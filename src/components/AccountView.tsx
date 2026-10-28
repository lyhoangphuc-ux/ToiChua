import React, { useState, useEffect } from 'react';
import { Customer, Order, UserPackage, PageId } from '../types';
import {
  User,
  Ticket,
  Package,
  Save,
  LogOut,
  Mail,
  Phone,
  MapPin,
  Check,
  Shield,
  ArrowRight,
} from 'lucide-react';

interface AccountViewProps {
  activeCustomer: Customer | null;
  orders: Order[];
  packages: UserPackage[];
  onSaveProfile: (updated: Partial<Customer>) => void;
  onLogout: () => void;
  onLogin: (customer: Customer, remember: boolean) => void;
  existingCustomers: Customer[];
  onNavigate: (page: PageId) => void;
  onToast: (msg: string) => void;
}

export const AccountView: React.FC<AccountViewProps> = ({
  activeCustomer,
  orders,
  packages,
  onSaveProfile,
  onLogout,
  onLogin,
  existingCustomers,
  onNavigate,
  onToast,
}) => {
  // Tabs for logged out state
  const [authTab, setAuthTab] = useState<'login' | 'register'>('login');

  // Login form state
  const [loginId, setLoginId] = useState('');
  const [loginPass, setLoginPass] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPass, setRegPass] = useState('');
  const [regConfirm, setRegConfirm] = useState('');

  // Edit profile form state
  const [editName, setEditName] = useState(activeCustomer?.name || '');
  const [editPhone, setEditPhone] = useState(activeCustomer?.phone || '');
  const [editAddress, setEditAddress] = useState(activeCustomer?.address || '');

  useEffect(() => {
    if (activeCustomer) {
      setEditName(activeCustomer.name || '');
      setEditPhone(activeCustomer.phone || '');
      setEditAddress(activeCustomer.address || '');
    }
  }, [activeCustomer]);

  const defaultAvatar = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120"><rect width="120" height="120" rx="60" fill="#eaf5ef"/><circle cx="60" cy="43" r="22" fill="#8ebaa1"/><path d="M20 112c3-25 19-38 40-38s37 13 40 38" fill="#8ebaa1"/></svg>'
  )}`;

  const userOrdersCount = activeCustomer
    ? orders.filter((o) => o.customerId === activeCustomer.id || o.phone === activeCustomer.phone).length
    : 0;

  const userPackagesCount = activeCustomer
    ? packages.filter((p) => p.customerId === activeCustomer.id).length
    : 0;

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim() || !editPhone.trim()) {
      onToast('Vui lòng điền họ tên và số điện thoại');
      return;
    }

    if (
      existingCustomers.some(
        (c) => c.id !== activeCustomer?.id && c.phone === editPhone.trim()
      )
    ) {
      onToast('Số điện thoại này đã được sử dụng bởi tài khoản khác');
      return;
    }

    onSaveProfile({
      name: editName.trim(),
      phone: editPhone.trim(),
      address: editAddress.trim(),
    });
    onToast('Đã lưu cập nhật thông tin tài khoản thành công!');
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const idClean = loginId.trim().toLowerCase();
    const customer = existingCustomers.find(
      (c) =>
        (c.email.toLowerCase() === idClean || c.phone.trim().toLowerCase() === idClean) &&
        c.password === loginPass
    );

    if (!customer) {
      onToast('Thông tin đăng nhập chưa chính xác');
      return;
    }

    if (!customer.memberCode) {
      customer.memberCode = 'TTTV-' + Math.random().toString(36).slice(2, 7).toUpperCase();
    }

    onLogin(customer, true);
    onToast(`Đăng nhập thành công! Xin chào ${customer.name}`);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (regPass !== regConfirm) {
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
      password: regPass,
      address: '',
    };

    onLogin(newCustomer, true);
    onToast(`Tạo tài khoản thành công! Mã thành viên của bạn là ${newCustomer.memberCode}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-[#15221b] tracking-tight">Tài khoản của bạn</h2>
          <p className="text-sm text-[#5e6f66] mt-1">
            Quản lý hồ sơ cá nhân, địa chỉ giao hàng và đặc quyền thành viên Tới Trưa.
          </p>
        </div>
        <span className="self-start sm:self-auto text-xs font-black tracking-wider bg-[#eaf5ee] text-[#0e563f] px-3.5 py-1.5 rounded-full border border-[#cbe3d4]">
          TỚI TRƯA MEMBER
        </span>
      </div>

      {activeCustomer ? (
        /* Logged In View */
        <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.9fr] gap-6 items-start">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#ede4d4] shadow-[0_8px_30px_rgba(14,86,63,0.04)] space-y-6">
            {/* User Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5 border-b border-[#ede4d4] pb-6">
              <img
                src={activeCustomer.avatar || defaultAvatar}
                alt={activeCustomer.name}
                className="w-18 h-18 rounded-2xl object-cover bg-[#eaf5ee] border-2 border-white shadow-md flex-shrink-0"
              />
              <div className="flex-1">
                <span className="text-[10px] font-black tracking-widest text-[#0e563f] uppercase bg-[#eaf5ee] px-2.5 py-0.5 rounded-md inline-block border border-[#cbe3d4]">
                  THÀNH VIÊN CHÍNH THỨC
                </span>
                <h3 className="text-2xl font-black text-[#15221b] mt-1">
                  {activeCustomer.name}
                </h3>
                <div className="text-xs text-[#5e6f66] mt-0.5">
                  {activeCustomer.email} • {activeCustomer.phone}
                </div>
                <div className="text-xs text-[#15221b] mt-2">
                  Mã thành viên: <b className="text-[#0e563f] font-black tracking-wider">{activeCustomer.memberCode}</b>
                </div>
              </div>
            </div>

            {/* Edit details form */}
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <h4 className="font-extrabold text-base text-[#15221b]">
                Chỉnh sửa thông tin nhận hàng
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#5e6f66] mb-1.5">
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#ede4d4] focus:border-[#0e563f] text-sm outline-none bg-[#fbf8f1] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#5e6f66] mb-1.5">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    required
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#ede4d4] focus:border-[#0e563f] text-sm outline-none bg-[#fbf8f1] focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5e6f66] mb-1.5">
                  Địa chỉ giao hàng mặc định
                </label>
                <input
                  type="text"
                  placeholder="Số nhà, tòa nhà, tên đường, phường, quận..."
                  value={editAddress}
                  onChange={(e) => setEditAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#ede4d4] focus:border-[#0e563f] text-sm outline-none bg-[#fbf8f1] focus:bg-white"
                />
                <p className="text-[11px] text-[#5e6f66] mt-1">
                  Địa chỉ này sẽ được tự động điền khi bạn đặt cơm trưa.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#0e563f] hover:bg-[#12694d] active:scale-95 text-white font-extrabold text-xs transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Lưu thông tin</span>
                </button>

                <button
                  type="button"
                  onClick={onLogout}
                  className="px-4 py-2.5 rounded-xl border border-[#ede4d4] hover:bg-[#fff5f5] hover:text-[#c84b42] text-[#5e6f66] font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Đăng xuất</span>
                </button>
              </div>
            </form>
          </div>

          {/* Right Summary */}
          <aside className="bg-white rounded-3xl p-6 border border-[#ede4d4] shadow-[0_8px_30px_rgba(14,86,63,0.04)] space-y-4">
            <h4 className="font-black text-lg text-[#15221b]">Thông tin nhanh</h4>

            <div className="divide-y divide-[#ede4d4] text-xs">
              <div className="py-3 flex justify-between items-center">
                <span className="text-[#5e6f66] flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-[#0e563f]" />
                  <span>Đơn hàng đã đặt</span>
                </span>
                <span className="font-extrabold text-sm text-[#15221b]">
                  {userOrdersCount}
                </span>
              </div>

              <div className="py-3 flex justify-between items-center">
                <span className="text-[#5e6f66] flex items-center gap-1.5">
                  <Ticket className="w-3.5 h-3.5 text-[#0e563f]" />
                  <span>Gói suất ăn đang có</span>
                </span>
                <span className="font-extrabold text-sm text-[#0e563f]">
                  {userPackagesCount}
                </span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={() => onNavigate('orders')}
                className="w-full py-2.5 rounded-xl border border-[#ede4d4] hover:border-[#0e563f] hover:text-[#0e563f] font-bold text-xs transition-colors cursor-pointer text-center"
              >
                Xem lịch sử đơn hàng →
              </button>
              <button
                type="button"
                onClick={() => onNavigate('member')}
                className="w-full py-2.5 rounded-xl border border-[#ede4d4] hover:border-[#0e563f] hover:text-[#0e563f] font-bold text-xs transition-colors cursor-pointer text-center"
              >
                Quản lý gói suất ăn (-20%) →
              </button>
              <button
                type="button"
                onClick={() => onNavigate('settings')}
                className="w-full py-2.5 rounded-xl bg-[#fbf8f1] hover:bg-[#eaf5ee] text-[#15221b] font-bold text-xs transition-colors cursor-pointer text-center border border-[#ede4d4]"
              >
                Cài đặt ảnh đại diện & đổi mật khẩu
              </button>
            </div>
          </aside>
        </div>
      ) : (
        /* Logged Out View */
        <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.9fr] gap-6 items-start">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#ede4d4] shadow-[0_8px_30px_rgba(14,86,63,0.04)]">
            <div className="grid grid-cols-2 p-1 bg-[#ede8dc] rounded-xl mb-6">
              <button
                type="button"
                onClick={() => setAuthTab('login')}
                className={`py-2 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer ${
                  authTab === 'login'
                    ? 'bg-white text-[#0e563f] shadow-sm'
                    : 'text-[#5e6f66]'
                }`}
              >
                Đăng nhập
              </button>
              <button
                type="button"
                onClick={() => setAuthTab('register')}
                className={`py-2 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer ${
                  authTab === 'register'
                    ? 'bg-white text-[#0e563f] shadow-sm'
                    : 'text-[#5e6f66]'
                }`}
              >
                Đăng ký tài khoản
              </button>
            </div>

            {authTab === 'login' ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <h3 className="text-xl font-black text-[#15221b]">
                  Chào mừng bạn quay lại 👋
                </h3>
                <p className="text-xs text-[#5e6f66] -mt-2">
                  Đăng nhập để tiếp tục hành trình bữa trưa ngon lành.
                </p>

                <div>
                  <label className="block text-xs font-bold text-[#5e6f66] mb-1.5">
                    Email hoặc số điện thoại
                  </label>
                  <input
                    type="text"
                    required
                    value={loginId}
                    onChange={(e) => setLoginId(e.target.value)}
                    placeholder="email@example.com hoặc số điện thoại"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#ede4d4] focus:border-[#0e563f] text-sm outline-none bg-[#fbf8f1] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#5e6f66] mb-1.5">
                    Mật khẩu
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={loginPass}
                    onChange={(e) => setLoginPass(e.target.value)}
                    placeholder="Nhập mật khẩu"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#ede4d4] focus:border-[#0e563f] text-sm outline-none bg-[#fbf8f1] focus:bg-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#0e563f] hover:bg-[#12694d] text-white font-black text-sm transition-all shadow-sm cursor-pointer"
                >
                  Đăng nhập →
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                <h3 className="text-xl font-black text-[#15221b]">
                  Tạo tài khoản mới ✨
                </h3>
                <p className="text-xs text-[#5e6f66] -mt-2">
                  Chỉ mất một phút để bắt đầu đặt trước bữa trưa.
                </p>

                <div>
                  <label className="block text-xs font-bold text-[#5e6f66] mb-1">
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="Nguyễn Văn An"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#ede4d4] focus:border-[#0e563f] text-sm outline-none bg-[#fbf8f1] focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#5e6f66] mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="email@example.com"
                      className="w-full px-3.5 py-2 rounded-xl border border-[#ede4d4] focus:border-[#0e563f] text-sm outline-none bg-[#fbf8f1] focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#5e6f66] mb-1">
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      required
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="09xx xxx xxx"
                      className="w-full px-3.5 py-2 rounded-xl border border-[#ede4d4] focus:border-[#0e563f] text-sm outline-none bg-[#fbf8f1] focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#5e6f66] mb-1">
                    Mật khẩu (ít nhất 6 ký tự)
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={regPass}
                    onChange={(e) => setRegPass(e.target.value)}
                    placeholder="Tạo mật khẩu"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#ede4d4] focus:border-[#0e563f] text-sm outline-none bg-[#fbf8f1] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#5e6f66] mb-1">
                    Nhập lại mật khẩu
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={regConfirm}
                    onChange={(e) => setRegConfirm(e.target.value)}
                    placeholder="Nhập lại mật khẩu"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#ede4d4] focus:border-[#0e563f] text-sm outline-none bg-[#fbf8f1] focus:bg-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#0e563f] hover:bg-[#12694d] text-white font-black text-sm transition-all shadow-sm cursor-pointer"
                >
                  Tạo tài khoản →
                </button>
              </form>
            )}
          </div>

          {/* Benefits Box */}
          <aside className="bg-[#eaf5ee] rounded-3xl p-6 sm:p-7 border border-[#cbe3d4] space-y-4">
            <div className="text-4xl">🥢</div>
            <h4 className="font-black text-lg text-[#15221b]">
              Một tài khoản, tiện ích đủ đầy
            </h4>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-white/70 border border-[#cbe3d4] flex items-center justify-between">
                <span className="font-bold text-[#15221b]">📦 Theo dõi đơn hàng theo thời gian thực</span>
                <span className="text-[#0e563f] font-black">✓</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/70 border border-[#cbe3d4] flex items-center justify-between">
                <span className="font-bold text-[#15221b]">🎟️ Quản lý thẻ ăn & tự động giảm 20%</span>
                <span className="text-[#0e563f] font-black">✓</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/70 border border-[#cbe3d4] flex items-center justify-between">
                <span className="font-bold text-[#15221b]">🧾 Xem lại lịch sử các bữa trưa</span>
                <span className="text-[#0e563f] font-black">✓</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/70 border border-[#cbe3d4] flex items-center justify-between">
                <span className="font-bold text-[#15221b]">⚡ Điền nhanh địa chỉ giao hàng</span>
                <span className="text-[#0e563f] font-black">✓</span>
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
};
