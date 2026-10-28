import { FoodItem, PackageCatalogItem, Voucher, CartItem } from '../types';

export const INITIAL_FOODS: FoodItem[] = [
  {
    id: 1,
    name: 'Cơm gà sốt tiêu',
    cat: 'Cơm',
    price: 55000,
    emoji: '🍗',
    desc: 'Gà đùi áp chảo sốt tiêu đen thơm nồng đậm đà, ăn kèm cơm trắng nóng hổi và dưa leo giòn mát.',
    bg: 'from-amber-100 to-amber-200',
    tag: 'BÁN CHẠY',
    imageUrl: '/assets/images/com_ga_sot_tieu_1793112548727.jpg',
  },
  {
    id: 2,
    name: 'Cơm sườn nướng mật ong',
    cat: 'Cơm',
    price: 59000,
    emoji: '🍖',
    desc: 'Sườn cốt lết nướng than hoa mật ong xém cạnh thơm phức, mỡ hành béo ngậy, cơm tấm dẻo và đồ chua.',
    bg: 'from-rose-100 to-rose-200',
    tag: 'ĐƯỢC YÊU THÍCH',
    imageUrl: '/assets/images/com_suon_nuong_1793112602742.jpg',
  },
  {
    id: 3,
    name: 'Cơm cá kho tộ đậm đà',
    cat: 'Cơm',
    price: 52000,
    emoji: '🐟',
    desc: 'Cá kho trong tộ đất chuẩn vị Nam Bộ, nước sốt kẹo sánh tiêu ớt cay the, cơm trắng và rau luộc thanh mát.',
    bg: 'from-emerald-100 to-emerald-200',
    tag: 'MÓN MỚI',
    imageUrl: '/assets/images/ca_kho_to_1793112646720.jpg',
  },
  {
    id: 4,
    name: 'Cơm gà xé lá chanh',
    cat: 'Cơm',
    price: 50000,
    emoji: '🍱',
    desc: 'Gà ta xé phay trộn lá chanh thơm lừng, hành tây ngâm chua ngọt, rau răm và cơm nghệ vàng ươm.',
    bg: 'from-cyan-100 to-cyan-200',
    tag: 'NHẸ NHÀNG',
    imageUrl: '/assets/images/com_ga_xe_1793112670730.jpg',
  },
  {
    id: 5,
    name: 'Cơm đậu hũ kho nấm đông cô',
    cat: 'Món chay',
    price: 45000,
    emoji: '🥦',
    desc: 'Đậu hũ chiên vàng kho nấm đông cô đậm vị tương truyền thống, ăn cùng cơm trắng và dưa leo rau thơm.',
    bg: 'from-green-100 to-green-200',
    tag: 'MÓN CHAY',
    imageUrl: '/assets/images/dau_hu_kho_nam_1793112686996.jpg',
  },
  {
    id: 6,
    name: 'Cơm bò xào lúc lắc khoai tây',
    cat: 'Cơm',
    price: 65000,
    emoji: '🥩',
    desc: 'Thịt bò xào mềm thơm bơ tỏi, ớt chuông hành tây, khoai tây chiên giòn rụm và cơm chiên tỏi.',
    bg: 'from-orange-100 to-orange-200',
    tag: 'ĐỦ NĂNG LƯỢNG',
    imageUrl: '/assets/images/bo_luc_lac_1793112709293.jpg',
  },
  {
    id: 7,
    name: 'Bún bò Huế giò chả',
    cat: 'Món nước',
    price: 60000,
    emoji: '🍜',
    desc: 'Nước dùng ninh xương đậm đà hương sả ruốc, thịt nạm bò mềm, khoanh giò heo, chả lụa và rau ghém tươi.',
    bg: 'from-amber-100 to-orange-100',
    tag: 'MÓN NƯỚC',
    imageUrl: '/assets/images/bun_bo_hue_1793112741274.jpg',
  },
  {
    id: 8,
    name: 'Mì xào giòn hải sản',
    cat: 'Món khô',
    price: 58000,
    emoji: '🍝',
    desc: 'Vắt mì chiên phồng giòn tan sốt tôm sú, mực tươi khía hoa, cải thìa, cà rốt và nấm đông cô nước sốt sánh bóng.',
    bg: 'from-yellow-100 to-amber-200',
    tag: 'ĐƯỢC YÊU THÍCH',
    imageUrl: '/assets/images/mi_xao_gion_1793112771893.jpg',
  },
  {
    id: 9,
    name: 'Canh rong biển thịt bằm thêm',
    cat: 'Món thêm',
    price: 15000,
    emoji: '🥣',
    desc: 'Bát canh nóng hổi với rong biển thanh mát, thịt bằm ngọt nước, đậu hũ non và rắc mè rang thơm lừng.',
    bg: 'from-emerald-50 to-teal-100',
    tag: 'MÓN THÊM',
    imageUrl: '/assets/images/canh_rong_bien_1793112796182.jpg',
  }
];

