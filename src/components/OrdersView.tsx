import React, { useState } from 'react';
import { Order, UserPackage, PageId } from '../types';
import { formatVND } from '../data/initialData';
import {
  Package,
  Clock,
  MapPin,
  Calendar,
  AlertTriangle,
  RotateCcw,
  CheckCircle,
  XCircle,
  Truck,
  CookingPot,
} from 'lucide-react';

interface OrdersViewProps {
  orders: Order[];
  onCancelOrder: (orderId: string) => void;
  onNavigate: (page: PageId) => void;
}

export const OrdersView: React.FC<OrdersViewProps> = ({
  orders,
  onCancelOrder,
  onNavigate,
}) => {
  const [filter, setFilter] = useState<string>('all');

  const formatOrderCreated = (created: string) => {
    if (!created) return 'Vừa xong';
    const d = new Date(created);
    if (!isNaN(d.getTime())) {
      return `${d.toLocaleDateString('vi-VN')} ${d.toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
      })}`;
    }
    return created;
  };

  const filteredOrders = orders.filter((o) => {
    if (filter === 'all') return true;
    if (filter === 'active') return !['Đã giao', 'Đã hủy', 'Giao thất bại'].includes(o.status);
    if (filter === 'completed') return o.status === 'Đã giao';
    if (filter === 'cancelled') return o.status === 'Đã hủy';
    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Đã giao':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-[#eaf5ee] text-[#0e563f] border border-[#cbe3d4]">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Đã giao</span>
          </span>
        );
      case 'Đang giao':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-blue-50 text-blue-700 border border-blue-200">
            <Truck className="w-3.5 h-3.5" />
            <span>Đang giao hàng</span>
          </span>
        );
      case 'Đang chuẩn bị':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-[#fef8eb] text-[#8c4e06] border border-[#fed7aa]">
            <CookingPot className="w-3.5 h-3.5 text-[#f59e0b]" />
            <span>Đang chuẩn bị</span>
          </span>
        );
      case 'Chờ xác nhận':
      case 'Đã xác nhận':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-[#fef6e7] text-[#8c4e06] border border-[#fed7aa]">
            <Clock className="w-3.5 h-3.5 text-[#f59e0b]" />
            <span>{status}</span>
          </span>
        );
      case 'Đã hủy':
      case 'Giao thất bại':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-[#fce9e7] text-[#b64239] border border-rose-200">
            <XCircle className="w-3.5 h-3.5" />
            <span>{status}</span>
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-black bg-gray-100 text-gray-700">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-[#15221b] tracking-tight">Đơn hàng của tôi</h2>
          <p className="text-sm text-[#5e6f66] mt-1">
            Theo dõi trạng thái giao cơm và lịch sử các bữa trưa đã đặt.
          </p>
        </div>

        {/* Status filters */}
        <div className="flex gap-1.5 p-1 bg-[#ede8dc] rounded-2xl self-start sm:self-auto text-xs font-bold">
          <button
            onClick={() => setFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
              filter === 'all'
                ? 'bg-white text-[#0e563f] shadow-xs'
                : 'text-[#5e6f66] hover:text-[#15221b]'
            }`}
          >
            Tất cả ({orders.length})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
              filter === 'active'
                ? 'bg-white text-[#0e563f] shadow-xs'
                : 'text-[#5e6f66] hover:text-[#15221b]'
            }`}
          >
            Đang xử lý
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
              filter === 'completed'
                ? 'bg-white text-[#0e563f] shadow-xs'
                : 'text-[#5e6f66] hover:text-[#15221b]'
            }`}
          >
            Đã giao
          </button>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-[#ede4d4] shadow-sm max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-[#eaf5ee] text-[#0e563f] flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-black text-[#15221b]">Chưa có đơn hàng nào</h3>
          <p className="text-xs text-[#5e6f66] mt-1.5 max-w-sm mx-auto">
            Bạn chưa đặt bữa trưa nào trong mục này. Khám phá thực đơn và lên lịch bữa ăn thơm ngon ngay hôm nay!
          </p>
          <button
            onClick={() => onNavigate('menu')}
            className="mt-5 px-5 py-2.5 rounded-xl bg-[#0e563f] text-white font-extrabold text-xs hover:bg-[#12694d] transition-all cursor-pointer shadow-sm"
          >
            Khám phá thực đơn ngay →
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const isCancelled = order.status === 'Đã hủy';
            return (
              <div
                key={order.id}
                className="bg-white rounded-3xl border border-[#ede4d4] p-5 sm:p-6 shadow-[0_4px_25px_rgba(14,86,63,0.04)] hover:border-[#0e563f]/30 transition-all space-y-4"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#ede4d4] pb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-base font-black text-[#0e563f]">
                      #{order.id}
                    </span>
                    <span className="text-xs text-[#5e6f66]">
                      Đặt lúc: {formatOrderCreated(order.created)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(order.status)}
                    <span className="text-xs font-bold text-[#5e6f66]">
                      {order.payStatus}
                    </span>
                  </div>
                </div>

                {/* Details grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <div className="font-bold text-[#5e6f66] mb-1 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#0e563f]" />
                      <span>Thời gian nhận cơm</span>
                    </div>
                    <div className="text-sm font-extrabold text-[#15221b]">
                      {order.day}
                    </div>
                    <div className="text-[#5e6f66] mt-0.5">Khung giờ: {order.time}</div>
                  </div>

                  <div>
                    <div className="font-bold text-[#5e6f66] mb-1 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#0e563f]" />
                      <span>Người nhận & Địa chỉ</span>
                    </div>
                    <div className="font-bold text-[#15221b]">
                      {order.name} - {order.phone}
                    </div>
                    <div className="text-[#5e6f66] mt-0.5 line-clamp-2">
                      {order.address}
                    </div>
                    {order.note && (
                      <div className="text-[11px] text-[#8c4e06] mt-1 bg-[#fef8eb] p-1 rounded border border-[#fed7aa]">
                        Ghi chú: {order.note}
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="font-bold text-[#5e6f66] mb-1">Thanh toán & Chi phí</div>
                    <div className="text-sm font-extrabold text-[#0e563f]">
                      {formatVND(order.total)}
                    </div>
                    <div className="text-[#5e6f66] mt-0.5">
                      Phương thức: {order.payment}
                    </div>
                    {order.discount > 0 && (
                      <div className="text-[11px] text-[#0e563f] font-bold">
                        Đã giảm trừ ({formatVND(order.discount)})
                      </div>
                    )}
                    {order.voucherCode && (
                      <div className="text-[11px] text-[#8c4e06] font-extrabold bg-[#fef6e7] border border-[#fed7aa] px-2 py-0.5 rounded mt-1 inline-block">
                        Voucher {order.voucherCode} ({formatVND(order.voucherDiscount || 0)})
                      </div>
                    )}
                  </div>
                </div>

                {/* Items list */}
                <div className="p-3.5 rounded-xl bg-[#fbf8f1] border border-[#ede4d4] space-y-1.5">
                  <div className="text-xs font-extrabold text-[#5e6f66] mb-1">
                    Danh sách phần cơm:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between text-xs p-2 rounded-lg bg-white border border-[#ede4d4]"
                      >
                        <span className="font-bold text-[#15221b] truncate">
                          {item.name}
                        </span>
                        <span className="font-extrabold text-[#0e563f] ml-2">
                          × {item.qty}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action footer */}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-[#5e6f66]">
                    * Hủy đơn ăn trong ngày trước 07:00 sáng được tự động hoàn tiền/suất ăn.
                  </span>

                  {!isCancelled && (
                    <button
                      onClick={() => onCancelOrder(order.id)}
                      className="px-3.5 py-1.5 rounded-xl border border-[#fce9e7] bg-[#fff5f5] hover:bg-[#ffebeb] text-[#c84b42] font-bold text-xs transition-colors cursor-pointer"
                    >
                      Hủy đơn hàng này
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Policy note */}
      <div className="p-4 rounded-2xl bg-[#fef8eb] border border-[#fed7aa] text-[#7c4307] text-xs flex items-center gap-2.5">
        <AlertTriangle className="w-4 h-4 text-[#f59e0b] flex-shrink-0" />
        <span>
          <b>Quy định hủy đơn:</b> Vì tính chất nấu ăn tươi nóng và chống lãng phí, đơn đặt trước chỉ được hủy trước <b>07:00 sáng</b> của ngày giao cơm. Khi hủy hợp lệ, thẻ ăn hoặc tiền chuyển khoản sẽ được hoàn lại tự động.
        </span>
      </div>
    </div>
  );
};

