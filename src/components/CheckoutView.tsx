import React, { useState, useEffect } from 'react';
import {
  CartItem,
  Customer,
  UserPackage,
  Order,
  PageId,
  Voucher,
} from '../types';
import {
  formatVND,
  getDayOptions,
  calculateShipping,
  FREE_SHIPPING_DISTRICTS,
  DEFAULT_VOUCHERS,
  checkVoucherEligibility,
  isWednesday,
  WEDNESDAY_SPECIAL_DISH_IDS,
} from '../data/initialData';
import {
  MapPin,
  Clock,
  Calendar,
  CreditCard,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  Sparkles,
  CheckCircle2,
  QrCode,
  ArrowLeft,
  Tag,
  Check,
  X,
  AlertCircle,
} from 'lucide-react';

interface CheckoutViewProps {
  cart: CartItem[];
  onUpdateQty: (id: number, delta: number) => void;
  onClearCart: () => void;
  activeCustomer: Customer | null;
  packages: UserPackage[];
  orders: Order[];
  onPlaceOrder: (order: Order, updatedPackage?: UserPackage) => void;
  onNavigate: (page: PageId) => void;
  onToast: (msg: string) => void;
  activeDay: string;
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({
  cart,
  onUpdateQty,
  activeCustomer,
  packages,
  orders,
  onPlaceOrder,
  onNavigate,
  onToast,
  activeDay,
}) => {
  const dayOptions = getDayOptions();

  // Form states
  const [customerName, setCustomerName] = useState(activeCustomer?.name || '');
  const [customerPhone, setCustomerPhone] = useState(activeCustomer?.phone || '');
  const [address, setAddress] = useState(activeCustomer?.address || '');
  const [useDay, setUseDay] = useState(activeDay || dayOptions[0].value);
  const [deliveryTime, setDeliveryTime] = useState('10:00 – 10:30');
  const [note, setNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<string>('Thanh toán khi nhận hàng (COD)');
  const [userManuallyChangedPayment, setUserManuallyChangedPayment] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);

  // Voucher states
  const [appliedVoucher, setAppliedVoucher] = useState<Voucher | null>(null);
  const [voucherInput, setVoucherInput] = useState('');
  const [showVoucherList, setShowVoucherList] = useState(false);

  // Sync customer details when activeCustomer changes
  useEffect(() => {
    if (activeCustomer) {
      if (!customerName) setCustomerName(activeCustomer.name || '');
      if (!customerPhone) setCustomerPhone(activeCustomer.phone || '');
      if (!address && activeCustomer.address) setAddress(activeCustomer.address);
    }
  }, [activeCustomer]);

  // Count past orders for this customer to evaluate first_order voucher
  const customerPastOrdersCount = activeCustomer
    ? orders.filter(
        (o) =>
          o.customerId === activeCustomer.id ||
          (activeCustomer.phone && o.phone === activeCustomer.phone)
      ).length
    : 0;

  // Check if active user has a usable package
  const userPackages = activeCustomer
    ? packages.filter((p) => p.customerId === activeCustomer.id && p.balance > 0)
    : [];

  const hasUsablePackage = userPackages.length > 0;

  // Auto select "Sử dụng gói suất ăn" if user has active package and hasn't manually picked another method
  useEffect(() => {
    if (hasUsablePackage && !userManuallyChangedPayment) {
      setPaymentMethod('Sử dụng gói suất ăn');
    }
  }, [hasUsablePackage, userManuallyChangedPayment]);

  // Calculations
  const rawSubtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const isPackagePayment = paymentMethod === 'Sử dụng gói suất ăn';
  const packageDiscount = isPackagePayment ? Math.round(rawSubtotal * 0.2) : 0;

  // Evaluate applied voucher
  let voucherDiscount = 0;
  let voucherEligibility = appliedVoucher
    ? checkVoucherEligibility(
        appliedVoucher,
        cart,
        customerPastOrdersCount,
        useDay
      )
    : { eligible: false, discount: 0 };

  if (appliedVoucher && voucherEligibility.eligible) {
    voucherDiscount = voucherEligibility.discount;
  }

  const totalDiscount = packageDiscount + voucherDiscount;
  const foodTotal = Math.max(0, rawSubtotal - totalDiscount);
  const shippingFee = rawSubtotal > 0 ? calculateShipping(address) : 0;
  const grandTotal = foodTotal + shippingFee;

  // Check address shipping badge
  const isFreeShip =
    address.trim().length > 0 &&
    FREE_SHIPPING_DISTRICTS.some((d) => address.toLowerCase().includes(d));

  const handlePaymentChange = (val: string) => {
    setUserManuallyChangedPayment(true);
    setPaymentMethod(val);
  };

  const handleApplyVoucherCode = (codeToApply?: string) => {
    const cleanCode = (codeToApply || voucherInput).trim().toUpperCase();
    if (!cleanCode) {
      onToast('Vui lòng nhập mã voucher');
      return;
    }

    const found = DEFAULT_VOUCHERS.find((v) => v.code === cleanCode);
    if (!found) {
      onToast(`Mã giảm giá "${cleanCode}" không hợp lệ`);
      return;
    }

    const check = checkVoucherEligibility(found, cart, customerPastOrdersCount, useDay);
    if (!check.eligible) {
      onToast(check.reason || 'Đơn hàng chưa đủ điều kiện áp dụng voucher này');
      return;
    }

    setAppliedVoucher(found);
    setVoucherInput(cleanCode);
    setShowVoucherList(false);
    onToast(`Áp dụng voucher "${found.title}" thành công! Tiết kiệm ${formatVND(check.discount)}`);
  };

  const handleRemoveVoucher = () => {
    setAppliedVoucher(null);
    setVoucherInput('');
    onToast('Đã hủy áp dụng voucher');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!cart.length) {
      onToast('Giỏ hàng chưa có món ăn');
      return;
    }

    if (!customerName.trim() || !customerPhone.trim() || !address.trim()) {
      onToast('Vui lòng điền họ tên, số điện thoại và địa chỉ nhận hàng');
      return;
    }

    let selectedPackage: UserPackage | null = null;
    let updatedPackage: UserPackage | undefined = undefined;

    if (isPackagePayment) {
      if (!activeCustomer) {
        onToast('Vui lòng đăng nhập để sử dụng thẻ ăn thành viên');
        onNavigate('account');
        return;
      }

      const totalQty = cart.reduce((sum, i) => sum + i.qty, 0);

      // Find package with sufficient balance
      selectedPackage =
        packages.find(
          (p) =>
            p.customerId === activeCustomer.id &&
            p.balance >= foodTotal &&
            (p.used || 0) + totalQty <= (p.count || 9999)
        ) || null;

      if (!selectedPackage) {
        onToast(
          'Số dư hoặc số suất còn lại của thẻ ăn không đủ. Vui lòng chọn gói khác hoặc phương thức thanh toán khác.'
        );
        return;
      }

      const confirmed = window.confirm(
        `Xác nhận đặt món? Trừ ${formatVND(
          foodTotal
        )} từ thẻ ăn ${activeCustomer.memberCode}. Phí giao hàng ${
          shippingFee ? formatVND(shippingFee) : 'miễn phí'
        } thanh toán riêng.`
      );

      if (!confirmed) return;

      updatedPackage = {
        ...selectedPackage,
        balance: selectedPackage.balance - foodTotal,
        used: (selectedPackage.used || 0) + totalQty,
      };
    }

    const newOrder: Order = {
      id: 'TT' + String(Date.now()).slice(-6),
      name: customerName.trim(),
      phone: customerPhone.trim(),
      address: address.trim(),
      day: useDay,
      time: deliveryTime,
      note: note.trim(),
      payment: paymentMethod,
      customerId: activeCustomer?.id || null,
      memberCode: activeCustomer?.memberCode || null,
      packageId: selectedPackage?.id || null,
      packageCharge: selectedPackage ? foodTotal : 0,
      packageQty: selectedPackage ? cart.reduce((a, x) => a + x.qty, 0) : 0,
      refundProcessed: false,
      items: [...cart],
      subtotal: rawSubtotal,
      discount: totalDiscount,
      voucherCode: appliedVoucher?.code || null,
      voucherDiscount: voucherDiscount > 0 ? voucherDiscount : undefined,
      foodTotal,
      shipping: shippingFee,
      total: grandTotal,
      status: 'Chờ xác nhận',
      payStatus: selectedPackage
        ? 'Đã thanh toán bằng thẻ ăn'
        : paymentMethod.includes('Chuyển khoản')
        ? 'Chờ chuyển khoản'
        : 'Chưa thanh toán (COD)',
      created: new Date().toISOString(),
    };

    onPlaceOrder(newOrder, updatedPackage);

    if (paymentMethod.includes('Chuyển khoản')) {
      setShowQRModal(true);
    } else {
      onToast(
        selectedPackage
          ? `Đặt món thành công! Đã trừ ${formatVND(foodTotal)} từ thẻ ăn.`
          : `Đặt trước thành công! Mã đơn: ${newOrder.id}`
      );
      onNavigate('orders');
    }
  };