export const DEFAULT_PACKAGES: PackageCatalogItem[] = [
  {
    id: 'p5',
    count: 5,
    price: 275000,
    originalPrice: 300000,
    title: 'Gói 5 suất ăn',
    tag: 'LINH HOẠT',
    desc: 'Phù hợp lịch ăn trưa linh hoạt trong tuần. Tiết kiệm công đặt hàng mỗi ngày.',
    image: '/assets/images/com_ga_xe_1793112670730.jpg',
    isActive: true,
    popular: false,
    features: [
      'Giảm ngay 20% mỗi phần cơm',
      'Thời hạn sử dụng lên đến 30 ngày',
      'Được hoàn tiền khi hủy đơn trước 07:00 sáng',
      'Phù hợp người mới thử nghiệm dịch vụ',
    ],
  },
  {
    id: 'p10',
    count: 10,
    price: 530000,
    originalPrice: 600000,
    title: 'Gói 10 suất ăn',
    tag: 'BÁN CHẠY NHẤT',
    desc: 'Lựa chọn số 1 của dân văn phòng. Tiết kiệm tối đa chi phí với quyền lợi trọn vẹn.',
    image: '/assets/images/com_suon_nuong_1793112602742.jpg',
    isActive: true,
    popular: true,
    features: [
      'Giảm sâu 20% toàn bộ thực đơn',
      'Thời hạn sử dụng lên đến 45 ngày',
      'Ưu tiên xếp món vào ca giao nóng sớm',
      'Tặng kèm 01 phần canh thanh nhiệt',
      'Hỗ trợ đổi món linh hoạt theo ngày',
    ],
  },
  {
    id: 'p20',
    count: 20,
    price: 1040000,
    originalPrice: 1200000,
    title: 'Gói 20 suất ăn',
    tag: 'TIẾT KIỆM TỐI ĐA',
    desc: 'Chủ động trọn vẹn bữa trưa cả tháng, tối ưu tài chính và ưu tiên chăm sóc khách VIP.',
    image: '/assets/images/bo_luc_lac_1793112709293.jpg',
    isActive: true,
    popular: false,
    features: [
      'Mức giá ưu đãi tốt nhất hệ thống (~52.000 ₫/suất)',
      'Thời hạn sử dụng lên đến 60 ngày',
      'Đặc quyền ưu tiên chế biến và giao hàng số 1',
      'Miễn phí đổi món hoặc dời ngày linh hoạt',
      'Hỗ trợ xuất hóa đơn VAT theo yêu cầu',
    ],
  },
];

