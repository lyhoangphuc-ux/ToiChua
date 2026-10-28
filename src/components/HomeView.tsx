import React, { useState } from 'react';
import { FoodItem, Language, PageId } from '../types';
import { FoodCard } from './FoodCard';
import { I18N, DEFAULT_VOUCHERS } from '../data/initialData';
import {
  Calendar,
  Clock,
  Leaf,
  ArrowRight,
  Info,
  Truck,
  Phone,
  Mail,
  Sparkles,
  Tag,
  Copy,
  Check,
} from 'lucide-react';

interface HomeViewProps {
  foods: FoodItem[];
  onAddToCart: (food: FoodItem) => void;
  onNavigate: (page: PageId) => void;
  language: Language;
  cartCountMap: Record<number, number>;
}

export const HomeView: React.FC<HomeViewProps> = ({
  foods,
  onAddToCart,
  onNavigate,
  language,
  cartCountMap,
}) => {
  const [showShipTooltip, setShowShipTooltip] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const t = I18N[language];

  const popularFoods = foods.slice(0, 3);

  const handleCopyCode = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Hero section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#093c2b] via-[#0e563f] to-[#147250] text-white p-7 sm:p-10 lg:p-12 shadow-[0_20px_45px_rgba(14,86,63,0.18)]">
        {/* Decorative background shape & warm golden accent */}
        <div className="absolute right-10 -top-20 w-80 h-80 rounded-full border border-white/10 pointer-events-none" />
        <div className="absolute right-1/4 -bottom-24 w-72 h-72 rounded-full bg-[#f59e0b]/20 blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.9fr] items-center gap-8 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-xs text-xs uppercase tracking-wider font-extrabold text-[#fde68a] mb-3 border border-white/15">
              <Sparkles className="w-3.5 h-3.5 text-[#f59e0b]" />
              <span>Đặt trước thông minh · Giao nóng đúng giờ</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.12] mb-4">
              Buổi trưa chưa tới,
              <br />
              <span className="text-[#f59e0b]">cơm đã tới rồi!</span>
            </h1>
            <p className="text-[#d8eae0] text-sm sm:text-base leading-relaxed max-w-xl mb-6">
              {t.heroDesc}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => onNavigate('menu')}
                className="px-6 py-3.5 rounded-xl bg-[#f59e0b] hover:bg-[#e08e04] text-[#2d1e06] font-black text-sm tracking-wide shadow-lg hover:shadow-xl active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>{t.exploreMenu}</span>
              </button>
              <button
                onClick={() => onNavigate('member')}
                className="px-5 py-3.5 rounded-xl bg-white/15 hover:bg-white/20 text-white font-bold text-sm backdrop-blur-xs border border-white/20 transition-all cursor-pointer"
              >
                <span>Xem gói suất ăn (-20%)</span>
              </button>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <div className="relative group">
              <div className="absolute -inset-1 rounded-3xl bg-[#f59e0b]/25 blur-lg group-hover:blur-xl transition-all" />
              <img
                src="/assets/images/com_suon_nuong_1793112602742.jpg"
                alt="Bữa cơm trưa Tới Trưa"
                className="relative rounded-3xl w-full max-w-[360px] h-[230px] sm:h-[260px] object-cover shadow-2xl rotate-2 group-hover:rotate-0 transition-transform duration-500 border-2 border-white/20"
                loading="lazy"
              />
              <div className="absolute bottom-3 left-3 right-3 bg-black/65 backdrop-blur-md rounded-xl p-2.5 text-xs text-white flex items-center justify-between border border-white/15">
                <span className="font-bold">Đầy đủ dinh dưỡng & sạch sẽ</span>
                <span className="text-[#f59e0b] font-black">Chuẩn vị nhà làm</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#ede4d4] shadow-[0_4px_20px_rgba(14,86,63,0.04)] flex items-center gap-4 hover:border-[#0e563f]/30 transition-all">
          <div className="w-12 h-12 rounded-xl bg-[#eaf5ee] flex items-center justify-center text-[#0e563f] flex-shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <div className="text-lg font-black text-[#15221b] leading-snug">
              {t.stat1Title}
            </div>
            <div className="text-xs text-[#5e6f66] font-medium">{t.stat1Desc}</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#ede4d4] shadow-[0_4px_20px_rgba(14,86,63,0.04)] flex items-center gap-4 hover:border-[#0e563f]/30 transition-all">
          <div className="w-12 h-12 rounded-xl bg-[#eaf5ee] flex items-center justify-center text-[#0e563f] flex-shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-lg font-black text-[#15221b] leading-snug">
              {t.stat2Title}
            </div>
            <div className="text-xs text-[#5e6f66] font-medium">{t.stat2Desc}</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#ede4d4] shadow-[0_4px_20px_rgba(14,86,63,0.04)] flex items-center gap-4 hover:border-[#0e563f]/30 transition-all">
          <div className="w-12 h-12 rounded-xl bg-[#eaf5ee] flex items-center justify-center text-[#0e563f] flex-shrink-0">
            <Leaf className="w-6 h-6" />
          </div>
          <div>
            <div className="text-lg font-black text-[#15221b] leading-snug">
              {t.stat3Title}
            </div>
            <div className="text-xs text-[#5e6f66] font-medium">{t.stat3Desc}</div>
          </div>
        </div>
      </div>

      {/* Voucher & Promotion Highlights Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#fef6e7] text-[#8c4e06] flex items-center justify-center font-bold">
              <Tag className="w-4 h-4 text-[#f59e0b]" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[#15221b] tracking-tight">
                Ưu đãi & Voucher hôm nay
              </h2>
              <p className="text-xs text-[#5e6f66]">
                Chọn mã giảm giá yêu thích và áp dụng trực tiếp tại bước thanh toán.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {DEFAULT_VOUCHERS.map((v) => (
            <div
              key={v.id}
              className="bg-white rounded-2xl p-5 border border-[#ede4d4] shadow-[0_4px_20px_rgba(14,86,63,0.04)] hover:shadow-md hover:border-[#0e563f]/40 transition-all flex flex-col justify-between relative overflow-hidden"
            >
              {/* Decorative top ribbon */}
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-[#eaf5ee] rounded-full pointer-events-none" />

              <div className="space-y-2 relative z-10">
                <span className="inline-block text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#fef6e7] text-[#8c4e06] border border-[#fed7aa]">
                  {v.badge}
                </span>
                <h3 className="font-black text-base text-[#15221b]">{v.title}</h3>
                <p className="text-xs text-[#5e6f66] leading-relaxed min-h-[38px]">
                  {v.description}
                </p>
              </div>

              <div className="pt-3 border-t border-[#ede4d4] mt-3 flex items-center justify-between gap-2 relative z-10">
                <div className="flex items-center gap-1.5 bg-[#fbf8f1] px-2.5 py-1.5 rounded-xl border border-[#ede4d4]">
                  <span className="text-[10px] text-[#5e6f66] uppercase font-bold">MÃ:</span>
                  <code className="text-xs font-black text-[#0e563f] font-mono tracking-wider">
                    {v.code}
                  </code>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopyCode(v.code)}
                  className="px-3 py-1.5 rounded-xl bg-[#eaf5ee] hover:bg-[#0e563f] hover:text-white text-[#0e563f] font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  {copiedCode === v.code ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Đã chép</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Sao chép</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Foods Section */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-5">
          <div>
            <h2 className="text-2xl font-black text-[#15221b] tracking-tight">{t.popularTitle}</h2>
            <p className="text-xs sm:text-sm text-[#5e6f66] mt-0.5">{t.popularDesc}</p>
          </div>
          <button
            onClick={() => onNavigate('menu')}
            className="self-start sm:self-auto px-4 py-2 rounded-xl bg-white hover:bg-[#eaf5ee] border border-[#ede4d4] text-[#0e563f] font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
          >
            <span>{t.viewAll}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {popularFoods.map((food) => (
            <FoodCard
              key={food.id}
              food={food}
              onAddToCart={onAddToCart}
              inCartCount={cartCountMap[food.id] || 0}
            />
          ))}
        </div>
      </div>

      {/* Tip notice */}
      <div className="p-4 rounded-2xl bg-[#fef8eb] border border-[#fde68a] text-[#7c4307] text-xs sm:text-sm flex items-start gap-3 shadow-xs">
        <Info className="w-5 h-5 text-[#f59e0b] flex-shrink-0 mt-0.5" />
        <div>
          <b>Mẹo nhỏ cho bạn:</b> Bạn có thể hủy đơn ăn trong ngày trước <b>07:00 sáng</b>. Hãy đặt trước hôm nay để Tới Trưa chuẩn bị phần ăn chu đáo nhất và giao tận bàn làm việc nhé!
        </div>
      </div>

      {/* Shipping hover notice */}
      <div
        className="relative p-4 rounded-2xl bg-white border border-[#ede4d4] text-[#15221b] cursor-pointer hover:border-[#0e563f] transition-all shadow-xs"
        onMouseEnter={() => setShowShipTooltip(true)}
        onMouseLeave={() => setShowShipTooltip(false)}
        onClick={() => setShowShipTooltip(!showShipTooltip)}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 font-bold text-sm text-[#0e563f]">
            <Truck className="w-4 h-4 text-[#f59e0b]" />
            <span>🚚 Quy định phí giao hàng tại TP. Hồ Chí Minh</span>
          </div>
          <span className="text-[11px] text-[#5e6f66] hidden sm:inline-block">
            {showShipTooltip ? 'Nhấn để ẩn chi tiết' : 'Rê chuột / Nhấn để xem danh sách khu vực'}
          </span>
        </div>
        <p className="text-xs text-[#5e6f66] mt-1.5 leading-relaxed">
          Miễn phí 100% giao hàng tại 12 quận trọng điểm. Phí đồng giá 15.000 ₫ cho các khu vực còn lại.
        </p>

        {showShipTooltip && (
          <div className="mt-3 p-3.5 rounded-xl bg-[#eaf5ee] border border-[#0e563f]/20 text-xs text-[#15221b] space-y-1">
            <div className="font-extrabold text-[#0e563f]">
              ✨ Danh sách quận/huyện MIỄN PHÍ giao hàng:
            </div>
            <p className="leading-relaxed">
              Bình Thạnh, TP. Thủ Đức, Gò Vấp, Quận 1, Quận 2, Quận 3, Quận 4, Quận 5, Quận 10, Quận 12, Tân Bình và Tân Phú.
            </p>
            <div className="text-[11px] text-[#5e6f66] pt-1">
              * Hệ thống sẽ tự động miễn phí giao hàng khi bạn nhập địa chỉ thuộc các khu vực trên.
            </div>
          </div>
        )}
      </div>

      {/* Customer Support Panel */}
      <div className="bg-white rounded-2xl p-6 border border-[#ede4d4] shadow-[0_8px_25px_rgba(14,86,63,0.04)] space-y-4">
        <div>
          <h3 className="text-lg font-black text-[#15221b]">Chăm sóc khách hàng (CSKH)</h3>
          <p className="text-xs text-[#5e6f66] mt-1">
            Tới Trưa luôn sẵn sàng hỗ trợ bạn về thực đơn, điều chỉnh khung giờ và giải đáp quyền lợi gói suất ăn.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div className="p-3.5 rounded-xl bg-[#fbf8f1] border border-[#ede4d4]">
            <div className="text-xs font-bold text-[#5e6f66] flex items-center gap-1.5 mb-1">
              <Phone className="w-3.5 h-3.5 text-[#0e563f]" />
              <span>Điện thoại hỗ trợ</span>
            </div>
            <a
              href="tel:19001234"
              className="text-base font-extrabold text-[#0e563f] hover:underline"
            >
              1900 1234
            </a>
          </div>

          <div className="p-3.5 rounded-xl bg-[#fbf8f1] border border-[#ede4d4]">
            <div className="text-xs font-bold text-[#5e6f66] flex items-center gap-1.5 mb-1">
              <Mail className="w-3.5 h-3.5 text-[#0e563f]" />
              <span>Email CSKH</span>
            </div>
            <a
              href="mailto:cskh@toitrua.vn"
              className="text-sm font-extrabold text-[#0e563f] hover:underline break-all"
            >
              cskh@toitrua.vn
            </a>
          </div>
        </div>
        <p className="text-[11px] text-[#5e6f66] italic">
          * Thông tin liên hệ phục vụ minh họa cho bản demo nghiệp vụ đặt cơm trưa thông minh Tới Trưa.
        </p>
      </div>
    </div>
  );
};

