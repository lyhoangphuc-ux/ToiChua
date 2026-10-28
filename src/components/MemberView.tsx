import React, { useState } from 'react';
import { Customer, PackageCatalogItem, UserPackage, PageId } from '../types';
import { formatVND } from '../data/initialData';
import {
  Ticket,
  Sparkles,
  Check,
  ArrowRight,
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Zap,
} from 'lucide-react';

interface MemberViewProps {
  catalog: PackageCatalogItem[];
  packages: UserPackage[];
  activeCustomer: Customer | null;
  onBuyPackage: (catalogItem: PackageCatalogItem) => void;
  onNavigate: (page: PageId) => void;
}

export const MemberView: React.FC<MemberViewProps> = ({
  catalog,
  packages,
  activeCustomer,
  onBuyPackage,
  onNavigate,
}) => {
  const [selectedDetailPkg, setSelectedDetailPkg] = useState<PackageCatalogItem | null>(null);

  const userPackages = activeCustomer
    ? packages.filter((p) => p.customerId === activeCustomer.id)
    : [];

  return (
    <div className="space-y-10 pb-10">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#093c2b] via-[#0e563f] to-[#12694d] text-white p-7 sm:p-10 shadow-[0_16px_40px_rgba(14,86,63,0.14)]">
        <div className="absolute right-6 -top-12 w-64 h-64 rounded-full border border-white/10 pointer-events-none" />
        <div className="absolute right-1/3 -bottom-16 w-56 h-56 rounded-full bg-[#f59e0b]/20 blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs text-xs uppercase tracking-wider font-extrabold text-[#fde68a] border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-[#f59e0b]" />
            <span>Tiết kiệm bữa trưa · Chiết khấu trực tiếp 20%</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
            Gói Suất Ăn Thành Viên Tới Trưa
          </h1>

          <p className="text-[#d8eae0] text-xs sm:text-sm leading-relaxed">
            Chủ động lên lịch ăn trưa văn phòng, thanh toán trước để nhận ưu đãi giảm 20% mỗi phần cơm và tự động trừ vào số dư thẻ khi đặt hàng. Không lo quên tiền lẻ, cơm giao nóng đúng hẹn.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-[#cce9d8]">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#f59e0b]" />
              <span>Giảm 20% giá món</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#f59e0b]" />
              <span>Hoàn suất khi hủy trước 07:00</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#f59e0b]" />
              <span>Hạn dùng từ 30 – 60 ngày</span>
            </div>
          </div>
        </div>
      </div>

      {/* Package Catalog Cards Grid */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-black text-[#15221b] tracking-tight">
              Bảng giá gói suất ăn hiện hành
            </h2>
            <p className="text-xs sm:text-sm text-[#5e6f66] mt-0.5">
              Chọn gói ăn phù hợp với lịch làm việc của bạn. Giá niêm yết đã bao gồm ưu đãi chiết khấu.
            </p>
          </div>
          <span className="text-xs font-bold text-[#0e563f] bg-[#eaf5ee] px-3 py-1 rounded-full border border-[#cbe3d4] self-start sm:self-auto">
            ⚡ Kích hoạt dùng ngay sau khi đăng ký
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {catalog.map((pkg) => {
            const isPopular = pkg.popular || pkg.tag?.includes('CHẠY') || pkg.id === 'p10';
            const isActive = pkg.isActive !== false;
            const pricePerMeal = Math.round(pkg.price / (pkg.count || 1));
            const hasOrigPrice = pkg.originalPrice && pkg.originalPrice > pkg.price;
            const savingsPercent = hasOrigPrice
              ? Math.round(((pkg.originalPrice! - pkg.price) / pkg.originalPrice!) * 100)
              : null;

            const defaultFeatures = [
              'Giảm ngay 20% mỗi phần cơm',
              'Thời hạn sử dụng lên đến 45 ngày',
              'Tự động trừ số dư, không cần tiền mặt',
              'Được hoàn suất khi hủy đơn trước 07:00 sáng',
            ];
            const features = pkg.features && pkg.features.length > 0 ? pkg.features : defaultFeatures;

            return (
              <div
                key={pkg.id}
                className={`relative rounded-3xl overflow-hidden transition-all duration-300 flex flex-col justify-between ${
                  isPopular
                    ? 'bg-white border-2 border-[#f59e0b] shadow-[0_12px_35px_rgba(245,158,11,0.16)] hover:shadow-[0_20px_45px_rgba(245,158,11,0.22)] -translate-y-1'
                    : 'bg-white border border-[#ede4d4] shadow-[0_6px_25px_rgba(14,86,63,0.05)] hover:shadow-[0_16px_35px_rgba(14,86,63,0.1)] hover:-translate-y-1'
                }`}
              >
                {/* Popular Spotlight Ribbon */}
                {isPopular && (
                  <div className="bg-[#f59e0b] text-[#2d1e06] text-center text-[11px] font-black uppercase tracking-wider py-1.5 px-4 flex items-center justify-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>LỰA CHỌN PHỔ BIẾN NHẤT</span>
                  </div>
                )}

                <div>
                  {/* Image banner with overlay */}
                  <div className="h-44 overflow-hidden relative bg-gray-100">
                    <img
                      src={pkg.image}
                      alt={pkg.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                    <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs text-[#0e563f] font-black text-[11px] px-3 py-1 rounded-xl shadow-xs border border-[#cbe3d4]">
                      {pkg.tag || 'ƯU ĐÃI'}
                    </span>

                    <span className="absolute bottom-3 right-3 bg-[#f59e0b] text-[#2d1e06] font-black text-xs px-3 py-1 rounded-full shadow-sm">
                      {pkg.count} suất ăn
                    </span>

                    {!isActive && (
                      <div className="absolute inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 text-center">
                        <span className="px-3.5 py-1.5 rounded-xl bg-gray-800 text-white text-xs font-black border border-white/20">
                          Tạm ngưng mở bán gói này
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Body information */}
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="font-black text-xl text-[#15221b] tracking-tight">
                        {pkg.title}
                      </h3>
                      <p className="text-xs text-[#5e6f66] mt-1.5 leading-relaxed min-h-[36px]">
                        {pkg.desc}
                      </p>
                    </div>

                    {/* Price Block */}
                    <div className="p-3.5 rounded-2xl bg-[#fbf8f1] border border-[#ede4d4] space-y-1">
                      <div className="text-[11px] uppercase tracking-wider text-[#5e6f66] font-bold">
                        Giá trọn gói
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black text-[#0e563f]">
                          {formatVND(pkg.price)}
                        </span>
                        {hasOrigPrice && (
                          <span className="text-xs text-[#78847d] line-through font-semibold">
                            {formatVND(pkg.originalPrice!)}
                          </span>
                        )}
                        {savingsPercent && (
                          <span className="text-[11px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                            -{savingsPercent}%
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-[#78847d] pt-1 border-t border-gray-200 flex justify-between">
                        <span>Đơn giá bình quân:</span>
                        <span className="font-bold text-[#15221b]">
                          ~{formatVND(pricePerMeal)}/suất
                        </span>
                      </div>
                    </div>

                    {/* Features checklist */}
                    <div className="space-y-2 pt-1 text-xs text-[#365f4e]">
                      {features.map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-2.5">
                          <Check className="w-4 h-4 text-[#0e563f] shrink-0 mt-0.5" />
                          <span className="leading-snug">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card footer CTA */}
                <div className="p-6 pt-0 mt-2">
                  <button
                    disabled={!isActive}
                    onClick={() => onBuyPackage(pkg)}
                    className={`w-full py-3.5 rounded-2xl font-black text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2 ${
                      !isActive
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : isPopular
                        ? 'bg-[#f59e0b] hover:bg-[#d97706] text-[#202923] cursor-pointer hover:shadow-lg active:scale-98'
                        : 'bg-[#0e563f] hover:bg-[#12694d] text-white cursor-pointer hover:shadow-lg active:scale-98'
                    }`}
                  >
                    <span>{isActive ? 'Đăng ký gói suất ăn ngay' : 'Tạm ngưng mở bán'}</span>
                    {isActive && <ArrowRight className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Member Packages Status Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#ede4d4] shadow-[0_8px_30px_rgba(14,86,63,0.04)] space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#ede4d4] pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs text-[#0e563f] font-black uppercase tracking-wider mb-1">
              <Ticket className="w-4 h-4 text-[#0e563f]" />
              <span>VÍ THẺ ĂN CÁ NHÂN</span>
            </div>
            <h3 className="text-xl font-black text-[#15221b]">
              Thẻ ăn thành viên của bạn
            </h3>
            <p className="text-xs text-[#5e6f66] mt-0.5">
              Tra cứu số dư thẻ ăn, tiến độ sử dụng và lịch sử kích hoạt gói.
            </p>
          </div>

          {activeCustomer && (
            <div className="self-start sm:self-auto text-left sm:text-right">
              <span className="text-[11px] text-[#5e6f66] block font-semibold">
                Mã thành viên của bạn:
              </span>
              <span className="text-sm font-black text-[#0e563f] bg-[#eaf5ee] px-3.5 py-1.5 rounded-xl border border-[#cbe3d4] inline-block mt-0.5">
                {activeCustomer.memberCode}
              </span>
            </div>
          )}
        </div>

        {!activeCustomer ? (
          <div className="py-12 text-center space-y-3.5 max-w-md mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-[#eaf5ee] text-[#0e563f] flex items-center justify-center mx-auto shadow-xs">
              <Ticket className="w-7 h-7" />
            </div>
            <h4 className="font-black text-lg text-[#15221b]">
              Đăng nhập để xem và quản lý gói suất ăn
            </h4>
            <p className="text-xs text-[#5e6f66] leading-relaxed">
              Gói suất ăn được liên kết trực tiếp với mã thành viên của bạn để bảo mật và tự động chiết khấu 20% khi đặt cơm.
            </p>
            <button
              onClick={() => onNavigate('account')}
              className="mt-2 px-6 py-3 rounded-xl bg-[#0e563f] hover:bg-[#12694d] text-white font-black text-xs transition-all shadow-md cursor-pointer active:scale-95"
            >
              Đăng nhập tài khoản ngay →
            </button>
          </div>
        ) : userPackages.length === 0 ? (
          <div className="py-10 text-center text-[#5e6f66] space-y-2">
            <div className="text-4xl mb-2">🎟️</div>
            <p className="font-bold text-base text-[#15221b]">
              Bạn chưa có gói suất ăn nào đang hoạt động
            </p>
            <p className="text-xs max-w-md mx-auto leading-relaxed">
              Hãy chọn một trong các gói ưu đãi bên trên để đăng ký và bắt đầu tiết kiệm bữa trưa ngay hôm nay!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-[#eaf5ee] border border-[#cbe3d4] text-xs text-[#0e563f] flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[#0e563f] shrink-0 mt-0.5" />
              <div>
                <b className="font-black">Hướng dẫn sử dụng thẻ ăn:</b> Khi vào Giỏ hàng để thanh toán, hệ thống sẽ tự động nhận diện gói ăn khả dụng và trừ tiền vào số dư thẻ, đồng thời giảm 20% tiền món ăn của bạn.
              </div>
            </div>

            <div className="divide-y divide-[#ede4d4]">
              {userPackages.map((pkg) => {
                const percentLeft = Math.min(100, Math.max(0, (pkg.balance / pkg.price) * 100));
                return (
                  <div key={pkg.id} className="py-5 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2.5">
                          <span className="font-black text-base sm:text-lg text-[#15221b]">
                            {pkg.title}
                          </span>
                          <span className="text-xs text-[#5e6f66] font-mono bg-[#fbf8f1] px-2 py-0.5 rounded-md border border-[#ede4d4]">
                            #{pkg.id}
                          </span>
                        </div>
                        <div className="text-xs text-[#5e6f66] mt-1 flex flex-wrap items-center gap-2">
                          <span>Ngày kích hoạt: {pkg.datePurchased}</span>
                          <span>•</span>
                          <span>Giá trị ban đầu: {formatVND(pkg.price)}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 self-start sm:self-auto">
                        <div className="text-left sm:text-right">
                          <span className="text-[11px] text-[#5e6f66] block font-semibold">
                            Số dư còn lại
                          </span>
                          <span className="text-lg sm:text-xl font-black text-[#0e563f]">
                            {formatVND(pkg.balance)}
                          </span>
                        </div>
                        <span className="bg-[#fef6e7] text-[#8c4e06] text-xs font-black px-3 py-1.5 rounded-xl border border-[#fed7aa]">
                          ĐÃ DÙNG {pkg.used} / {pkg.count} SUẤT
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1.5">
                      <div className="h-3 w-full bg-[#eaf5ee] rounded-full overflow-hidden p-0.5">
                        <div
                          className="h-full bg-gradient-to-r from-[#12694d] to-[#0e563f] rounded-full transition-all duration-500"
                          style={{ width: `${percentLeft}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-[#5e6f66]">
                        <span>Tỷ lệ số dư còn: <b>{Math.round(percentLeft)}%</b></span>
                        <span>Đã sử dụng: <b>{pkg.used}</b> trên tổng số <b>{pkg.count}</b> suất ăn</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Trust & FAQ Highlights Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#ede4d4] shadow-xs flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#eaf5ee] flex items-center justify-center text-[#0e563f] shrink-0">
            <Zap className="w-5 h-5 text-[#0e563f]" />
          </div>
          <div>
            <h4 className="font-black text-sm text-[#15221b]">Đặt cơm nhanh chóng</h4>
            <p className="text-xs text-[#5e6f66] mt-1 leading-relaxed">
              Chỉ 1 chạm để xác nhận đơn, hệ thống tự động trừ thẻ không cần nhập thông tin chuyển khoản mỗi ngày.
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#ede4d4] shadow-xs flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#eaf5ee] flex items-center justify-center text-[#0e563f] shrink-0">
            <Clock className="w-5 h-5 text-[#0e563f]" />
          </div>
          <div>
            <h4 className="font-black text-sm text-[#15221b]">Hủy đơn linh hoạt</h4>
            <p className="text-xs text-[#5e6f66] mt-1 leading-relaxed">
              Nếu có lịch họp đột xuất, bạn có thể hủy đơn trước 07:00 sáng và suất ăn sẽ tự động hoàn lại vào thẻ.
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#ede4d4] shadow-xs flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#eaf5ee] flex items-center justify-center text-[#0e563f] shrink-0">
            <ShieldCheck className="w-5 h-5 text-[#0e563f]" />
          </div>
          <div>
            <h4 className="font-black text-sm text-[#15221b]">Chất lượng chuẩn nhà làm</h4>
            <p className="text-xs text-[#5e6f66] mt-1 leading-relaxed">
              Nguyên liệu tươi ngon mỗi sáng, nấu vừa đủ theo đơn đã đặt, hạn chế tối đa dầu mỡ và đồ thừa.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