export const DEFAULT_VOUCHERS: Voucher[] = [
  {
    id: 'v1',
    code: 'TRUANGON',
    title: 'Trưa ngon – Giá hời',
    description: 'Giảm 20% cho đơn hàng đầu tiên, tối đa 30.000đ.',
    badge: 'ĐƠN ĐẦU TIÊN -20%',
    discountType: 'first_order',
    percent: 20,
    maxDiscount: 30000,
  },
  {
    id: 'v2',
    code: 'HOIANTRUA',
    title: 'Rủ hội ăn trưa – Deal thêm vui',
    description: 'Đặt từ 4 phần cơm trở lên giảm 5% tổng đơn hàng.',
    badge: 'ĐẶT TỪ 4 PHẦN -5%',
    discountType: 'group_order',
    percent: 5,
    minQuantity: 4,
  },
  {
    id: 'v3',
    code: 'THUTUVUIVE',
    title: 'Thứ Tư vui vẻ',
    description: 'Mỗi thứ Tư, chọn một số món ăn giảm giá 20% (Cơm gà sốt tiêu, Cơm sườn nướng, Cơm đậu hũ nấm).',
    badge: 'THỨ TƯ DEAL -20%',
    discountType: 'wednesday',
    percent: 20,
  },
];

export const WEDNESDAY_SPECIAL_DISH_IDS = [1, 2, 5];

export function isWednesday(dateStr: string): boolean {
  if (!dateStr) return false;
  const d = new Date(dateStr + 'T00:00:00');
  return d.getDay() === 3; // 3 = Wednesday
}

export function checkVoucherEligibility(
  voucher: Voucher,
  cart: CartItem[],
  customerOrderCount: number,
  useDay: string
): { eligible: boolean; discount: number; reason?: string } {
  const totalQty = cart.reduce((s, i) => s + i.qty, 0);
  const rawSubtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);

  if (voucher.discountType === 'first_order') {
    if (customerOrderCount > 0) {
      return {
        eligible: false,
        discount: 0,
        reason: 'Chỉ áp dụng cho đơn hàng đầu tiên của bạn.',
      };
    }
    const calc = Math.round(rawSubtotal * 0.2);
    const capped = voucher.maxDiscount ? Math.min(calc, voucher.maxDiscount) : calc;
    return {
      eligible: true,
      discount: capped,
    };
  }

  if (voucher.discountType === 'group_order') {
    if (totalQty < (voucher.minQuantity || 4)) {
      return {
        eligible: false,
        discount: 0,
        reason: `Cần đặt từ 4 phần cơm trở lên (hiện có ${totalQty} phần).`,
      };
    }
    const discount = Math.round(rawSubtotal * 0.05);
    return {
      eligible: true,
      discount,
    };
  }

  if (voucher.discountType === 'wednesday') {
    const isWed = isWednesday(useDay);
    if (!isWed) {
      return {
        eligible: false,
        discount: 0,
        reason: 'Chỉ áp dụng cho đơn nhận cơm vào ngày Thứ Tư.',
      };
    }
    const wedItems = cart.filter((item) => WEDNESDAY_SPECIAL_DISH_IDS.includes(item.id));
    if (wedItems.length === 0) {
      return {
        eligible: false,
        discount: 0,
        reason: 'Giỏ hàng chưa có món ưu đãi Thứ Tư (Cơm gà sốt tiêu, Cơm sườn nướng, Cơm đậu hũ nấm).',
      };
    }
    const wedSubtotal = wedItems.reduce((s, i) => s + i.price * i.qty, 0);
    const discount = Math.round(wedSubtotal * 0.2);
    return {
      eligible: true,
      discount,
    };
  }

  return { eligible: false, discount: 0 };
}

export const FREE_SHIPPING_DISTRICTS = [
  'quận 1', 'q1',
  'quận 2', 'q2',
  'quận 3', 'q3',
  'quận 4', 'q4',
  'quận 5', 'q5',
  'quận 10', 'q10',
  'quận 12', 'q12',
  'bình thạnh',
  'gò vấp',
  'thủ đức',
  'tân bình',
  'tân phú'
];

export function getDayOptions(): { value: string; label: string; isWed: boolean; dateObj: Date }[] {
  const base = new Date();
  base.setHours(0, 0, 0, 0);

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(base);
    d.setDate(d.getDate() + i + 3); // Announced 3 days in advance
    const value = d.toISOString().slice(0, 10);
    const isWed = d.getDay() === 3;
    const label = d.toLocaleDateString('vi-VN', {
      weekday: 'short',
      day: '2-digit',
      month: '2-digit',
    });
    return { value, label, isWed, dateObj: d };
  });
}

