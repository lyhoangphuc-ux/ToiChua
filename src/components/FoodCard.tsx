import React from 'react';
import { Plus } from 'lucide-react';
import { FoodItem } from '../types';
import { formatVND } from '../data/initialData';

interface FoodCardProps {
  food: FoodItem;
  onAddToCart: (food: FoodItem) => void;
  inCartCount?: number;
  isWednesdayDeal?: boolean;
}

export const FoodCard: React.FC<FoodCardProps> = ({
  food,
  onAddToCart,
  inCartCount = 0,
  isWednesdayDeal = false,
}) => {
  const defaultImages: Record<number, string> = {
    1: '/assets/images/com_ga_sot_tieu_1793112548727.jpg',
    2: '/assets/images/com_suon_nuong_1793112602742.jpg',
    3: '/assets/images/ca_kho_to_1793112646720.jpg',
    4: '/assets/images/com_ga_xe_1793112670730.jpg',
    5: '/assets/images/dau_hu_kho_nam_1793112686996.jpg',
    6: '/assets/images/bo_luc_lac_1793112709293.jpg',
    7: '/assets/images/bun_bo_hue_1793112741274.jpg',
    8: '/assets/images/mi_xao_gion_1793112771893.jpg',
    9: '/assets/images/canh_rong_bien_1793112796182.jpg',
  };

  const imageSrc =
    food.imageUrl ||
    defaultImages[food.id] ||
    '/assets/images/com_ga_sot_tieu_1793112548727.jpg';

  const discountedPrice = Math.round(food.price * 0.8);

  return (
    <article className="group bg-white rounded-2xl border border-[#ede4d4] overflow-hidden shadow-[0_4px_20px_rgba(14,86,63,0.04)] hover:shadow-[0_16px_32px_rgba(14,86,63,0.1)] transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between">
      <div>
        <div className="relative h-44 w-full overflow-hidden bg-gradient-to-br from-[#fbf5e9] to-[#f7ecda]">
          <img
            src={imageSrc}
            alt={food.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                defaultImages[food.id] || '/assets/images/com_ga_sot_tieu_1793112548727.jpg';
            }}
          />
          {isWednesdayDeal ? (
            <span className="absolute top-3 left-3 bg-[#f59e0b] text-[#2d1e06] text-[11px] font-black px-2.5 py-1 rounded-lg shadow-sm tracking-wide">
              🔥 THỨ TƯ -20%
            </span>
          ) : (
            food.tag && (
              <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs text-[#0e563f] text-[11px] font-extrabold px-2.5 py-1 rounded-lg shadow-sm tracking-wide border border-[#cbe3d4]">
                {food.tag}
              </span>
            )
          )}
          {inCartCount > 0 && (
            <span className="absolute top-3 right-3 bg-[#f59e0b] text-[#2d1e06] text-[11px] font-black px-2 py-0.5 rounded-full shadow-sm">
              Đã chọn: {inCartCount}
            </span>
          )}
        </div>

        <div className="p-4">
          <div className="flex items-center gap-1.5 text-xs text-[#5e6f66] mb-1 font-semibold">
            <span>{food.emoji}</span>
            <span>{food.cat}</span>
          </div>
          <h3 className="font-bold text-[16.5px] text-[#15221b] group-hover:text-[#0e563f] transition-colors leading-snug">
            {food.name}
          </h3>
          <p className="text-xs text-[#5e6f66] mt-1.5 leading-relaxed line-clamp-2 min-h-[34px]">
            {food.desc ||
              'Bữa trưa được chế biến tươi sạch, đảm bảo hương vị và dinh dưỡng mỗi ngày.'}
          </p>
        </div>
      </div>

      <div className="px-4 pb-4 pt-1 flex items-center justify-between border-t border-[#ede4d4] mt-2">
        <div>
          <span className="text-[11px] uppercase tracking-wider text-[#5e6f66] font-semibold block -mb-0.5">
            {isWednesdayDeal ? 'Giá Thứ Tư (Mã: THUTUVUIVE)' : 'Giá phần ăn'}
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-extrabold text-[#0e563f] tracking-tight">
              {formatVND(isWednesdayDeal ? discountedPrice : food.price)}
            </span>
            {isWednesdayDeal && (
              <span className="text-xs text-[#5e6f66] line-through">
                {formatVND(food.price)}
              </span>
            )}
          </div>
        </div>
        <button
          onClick={() => onAddToCart(food)}
          aria-label={`Thêm ${food.name}`}
          className="w-9 h-9 rounded-xl bg-[#0e563f] hover:bg-[#12694d] active:scale-95 text-white flex items-center justify-center transition-all shadow-sm cursor-pointer"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
        </button>
      </div>
    </article>
  );
};

