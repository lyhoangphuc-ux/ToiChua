import React, { useState } from 'react';
import { FoodItem, CategoryType } from '../types';
import { FoodCard } from './FoodCard';
import {
  getDayOptions,
  isWednesday,
  WEDNESDAY_SPECIAL_DISH_IDS,
} from '../data/initialData';
import { Calendar, Search, Sparkles } from 'lucide-react';

interface MenuViewProps {
  foods: FoodItem[];
  activeDay: string;
  onSelectDay: (dayVal: string) => void;
  onAddToCart: (food: FoodItem) => void;
  cartCountMap: Record<number, number>;
}

export const MenuView: React.FC<MenuViewProps> = ({
  foods,
  activeDay,
  onSelectDay,
  onAddToCart,
  cartCountMap,
}) => {
  const [activeCat, setActiveCat] = useState<string>('Tất cả');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const dayOptions = getDayOptions();
  const isSelectedWed = isWednesday(activeDay);

  const categories: string[] = [
    'Tất cả',
    'Món nước',
    'Món khô',
    'Cơm',
    'Món chay',
    'Món thêm',
  ];

  const filteredFoods = foods.filter((f) => {
    // Category match
    let matchCat = false;
    if (activeCat === 'Tất cả') {
      matchCat = true;
    } else if (activeCat === 'Cơm') {
      matchCat = f.cat === 'Cơm' || f.cat.toLowerCase().includes('cơm');
    } else {
      matchCat = f.cat === activeCat;
    }

    // Search query match
    let matchSearch = true;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      matchSearch =
        f.name.toLowerCase().includes(q) ||
        f.desc.toLowerCase().includes(q) ||
        f.cat.toLowerCase().includes(q);
    }

    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-[#15221b] tracking-tight">Thực đơn Tới Trưa</h2>
          <p className="text-sm text-[#5e6f66] mt-1">
            Chọn ngày sử dụng và món ăn yêu thích của bạn. Thực đơn được nấu mới mỗi ngày.
          </p>
        </div>
        <span className="self-start sm:self-auto text-xs font-black tracking-wider bg-[#fef6e7] text-[#8c4e06] px-3.5 py-1.5 rounded-full border border-[#fed7aa]">
          MENU CÔNG BỐ TRƯỚC 3 NGÀY
        </span>
      </div>

      {/* Day filters */}
      <div>
        <div className="text-xs font-bold text-[#5e6f66] mb-2 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#0e563f]" />
            <span>Chọn ngày nhận cơm trưa (Đặt trước):</span>
          </div>
          <span className="text-[11px] text-[#8c4e06] font-semibold">
            Thứ Tư hàng tuần có ưu đãi -20%
          </span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {dayOptions.slice(0, 5).map((d) => {
            const isSelected = d.value === activeDay;
            return (
              <button
                key={d.value}
                onClick={() => onSelectDay(d.value)}
                className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all border cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#0e563f] text-white border-[#0e563f] shadow-sm'
                    : 'bg-white text-[#5e6f66] border-[#ede4d4] hover:border-[#0e563f]/40 hover:bg-[#f5efe3]'
                }`}
              >
                <span>{d.label}</span>
                {d.isWed && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                    isSelected ? 'bg-[#f59e0b] text-[#2d1e06]' : 'bg-[#fef6e7] text-[#8c4e06]'
                  }`}>
                    Thứ 4 vui vẻ
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Wednesday Special Banner */}
      {isSelectedWed && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-[#fef8eb] to-[#fef2dc] border border-[#fed7aa] text-[#7c4307] text-xs sm:text-sm flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#f59e0b] text-[#2d1e06] flex items-center justify-center font-black flex-shrink-0">
              <Sparkles className="w-4 h-4 text-[#2d1e06]" />
            </div>
            <div>
              <div className="font-black text-sm text-[#15221b]">
                Hôm nay áp dụng ưu đãi: Thứ Tư vui vẻ!
              </div>
              <div className="text-xs text-[#8c4e06]">
                Các món có nhãn <span className="font-bold underline">🔥 THỨ TƯ -20%</span> được giảm 20% khi nhập mã voucher <code className="bg-white px-1.5 py-0.5 rounded font-mono font-bold text-[#0e563f]">THUTUVUIVE</code> tại giỏ hàng!
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Category filters & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-1">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = activeCat === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCat(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border cursor-pointer ${
                  isSelected
                    ? 'bg-[#0e563f] text-white border-[#0e563f]'
                    : 'bg-white text-[#5e6f66] border-[#ede4d4] hover:border-[#0e563f]/40 hover:bg-[#f5efe3]'
                }`}
              >
                {cat === 'Tất cả' ? 'Tất cả món' : cat}
              </button>
            );
          })}
        </div>

        <div className="relative min-w-[220px]">
          <Search className="w-4 h-4 text-[#5e6f66] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm kiếm món ăn..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm rounded-xl border border-[#ede4d4] bg-white focus:outline-none focus:border-[#0e563f] text-[#15221b]"
          />
        </div>
      </div>

      {/* Foods Grid */}
      {filteredFoods.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredFoods.map((food) => {
            const hasWedDeal = isSelectedWed && WEDNESDAY_SPECIAL_DISH_IDS.includes(food.id);
            return (
              <FoodCard
                key={food.id}
                food={food}
                onAddToCart={onAddToCart}
                inCartCount={cartCountMap[food.id] || 0}
                isWednesdayDeal={hasWedDeal}
              />
            );
          })}
        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-2xl border border-[#ede4d4] text-[#5e6f66]">
          <div className="text-4xl mb-3">🍲</div>
          <h3 className="font-bold text-base text-[#15221b]">Không tìm thấy món ăn phù hợp</h3>
          <p className="text-xs mt-1">
            Hãy thử chọn nhóm món khác hoặc tìm từ khóa ngắn hơn.
          </p>
          <button
            onClick={() => {
              setActiveCat('Tất cả');
              setSearchQuery('');
            }}
            className="mt-3 px-4 py-2 rounded-xl bg-[#eaf5ee] text-[#0e563f] font-bold text-xs hover:bg-[#d8ecdf] transition-colors cursor-pointer"
          >
            Hiển thị tất cả món ăn
          </button>
        </div>
      )}
    </div>
  );
};