export function formatVND(n: number): string {
  return new Intl.NumberFormat('vi-VN').format(n) + ' ₫';
}

export function calculateShipping(address: string): number {
  if (!address.trim()) return 0;
  const lower = address.toLowerCase();
  const isFree = FREE_SHIPPING_DISTRICTS.some((district) => lower.includes(district));
  return isFree ? 0 : 15000;
}

export const I18N = {
  vi: {
    home: 'Trang chủ',
    menu: 'Thực đơn',
    orders: 'Đơn hàng của tôi',
    member: 'Gói suất ăn',
    account: 'Tài khoản',
    settings: 'Cài đặt',
    checkout: 'Giỏ hàng',
    admin: 'Quản trị',
    brandTag: 'Trưa tới, ăn chưa?',
    heroEyebrow: 'Đặt trước thông minh · Giao nóng đúng giờ',
    heroTitle: 'Buổi trưa chưa tới,\ncơm đã tới rồi!',
    heroDesc: 'Chọn món yêu thích, đặt trước thật nhanh. Tới Trưa chuẩn bị vừa đủ và giao bữa trưa nóng hổi đến bạn đúng giờ.',
    exploreMenu: 'Khám phá thực đơn →',
    stat1Title: 'Trước 3 ngày',
    stat1Desc: 'Menu được công bố sớm',
    stat2Title: '09:00 – 11:30',
    stat2Desc: 'Khung giờ giao dự kiến',
    stat3Title: 'Chuẩn bị vừa đủ',
    stat3Desc: 'Hạn chế lãng phí thực phẩm',
    popularTitle: 'Món được yêu thích',
    popularDesc: 'Bữa trưa ngon miệng, giá cả hợp lý.',
    viewAll: 'Xem tất cả →',
    freeShippingNoticeTitle: 'Quy định phí giao hàng tại TP. Hồ Chí Minh',
    freeShippingNoticeHover: 'Miễn phí giao hàng tại: Bình Thạnh, TP. Thủ Đức, Gò Vấp, Quận 1, Quận 2, Quận 3, Quận 4, Quận 5, Quận 10, Quận 12, Tân Bình và Tân Phu. Các khu vực khác áp dụng phí giao hàng 15.000 ₫.',
  },
  en: {
    home: 'Home',
    menu: 'Menu',
    orders: 'My Orders',
    member: 'Meal Packages',
    account: 'Account',
    settings: 'Settings',
    checkout: 'Cart',
    admin: 'Admin',
    brandTag: 'Trưa tới, ăn chưa?',
    heroEyebrow: 'Smart Pre-order · On-time Delivery',
    heroTitle: 'Lunch arrives\nbefore noon!',
    heroDesc: 'Pick your favorite meal and pre-order in seconds. We cook with care and deliver warm meals on time.',
    exploreMenu: 'Explore Menu →',
    stat1Title: '3 Days Ahead',
    stat1Desc: 'Early announced weekly menu',
    stat2Title: '09:00 – 11:30',
    stat2Desc: 'Expected delivery window',
    stat3Title: 'Just-in-time Prep',
    stat3Desc: 'Zero food waste approach',
    popularTitle: 'Popular Dishes',
    popularDesc: 'Delicious lunches at friendly prices.',
    viewAll: 'View All →',
    freeShippingNoticeTitle: 'Shipping policy in Ho Chi Minh City',
    freeShippingNoticeHover: 'Free delivery in: Binh Thanh, Thu Duc City, Go Vap, Districts 1, 2, 3, 4, 5, 10, 12, Tan Binh and Tan Phu. Other districts have a 15,000 ₫ delivery fee.',
  },
};