  return (
    <div className="space-y-6">
      {/* Head */}
      <div>
        <h2 className="text-3xl font-black text-[#202923] tracking-tight">Xác nhận đặt cơm</h2>
        <p className="text-sm text-[#78847d] mt-1">
          Kiểm tra thông tin giao hàng, áp dụng voucher ưu đãi và gửi đơn đặt trước.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.9fr] gap-6 items-start">
        {/* Left Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Section 1: Customer & Delivery Address */}
          <div className="bg-white rounded-2xl p-6 border border-[#e8eee9] shadow-[0_8px_25px_rgba(36,78,56,0.04)] space-y-4">
            <div className="flex items-center gap-2 text-base font-extrabold text-[#202923] border-b border-[#f0f4f1] pb-3">
              <MapPin className="w-5 h-5 text-[#0e563f]" />
              <span>Thông tin nhận hàng</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#647169] mb-1.5">
                  Họ và tên người nhận *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Nguyễn Văn An"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#dfe7e1] focus:border-[#216b50] focus:ring-2 focus:ring-[#216b50]/20 outline-none text-sm bg-[#fafbfa] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#647169] mb-1.5">
                  Số điện thoại liên hệ *
                </label>
                <input
                  type="tel"
                  inputMode="tel"
                  required
                  placeholder="09xx xxx xxx"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#dfe7e1] focus:border-[#216b50] focus:ring-2 focus:ring-[#216b50]/20 outline-none text-sm bg-[#fafbfa] focus:bg-white"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-[#647169]">
                  Địa chỉ giao hàng (Văn phòng / Nhà riêng) *
                </label>
                {address && (
                  <span
                    className={`text-[11px] font-extrabold px-2 py-0.5 rounded-md ${
                      isFreeShip
                        ? 'bg-[#eaf5ef] text-[#0e563f]'
                        : 'bg-[#fff7e8] text-[#8a5b17]'
                    }`}
                  >
                    {isFreeShip ? '✓ Miễn phí giao hàng' : '+ 15.000 ₫ phí ship'}
                  </span>
                )}
              </div>
              <input
                type="text"
                required
                placeholder="Số phòng/tầng, tòa nhà, tên đường, phường, quận..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#dfe7e1] focus:border-[#216b50] focus:ring-2 focus:ring-[#216b50]/20 outline-none text-sm bg-[#fafbfa] focus:bg-white"
              />
              <p className="text-[11px] text-[#78847d] mt-1.5">
                Gợi ý: Miễn phí giao hàng tại Bình Thạnh, Thủ Đức, Gò Vấp, Quận 1, 2, 3, 4, 5, 10, 12, Tân Bình, Tân Phú.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block text-xs font-bold text-[#647169] mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#0e563f]" />
                  <span>Ngày sử dụng (Đặt trước)</span>
                </label>
                <select
                  value={useDay}
                  onChange={(e) => setUseDay(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#dfe7e1] focus:border-[#216b50] bg-white text-sm outline-none"
                >
                  {dayOptions.map((d) => (
                    <option key={d.value} value={d.value}>
                      {d.label} ({d.value}) {d.isWed ? '🔥 Deal Thứ Tư' : ''}
                    </option>
                  ))}
                </select>
                {isWednesday(useDay) && (
                  <span className="text-[11px] text-[#8a5b17] font-bold block mt-1">
                    🎉 Ngày Thứ Tư: Áp dụng voucher "Thứ Tư vui vẻ" giảm 20% các món chọn lọc!
                  </span>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-[#647169] mb-1.5 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#0e563f]" />
                  <span>Khung giờ nhận dự kiến</span>
                </label>
                <select
                  value={deliveryTime}
                  onChange={(e) => setDeliveryTime(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#dfe7e1] focus:border-[#216b50] bg-white text-sm outline-none"
                >
                  <option value="09:00 – 09:30">09:00 – 09:30</option>
                  <option value="09:30 – 10:00">09:30 – 10:00</option>
                  <option value="10:00 – 10:30">10:00 – 10:30 (Khuyên dùng)</option>
                  <option value="10:30 – 11:00">10:30 – 11:00</option>
                  <option value="11:00 – 11:30">11:00 – 11:30</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#647169] mb-1.5">
                Ghi chú cho bếp / tài xế giao hàng
              </label>
              <input
                type="text"
                placeholder="Ví dụ: ít cay, mang lên tầng 4, gọi khi đến nơi..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#dfe7e1] focus:border-[#216b50] text-sm outline-none bg-[#fafbfa] focus:bg-white"
              />
            </div>
          </div>

          {/* Section 2: Vouchers & Mã giảm giá */}
          <div className="bg-white rounded-2xl p-6 border border-[#e8eee9] shadow-[0_8px_25px_rgba(36,78,56,0.04)] space-y-4">
            <div className="flex items-center justify-between border-b border-[#f0f4f1] pb-3">
              <div className="flex items-center gap-2 text-base font-extrabold text-[#202923]">
                <Tag className="w-5 h-5 text-[#f4a340]" />
                <span>Mã giảm giá & Voucher</span>
              </div>
              <button
                type="button"
                onClick={() => setShowVoucherList(!showVoucherList)}
                className="text-xs font-bold text-[#0e563f] hover:underline cursor-pointer"
              >
                {showVoucherList ? 'Thu gọn danh sách' : 'Xem voucher có sẵn (3)'}
              </button>
            </div>

            {/* Input field */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Nhập mã: TRUANGON, HOIANTRUA, THUTUVUIVE..."
                  value={voucherInput}
                  onChange={(e) => setVoucherInput(e.target.value.toUpperCase())}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#dfe7e1] focus:border-[#216b50] text-sm uppercase font-bold tracking-wider outline-none bg-[#fafbfa] focus:bg-white"
                />
                {appliedVoucher && (
                  <button
                    type="button"
                    onClick={handleRemoveVoucher}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#78847d] hover:text-[#c84b42] cursor-pointer"
                    title="Gỡ voucher"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <button
                type="button"
                onClick={() => handleApplyVoucherCode()}
                className="px-5 py-2.5 rounded-xl bg-[#0e563f] hover:bg-[#12694d] text-white font-extrabold text-xs transition-all cursor-pointer shadow-xs whitespace-nowrap"
              >
                Áp dụng
              </button>
            </div>

            {/* Active Voucher Banner */}
            {appliedVoucher && voucherEligibility.eligible && (
              <div className="p-3.5 rounded-xl bg-[#eaf5ef] border border-[#216b50]/30 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#216b50] text-white flex items-center justify-center font-black">
                    ✓
                  </div>
                  <div>
                    <span className="font-extrabold text-[#0e563f]">
                      {appliedVoucher.title} ({appliedVoucher.code})
                    </span>
                    <div className="text-[11px] text-[#647169]">
                      Đã giảm <b>{formatVND(voucherDiscount)}</b> vào tổng đơn hàng.
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveVoucher}
                  className="text-xs font-bold text-[#c84b42] hover:underline cursor-pointer"
                >
                  Gỡ bỏ
                </button>
              </div>
            )}

            {/* Voucher List Drawer/Cards */}
            {showVoucherList && (
              <div className="space-y-3 pt-1">
                {DEFAULT_VOUCHERS.map((v) => {
                  const check = checkVoucherEligibility(
                    v,
                    cart,
                    customerPastOrdersCount,
                    useDay
                  );
                  const isCurrent = appliedVoucher?.id === v.id;

                  return (
                    <div
                      key={v.id}
                      className={`p-3.5 rounded-xl border transition-all ${
                        isCurrent
                          ? 'border-[#216b50] bg-[#eaf5ef]/70 ring-2 ring-[#216b50]/20'
                          : 'border-[#dfe7e1] bg-[#fafbfa] hover:border-[#216b50]/40'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-black text-sm text-[#202923]">
                              {v.title}
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#fff2dd] text-[#8a5b17]">
                              {v.badge}
                            </span>
                          </div>
                          <p className="text-xs text-[#647169] leading-relaxed">
                            {v.description}
                          </p>
                          <div className="text-[11px] font-bold">
                            Mã: <code className="bg-white px-1.5 py-0.5 rounded border border-[#dfe7e1] text-[#0e563f] font-mono">{v.code}</code>
                            {check.eligible ? (
                              <span className="text-[#0e563f] ml-2">
                                ✓ Khả dụng: giảm {formatVND(check.discount)}
                              </span>
                            ) : (
                              <span className="text-[#b64239] ml-2 font-normal">
                                ⚠ {check.reason}
                              </span>
                            )}
                          </div>
                        </div>

                        <div>
                          {isCurrent ? (
                            <span className="px-3 py-1.5 rounded-lg bg-[#216b50] text-white font-bold text-xs inline-flex items-center gap-1">
                              <Check className="w-3.5 h-3.5" />
                              <span>Đang dùng</span>
                            </span>
                          ) : (
                            <button
                              type="button"
                              disabled={!check.eligible}
                              onClick={() => handleApplyVoucherCode(v.code)}
                              className="px-3.5 py-1.5 rounded-lg bg-white border border-[#216b50] text-[#0e563f] hover:bg-[#eaf5ef] disabled:opacity-40 disabled:border-[#dfe7e1] disabled:text-[#78847d] font-bold text-xs transition-colors cursor-pointer"
                            >
                              Dùng ngay
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Section 3: Payment Method */}
          <div className="bg-white rounded-2xl p-6 border border-[#e8eee9] shadow-[0_8px_25px_rgba(36,78,56,0.04)] space-y-4">
            <div className="flex items-center gap-2 text-base font-extrabold text-[#202923] border-b border-[#f0f4f1] pb-3">
              <CreditCard className="w-5 h-5 text-[#0e563f]" />
              <span>Phương thức thanh toán</span>
            </div>

            <div className="space-y-2.5">
              {[
                {
                  id: 'Thanh toán khi nhận hàng (COD)',
                  title: 'Thanh toán tiền mặt khi nhận hàng (COD)',
                  desc: 'Trả tiền trực tiếp cho tài xế khi nhận hộp cơm nóng hổi.',
                },
                {
                  id: 'Chuyển khoản (mô phỏng)',
                  title: 'Chuyển khoản ngân hàng (VietQR mô phỏng)',
                  desc: 'Quét mã QR chuyển khoản nhanh chóng và tiện lợi.',
                },
                {
                  id: 'Ví điện tử (mô phỏng)',
                  title: 'Ví MoMo / ZaloPay (mô phỏng)',
                  desc: 'Thanh toán qua cổng ví điện tử phổ biến.',
                },
                {
                  id: 'Sử dụng gói suất ăn',
                  title: 'Sử dụng gói suất ăn thành viên (-20% tiền món)',
                  desc: activeCustomer
                    ? `Thẻ thành viên ${activeCustomer.memberCode}. Tự động trừ tiền và chiết khấu ngay 20%.`
                    : 'Đăng nhập tài khoản để hưởng chiết khấu 20% khi thanh toán bằng thẻ ăn.',
                  badge: 'TIẾT KIỆM 20%',
                },
              ].map((m) => {
                const isSelected = paymentMethod === m.id;
                return (
                  <label
                    key={m.id}
                    onClick={() => handlePaymentChange(m.id)}
                    className={`block p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[#216b50] bg-[#eaf5ef]/60 ring-2 ring-[#216b50]/20'
                        : 'border-[#dfe7e1] bg-white hover:border-[#216b50]/40'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="paymentGroup"
                        checked={isSelected}
                        onChange={() => handlePaymentChange(m.id)}
                        className="mt-1 w-4 h-4 text-[#0e563f] accent-[#216b50]"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-sm text-[#202923]">
                            {m.title}
                          </span>
                          {m.badge && (
                            <span className="bg-[#f4a340] text-[#30230f] text-[10px] font-black px-2 py-0.5 rounded-full">
                              {m.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#78847d] mt-0.5">{m.desc}</p>
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>

            {isPackagePayment && (
              <div className="p-3.5 rounded-xl bg-[#eaf5ef] border border-[#216b50]/30 text-xs text-[#0e563f] flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#f4a340]" />
                <div>
                  <b>Đặc quyền thẻ ăn:</b> Giảm thêm 20% tiền món ăn. Số tiền giảm{' '}
                  <b>{formatVND(packageDiscount)}</b>.
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={cart.length === 0}
            className="w-full py-4 px-6 rounded-2xl bg-[#0e563f] hover:bg-[#12694d] active:scale-[0.99] disabled:opacity-50 text-white font-black text-base shadow-lg shadow-[#216b50]/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <span>Xác nhận đặt cơm →</span>
          </button>
        </form>

        {/* Right Summary */}
        <aside className="sticky top-24 bg-white rounded-2xl p-6 border border-[#e8eee9] shadow-[0_8px_25px_rgba(36,78,56,0.04)] space-y-4">
          <div className="flex items-center justify-between border-b border-[#f0f4f1] pb-3">
            <h3 className="font-black text-lg text-[#202923] flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#0e563f]" />
              <span>Đơn cơm của bạn</span>
            </h3>
            <span className="text-xs font-bold text-[#78847d]">
              {cart.reduce((a, b) => a + b.qty, 0)} món
            </span>
          </div>

          {cart.length === 0 ? (
            <div className="py-8 text-center text-[#78847d]">
              <div className="text-4xl mb-2">🛍️</div>
              <p className="text-sm font-bold text-[#202923]">Giỏ hàng đang trống</p>
              <p className="text-xs mt-1">Hãy quay lại thực đơn và chọn món trưa bạn thích nhé!</p>
              <button
                type="button"
                onClick={() => onNavigate('menu')}
                className="mt-4 px-4 py-2 rounded-xl bg-[#eaf5ef] text-[#0e563f] font-bold text-xs hover:bg-[#d5ebde] transition-colors cursor-pointer"
              >
                ← Xem thực đơn hôm nay
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="divide-y divide-[#f0f4f1] max-h-72 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.id} className="py-3 flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm text-[#202923] truncate">
                        {item.name}
                      </div>
                      <div className="text-xs text-[#78847d]">
                        {formatVND(item.price)} / phần
                      </div>

                      {/* Qty controls */}
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          type="button"
                          onClick={() => onUpdateQty(item.id, -1)}
                          className="w-6 h-6 rounded-md bg-[#eaf5ef] text-[#0e563f] hover:bg-[#d5ebde] flex items-center justify-center font-black text-xs cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-extrabold w-4 text-center">
                          {item.qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQty(item.id, 1)}
                          className="w-6 h-6 rounded-md bg-[#eaf5ef] text-[#0e563f] hover:bg-[#d5ebde] flex items-center justify-center font-black text-xs cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-extrabold text-sm text-[#202923]">
                        {formatVND(item.price * item.qty)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="pt-3 border-t border-[#f0f4f1] space-y-2 text-xs">
                <div className="flex justify-between text-[#647169]">
                  <span>Tạm tính tiền món</span>
                  <span className="font-bold">{formatVND(rawSubtotal)}</span>
                </div>

                {isPackagePayment && (
                  <div className="flex justify-between text-[#0e563f] font-bold">
                    <span>Ưu đãi gói suất ăn (-20%)</span>
                    <span>-{formatVND(packageDiscount)}</span>
                  </div>
                )}

                {voucherDiscount > 0 && appliedVoucher && (
                  <div className="flex justify-between text-[#f4a340] font-extrabold bg-[#fff8eb] p-2 rounded-lg border border-[#f3e2c2]">
                    <div className="flex items-center gap-1">
                      <Tag className="w-3.5 h-3.5" />
                      <span>Voucher: {appliedVoucher.code}</span>
                    </div>
                    <span>-{formatVND(voucherDiscount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-[#647169]">
                  <span>Phí giao hàng dự kiến</span>
                  <span className={`font-bold ${shippingFee === 0 ? 'text-[#0e563f]' : ''}`}>
                    {shippingFee === 0 ? 'Miễn phí' : formatVND(shippingFee)}
                  </span>
                </div>

                <div className="flex justify-between text-base font-black text-[#202923] pt-2 border-t border-[#e8eee9]">
                  <span>Tổng thanh toán</span>
                  <span className="text-[#0e563f]">{formatVND(grandTotal)}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onNavigate('menu')}
                className="w-full mt-3 py-2.5 rounded-xl border border-[#dfe7e1] text-[#69756e] hover:text-[#202923] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Tiếp tục chọn thêm món</span>
              </button>
            </div>
          )}
        </aside>
      </div>

      {/* VietQR Demo Modal */}
      {showQRModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-[#eaf5ef] text-[#0e563f] flex items-center justify-center mx-auto">
              <QrCode className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-[#202923]">Quét mã VietQR chuyển khoản</h3>
              <p className="text-xs text-[#78847d] mt-1">
                Số tiền cần thanh toán: <b className="text-[#0e563f] text-sm">{formatVND(grandTotal)}</b>
              </p>
            </div>

            {/* QR Mock graphic */}
            <div className="p-4 rounded-2xl bg-[#fafbfa] border-2 border-dashed border-[#dfe7e1] flex flex-col items-center">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=TOITRUA-${encodeURIComponent(
                  customerPhone
                )}-${grandTotal}`}
                alt="Mã QR thanh toán Tới Trưa"
                className="w-44 h-44 rounded-xl shadow-xs"
              />
              <div className="text-[11px] text-[#78847d] mt-2 font-mono">
                Nội dung: TOITRUA {customerPhone}
              </div>
            </div>

            <div className="text-xs text-[#78847d]">
              Hệ thống sẽ tự động cập nhật trạng thái đơn sang "Đã thanh toán" sau khi nhận được tiền.
            </div>

            <button
              onClick={() => {
                setShowQRModal(false);
                onToast('Đã ghi nhận đơn hàng chuyển khoản thành công!');
                onNavigate('orders');
              }}
              className="w-full py-3 rounded-xl bg-[#0e563f] text-white font-extrabold text-sm hover:bg-[#12694d] transition-colors cursor-pointer"
            >
              Tôi đã chuyển khoản xong →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