export const INITIAL_CUSTOMERS = [
  {
    id: 'CUST-001',
    memberCode: 'TT-VIP-886',
    name: 'Nguyễn Văn An',
    email: 'lyhoangphuc3006@gmail.com',
    phone: '0903123456',
    password: 'password123',
    address: 'Tầng 12, Tòa nhà Bitexco, Số 2 Hải Triều, P. Bến Nghé, Quận 1',
    role: 'customer' as const,
    createdAt: '2026-10-15',
  },
  {
    id: 'CUST-002',
    memberCode: 'TT-MEM-204',
    name: 'Trần Thị Mai',
    email: 'tranmai@example.com',
    phone: '0988776655',
    password: 'password123',
    address: 'Tầng 8, E-Town 2, 364 Cộng Hòa, Phường 13, Quận Tân Bình',
    role: 'customer' as const,
    createdAt: '2026-10-18',
  },
  {
    id: 'CUST-003',
    memberCode: 'TT-MEM-412',
    name: 'Lê Hoàng Nam',
    email: 'namle@example.com',
    phone: '0912345678',
    password: 'password123',
    address: 'Tòa Opal Tower, Saigon Pearl, 92 Nguyễn Hữu Cảnh, Quận Bình Thạnh',
    role: 'customer' as const,
    createdAt: '2026-10-20',
  },
  {
    id: 'CUST-ADMIN',
    memberCode: 'TT-ADMIN-01',
    name: 'Quản Trị Viên Tới Trưa',
    email: 'admin@toitrua.vn',
    phone: '0900123456',
    password: 'admin',
    address: 'Văn phòng Điều Hành Tới Trưa, Quận 1, TP. Hồ Chí Minh',
    role: 'admin' as const,
    createdAt: '2026-10-01',
  },
];

export const INITIAL_DEMO_PACKAGES = [
  {
    id: 'GOI-VIP-886',
    customerId: 'CUST-001',
    memberCode: 'TT-VIP-886',
    title: 'Gói 20 suất ăn',
    count: 20,
    used: 7,
    price: 1040000,
    balance: 676000,
    tag: 'DÀI HẠN',
    datePurchased: '18/10/2026',
  },
  {
    id: 'GOI-MEM-204',
    customerId: 'CUST-002',
    memberCode: 'TT-MEM-204',
    title: 'Gói 10 suất ăn',
    count: 10,
    used: 4,
    price: 530000,
    balance: 318000,
    tag: 'TIẾT KIỆM',
    datePurchased: '21/10/2026',
  },
  {
    id: 'GOI-MEM-412',
    customerId: 'CUST-003',
    memberCode: 'TT-MEM-412',
    title: 'Gói 5 suất ăn',
    count: 5,
    used: 2,
    price: 275000,
    balance: 165000,
    tag: 'LINH HOẠT',
    datePurchased: '24/10/2026',
  },
];

export function generateInitialDemoOrders(): import('../types').Order[] {
  const days = getDayOptions();
  const targetDay = days[0]?.value || new Date().toISOString().slice(0, 10);
  const nextDay = days[1]?.value || targetDay;

  return [
    {
      id: 'TT-9821',
      name: 'Nguyễn Văn An',
      phone: '0903123456',
      address: 'Tầng 12, Tòa nhà Bitexco, 2 Hải Triều, P. Bến Nghé, Quận 1',
      day: targetDay,
      time: '10:30 – 11:00',
      note: 'Giao lễ tân tòa nhà, gọi trước 5 phút',
      payment: 'Thẻ thành viên Tới Trưa',
      customerId: 'CUST-001',
      memberCode: 'TT-VIP-886',
      packageId: 'GOI-VIP-886',
      packageCharge: 107200,
      packageQty: 2,
      refundProcessed: false,
      items: [
        { ...INITIAL_FOODS[1], qty: 2 }, // Cơm sườn nướng
        { ...INITIAL_FOODS[8], qty: 2 }, // Canh rong biển
      ],
      subtotal: 148000,
      discount: 29600,
      foodTotal: 118400,
      shipping: 0,
      total: 118400,
      status: 'Đang giao',
      payStatus: 'Đã thanh toán (Thẻ thành viên)',
      created: 'Hôm nay, 08:15',
      kitchenNote: 'Cơm sườn xén cạnh thơm vàng, canh nóng',
    },
    {
      id: 'TT-9822',
      name: 'Trần Thị Mai',
      phone: '0988776655',
      address: 'Tầng 8, E-Town 2, 364 Cộng Hòa, Phường 13, Quận Tân Bình',
      day: targetDay,
      time: '11:00 – 11:30',
      note: 'Ít tiêu cho món bò lúc lắc',
      payment: 'Chuyển khoản VietQR',
      customerId: 'CUST-002',
      memberCode: 'TT-MEM-204',
      packageId: null,
      packageCharge: 0,
      packageQty: 0,
      refundProcessed: false,
      items: [
        { ...INITIAL_FOODS[5], qty: 1 }, // Bò lúc lắc
        { ...INITIAL_FOODS[7], qty: 1 }, // Mì xào giòn
      ],
      subtotal: 123000,
      discount: 0,
      foodTotal: 123000,
      shipping: 0,
      total: 123000,
      status: 'Đang chuẩn bị',
      payStatus: 'Đã thanh toán VietQR',
      created: 'Hôm nay, 08:32',
      kitchenNote: 'Thịt bò xào mềm, sốt tiêu riêng',
    },
    {
      id: 'TT-9823',
      name: 'Lê Hoàng Nam',
      phone: '0912345678',
      address: 'Tòa Opal Tower, Saigon Pearl, 92 Nguyễn Hữu Cảnh, Bình Thạnh',
      day: targetDay,
      time: '10:00 – 10:30',
      note: 'Để bàn bảo vệ sảnh A',
      payment: 'Thẻ thành viên Tới Trưa',
      customerId: 'CUST-003',
      memberCode: 'TT-MEM-412',
      packageId: 'GOI-MEM-412',
      packageCharge: 168000,
      packageQty: 4,
      refundProcessed: false,
      items: [
        { ...INITIAL_FOODS[0], qty: 3 }, // Cơm gà sốt tiêu
        { ...INITIAL_FOODS[4], qty: 1 }, // Cơm đậu hũ nấm
      ],
      subtotal: 210000,
      discount: 42000,
      foodTotal: 168000,
      shipping: 0,
      total: 168000,
      status: 'Đã xác nhận',
      payStatus: 'Đã thanh toán (Thẻ thành viên)',
      created: 'Hôm nay, 07:45',
      kitchenNote: 'Phần chay đóng hộp màu xanh riêng',
    },
    {
      id: 'TT-9824',
      name: 'Phạm Quỳnh Trang',
      phone: '0933445566',
      address: 'Căn hộ 24.08, Landmark 81, 720A Điện Biên Phủ, Quận Bình Thạnh',
      day: targetDay,
      time: '10:30 – 11:00',
      note: 'Bún bò nước lèo để riêng, nhiều rau thơm',
      payment: 'Tiền mặt khi nhận (COD)',
      customerId: null,
      memberCode: null,
      packageId: null,
      packageCharge: 0,
      packageQty: 0,
      refundProcessed: false,
      items: [
        { ...INITIAL_FOODS[6], qty: 2 }, // Bún bò Huế
        { ...INITIAL_FOODS[8], qty: 1 }, // Canh rong biển
      ],
      subtotal: 135000,
      discount: 0,
      foodTotal: 135000,
      shipping: 0,
      total: 135000,
      status: 'Chờ xác nhận',
      payStatus: 'Chưa thanh toán (COD)',
      created: 'Hôm nay, 08:50',
    },
    {
      id: 'TT-9825',
      name: 'Vũ Minh Đức',
      phone: '0977889900',
      address: 'Tòa nhà Techcombank, 23 Lê Duẩn, Phường Bến Nghé, Quận 1',
      day: targetDay,
      time: '11:00 – 11:30',
      note: 'Giao lên tầng 5 phòng Công Nghệ',
      payment: 'Ví điện tử MoMo',
      customerId: null,
      memberCode: null,
      packageId: null,
      packageCharge: 0,
      packageQty: 0,
      refundProcessed: false,
      items: [
        { ...INITIAL_FOODS[2], qty: 1 }, // Cá kho tộ
        { ...INITIAL_FOODS[3], qty: 1 }, // Cơm gà xé
      ],
      subtotal: 102000,
      discount: 0,
      voucherCode: 'TRUANGON',
      voucherDiscount: 20400,
      foodTotal: 81600,
      shipping: 0,
      total: 81600,
      status: 'Đang chuẩn bị',
      payStatus: 'Đã thanh toán MoMo',
      created: 'Hôm nay, 07:15',
    },
    {
      id: 'TT-9826',
      name: 'Đỗ Bích Ngọc',
      phone: '0909112233',
      address: 'Sunwah Tower, 115 Nguyễn Huệ, Phường Bến Nghé, Quận 1',
      day: nextDay,
      time: '10:00 – 10:30',
      note: 'Khách ăn chay định kỳ',
      payment: 'Thẻ thành viên Tới Trưa',
      customerId: 'CUST-001',
      memberCode: 'TT-VIP-886',
      packageId: 'GOI-VIP-886',
      packageCharge: 96000,
      packageQty: 2,
      refundProcessed: false,
      items: [
        { ...INITIAL_FOODS[4], qty: 2 }, // Đậu hũ nấm
        { ...INITIAL_FOODS[8], qty: 2 }, // Canh rong biển
      ],
      subtotal: 120000,
      discount: 24000,
      foodTotal: 96000,
      shipping: 0,
      total: 96000,
      status: 'Đã xác nhận',
      payStatus: 'Đã thanh toán (Thẻ thành viên)',
      created: 'Hôm qua, 17:30',
    },
    {
      id: 'TT-9827',
      name: 'Hoàng Quốc Tuấn',
      phone: '0945678901',
      address: 'Tòa nhà FPT Software, Khu Công Nghệ Cao, TP. Thủ Đức',
      day: nextDay,
      time: '11:00 – 11:30',
      note: 'Đơn nhóm 6 người',
      payment: 'Chuyển khoản VietQR',
      customerId: null,
      memberCode: null,
      packageId: null,
      packageCharge: 0,
      packageQty: 0,
      refundProcessed: false,
      items: [
        { ...INITIAL_FOODS[1], qty: 4 }, // Cơm sườn
        { ...INITIAL_FOODS[5], qty: 2 }, // Bò lúc lắc
      ],
      subtotal: 366000,
      discount: 18300,
      voucherCode: 'HOIANTRUA',
      voucherDiscount: 18300,
      foodTotal: 347700,
      shipping: 0,
      total: 347700,
      status: 'Đã xác nhận',
      payStatus: 'Đã thanh toán VietQR',
      created: 'Hôm qua, 18:00',
    },
    {
      id: 'TT-9820',
      name: 'Bùi Thanh Hương',
      phone: '0922334455',
      address: 'Chung cư Masteri Thảo Điền, Xa Lộ Hà Nội, TP. Thủ Đức',
      day: targetDay,
      time: '09:30 – 10:00',
      note: 'Hủy đơn do bận họp đột xuất',
      payment: 'Thẻ thành viên Tới Trưa',
      customerId: 'CUST-002',
      memberCode: 'TT-MEM-204',
      packageId: 'GOI-MEM-204',
      packageCharge: 44000,
      packageQty: 1,
      refundProcessed: true,
      items: [{ ...INITIAL_FOODS[0], qty: 1 }],
      subtotal: 55000,
      discount: 11000,
      foodTotal: 44000,
      shipping: 0,
      total: 44000,
      status: 'Đã hủy',
      payStatus: 'Đã hoàn tiền vào thẻ ăn',
      created: 'Hôm nay, 06:10',
    },
  ];
}

