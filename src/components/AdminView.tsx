import React, { useState, useMemo } from 'react';
import {
  Customer,
  FoodItem,
  Order,
  OrderStatus,
  PackageCatalogItem,
  UserPackage,
  Voucher,
} from '../types';
import {
  formatVND,
  getDayOptions,
  INITIAL_FOODS,
  DEFAULT_VOUCHERS,
  generateInitialDemoOrders,
  INITIAL_CUSTOMERS,
  INITIAL_DEMO_PACKAGES,
} from '../data/initialData';
import {
  BarChart3,
  CookingPot,
  PlusCircle,
  Download,
  Trash2,
  CheckCircle,
  PackageCheck,
  TrendingUp,
  Search,
  Filter,
  Printer,
  Eye,
  AlertCircle,
  Clock,
  MapPin,
  Phone,
  User,
  ShieldCheck,
  ArrowLeft,
  Edit,
  Tag,
  Gift,
  Users,
  RefreshCw,
  X,
  Calendar,
  Layers,
  ChevronRight,
  Database,
  CheckSquare,
  Square,
  FileSpreadsheet,
  Loader2,
  ToggleLeft,
  ToggleRight,
  Sliders,
  Sparkles,
  Check,
} from 'lucide-react';

interface AdminViewProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  onBulkUpdateOrderStatus?: (orderIds: string[], newStatus: OrderStatus) => void;
  onAddOrder?: (newOrder: Order) => void;
  foods: FoodItem[];
  onAddFood: (newFood: Omit<FoodItem, 'id'>) => void;
  onUpdateFood?: (foodId: number, updated: Partial<FoodItem>) => void;
  onRemoveFood: (foodId: number) => void;
  onResetFoods?: () => void;
  packages: UserPackage[];
  onUpdatePackages?: (packages: UserPackage[]) => void;
  packageCatalog?: PackageCatalogItem[];
  onUpdatePackageCatalog?: (packages: PackageCatalogItem[]) => void;
  customers?: Customer[];
  onUpdateCustomers?: (customers: Customer[]) => void;
  onToast: (msg: string) => void;
  onNavigateHome: () => void;
  onSeedDemoData?: () => void;
  onClearOrders?: () => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  orders,
  onUpdateOrderStatus,
  onBulkUpdateOrderStatus,
  onAddOrder,
  foods,
  onAddFood,
  onUpdateFood,
  onRemoveFood,
  onResetFoods,
  packages,
  onUpdatePackages,
  packageCatalog = [],
  onUpdatePackageCatalog,
  customers = [],
  onUpdateCustomers,
  onToast,
  onNavigateHome,
  onSeedDemoData,
  onClearOrders,
}) => {
  // Tabs
  const [adminTab, setAdminTab] = useState<
    'overview' | 'orders' | 'kitchen' | 'menu' | 'customers' | 'vouchers' | 'reports'
  >('overview');

  // Security gate PIN (Default 123456, session unlocked by default or can lock)
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    return sessionStorage.getItem('tt_admin_unlocked') === 'true';
  });
  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState('');

  // Date selectors
  const dayOptions = getDayOptions();
  const [kitchenDay, setKitchenDay] = useState<string>(dayOptions[0]?.value || '');
  const [kitchenDoneDishes, setKitchenDoneDishes] = useState<Record<string, boolean>>({});

  // Orders Tab filters & search
  const [searchOrderQuery, setSearchOrderQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterDay, setFilterDay] = useState<string>('all');
  const [filterTime, setFilterTime] = useState<string>('all');
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  const [activeOrderDetail, setActiveOrderDetail] = useState<Order | null>(null);
  const [showPrintModal, setShowPrintModal] = useState<Order | null>(null);
  const [showNewOrderModal, setShowNewOrderModal] = useState(false);

  // Menu Tab states
  const [searchMenuQuery, setSearchMenuQuery] = useState('');
  const [filterMenuCat, setFilterMenuCat] = useState<string>('Tất cả');
  const [showAddDishModal, setShowAddDishModal] = useState(false);
  const [editingDish, setEditingDish] = useState<FoodItem | null>(null);

  // Form states for new dish
  const [newDishName, setNewDishName] = useState('');
  const [newDishPrice, setNewDishPrice] = useState('55000');
  const [newDishCat, setNewDishCat] = useState('Cơm');
  const [newDishEmoji, setNewDishEmoji] = useState('🍱');
  const [newDishTag, setNewDishTag] = useState('MỚI');
  const [newDishDesc, setNewDishDesc] = useState('Chế biến nóng hổi, nguyên liệu tươi ngon mỗi ngày.');
  const [newDishImage, setNewDishImage] = useState('/assets/images/com_ga_sot_tieu_1793112548727.jpg');

  // Vouchers state
  const [vouchers, setVouchers] = useState<Voucher[]>(() => {
    try {
      const saved = localStorage.getItem('tt_vouchers');
      return saved ? JSON.parse(saved) : DEFAULT_VOUCHERS;
    } catch {
      return DEFAULT_VOUCHERS;
    }
  });

  const [newVoucherCode, setNewVoucherCode] = useState('');
  const [newVoucherTitle, setNewVoucherTitle] = useState('');
  const [newVoucherPercent, setNewVoucherPercent] = useState('15');
  const [newVoucherMax, setNewVoucherMax] = useState('25000');

  // New manual order form state
  const [manualName, setManualName] = useState('');
  const [manualPhone, setManualPhone] = useState('');
  const [manualAddress, setManualAddress] = useState('');
  const [manualDay, setManualDay] = useState(dayOptions[0]?.value || '');
  const [manualTime, setManualTime] = useState('11:00 – 11:30');
  const [manualNote, setManualNote] = useState('');
  const [manualPayment, setManualPayment] = useState('Tiền mặt khi nhận (COD)');
  const [manualDishId, setManualDishId] = useState<number>(foods[0]?.id || 1);
  const [manualQty, setManualQty] = useState(1);

  // Available image presets
  const imagePresets = [
    { label: 'Cơm gà sốt tiêu', url: '/assets/images/com_ga_sot_tieu_1793112548727.jpg' },
    { label: 'Cơm sườn nướng', url: '/assets/images/com_suon_nuong_1793112602742.jpg' },
    { label: 'Cơm cá kho tộ', url: '/assets/images/ca_kho_to_1793112646720.jpg' },
    { label: 'Cơm gà xé', url: '/assets/images/com_ga_xe_1793112670730.jpg' },
    { label: 'Đậu hũ nấm', url: '/assets/images/dau_hu_kho_nam_1793112686996.jpg' },
    { label: 'Bò lúc lắc', url: '/assets/images/bo_luc_lac_1793112709293.jpg' },
    { label: 'Bún bò Huế', url: '/assets/images/bun_bo_hue_1793112741274.jpg' },
    { label: 'Mì xào giòn', url: '/assets/images/mi_xao_gion_1793112771893.jpg' },
    { label: 'Canh rong biển', url: '/assets/images/canh_rong_bien_1793112796182.jpg' },
  ];

  // Package Catalog management states
  const [editingPackage, setEditingPackage] = useState<PackageCatalogItem | null>(null);
  const [editPackageTitle, setEditPackageTitle] = useState('');
  const [editPackagePrice, setEditPackagePrice] = useState('');
  const [editPackageOriginalPrice, setEditPackageOriginalPrice] = useState('');
  const [editPackageCount, setEditPackageCount] = useState('');
  const [editPackageTag, setEditPackageTag] = useState('');
  const [editPackageDesc, setEditPackageDesc] = useState('');
  const [editPackageFeatures, setEditPackageFeatures] = useState('');
  const [editPackageIsActive, setEditPackageIsActive] = useState(true);
  const [editPackageImage, setEditPackageImage] = useState('');
  const [isSavingPackage, setIsSavingPackage] = useState(false);
  const [packageValidationError, setPackageValidationError] = useState('');

  const handleOpenEditPackage = (pkg: PackageCatalogItem) => {
    setEditingPackage(pkg);
    setEditPackageTitle(pkg.title);
    setEditPackagePrice(String(pkg.price));
    setEditPackageOriginalPrice(pkg.originalPrice ? String(pkg.originalPrice) : '');
    setEditPackageCount(String(pkg.count));
    setEditPackageTag(pkg.tag || '');
    setEditPackageDesc(pkg.desc || '');
    setEditPackageFeatures((pkg.features || []).join('\n'));
    setEditPackageIsActive(pkg.isActive !== false);
    setEditPackageImage(pkg.image || '/assets/images/com_suon_nuong_1793112602742.jpg');
    setPackageValidationError('');
  };

  const handleSavePackageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPackageValidationError('');

    const cleanTitle = editPackageTitle.trim();
    if (!cleanTitle) {
      setPackageValidationError('Tên gói suất ăn không được để trống.');
      return;
    }

    const priceNum = Number(editPackagePrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      setPackageValidationError('Giá bán phải là số hợp lệ lớn hơn 0 ₫.');
      return;
    }

    const countNum = Number(editPackageCount);
    if (isNaN(countNum) || countNum <= 0) {
      setPackageValidationError('Số lượng suất ăn phải là số nguyên lớn hơn 0.');
      return;
    }

    const origPriceNum = editPackageOriginalPrice ? Number(editPackageOriginalPrice) : undefined;
    if (origPriceNum !== undefined && (isNaN(origPriceNum) || origPriceNum < priceNum)) {
      setPackageValidationError('Giá gốc (nếu có) phải lớn hơn hoặc bằng giá bán.');
      return;
    }

    const featuresArray = editPackageFeatures
      .split('\n')
      .map((f) => f.trim())
      .filter((f) => f.length > 0);

    setIsSavingPackage(true);

    setTimeout(() => {
      if (editingPackage && onUpdatePackageCatalog) {
        const updatedList = packageCatalog.map((p) => {
          if (p.id === editingPackage.id) {
            return {
              ...p,
              title: cleanTitle,
              price: priceNum,
              originalPrice: origPriceNum,
              count: countNum,
              tag: editPackageTag.trim() || 'ƯU ĐÃI',
              desc: editPackageDesc.trim(),
              features: featuresArray.length > 0 ? featuresArray : p.features,
              isActive: editPackageIsActive,
              image: editPackageImage || p.image,
            };
          }
          return p;
        });

        onUpdatePackageCatalog(updatedList);
        localStorage.setItem('tt_package_catalog', JSON.stringify(updatedList));
        onToast(`Đã lưu thay đổi cho "${cleanTitle}" thành công!`);
      }

      setIsSavingPackage(false);
      setEditingPackage(null);
    }, 350);
  };

  const handleTogglePackageStatus = (pkgId: string) => {
    if (!onUpdatePackageCatalog) return;
    const pkg = packageCatalog.find((p) => p.id === pkgId);
    if (!pkg) return;
    const newStatus = !(pkg.isActive !== false);
    const updated = packageCatalog.map((p) =>
      p.id === pkgId ? { ...p, isActive: newStatus } : p
    );
    onUpdatePackageCatalog(updated);
    localStorage.setItem('tt_package_catalog', JSON.stringify(updated));
    onToast(
      `Đã ${newStatus ? 'kích hoạt kinh doanh' : 'tạm ngưng mở bán'} gói "${pkg.title}"`
    );
  };


  // Unlock handler
  const handleUnlock = (pin: string) => {
    if (pin === '123456' || pin === 'admin') {
      setIsUnlocked(true);
      sessionStorage.setItem('tt_admin_unlocked', 'true');
      setPinError('');
      onToast('Đã xác thực quyền Quản trị viên thành công!');
    } else {
      setPinError('Mã PIN không đúng (Gợi ý: 123456)');
    }
  };

  // Metrics computation
  const activeOrders = orders.filter((o) => !['Đã hủy', 'Đã giao'].includes(o.status));
  const completedOrders = orders.filter((o) => o.status === 'Đã giao');
  const cancelledOrders = orders.filter((o) => o.status === 'Đã hủy');
  const totalRevenue = completedOrders.reduce((s, o) => s + (Number(o.total) || 0), 0);
  const totalMealPortions = orders
    .filter((o) => o.status !== 'Đã hủy')
    .reduce((sum, o) => sum + o.items.reduce((a, b) => a + b.qty, 0), 0);
  const packageRevenue = packages.reduce((sum, p) => sum + (Number(p.price) || 0), 0);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const q = searchOrderQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        o.id.toLowerCase().includes(q) ||
        o.name.toLowerCase().includes(q) ||
        o.phone.includes(q) ||
        o.address.toLowerCase().includes(q);

      const matchStatus = filterStatus === 'all' || o.status === filterStatus;
      const matchDay = filterDay === 'all' || o.day === filterDay;
      const matchTime = filterTime === 'all' || o.time.includes(filterTime);

      return matchSearch && matchStatus && matchDay && matchTime;
    });
  }, [orders, searchOrderQuery, filterStatus, filterDay, filterTime]);

  // Kitchen Aggregation for selected day
  const targetKitchenOrders = useMemo(() => {
    return orders.filter((o) => o.day === kitchenDay && o.status !== 'Đã hủy');
  }, [orders, kitchenDay]);

  const kitchenPortionsMap = useMemo(() => {
    const map: Record<string, { name: string; count: number; cat: string; emoji: string }> = {};
    targetKitchenOrders.forEach((o) => {
      o.items.forEach((item) => {
        if (!map[item.name]) {
          map[item.name] = {
            name: item.name,
            count: 0,
            cat: item.cat,
            emoji: item.emoji || '🍱',
          };
        }
        map[item.name].count += item.qty;
      });
    });
    return map;
  }, [targetKitchenOrders]);

  // Group kitchen orders by Time Slot
  const timeSlotsGroup = useMemo(() => {
    const slots: Record<string, Order[]> = {
      '09:30 – 10:00': [],
      '10:00 – 10:30': [],
      '10:30 – 11:00': [],
      '11:00 – 11:30': [],
    };
    targetKitchenOrders.forEach((o) => {
      const slotKey = Object.keys(slots).find((k) => o.time.includes(k)) || '11:00 – 11:30';
      if (!slots[slotKey]) slots[slotKey] = [];
      slots[slotKey].push(o);
    });
    return slots;
  }, [targetKitchenOrders]);

  // Selection handlers
  const handleToggleSelectOrder = (id: string) => {
    setSelectedOrderIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSelectAllOrders = () => {
    if (selectedOrderIds.length === filteredOrders.length) {
      setSelectedOrderIds([]);
    } else {
      setSelectedOrderIds(filteredOrders.map((o) => o.id));
    }
  };

  const handleBulkStatusChange = (status: OrderStatus) => {
    if (selectedOrderIds.length === 0) {
      onToast('Vui lòng chọn ít nhất 1 đơn hàng để cập nhật');
      return;
    }
    if (onBulkUpdateOrderStatus) {
      onBulkUpdateOrderStatus(selectedOrderIds, status);
    } else {
      selectedOrderIds.forEach((id) => onUpdateOrderStatus(id, status));
    }
    onToast(`Đã chuyển ${selectedOrderIds.length} đơn hàng sang trạng thái "${status}"`);
    setSelectedOrderIds([]);
  };

  // Add dish handler
  const handleSaveDish = (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = Number(newDishPrice);
    if (!newDishName.trim() || isNaN(priceNum) || priceNum < 1000) {
      onToast('Tên món và giá bán không hợp lệ (tối thiểu 1.000 ₫)');
      return;
    }

    onAddFood({
      name: newDishName.trim(),
      price: priceNum,
      cat: newDishCat,
      emoji: newDishEmoji.trim() || '🍱',
      desc: newDishDesc.trim(),
      bg: 'from-amber-100 to-amber-200',
      tag: newDishTag.trim() || 'MỚI',
      imageUrl: newDishImage,
      isAvailable: true,
    });

    setNewDishName('');
    setShowAddDishModal(false);
    onToast(`Đã thêm món "${newDishName}" vào thực đơn hệ thống!`);
  };

  // Edit dish handler
  const handleUpdateDishSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDish) return;
    if (onUpdateFood) {
      onUpdateFood(editingDish.id, {
        name: editingDish.name,
        price: Number(editingDish.price),
        cat: editingDish.cat,
        emoji: editingDish.emoji,
        desc: editingDish.desc,
        tag: editingDish.tag,
        imageUrl: editingDish.imageUrl,
        isAvailable: editingDish.isAvailable !== false,
      });
      onToast(`Đã cập nhật món "${editingDish.name}"`);
    }
    setEditingDish(null);
  };

  // Manual order submission
  const handleCreateManualOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualName.trim() || !manualPhone.trim() || !manualAddress.trim()) {
      onToast('Vui lòng điền đầy đủ tên, số điện thoại và địa chỉ nhận hàng');
      return;
    }
    const chosenDish = foods.find((f) => f.id === manualDishId) || foods[0];
    const subtotal = chosenDish.price * manualQty;
    const isFreeShip =
      manualAddress.toLowerCase().includes('quận 1') ||
      manualAddress.toLowerCase().includes('bình thạnh') ||
      manualAddress.toLowerCase().includes('thủ đức');
    const shipping = isFreeShip ? 0 : 15000;
    const total = subtotal + shipping;

    const newOrd: Order = {
      id: 'TT-' + Math.floor(1000 + Math.random() * 9000),
      name: manualName.trim(),
      phone: manualPhone.trim(),
      address: manualAddress.trim(),
      day: manualDay,
      time: manualTime,
      note: manualNote.trim(),
      payment: manualPayment,
      customerId: null,
      memberCode: null,
      packageId: null,
      packageCharge: 0,
      packageQty: 0,
      refundProcessed: false,
      items: [{ ...chosenDish, qty: manualQty }],
      subtotal,
      discount: 0,
      foodTotal: subtotal,
      shipping,
      total,
      status: 'Đã xác nhận',
      payStatus: manualPayment.includes('COD') ? 'Chưa thanh toán (COD)' : 'Đã thanh toán',
      created: 'Vừa xong (Tạo tại quầy)',
    };

    if (onAddOrder) {
      onAddOrder(newOrd);
    }
    setShowNewOrderModal(false);
    setManualName('');
    setManualPhone('');
    setManualAddress('');
    onToast(`Đã tạo đơn hàng thành công: #${newOrd.id}`);
  };

  // Add Voucher
  const handleCreateVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVoucherCode.trim()) return;
    const newV: Voucher = {
      id: 'v-' + Date.now().toString().slice(-4),
      code: newVoucherCode.trim().toUpperCase(),
      title: newVoucherTitle.trim() || `Ưu đãi ${newVoucherPercent}%`,
      description: `Giảm ${newVoucherPercent}% tổng đơn hàng, tối đa ${formatVND(Number(newVoucherMax))}`,
      badge: `GIẢM ${newVoucherPercent}%`,
      discountType: 'first_order',
      percent: Number(newVoucherPercent) || 15,
      maxDiscount: Number(newVoucherMax) || 30000,
      isActive: true,
    };
    const updated = [newV, ...vouchers];
    setVouchers(updated);
    localStorage.setItem('tt_vouchers', JSON.stringify(updated));
    setNewVoucherCode('');
    setNewVoucherTitle('');
    onToast(`Đã kích hoạt mã khuyến mãi ${newV.code}!`);
  };

  // CSV Export
  const exportOrdersCSV = () => {
    const headers = [
      'Mã đơn',
      'Khách hàng',
      'Số điện thoại',
      'Ngày dùng',
      'Khung giờ',
      'Địa chỉ',
      'Món ăn',
      'Tổng tiền (VNĐ)',
      'Trạng thái',
      'Hình thức thanh toán',
      'Tình trạng thanh toán',
      'Ngày tạo',
    ];

    const rows = orders.map((o) => [
      o.id,
      o.name,
      o.phone,
      o.day,
      o.time,
      o.address,
      o.items.map((i) => `${i.name} (${i.qty})`).join('; '),
      o.total,
      o.status,
      o.payment,
      o.payStatus,
      o.created,
    ]);

    const csvContent =
      '\ufeff' +
      [headers, ...rows]
        .map((row) => row.map((field) => `"${String(field || '').replaceAll('"', '""')}"`).join(','))
        .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `danh-sach-don-hang-toi-trua-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    onToast('Đã xuất báo cáo đơn hàng CSV!');
  };

  const exportKitchenCSV = () => {
    const headers = ['Món ăn', 'Danh mục', 'Số lượng cần nấu (suất)', 'Ngày nấu'];
    const rows = Object.values(kitchenPortionsMap).map((m) => [
      m.name,
      m.cat,
      m.count,
      kitchenDay,
    ]);

    const csvContent =
      '\ufeff' +
      [headers, ...rows]
        .map((row) => row.map((field) => `"${String(field || '').replaceAll('"', '""')}"`).join(','))
        .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `dieu-phoi-bep-${kitchenDay}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    onToast(`Đã xuất phiếu điều phối bếp ngày ${kitchenDay}!`);
  };

  // Status badge styling helper
  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Chờ xác nhận':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'Đã xác nhận':
        return 'bg-blue-100 text-blue-900 border-blue-300';
      case 'Đang chuẩn bị':
        return 'bg-orange-100 text-orange-900 border-orange-300';
      case 'Đang giao':
        return 'bg-purple-100 text-purple-900 border-purple-300';
      case 'Đã giao':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case 'Đã hủy':
        return 'bg-rose-100 text-rose-900 border-rose-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  // If locked, show security PIN gate
  if (!isUnlocked) {
    return (
      <div className="max-w-md mx-auto my-12 bg-white rounded-3xl p-8 border border-[#ede4d4] shadow-xl text-center space-y-6">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-[#eaf5ee] text-[#0e563f] flex items-center justify-center">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-[#15221b]">Cổng Quản Trị Hệ Thống</h2>
          <p className="text-xs text-[#5e6f66] mt-1.5">
            Khu vực dành riêng cho Quản lý bếp và Điều hành Tới Trưa.
          </p>
        </div>

        <div className="space-y-3">
          <input
            type="password"
            placeholder="Nhập mã PIN quản trị viên..."
            value={enteredPin}
            onChange={(e) => setEnteredPin(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleUnlock(enteredPin);
            }}
            className="w-full px-4 py-3 rounded-xl border border-[#ede4d4] text-center text-lg tracking-widest font-black outline-none focus:border-[#0e563f] focus:ring-2 focus:ring-[#0e563f]/20 bg-[#fbf8f1]"
          />
          {pinError && <p className="text-xs text-rose-600 font-bold">{pinError}</p>}

          <button
            onClick={() => handleUnlock(enteredPin)}
            className="w-full py-3 rounded-xl bg-[#0e563f] hover:bg-[#12694d] text-white font-extrabold text-sm transition-all shadow-md cursor-pointer"
          >
            Mở khóa Bảng Quản Trị
          </button>

          <button
            onClick={() => handleUnlock('123456')}
            className="w-full py-2.5 rounded-xl bg-[#f5efe3] hover:bg-[#ede4d4] text-[#0e563f] font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>👉 Mở khóa nhanh chế độ Test (PIN: 123456)</span>
          </button>
        </div>

        <button
          onClick={onNavigateHome}
          className="inline-flex items-center gap-1 text-xs text-[#5e6f66] hover:text-[#0e563f] font-bold cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Quay lại trang đặt cơm khách hàng</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header Banner */}
      <div className="bg-gradient-to-r from-[#093c2b] to-[#0e563f] text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <span className="px-2.5 py-0.5 rounded-full bg-[#f59e0b] text-[#202923] text-[10px] font-black uppercase tracking-wider">
              ADMIN CONTROL CENTER
            </span>
            <span className="flex items-center gap-1.5 text-xs text-[#cbe3d4]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Bếp đang trực tuyến
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-3">
            <span>Hệ Thống Quản Trị & Điều Hành Tới Trưa</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#cbe3d4] max-w-2xl">
            Quản lý toàn diện: Tiếp nhận đơn hàng, điều phối bếp chuẩn bị vừa đủ, quản lý thực đơn, khách hàng và gói thành viên.
          </p>
        </div>

        {/* Quick actions top right */}
        <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
          <button
            onClick={() => setShowNewOrderModal(true)}
            className="px-3.5 py-2 rounded-xl bg-[#f59e0b] hover:bg-[#d97706] text-[#202923] font-black text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Tạo đơn tại quầy</span>
          </button>

          {onSeedDemoData && (
            <button
              onClick={() => {
                onSeedDemoData();
                onToast('Đã nạp bộ dữ liệu mẫu đầy đủ cho quản trị!');
              }}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 backdrop-blur-xs transition-all cursor-pointer border border-white/20"
              title="Nạp dữ liệu đơn mẫu để kiểm thử"
            >
              <Database className="w-4 h-4 text-[#f59e0b]" />
              <span>Nạp demo</span>
            </button>
          )}

          <button
            onClick={onNavigateHome}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 backdrop-blur-xs transition-all cursor-pointer border border-white/20"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Xem Website</span>
          </button>
        </div>
      </div>

      {/* Main Tab Bar */}
      <div className="bg-white rounded-2xl p-1.5 border border-[#ede4d4] shadow-xs flex overflow-x-auto gap-1 scrollbar-none text-xs font-black">
        {[
          { id: 'overview', label: 'Tổng quan điều hành', icon: BarChart3, count: null },
          { id: 'orders', label: 'Quản lý Đơn hàng', icon: PackageCheck, count: orders.length },
          { id: 'kitchen', label: 'Điều phối Bếp & Giao', icon: CookingPot, count: targetKitchenOrders.length },
          { id: 'menu', label: 'Thực đơn & Món ăn', icon: Layers, count: foods.length },
          { id: 'customers', label: 'Khách hàng & Gói ăn', icon: Users, count: customers.length },
          { id: 'vouchers', label: 'Khuyến mãi & Voucher', icon: Gift, count: vouchers.length },
          { id: 'reports', label: 'Báo cáo & Dữ liệu', icon: FileSpreadsheet, count: null },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = adminTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setAdminTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl flex items-center gap-2 whitespace-nowrap cursor-pointer transition-all ${
                isActive
                  ? 'bg-[#0e563f] text-white shadow-sm'
                  : 'text-[#5e6f66] hover:text-[#15221b] hover:bg-[#f5efe3]'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#fed7aa]' : 'text-[#78847d]'}`} />
              <span>{tab.label}</span>
              {tab.count !== null && (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                    isActive ? 'bg-[#f59e0b] text-[#202923]' : 'bg-[#edf2ee] text-[#5e6f66]'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: OVERVIEW */}
      {/* ========================================================================= */}
      {adminTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Stat Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-[#ede4d4] shadow-xs">
              <div className="flex items-center justify-between text-xs text-[#5e6f66] font-bold mb-2">
                <span>Doanh thu thành công</span>
                <TrendingUp className="w-4 h-4 text-[#0e563f]" />
              </div>
              <div className="text-2xl font-black text-[#0e563f]">{formatVND(totalRevenue)}</div>
              <div className="text-[11px] text-[#78847d] mt-1">
                Từ {completedOrders.length} đơn đã giao hoàn tất
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-[#ede4d4] shadow-xs">
              <div className="flex items-center justify-between text-xs text-[#5e6f66] font-bold mb-2">
                <span>Đang xử lý / Chế biến</span>
                <Clock className="w-4 h-4 text-[#f59e0b]" />
              </div>
              <div className="text-2xl font-black text-[#d97706]">{activeOrders.length} đơn</div>
              <div className="text-[11px] text-[#78847d] mt-1">
                Cần chế biến & giao đúng hẹn
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-[#ede4d4] shadow-xs">
              <div className="flex items-center justify-between text-xs text-[#5e6f66] font-bold mb-2">
                <span>Suất cơm cần phục vụ</span>
                <CookingPot className="w-4 h-4 text-[#0e563f]" />
              </div>
              <div className="text-2xl font-black text-[#15221b]">{totalMealPortions} suất</div>
              <div className="text-[11px] text-[#78847d] mt-1">
                Mô hình chuẩn bị vừa đủ - 0 lãng phí
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-[#ede4d4] shadow-xs">
              <div className="flex items-center justify-between text-xs text-[#5e6f66] font-bold mb-2">
                <span>Gói thẻ thành viên</span>
                <Users className="w-4 h-4 text-[#2563eb]" />
              </div>
              <div className="text-2xl font-black text-[#2563eb]">{packages.length} thẻ</div>
              <div className="text-[11px] text-[#78847d] mt-1">
                Doanh thu gói: {formatVND(packageRevenue)}
              </div>
            </div>
          </div>

          {/* Visual SVG Analytics Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chart: Orders status breakdown */}
            <div className="bg-white rounded-3xl p-6 border border-[#ede4d4] shadow-xs space-y-4">
              <h3 className="font-black text-base text-[#15221b] flex items-center justify-between">
                <span>Trạng thái đơn hàng</span>
                <span className="text-xs text-[#5e6f66] font-bold">{orders.length} tổng đơn</span>
              </h3>

              <div className="space-y-3 pt-2">
                {[
                  {
                    label: 'Đã giao thành công',
                    count: completedOrders.length,
                    color: 'bg-emerald-500',
                  },
                  {
                    label: 'Đang chuẩn bị & Đang giao',
                    count: activeOrders.length,
                    color: 'bg-amber-500',
                  },
                  {
                    label: 'Chờ xác nhận',
                    count: orders.filter((o) => o.status === 'Chờ xác nhận').length,
                    color: 'bg-blue-500',
                  },
                  {
                    label: 'Đã hủy',
                    count: cancelledOrders.length,
                    color: 'bg-rose-500',
                  },
                ].map((s) => {
                  const pct = orders.length ? Math.round((s.count / orders.length) * 100) : 0;
                  return (
                    <div key={s.label} className="space-y-1">
                      <div className="flex justify-between text-xs font-bold text-[#15221b]">
                        <span>{s.label}</span>
                        <span>
                          {s.count} đơn ({pct}%)
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-[#f0f4f1] overflow-hidden">
                        <div
                          className={`h-full ${s.color} rounded-full transition-all duration-500`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Delivery time slots distribution */}
            <div className="bg-white rounded-3xl p-6 border border-[#ede4d4] shadow-xs space-y-4">
              <h3 className="font-black text-base text-[#15221b]">
                Phân bổ theo Khung giờ giao
              </h3>
              <p className="text-xs text-[#5e6f66]">
                Cam kết giao nóng từ 09:00 - 11:30 để khách ăn đúng bữa trưa.
              </p>

              <div className="space-y-2.5 pt-1">
                {[
                  '09:30 – 10:00',
                  '10:00 – 10:30',
                  '10:30 – 11:00',
                  '11:00 – 11:30',
                ].map((slot) => {
                  const count = orders.filter(
                    (o) => o.time.includes(slot) && o.status !== 'Đã hủy'
                  ).length;
                  return (
                    <div
                      key={slot}
                      className="p-2.5 rounded-xl bg-[#fbf8f1] border border-[#ede4d4] flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-[#0e563f]" />
                        <span className="font-bold text-[#15221b]">{slot}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-lg bg-white border border-[#ede4d4] font-black text-[#0e563f]">
                        {count} đơn
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Kitchen Alerts */}
            <div className="bg-gradient-to-br from-[#fef6e7] to-[#fffefc] rounded-3xl p-6 border border-[#fed7aa] shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-[#8c4e06]">
                <AlertCircle className="w-5 h-5 text-[#d97706]" />
                <h3 className="font-black text-base text-[#2d1e06]">Cảnh báo Bếp & Giao</h3>
              </div>

              <div className="space-y-3 text-xs text-[#45300d]">
                <div className="p-3 bg-white/90 rounded-2xl border border-[#fed7aa] space-y-1">
                  <div className="font-black text-sm text-[#0e563f]">
                    Hôm nay cần chuẩn bị {targetKitchenOrders.length} đơn
                  </div>
                  <p className="text-[11px] text-[#5e6f66]">
                    Vui lòng bấm tab <b>Điều phối Bếp</b> để xem chi tiết từng món và đóng gói đúng tuyến.
                  </p>
                </div>

                <div className="p-3 bg-white/90 rounded-2xl border border-[#fed7aa] space-y-1">
                  <div className="font-black text-sm text-[#b45309]">
                    {orders.filter((o) => o.status === 'Chờ xác nhận').length} đơn đang chờ duyệt
                  </div>
                  <p className="text-[11px] text-[#5e6f66]">
                    Xác nhận sớm để chuyển vào danh sách nấu của ca sáng.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setAdminTab('kitchen')}
                className="w-full py-2.5 rounded-xl bg-[#0e563f] hover:bg-[#12694d] text-white font-black text-xs transition-all shadow-xs cursor-pointer text-center block"
              >
                Mở Điều Phối Bếp Ngay →
              </button>
            </div>
          </div>

          {/* Recent Orders table snippet */}
          <div className="bg-white rounded-3xl p-6 border border-[#ede4d4] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-lg text-[#15221b]">Đơn hàng mới tiếp nhận</h3>
              <button
                onClick={() => setAdminTab('orders')}
                className="text-xs text-[#0e563f] hover:underline font-extrabold cursor-pointer"
              >
                Xem tất cả {orders.length} đơn →
              </button>
            </div>

            {orders.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#5e6f66]">
                Chưa có đơn hàng nào được ghi nhận. Bấm "Nạp demo" ở trên để kiểm thử.
              </div>
            ) : (
              <div className="divide-y divide-[#ede4d4]">
                {orders.slice(0, 5).map((o) => (
                  <div
                    key={o.id}
                    className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs hover:bg-[#faf8f2] px-2 rounded-xl transition-colors cursor-pointer"
                    onClick={() => {
                      setActiveOrderDetail(o);
                      setAdminTab('orders');
                    }}
                  >
                    <div className="space-y-0.5">
                      <div className="font-black text-sm text-[#15221b] flex items-center gap-2">
                        <span>#{o.id}</span>
                        <span className="font-bold text-[#5e6f66]">• {o.name}</span>
                        <span className="text-[#86958d]">({o.phone})</span>
                      </div>
                      <div className="text-[#5e6f66] flex flex-wrap items-center gap-2 text-[11px]">
                        <span>Ngày {o.day}</span>
                        <span>•</span>
                        <span>Giờ: {o.time}</span>
                        <span>•</span>
                        <span className="text-[#0e563f] font-bold">
                          {o.items.map((i) => `${i.name} × ${i.qty}`).join(', ')}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-auto">
                      <div className="text-right">
                        <div className="font-black text-sm text-[#0e563f]">
                          {formatVND(o.total)}
                        </div>
                        <div className="text-[10px] text-[#78847d]">{o.payment}</div>
                      </div>
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-black border ${getStatusBadge(
                          o.status
                        )}`}
                      >
                        {o.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: ORDERS MANAGEMENT */}
      {/* ========================================================================= */}
      {adminTab === 'orders' && (
        <div className="space-y-6">
          {/* Filter and Search toolbar */}
          <div className="bg-white rounded-3xl p-5 border border-[#ede4d4] shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              {/* Search box */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#78847d] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Tìm theo Mã đơn (#TT-...), Tên khách, Số điện thoại hoặc Địa chỉ..."
                  value={searchOrderQuery}
                  onChange={(e) => setSearchOrderQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#ede4d4] text-xs outline-none focus:border-[#0e563f] bg-[#fbf8f1]"
                />
              </div>

              {/* Status and date filters */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-[#ede4d4] font-bold text-xs bg-white outline-none focus:border-[#0e563f]"
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="Chờ xác nhận">Chờ xác nhận</option>
                  <option value="Đã xác nhận">Đã xác nhận</option>
                  <option value="Đang chuẩn bị">Đang chuẩn bị</option>
                  <option value="Đang giao">Đang giao</option>
                  <option value="Đã giao">Đã giao</option>
                  <option value="Đã hủy">Đã hủy</option>
                </select>

                <select
                  value={filterDay}
                  onChange={(e) => setFilterDay(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-[#ede4d4] font-bold text-xs bg-white outline-none focus:border-[#0e563f]"
                >
                  <option value="all">Tất cả các ngày</option>
                  {dayOptions.map((d) => (
                    <option key={d.value} value={d.value}>
                      {d.label} ({d.value})
                    </option>
                  ))}
                </select>

                <button
                  onClick={exportOrdersCSV}
                  className="px-3.5 py-2 rounded-xl bg-[#0e563f] hover:bg-[#12694d] text-white font-extrabold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Xuất CSV</span>
                </button>
              </div>
            </div>

            {/* Batch actions bar if items are selected */}
            {selectedOrderIds.length > 0 && (
              <div className="p-3 bg-[#eaf5ee] rounded-2xl border border-[#cbe3d4] flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="font-black text-[#0e563f] flex items-center gap-2">
                  <CheckSquare className="w-4 h-4" />
                  <span>Đã chọn {selectedOrderIds.length} đơn hàng:</span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => handleBulkStatusChange('Đã xác nhận')}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 text-white font-bold cursor-pointer hover:bg-blue-700"
                  >
                    Duyệt đơn
                  </button>
                  <button
                    onClick={() => handleBulkStatusChange('Đang chuẩn bị')}
                    className="px-3 py-1.5 rounded-lg bg-orange-600 text-white font-bold cursor-pointer hover:bg-orange-700"
                  >
                    Chuyển vào bếp
                  </button>
                  <button
                    onClick={() => handleBulkStatusChange('Đang giao')}
                    className="px-3 py-1.5 rounded-lg bg-purple-600 text-white font-bold cursor-pointer hover:bg-purple-700"
                  >
                    Giao cho Shipper
                  </button>
                  <button
                    onClick={() => handleBulkStatusChange('Đã giao')}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold cursor-pointer hover:bg-emerald-700"
                  >
                    Hoàn tất giao
                  </button>
                  <button
                    onClick={() => setSelectedOrderIds([])}
                    className="px-2.5 py-1.5 text-xs text-[#5e6f66] hover:underline cursor-pointer"
                  >
                    Bỏ chọn
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-3xl border border-[#ede4d4] shadow-xs overflow-hidden">
            <div className="p-4 border-b border-[#ede4d4] flex items-center justify-between text-xs text-[#5e6f66] font-bold">
              <span>Hiển thị {filteredOrders.length} đơn hàng</span>
              <button
                onClick={handleSelectAllOrders}
                className="text-[#0e563f] hover:underline cursor-pointer"
              >
                {selectedOrderIds.length === filteredOrders.length && filteredOrders.length > 0
                  ? 'Bỏ chọn tất cả'
                  : 'Chọn tất cả đơn'}
              </button>
            </div>

            {filteredOrders.length === 0 ? (
              <div className="py-12 text-center text-xs text-[#5e6f66] space-y-2">
                <PackageCheck className="w-8 h-8 text-[#86958d] mx-auto" />
                <p className="font-bold text-sm text-[#15221b]">Không tìm thấy đơn hàng phù hợp</p>
                <p>Hãy thử đổi từ khóa tìm kiếm hoặc chọn bộ lọc khác.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse min-w-[850px]">
                  <thead>
                    <tr className="bg-[#fbf8f1] border-b border-[#ede4d4] text-[#5e6f66] uppercase tracking-wider text-[11px] font-black">
                      <th className="py-3 px-3 w-10 text-center">
                        <input
                          type="checkbox"
                          checked={
                            selectedOrderIds.length === filteredOrders.length &&
                            filteredOrders.length > 0
                          }
                          onChange={handleSelectAllOrders}
                          className="cursor-pointer"
                        />
                      </th>
                      <th className="py-3 px-3">Mã đơn & Khách</th>
                      <th className="py-3 px-3">Thời gian nhận</th>
                      <th className="py-3 px-3">Món đã đặt</th>
                      <th className="py-3 px-3">Địa chỉ giao</th>
                      <th className="py-3 px-3">Tổng thu</th>
                      <th className="py-3 px-3">Trạng thái</th>
                      <th className="py-3 px-3 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#ede4d4]">
                    {filteredOrders.map((o) => {
                      const isSelected = selectedOrderIds.includes(o.id);
                      return (
                        <tr
                          key={o.id}
                          className={`hover:bg-[#fbf8f1] transition-colors ${
                            isSelected ? 'bg-[#eaf5ee]/50' : ''
                          }`}
                        >
                          <td className="py-3 px-3 text-center">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleToggleSelectOrder(o.id)}
                              className="cursor-pointer"
                            />
                          </td>

                          {/* Order ID & Customer */}
                          <td className="py-3 px-3">
                            <div className="font-black text-[#15221b] text-sm">#{o.id}</div>
                            <div className="font-bold text-[#202923]">{o.name}</div>
                            <div className="text-[11px] text-[#78847d] flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              <span>{o.phone}</span>
                            </div>
                          </td>

                          {/* Time & Day */}
                          <td className="py-3 px-3 whitespace-nowrap">
                            <div className="font-bold text-[#15221b] flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-[#0e563f]" />
                              <span>{o.day}</span>
                            </div>
                            <div className="text-[11px] text-[#78847d] flex items-center gap-1 mt-0.5">
                              <Clock className="w-3 h-3" />
                              <span>{o.time}</span>
                            </div>
                          </td>

                          {/* Items summary */}
                          <td className="py-3 px-3 max-w-[200px]">
                            <div className="space-y-0.5">
                              {o.items.map((i, idx) => (
                                <div key={idx} className="truncate text-[11px] text-[#202923]">
                                  <span className="font-bold text-[#0e563f]">{i.qty}×</span>{' '}
                                  {i.name}
                                </div>
                              ))}
                            </div>
                            {o.note && (
                              <div className="text-[10px] text-amber-800 italic mt-1 truncate">
                                💬 "{o.note}"
                              </div>
                            )}
                          </td>

                          {/* Address */}
                          <td className="py-3 px-3 max-w-[180px] text-[#5e6f66] text-[11px] truncate">
                            <div className="flex items-start gap-1">
                              <MapPin className="w-3 h-3 text-rose-500 shrink-0 mt-0.5" />
                              <span title={o.address}>{o.address}</span>
                            </div>
                          </td>

                          {/* Total & Payment */}
                          <td className="py-3 px-3 whitespace-nowrap">
                            <div className="font-black text-sm text-[#0e563f]">
                              {formatVND(o.total)}
                            </div>
                            <div className="text-[10px] text-[#78847d]">{o.payment}</div>
                          </td>

                          {/* Status Dropdown */}
                          <td className="py-3 px-3">
                            <select
                              value={o.status}
                              onChange={(e) =>
                                onUpdateOrderStatus(o.id, e.target.value as OrderStatus)
                              }
                              className={`px-2.5 py-1 rounded-xl text-xs font-black border outline-none cursor-pointer ${getStatusBadge(
                                o.status
                              )}`}
                            >
                              <option value="Chờ xác nhận">Chờ xác nhận</option>
                              <option value="Đã xác nhận">Đã xác nhận</option>
                              <option value="Đang chuẩn bị">Đang chuẩn bị</option>
                              <option value="Đang giao">Đang giao</option>
                              <option value="Đã giao">Đã giao</option>
                              <option value="Đã hủy">Đã hủy</option>
                              <option value="Giao thất bại">Giao thất bại</option>
                            </select>
                          </td>

                          {/* Action Buttons */}
                          <td className="py-3 px-3 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => setActiveOrderDetail(o)}
                                className="p-1.5 rounded-lg text-[#0e563f] hover:bg-[#eaf5ee] transition-colors cursor-pointer"
                                title="Xem chi tiết đơn"
                              >
                                <Eye className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() => setShowPrintModal(o)}
                                className="p-1.5 rounded-lg text-[#15221b] hover:bg-[#f5efe3] transition-colors cursor-pointer"
                                title="In phiếu giao hàng"
                              >
                                <Printer className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: KITCHEN & DISPATCH COMMAND */}
      {/* ========================================================================= */}
      {adminTab === 'kitchen' && (
        <div className="space-y-6">
          {/* Header & Date picker */}
          <div className="bg-white rounded-3xl p-6 border border-[#ede4d4] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <CookingPot className="w-6 h-6 text-[#0e563f]" />
                <h2 className="text-xl font-black text-[#15221b]">
                  Trung Tâm Điều Phối Bếp & Chia Tuyến Giao
                </h2>
              </div>
              <p className="text-xs text-[#5e6f66] mt-1">
                Tự động gom suất ăn theo món, loại trừ đơn hủy, giúp bếp nấu chính xác số lượng và hạn chế thức ăn thừa.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <label className="text-xs font-bold text-[#5e6f66] whitespace-nowrap">
                Ngày chuẩn bị:
              </label>
              <select
                value={kitchenDay}
                onChange={(e) => setKitchenDay(e.target.value)}
                className="px-4 py-2 rounded-xl border border-[#ede4d4] text-xs font-black bg-[#fbf8f1] outline-none focus:border-[#0e563f]"
              >
                {dayOptions.map((d) => (
                  <option key={d.value} value={d.value}>
                    {d.label} ({d.value})
                  </option>
                ))}
              </select>

              <button
                onClick={exportKitchenCSV}
                className="px-3.5 py-2 rounded-xl bg-[#0e563f] hover:bg-[#12694d] text-white font-extrabold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Xuất phiếu</span>
              </button>
            </div>
          </div>

          {/* Quick numbers for this day */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-[#ede4d4] shadow-xs">
              <span className="text-xs text-[#5e6f66] font-bold block mb-1">Tổng đơn trong ngày</span>
              <strong className="text-xl font-black text-[#15221b]">{targetKitchenOrders.length} đơn</strong>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#ede4d4] shadow-xs">
              <span className="text-xs text-[#5e6f66] font-bold block mb-1">Tổng suất cần nấu</span>
              <strong className="text-xl font-black text-[#0e563f]">
                {Object.values(kitchenPortionsMap).reduce((s, x) => s + x.count, 0)} suất
              </strong>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#ede4d4] shadow-xs">
              <span className="text-xs text-[#5e6f66] font-bold block mb-1">Món ăn khác nhau</span>
              <strong className="text-xl font-black text-[#15221b]">
                {Object.keys(kitchenPortionsMap).length} món
              </strong>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#ede4d4] shadow-xs">
              <span className="text-xs text-[#5e6f66] font-bold block mb-1">Giờ bắt đầu giao</span>
              <strong className="text-xl font-black text-[#f59e0b]">09:30 AM</strong>
            </div>
          </div>

          {/* Portions by Dish Grid */}
          <div className="bg-white rounded-3xl p-6 border border-[#ede4d4] shadow-xs space-y-4">
            <h3 className="font-black text-lg text-[#15221b] flex items-center justify-between">
              <span>Danh sách số lượng từng món cần chế biến</span>
              <span className="text-xs text-[#5e6f66] font-normal">
                (Tích để đánh dấu món đã nấu xong)
              </span>
            </h3>

            {Object.keys(kitchenPortionsMap).length === 0 ? (
              <div className="py-12 text-center text-[#5e6f66]">
                <div className="text-4xl mb-2">🍳</div>
                <p className="font-bold text-sm text-[#15221b]">
                  Chưa có phần ăn nào được đặt cho ngày {kitchenDay}
                </p>
                <p className="text-xs mt-1">
                  Đơn hàng đặt trước cho ngày này sẽ tự động được tổng hợp tại đây.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.values(kitchenPortionsMap).map((dish) => {
                  const isDone = kitchenDoneDishes[dish.name] || false;
                  return (
                    <div
                      key={dish.name}
                      onClick={() =>
                        setKitchenDoneDishes((prev) => ({
                          ...prev,
                          [dish.name]: !isDone,
                        }))
                      }
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isDone
                          ? 'bg-[#eaf5ee] border-[#cbe3d4] opacity-75'
                          : 'bg-[#fbf8f1] border-[#ede4d4] hover:border-[#0e563f]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{dish.emoji}</span>
                        <div>
                          <div
                            className={`font-black text-sm ${
                              isDone ? 'line-through text-[#5e6f66]' : 'text-[#15221b]'
                            }`}
                          >
                            {dish.name}
                          </div>
                          <div className="text-[11px] text-[#78847d]">{dish.cat}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-xl bg-[#0e563f] text-white font-black text-sm shadow-xs">
                          {dish.count} suất
                        </span>
                        <div
                          className={`w-6 h-6 rounded-lg flex items-center justify-center border ${
                            isDone
                              ? 'bg-[#0e563f] text-white border-[#0e563f]'
                              : 'bg-white border-[#ede4d4] text-transparent'
                          }`}
                        >
                          ✓
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Time Slots Breakdown for Packaging & Dispatch */}
          <div className="bg-white rounded-3xl p-6 border border-[#ede4d4] shadow-xs space-y-6">
            <h3 className="font-black text-lg text-[#15221b]">
              Chia tuyến đóng gói theo Khung giờ giao ({kitchenDay})
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(timeSlotsGroup).map(([slot, slotOrders]) => (
                <div
                  key={slot}
                  className="rounded-2xl border border-[#ede4d4] bg-[#fbf8f1] p-4 space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-[#ede4d4] pb-2">
                    <span className="font-black text-sm text-[#0e563f] flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-[#f59e0b]" />
                      Khung giờ: {slot}
                    </span>
                    <span className="text-xs font-black px-2 py-0.5 rounded-lg bg-white border border-[#ede4d4]">
                      {slotOrders.length} đơn
                    </span>
                  </div>

                  {slotOrders.length === 0 ? (
                    <div className="py-4 text-center text-xs text-[#78847d]">
                      Không có đơn nào trong khung giờ này.
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                      {slotOrders.map((ord) => (
                        <div
                          key={ord.id}
                          className="p-2.5 rounded-xl bg-white border border-[#ede4d4] text-xs space-y-1"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-black text-[#15221b]">
                              #{ord.id} • {ord.name}
                            </span>
                            <span className="text-[10px] text-[#0e563f] font-bold">
                              {ord.phone}
                            </span>
                          </div>
                          <div className="text-[11px] text-[#5e6f66] flex items-start gap-1">
                            <MapPin className="w-3 h-3 text-rose-500 shrink-0 mt-0.5" />
                            <span className="truncate">{ord.address}</span>
                          </div>
                          <div className="text-[11px] font-bold text-[#0e563f] bg-[#eaf5ee] px-2 py-0.5 rounded-md">
                            {ord.items.map((i) => `${i.name} (x${i.qty})`).join(', ')}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: MENU MANAGEMENT */}
      {/* ========================================================================= */}
      {adminTab === 'menu' && (
        <div className="space-y-6">
          {/* Header & Controls */}
          <div className="bg-white rounded-3xl p-6 border border-[#ede4d4] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-[#15221b]">Quản Lý Thực Đơn Hệ Thống</h2>
              <p className="text-xs text-[#5e6f66] mt-1">
                Thêm món mới, điều chỉnh giá, bật/tắt trạng thái món và hình ảnh minh họa cho khách hàng.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => setShowAddDishModal(true)}
                className="px-4 py-2.5 rounded-xl bg-[#0e563f] hover:bg-[#12694d] text-white font-black text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
              >
                <PlusCircle className="w-4 h-4" />
                <span>+ Thêm món ăn mới</span>
              </button>

              {onResetFoods && (
                <button
                  onClick={() => {
                    if (window.confirm('Khôi phục danh sách món ăn gốc mặc định của Tới Trưa?')) {
                      onResetFoods();
                      onToast('Đã khôi phục thực đơn gốc!');
                    }
                  }}
                  className="px-3.5 py-2.5 rounded-xl bg-[#f5efe3] hover:bg-[#ede4d4] text-[#15221b] font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Khôi phục gốc</span>
                </button>
              )}
            </div>
          </div>

          {/* Search & Category Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-[#78847d] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm món ăn theo tên hoặc mô tả..."
                value={searchMenuQuery}
                onChange={(e) => setSearchMenuQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#ede4d4] text-xs outline-none focus:border-[#0e563f] bg-white"
              />
            </div>

            <div className="flex gap-1 overflow-x-auto text-xs font-bold scrollbar-none">
              {['Tất cả', 'Cơm', 'Món nước', 'Món khô', 'Món chay', 'Món thêm'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterMenuCat(cat)}
                  className={`px-3 py-1.5 rounded-xl cursor-pointer transition-all whitespace-nowrap ${
                    filterMenuCat === cat
                      ? 'bg-[#0e563f] text-white shadow-xs'
                      : 'bg-white text-[#5e6f66] border border-[#ede4d4] hover:bg-[#f5efe3]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Dishes Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {foods
              .filter((f) => {
                const q = searchMenuQuery.toLowerCase();
                const matchQ = f.name.toLowerCase().includes(q) || f.desc.toLowerCase().includes(q);
                const matchC = filterMenuCat === 'Tất cả' || f.cat === filterMenuCat;
                return matchQ && matchC;
              })
              .map((food) => {
                const isAvailable = food.isAvailable !== false;
                return (
                  <div
                    key={food.id}
                    className={`bg-white rounded-3xl border overflow-hidden shadow-xs flex flex-col justify-between transition-all ${
                      isAvailable ? 'border-[#ede4d4]' : 'border-rose-200 bg-rose-50/20'
                    }`}
                  >
                    <div>
                      {/* Image header */}
                      <div className="relative h-44 w-full bg-[#f5efe3] overflow-hidden">
                        <img
                          src={food.imageUrl || '/assets/images/com_ga_sot_tieu_1793112548727.jpg'}
                          alt={food.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // fallback
                            (e.target as HTMLImageElement).src =
                              '/assets/images/com_ga_sot_tieu_1793112548727.jpg';
                          }}
                        />
                        <div className="absolute top-3 left-3 flex gap-1.5">
                          <span className="px-2.5 py-1 rounded-full bg-[#0e563f] text-white font-black text-[10px] shadow-sm">
                            {food.cat}
                          </span>
                          {food.tag && (
                            <span className="px-2.5 py-1 rounded-full bg-[#f59e0b] text-[#202923] font-black text-[10px] shadow-sm">
                              {food.tag}
                            </span>
                          )}
                        </div>

                        {!isAvailable && (
                          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center">
                            <span className="px-3 py-1 rounded-xl bg-rose-600 text-white font-black text-xs">
                              TẠM HẾT MÓN
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-5 space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-black text-base text-[#15221b] flex items-center gap-1.5">
                            <span>{food.emoji}</span>
                            <span>{food.name}</span>
                          </h4>
                          <span className="font-black text-sm text-[#0e563f]">
                            {formatVND(food.price)}
                          </span>
                        </div>
                        <p className="text-xs text-[#5e6f66] line-clamp-2">{food.desc}</p>
                      </div>
                    </div>

                    {/* Actions bar */}
                    <div className="p-4 bg-[#fbf8f1] border-t border-[#ede4d4] flex items-center justify-between gap-2">
                      <button
                        onClick={() => {
                          if (onUpdateFood) {
                            onUpdateFood(food.id, { isAvailable: !isAvailable });
                            onToast(
                              `Đã chuyển trạng thái món sang: ${
                                !isAvailable ? 'Còn phục vụ' : 'Tạm hết món'
                              }`
                            );
                          }
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                          isAvailable
                            ? 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                            : 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200'
                        }`}
                      >
                        {isAvailable ? 'Đánh dấu Tạm hết' : 'Kích hoạt lại'}
                      </button>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setEditingDish(food)}
                          className="p-2 rounded-xl bg-white border border-[#ede4d4] text-[#15221b] hover:bg-[#f5efe3] cursor-pointer"
                          title="Sửa món"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Xóa món "${food.name}" khỏi thực đơn?`)) {
                              onRemoveFood(food.id);
                            }
                          }}
                          className="p-2 rounded-xl bg-white border border-[#ede4d4] text-rose-600 hover:bg-rose-50 cursor-pointer"
                          title="Xóa món"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: CUSTOMERS & PACKAGES */}
      {/* ========================================================================= */}
      {adminTab === 'customers' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-[#ede4d4] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#eaf5ee] text-[#0e563f] text-xs font-black uppercase tracking-wider mb-2 border border-[#cbe3d4]">
                <PackageCheck className="w-3.5 h-3.5 text-[#0e563f]" />
                <span>QUẢN TRỊ GÓI SUẤT ĂN & KHÁCH HÀNG</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#15221b]">
                Quản Lý Gói Suất Ăn Hệ Thống & Khách Hàng
              </h2>
              <p className="text-xs sm:text-sm text-[#5e6f66] mt-1">
                Tùy chỉnh thông tin giá bán, quyền lợi các gói cơm chào bán và theo dõi số dư thẻ ăn của khách hàng.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3.5 py-1.5 rounded-xl bg-[#fbf8f1] border border-[#ede4d4] text-xs font-bold text-[#0e563f]">
                {packageCatalog.length} gói hệ thống
              </span>
              <span className="px-3.5 py-1.5 rounded-xl bg-[#eaf5ee] text-[#0e563f] border border-[#cbe3d4] text-xs font-black">
                {packageCatalog.filter((p) => p.isActive !== false).length} đang mở bán
              </span>
            </div>
          </div>

          {/* ========================================================= */}
          {/* SECTION 1: SYSTEM PACKAGE CATALOG MANAGEMENT */}
          {/* ========================================================= */}
          <div className="bg-white rounded-3xl border border-[#ede4d4] shadow-xs p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#ede4d4] pb-4">
              <div>
                <h3 className="font-black text-lg text-[#15221b] flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-[#0e563f]" />
                  <span>Danh Mục Gói Suất Ăn Hệ Thống</span>
                </h3>
                <p className="text-xs text-[#5e6f66] mt-0.5">
                  Các gói suất ăn đang hiển thị trên trang thành viên của khách hàng. Bấm "Chỉnh sửa" để đổi tên, giá bán, mô tả hoặc tạm ngưng bán.
                </p>
              </div>
            </div>

            {packageCatalog.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#5e6f66]">
                Chưa có gói suất ăn nào trong hệ thống.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {packageCatalog.map((pkg) => {
                  const isActive = pkg.isActive !== false;
                  const pricePerMeal = Math.round(pkg.price / (pkg.count || 1));
                  const savingPercent = pkg.originalPrice && pkg.originalPrice > pkg.price
                    ? Math.round(((pkg.originalPrice - pkg.price) / pkg.originalPrice) * 100)
                    : null;

                  return (
                    <div
                      key={pkg.id}
                      className={`rounded-2xl border transition-all duration-200 flex flex-col justify-between overflow-hidden ${
                        isActive
                          ? 'border-[#ede4d4] bg-[#fbf8f1] hover:border-[#0e563f]/50 shadow-xs'
                          : 'border-dashed border-gray-300 bg-gray-50/80 opacity-80'
                      }`}
                    >
                      <div>
                        {/* Image header */}
                        <div className="relative h-40 w-full overflow-hidden bg-gray-100">
                          <img
                            src={pkg.image || '/assets/images/com_suon_nuong_1793112602742.jpg'}
                            alt={pkg.title}
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                          />
                          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                            <span className="bg-white/95 backdrop-blur-xs text-[#0e563f] font-black text-[10px] px-2.5 py-1 rounded-md shadow-xs border border-[#cbe3d4]">
                              {pkg.tag || 'ƯU ĐÃI'}
                            </span>
                          </div>
                          <div className="absolute top-2.5 right-2.5">
                            <span
                              className={`text-[10px] font-black px-2 py-0.5 rounded-md shadow-xs border ${
                                isActive
                                  ? 'bg-emerald-500 text-white border-emerald-600'
                                  : 'bg-gray-700 text-white border-gray-800'
                              }`}
                            >
                              {isActive ? 'ĐANG BÁN' : 'TẠM NGƯNG'}
                            </span>
                          </div>
                          <div className="absolute bottom-2.5 left-2.5 bg-black/70 backdrop-blur-xs text-white text-[11px] font-black px-2 py-0.5 rounded-md">
                            {pkg.count} suất ăn
                          </div>
                        </div>

                        {/* Body details */}
                        <div className="p-4 space-y-3">
                          <div>
                            <h4 className="font-black text-base text-[#15221b]">
                              {pkg.title}
                            </h4>
                            <p className="text-xs text-[#5e6f66] mt-1 line-clamp-2 min-h-[32px]">
                              {pkg.desc || 'Không có mô tả chi tiết'}
                            </p>
                          </div>

                          {/* Pricing breakdown */}
                          <div className="p-2.5 rounded-xl bg-white border border-[#ede4d4] space-y-1">
                            <div className="flex items-baseline justify-between">
                              <span className="text-[11px] text-[#5e6f66] font-semibold">
                                Giá niêm yết:
                              </span>
                              <div className="text-right">
                                <span className="font-black text-base text-[#0e563f]">
                                  {formatVND(pkg.price)}
                                </span>
                                {pkg.originalPrice && pkg.originalPrice > pkg.price && (
                                  <span className="text-[11px] text-[#78847d] line-through ml-1.5">
                                    {formatVND(pkg.originalPrice)}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center justify-between text-[11px] text-[#78847d] pt-1 border-t border-gray-100">
                              <span>Đơn giá/suất:</span>
                              <span className="font-bold text-[#15221b]">
                                ~{formatVND(pricePerMeal)}/suất
                              </span>
                              {savingPercent && (
                                <span className="text-emerald-700 font-black">
                                  Tiết kiệm {savingPercent}%
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Features list */}
                          {pkg.features && pkg.features.length > 0 && (
                            <div className="space-y-1 text-[11px] text-[#5e6f66]">
                              <span className="font-bold text-[#15221b] block text-[10px] uppercase tracking-wider">
                                Quyền lợi áp dụng:
                              </span>
                              {pkg.features.slice(0, 3).map((feat, idx) => (
                                <div key={idx} className="flex items-start gap-1.5">
                                  <CheckCircle className="w-3.5 h-3.5 text-[#0e563f] shrink-0 mt-0.5" />
                                  <span className="line-clamp-1">{feat}</span>
                                </div>
                              ))}
                              {pkg.features.length > 3 && (
                                <div className="text-[10px] text-[#78847d] italic">
                                  + thêm {pkg.features.length - 3} quyền lợi khác
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Card actions */}
                      <div className="p-3 bg-white border-t border-[#ede4d4] flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => handleTogglePackageStatus(pkg.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                            isActive
                              ? 'bg-gray-100 hover:bg-gray-200 text-[#5e6f66]'
                              : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800'
                          }`}
                          title={isActive ? 'Tạm ngưng mở bán gói này' : 'Bật mở bán lại'}
                        >
                          {isActive ? (
                            <>
                              <ToggleRight className="w-4 h-4 text-emerald-600" />
                              <span>Đang bán</span>
                            </>
                          ) : (
                            <>
                              <ToggleLeft className="w-4 h-4 text-gray-500" />
                              <span>Tạm ngưng</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenEditPackage(pkg)}
                          className="px-3.5 py-1.5 rounded-xl bg-[#0e563f] hover:bg-[#12694d] text-white text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
                        >
                          <Edit className="w-3.5 h-3.5 text-[#fed7aa]" />
                          <span>Chỉnh sửa</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ========================================================= */}
          {/* SECTION 2: ACTIVE USER PACKAGES TABLE */}
          {/* ========================================================= */}
          <div className="bg-white rounded-3xl border border-[#ede4d4] shadow-xs overflow-hidden space-y-4 p-6">
            <h3 className="font-black text-lg text-[#15221b] flex items-center justify-between">
              <span>Gói suất ăn thành viên đã kích hoạt ({packages.length})</span>
            </h3>

            {packages.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#5e6f66]">
                Chưa có gói thẻ ăn nào được mua.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse min-w-[700px]">
                  <thead>
                    <tr className="bg-[#fbf8f1] border-b border-[#ede4d4] text-[#5e6f66] uppercase text-[11px] font-black">
                      <th className="py-3 px-3">Mã gói / Khách</th>
                      <th className="py-3 px-3">Gói dịch vụ</th>
                      <th className="py-3 px-3">Tiến độ sử dụng</th>
                      <th className="py-3 px-3">Số dư hiện tại</th>
                      <th className="py-3 px-3">Ngày mua</th>
                      <th className="py-3 px-3 text-right">Điều chỉnh</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#ede4d4]">
                    {packages.map((pkg) => (
                      <tr key={pkg.id} className="hover:bg-[#fbf8f1]">
                        <td className="py-3 px-3">
                          <div className="font-black text-[#15221b]">#{pkg.id}</div>
                          <div className="font-bold text-[#0e563f]">Mã TV: {pkg.memberCode}</div>
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-bold text-[#15221b]">{pkg.title}</div>
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#f5efe3] text-[#8c4e06] font-black">
                            {pkg.tag}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-bold text-[#15221b]">
                            Đã dùng {pkg.used} / {pkg.count} suất
                          </div>
                          <div className="w-32 h-1.5 rounded-full bg-[#ede4d4] mt-1 overflow-hidden">
                            <div
                              className="h-full bg-[#0e563f] rounded-full"
                              style={{ width: `${Math.min(100, (pkg.used / pkg.count) * 100)}%` }}
                            />
                          </div>
                        </td>
                        <td className="py-3 px-3 font-black text-sm text-[#0e563f]">
                          {formatVND(pkg.balance)}
                        </td>
                        <td className="py-3 px-3 text-[#5e6f66]">{pkg.datePurchased}</td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => {
                              const addAmount = prompt(
                                'Nhập số tiền muốn nạp thêm vào thẻ (VNĐ):',
                                '100000'
                              );
                              if (addAmount && !isNaN(Number(addAmount))) {
                                const newAmount = Number(addAmount);
                                if (onUpdatePackages) {
                                  const updated = packages.map((p) =>
                                    p.id === pkg.id ? { ...p, balance: p.balance + newAmount } : p
                                  );
                                  onUpdatePackages(updated);
                                  onToast(`Đã nạp ${formatVND(newAmount)} vào thẻ ${pkg.id}`);
                                }
                              }
                            }}
                            className="px-3 py-1 rounded-xl bg-[#0e563f] hover:bg-[#12694d] text-white font-bold text-xs cursor-pointer shadow-xs"
                          >
                            + Nạp thêm tiền
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Customer Profiles List */}
          <div className="bg-white rounded-3xl border border-[#ede4d4] shadow-xs p-6 space-y-4">
            <h3 className="font-black text-lg text-[#15221b]">
              Hồ sơ khách hàng thành viên ({customers.length})
            </h3>
            {customers.length === 0 ? (
              <div className="py-6 text-center text-xs text-[#5e6f66]">
                Chưa có khách hàng đăng ký tài khoản.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {customers.map((cust) => {
                  const custOrders = orders.filter((o) => o.customerId === cust.id || o.phone === cust.phone);
                  const custTotalSpent = custOrders
                    .filter((o) => o.status === 'Đã giao')
                    .reduce((s, o) => s + o.total, 0);

                  return (
                    <div
                      key={cust.id}
                      className="p-4 rounded-2xl border border-[#ede4d4] bg-[#fbf8f1] space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-black text-sm text-[#15221b] flex items-center gap-2">
                          <User className="w-4 h-4 text-[#0e563f]" />
                          <span>{cust.name}</span>
                        </div>
                        <span className="px-2 py-0.5 rounded-md bg-[#eaf5ee] text-[#0e563f] font-black text-[10px]">
                          {cust.memberCode}
                        </span>
                      </div>

                      <div className="space-y-0.5 text-[#5e6f66] text-[11px]">
                        <div>SĐT: <b className="text-[#15221b]">{cust.phone}</b></div>
                        <div>Email: {cust.email}</div>
                        <div className="truncate">Địa chỉ: {cust.address}</div>
                      </div>

                      <div className="pt-2 border-t border-[#ede4d4] flex items-center justify-between text-[11px]">
                        <span className="text-[#78847d]">{custOrders.length} đơn hàng</span>
                        <span className="font-black text-[#0e563f]">
                          Đã chi tiêu: {formatVND(custTotalSpent)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: VOUCHERS & PROMOTIONS */}
      {/* ========================================================================= */}
      {adminTab === 'vouchers' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-[#ede4d4] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-[#15221b]">
                Quản Lý Chương Trình Khuyến Mãi & Voucher
              </h2>
              <p className="text-xs text-[#5e6f66] mt-1">
                Thiết lập mã giảm giá cho đơn đầu tiên, đặt nhóm từ 4 phần, hoặc ưu đãi Thứ Tư vui vẻ.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-6 items-start">
            {/* Create voucher form */}
            <form
              onSubmit={handleCreateVoucher}
              className="bg-white rounded-3xl p-6 border border-[#ede4d4] shadow-xs space-y-4"
            >
              <h3 className="font-black text-base text-[#15221b] flex items-center gap-2">
                <Gift className="w-4 h-4 text-[#0e563f]" />
                <span>Tạo mã khuyến mãi mới</span>
              </h3>

              <div>
                <label className="block text-xs font-bold text-[#5e6f66] mb-1">Mã Voucher (Code)</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: BANMOI25, TRUANON..."
                  value={newVoucherCode}
                  onChange={(e) => setNewVoucherCode(e.target.value.toUpperCase())}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#ede4d4] text-xs font-black uppercase tracking-wider outline-none focus:border-[#0e563f]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5e6f66] mb-1">Tên chương trình</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Giảm 20% cho văn phòng mới"
                  value={newVoucherTitle}
                  onChange={(e) => setNewVoucherTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#ede4d4] text-xs outline-none focus:border-[#0e563f]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#5e6f66] mb-1">Mức giảm (%)</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={newVoucherPercent}
                    onChange={(e) => setNewVoucherPercent(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#ede4d4] text-xs outline-none focus:border-[#0e563f]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#5e6f66] mb-1">Giảm tối đa (VNĐ)</label>
                  <input
                    type="number"
                    step="5000"
                    value={newVoucherMax}
                    onChange={(e) => setNewVoucherMax(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#ede4d4] text-xs outline-none focus:border-[#0e563f]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#0e563f] hover:bg-[#12694d] text-white font-black text-xs transition-all shadow-md cursor-pointer"
              >
                + Kích hoạt Voucher này
              </button>
            </form>

            {/* Existing vouchers */}
            <div className="bg-white rounded-3xl p-6 border border-[#ede4d4] shadow-xs space-y-3">
              <h3 className="font-black text-base text-[#15221b]">
                Danh sách Voucher hiện hành ({vouchers.length})
              </h3>
              <div className="space-y-3">
                {vouchers.map((v) => (
                  <div
                    key={v.id}
                    className="p-4 rounded-2xl border border-[#ede4d4] bg-[#fbf8f1] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-lg bg-[#0e563f] text-white font-black text-xs tracking-wider">
                          {v.code}
                        </span>
                        <span className="font-black text-[#15221b] text-sm">{v.title}</span>
                      </div>
                      <p className="text-[11px] text-[#5e6f66]">{v.description}</p>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-auto">
                      <span className="px-2.5 py-1 rounded-full bg-[#fef6e7] text-[#8c4e06] font-black text-[11px]">
                        -{v.percent}%
                      </span>
                      <button
                        onClick={() => {
                          const updated = vouchers.filter((x) => x.id !== v.id);
                          setVouchers(updated);
                          localStorage.setItem('tt_vouchers', JSON.stringify(updated));
                          onToast(`Đã xóa voucher ${v.code}`);
                        }}
                        className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 cursor-pointer"
                        title="Xóa voucher"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 7: REPORTS & DATA TOOLS */}
      {/* ========================================================================= */}
      {adminTab === 'reports' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-[#ede4d4] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-[#15221b]">Báo Cáo Doanh Thu & Sao Lưu Dữ Liệu</h2>
              <p className="text-xs text-[#5e6f66] mt-1">
                Thống kê số liệu tài chính chi tiết, tải dữ liệu bảng tính và quản lý khôi phục hệ thống.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={exportOrdersCSV}
                className="px-4 py-2 rounded-xl bg-[#0e563f] hover:bg-[#12694d] text-white font-black text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Xuất Báo Cáo Đơn Hàng</span>
              </button>
            </div>
          </div>

          {/* Financial Breakdown */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-white border border-[#ede4d4] shadow-xs">
              <span className="text-xs text-[#5e6f66] font-bold block mb-1">Doanh thu bán lẻ món</span>
              <strong className="text-xl font-black text-[#0e563f]">{formatVND(totalRevenue)}</strong>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-[#ede4d4] shadow-xs">
              <span className="text-xs text-[#5e6f66] font-bold block mb-1">Doanh thu bán gói ăn</span>
              <strong className="text-xl font-black text-[#2563eb]">{formatVND(packageRevenue)}</strong>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-[#ede4d4] shadow-xs">
              <span className="text-xs text-[#5e6f66] font-bold block mb-1">Phí giao hàng thu</span>
              <strong className="text-xl font-black text-[#15221b]">
                {formatVND(
                  orders
                    .filter((o) => o.status === 'Đã giao')
                    .reduce((s, o) => s + (o.shipping || 0), 0)
                )}
              </strong>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-[#ede4d4] shadow-xs">
              <span className="text-xs text-[#5e6f66] font-bold block mb-1">Tỷ lệ hoàn thành đơn</span>
              <strong className="text-xl font-black text-emerald-600">
                {orders.length
                  ? Math.round((completedOrders.length / orders.length) * 100)
                  : 0}
                %
              </strong>
            </div>
          </div>

          {/* Database management and Reset tools */}
          <div className="bg-white rounded-3xl p-6 border border-[#ede4d4] shadow-xs space-y-4">
            <h3 className="font-black text-base text-[#15221b] flex items-center gap-2">
              <Database className="w-5 h-5 text-[#0e563f]" />
              <span>Công cụ Quản trị Dữ liệu & Kiểm thử hệ thống</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-[#fbf8f1] border border-[#ede4d4] space-y-2">
                <div className="font-black text-sm text-[#15221b]">Nạp Bộ Dữ Liệu Mẫu Mới</div>
                <p className="text-xs text-[#5e6f66]">
                  Nạp 8 đơn hàng đa dạng trạng thái, 4 khách hàng mẫu và 3 gói thành viên để kiểm tra bảng điều khiển.
                </p>
                <button
                  onClick={() => {
                    if (onSeedDemoData) {
                      onSeedDemoData();
                      onToast('Đã nạp thành công bộ dữ liệu mẫu!');
                    }
                  }}
                  className="w-full py-2 rounded-xl bg-[#0e563f] text-white font-bold text-xs hover:bg-[#12694d] cursor-pointer"
                >
                  Nạp dữ liệu mẫu
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-[#fbf8f1] border border-[#ede4d4] space-y-2">
                <div className="font-black text-sm text-[#15221b]">Khôi phục Thực Đơn Gốc</div>
                <p className="text-xs text-[#5e6f66]">
                  Đưa 9 món ăn Việt Nam truyền thống với đầy đủ hình ảnh chuẩn về lại trạng thái ban đầu.
                </p>
                <button
                  onClick={() => {
                    if (onResetFoods) {
                      onResetFoods();
                      onToast('Đã khôi phục thực đơn gốc!');
                    }
                  }}
                  className="w-full py-2 rounded-xl bg-[#f5efe3] text-[#15221b] font-bold text-xs hover:bg-[#ede4d4] cursor-pointer"
                >
                  Khôi phục thực đơn
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-2">
                <div className="font-black text-sm text-rose-800">Xóa Sạch Dữ Liệu Đơn</div>
                <p className="text-xs text-rose-700">
                  Dọn dẹp toàn bộ đơn hàng trong bộ nhớ để bắt đầu một chu kỳ đặt cơm hoàn toàn mới.
                </p>
                <button
                  onClick={() => {
                    if (
                      window.confirm(
                        'CẢNH BÁO: Bạn có chắc chắn muốn xóa toàn bộ danh sách đơn hàng?'
                      )
                    ) {
                      if (onClearOrders) {
                        onClearOrders();
                        onToast('Đã dọn dẹp sạch danh sách đơn hàng!');
                      }
                    }
                  }}
                  className="w-full py-2 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 cursor-pointer"
                >
                  Xóa tất cả đơn hàng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ORDER DETAIL DRAWER */}
      {/* ========================================================================= */}
      {activeOrderDetail && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-[#ede4d4] shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal header */}
            <div className="flex items-center justify-between border-b border-[#ede4d4] pb-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#0e563f] bg-[#eaf5ee] px-2 py-0.5 rounded-md">
                  CHI TIẾT ĐƠN HÀNG
                </span>
                <h3 className="text-xl font-black text-[#15221b] mt-1">
                  Đơn #{activeOrderDetail.id}
                </h3>
              </div>
              <button
                onClick={() => setActiveOrderDetail(null)}
                className="p-2 rounded-full hover:bg-[#f5efe3] text-[#5e6f66] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer & Delivery info */}
            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-[#fbf8f1] border border-[#ede4d4] space-y-1.5">
                <div className="flex justify-between font-black text-sm text-[#15221b]">
                  <span>{activeOrderDetail.name}</span>
                  <span className="text-[#0e563f]">{activeOrderDetail.phone}</span>
                </div>
                <div className="text-[#5e6f66] flex items-start gap-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                  <span>{activeOrderDetail.address}</span>
                </div>
                <div className="flex items-center gap-3 pt-1 text-[11px] font-bold text-[#15221b]">
                  <span>Ngày nhận: {activeOrderDetail.day}</span>
                  <span>•</span>
                  <span>Khung giờ: {activeOrderDetail.time}</span>
                </div>
                {activeOrderDetail.note && (
                  <div className="text-[11px] text-amber-900 bg-amber-50 p-2 rounded-xl border border-amber-200 mt-1">
                    Ghi chú khách: "{activeOrderDetail.note}"
                  </div>
                )}
              </div>

              {/* Items list */}
              <div>
                <h4 className="font-black text-xs uppercase tracking-wider text-[#78847d] mb-2">
                  Danh sách món ăn ({activeOrderDetail.items.reduce((s, i) => s + i.qty, 0)} phần)
                </h4>
                <div className="divide-y divide-[#ede4d4] border border-[#ede4d4] rounded-2xl overflow-hidden">
                  {activeOrderDetail.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-white flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl">{item.emoji || '🍱'}</span>
                        <div>
                          <div className="font-bold text-[#15221b]">{item.name}</div>
                          <div className="text-[10px] text-[#78847d]">{formatVND(item.price)}</div>
                        </div>
                      </div>
                      <div className="font-black text-sm text-[#0e563f]">
                        {item.qty} × {formatVND(item.price * item.qty)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment summary */}
              <div className="p-3.5 rounded-2xl bg-[#fbf8f1] border border-[#ede4d4] space-y-1 text-xs">
                <div className="flex justify-between text-[#5e6f66]">
                  <span>Tiền món ăn:</span>
                  <span>{formatVND(activeOrderDetail.subtotal)}</span>
                </div>
                {activeOrderDetail.discount > 0 && (
                  <div className="flex justify-between text-[#0e563f]">
                    <span>Giảm giá (Thẻ / Ưu đãi):</span>
                    <span>-{formatVND(activeOrderDetail.discount)}</span>
                  </div>
                )}
                {activeOrderDetail.voucherDiscount ? (
                  <div className="flex justify-between text-[#0e563f]">
                    <span>Voucher ({activeOrderDetail.voucherCode}):</span>
                    <span>-{formatVND(activeOrderDetail.voucherDiscount)}</span>
                  </div>
                ) : null}
                <div className="flex justify-between text-[#5e6f66]">
                  <span>Phí giao hàng:</span>
                  <span>
                    {activeOrderDetail.shipping === 0
                      ? 'Miễn phí'
                      : formatVND(activeOrderDetail.shipping)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-black text-[#0e563f] pt-1 border-t border-[#ede4d4]">
                  <span>Tổng tiền thanh toán:</span>
                  <span>{formatVND(activeOrderDetail.total)}</span>
                </div>
                <div className="text-[11px] text-[#78847d] pt-1">
                  Phương thức: <b>{activeOrderDetail.payment}</b> ({activeOrderDetail.payStatus})
                </div>
              </div>
            </div>

            {/* Quick status switch buttons */}
            <div className="space-y-2 pt-2 border-t border-[#ede4d4]">
              <div className="text-xs font-bold text-[#5e6f66]">Chuyển nhanh trạng thái đơn:</div>
              <div className="grid grid-cols-3 gap-2">
                {(['Đã xác nhận', 'Đang chuẩn bị', 'Đang giao', 'Đã giao', 'Đã hủy'] as OrderStatus[]).map(
                  (st) => (
                    <button
                      key={st}
                      onClick={() => {
                        onUpdateOrderStatus(activeOrderDetail.id, st);
                        setActiveOrderDetail({ ...activeOrderDetail, status: st });
                      }}
                      className={`px-2.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer border ${
                        activeOrderDetail.status === st
                          ? 'bg-[#0e563f] text-white border-[#0e563f]'
                          : 'bg-[#fbf8f1] border-[#ede4d4] text-[#15221b] hover:bg-[#ede4d4]'
                      }`}
                    >
                      {st}
                    </button>
                  )
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => {
                  setShowPrintModal(activeOrderDetail);
                  setActiveOrderDetail(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#f59e0b] hover:bg-[#d97706] text-[#202923] font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Printer className="w-4 h-4" />
                <span>In Phiếu Giao / Hóa Đơn Bếp</span>
              </button>
              <button
                onClick={() => setActiveOrderDetail(null)}
                className="px-4 py-2.5 rounded-xl border border-[#ede4d4] text-xs font-bold hover:bg-[#f5efe3] cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: PRINT RECEIPT PREVIEW (Thermal slip format) */}
      {/* ========================================================================= */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 border border-[#ede4d4] shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-[#0e563f]">PHIẾU IN HÓA ĐƠN BẾP</span>
              <button
                onClick={() => setShowPrintModal(null)}
                className="p-1 rounded-full hover:bg-gray-100 text-[#5e6f66] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Receipt Box styled as thermal paper */}
            <div
              id="printable-receipt"
              className="p-4 bg-[#fffefc] border-2 border-dashed border-[#ede4d4] rounded-2xl text-[11px] font-mono space-y-3"
            >
              <div className="text-center space-y-0.5 border-b border-dashed border-[#ede4d4] pb-3">
                <div className="font-black text-sm text-[#0e563f]">*** TỚI TRƯA ***</div>
                <div className="text-[10px] text-[#5e6f66]">Trưa tới, ăn chưa?</div>
                <div className="text-[10px] text-[#78847d]">Hotline hỗ trợ: 1900 1234</div>
              </div>

              <div className="space-y-1">
                <div>
                  MÃ ĐƠN: <b>#{showPrintModal.id}</b>
                </div>
                <div>
                  Khách: <b>{showPrintModal.name}</b>
                </div>
                <div>
                  SĐT: <b>{showPrintModal.phone}</b>
                </div>
                <div>
                  Ngày: <b>{showPrintModal.day}</b> | Giờ: <b>{showPrintModal.time}</b>
                </div>
                <div>Đ/C: {showPrintModal.address}</div>
                {showPrintModal.note && (
                  <div className="text-[10px] italic">Lưu ý: {showPrintModal.note}</div>
                )}
              </div>

              <div className="border-t border-b border-dashed border-[#ede4d4] py-2 space-y-1">
                {showPrintModal.items.map((i, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span>
                      {i.qty}x {i.name}
                    </span>
                    <span>{formatVND(i.price * i.qty)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-0.5">
                <div className="flex justify-between">
                  <span>Tiền món:</span>
                  <span>{formatVND(showPrintModal.subtotal)}</span>
                </div>
                {showPrintModal.discount > 0 && (
                  <div className="flex justify-between text-[#0e563f]">
                    <span>Ưu đãi thẻ:</span>
                    <span>-{formatVND(showPrintModal.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Phí giao:</span>
                  <span>{formatVND(showPrintModal.shipping)}</span>
                </div>
                <div className="flex justify-between font-black text-xs pt-1 border-t border-dashed border-[#ede4d4]">
                  <span>TỔNG CỘNG:</span>
                  <span>{formatVND(showPrintModal.total)}</span>
                </div>
              </div>

              <div className="text-center text-[10px] text-[#78847d] pt-2">
                Cảm ơn quý khách đã đặt cơm tại Tới Trưa!
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  window.print();
                  onToast('Đang gửi lệnh in tới máy in hóa đơn!');
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#0e563f] hover:bg-[#12694d] text-white font-black text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <Printer className="w-4 h-4" />
                <span>In phiếu ngay</span>
              </button>
              <button
                onClick={() => setShowPrintModal(null)}
                className="px-4 py-2.5 rounded-xl border border-[#ede4d4] text-xs font-bold hover:bg-[#f5efe3] cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CREATE MANUAL ORDER */}
      {/* ========================================================================= */}
      {showNewOrderModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateManualOrder}
            className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-[#ede4d4] shadow-2xl p-6 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-[#ede4d4] pb-3">
              <h3 className="font-black text-lg text-[#15221b] flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-[#0e563f]" />
                <span>Tạo đơn hàng mới tại quầy</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowNewOrderModal(false)}
                className="p-1.5 rounded-full hover:bg-gray-100 text-[#5e6f66] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#5e6f66] mb-1">Tên khách hàng</label>
                  <input
                    type="text"
                    required
                    placeholder="Nguyễn Văn A"
                    value={manualName}
                    onChange={(e) => setManualName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#ede4d4] outline-none focus:border-[#0e563f]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#5e6f66] mb-1">Số điện thoại</label>
                  <input
                    type="tel"
                    required
                    placeholder="0901234567"
                    value={manualPhone}
                    onChange={(e) => setManualPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#ede4d4] outline-none focus:border-[#0e563f]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#5e6f66] mb-1">Địa chỉ giao hàng</label>
                <input
                  type="text"
                  required
                  placeholder="Tòa nhà, số nhà, phường, quận..."
                  value={manualAddress}
                  onChange={(e) => setManualAddress(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#ede4d4] outline-none focus:border-[#0e563f]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#5e6f66] mb-1">Ngày nhận cơm</label>
                  <select
                    value={manualDay}
                    onChange={(e) => setManualDay(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#ede4d4] outline-none focus:border-[#0e563f] bg-white font-bold"
                  >
                    {dayOptions.map((d) => (
                      <option key={d.value} value={d.value}>
                        {d.label} ({d.value})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-[#5e6f66] mb-1">Khung giờ giao</label>
                  <select
                    value={manualTime}
                    onChange={(e) => setManualTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#ede4d4] outline-none focus:border-[#0e563f] bg-white font-bold"
                  >
                    <option value="09:30 – 10:00">09:30 – 10:00</option>
                    <option value="10:00 – 10:30">10:00 – 10:30</option>
                    <option value="10:30 – 11:00">10:30 – 11:00</option>
                    <option value="11:00 – 11:30">11:00 – 11:30</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-[1.5fr_1fr] gap-3">
                <div>
                  <label className="block font-bold text-[#5e6f66] mb-1">Chọn món ăn</label>
                  <select
                    value={manualDishId}
                    onChange={(e) => setManualDishId(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-[#ede4d4] outline-none focus:border-[#0e563f] bg-white font-bold"
                  >
                    {foods.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name} ({formatVND(f.price)})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-[#5e6f66] mb-1">Số lượng</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={manualQty}
                    onChange={(e) => setManualQty(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-[#ede4d4] outline-none focus:border-[#0e563f] font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#5e6f66] mb-1">Ghi chú bếp / giao</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Ít cay, giao lễ tân sảnh 1..."
                  value={manualNote}
                  onChange={(e) => setManualNote(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#ede4d4] outline-none focus:border-[#0e563f]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#5e6f66] mb-1">Hình thức thanh toán</label>
                <select
                  value={manualPayment}
                  onChange={(e) => setManualPayment(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#ede4d4] outline-none focus:border-[#0e563f] bg-white"
                >
                  <option value="Tiền mặt khi nhận (COD)">Tiền mặt khi nhận (COD)</option>
                  <option value="Chuyển khoản VietQR">Chuyển khoản VietQR</option>
                  <option value="Ví điện tử MoMo">Ví điện tử MoMo</option>
                  <option value="Thẻ thành viên Tới Trưa">Thẻ thành viên Tới Trưa</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2 pt-2 border-t border-[#ede4d4]">
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-[#0e563f] hover:bg-[#12694d] text-white font-black text-xs cursor-pointer shadow-md"
              >
                Xác nhận tạo đơn
              </button>
              <button
                type="button"
                onClick={() => setShowNewOrderModal(false)}
                className="px-4 py-2.5 rounded-xl border border-[#ede4d4] text-xs font-bold hover:bg-[#f5efe3] cursor-pointer"
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD NEW DISH */}
      {/* ========================================================================= */}
      {showAddDishModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveDish}
            className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-[#ede4d4] shadow-2xl p-6 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-[#ede4d4] pb-3">
              <h3 className="font-black text-lg text-[#15221b] flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-[#0e563f]" />
                <span>Thêm món ăn mới vào Thực đơn</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowAddDishModal(false)}
                className="p-1.5 rounded-full hover:bg-gray-100 text-[#5e6f66] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#5e6f66] mb-1">Tên món ăn</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Cơm ba chỉ heo nướng mật ong"
                  value={newDishName}
                  onChange={(e) => setNewDishName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#ede4d4] outline-none focus:border-[#0e563f]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#5e6f66] mb-1">Giá bán (VNĐ)</label>
                  <input
                    type="number"
                    min="1000"
                    step="1000"
                    required
                    value={newDishPrice}
                    onChange={(e) => setNewDishPrice(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#ede4d4] outline-none focus:border-[#0e563f] font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#5e6f66] mb-1">Danh mục</label>
                  <select
                    value={newDishCat}
                    onChange={(e) => setNewDishCat(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#ede4d4] outline-none focus:border-[#0e563f] bg-white font-bold"
                  >
                    <option value="Cơm">Cơm</option>
                    <option value="Món nước">Món nước</option>
                    <option value="Món khô">Món khô</option>
                    <option value="Món chay">Món chay</option>
                    <option value="Món thêm">Món thêm</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#5e6f66] mb-1">Emoji đại diện</label>
                  <input
                    type="text"
                    maxLength={4}
                    value={newDishEmoji}
                    onChange={(e) => setNewDishEmoji(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#ede4d4] outline-none focus:border-[#0e563f] text-center text-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#5e6f66] mb-1">Nhãn tag nổi bật</label>
                  <input
                    type="text"
                    placeholder="MỚI, BÁN CHẠY, ĐẶC BIỆT..."
                    value={newDishTag}
                    onChange={(e) => setNewDishTag(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#ede4d4] outline-none focus:border-[#0e563f]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#5e6f66] mb-1">Mô tả món ăn</label>
                <textarea
                  rows={2}
                  value={newDishDesc}
                  onChange={(e) => setNewDishDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#ede4d4] outline-none focus:border-[#0e563f]"
                />
              </div>

              {/* Photo selection presets */}
              <div>
                <label className="block font-bold text-[#5e6f66] mb-1">Chọn ảnh món ăn mẫu</label>
                <div className="grid grid-cols-3 gap-2 max-h-32 overflow-y-auto p-1 border border-[#ede4d4] rounded-xl">
                  {imagePresets.map((p) => (
                    <div
                      key={p.url}
                      onClick={() => setNewDishImage(p.url)}
                      className={`relative rounded-lg overflow-hidden h-14 border cursor-pointer transition-all ${
                        newDishImage === p.url
                          ? 'border-[#0e563f] ring-2 ring-[#0e563f]'
                          : 'border-transparent opacity-80 hover:opacity-100'
                      }`}
                    >
                      <img src={p.url} alt={p.label} className="w-full h-full object-cover" />
                      <div className="absolute inset-x-0 bottom-0 bg-black/60 text-white text-[9px] truncate px-1 text-center">
                        {p.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2 border-t border-[#ede4d4]">
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-[#0e563f] hover:bg-[#12694d] text-white font-black text-xs cursor-pointer shadow-md"
              >
                + Thêm món vào thực đơn
              </button>
              <button
                type="button"
                onClick={() => setShowAddDishModal(false)}
                className="px-4 py-2.5 rounded-xl border border-[#ede4d4] text-xs font-bold hover:bg-[#f5efe3] cursor-pointer"
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: EDIT DISH */}
      {/* ========================================================================= */}
      {editingDish && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleUpdateDishSubmit}
            className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-[#ede4d4] shadow-2xl p-6 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-[#ede4d4] pb-3">
              <h3 className="font-black text-lg text-[#15221b] flex items-center gap-2">
                <Edit className="w-5 h-5 text-[#0e563f]" />
                <span>Chỉnh sửa món #{editingDish.id}</span>
              </h3>
              <button
                type="button"
                onClick={() => setEditingDish(null)}
                className="p-1.5 rounded-full hover:bg-gray-100 text-[#5e6f66] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#5e6f66] mb-1">Tên món ăn</label>
                <input
                  type="text"
                  required
                  value={editingDish.name}
                  onChange={(e) => setEditingDish({ ...editingDish, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#ede4d4] outline-none focus:border-[#0e563f]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#5e6f66] mb-1">Giá bán (VNĐ)</label>
                  <input
                    type="number"
                    min="1000"
                    step="1000"
                    required
                    value={editingDish.price}
                    onChange={(e) =>
                      setEditingDish({ ...editingDish, price: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-[#ede4d4] outline-none focus:border-[#0e563f] font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#5e6f66] mb-1">Danh mục</label>
                  <select
                    value={editingDish.cat}
                    onChange={(e) => setEditingDish({ ...editingDish, cat: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#ede4d4] outline-none focus:border-[#0e563f] bg-white font-bold"
                  >
                    <option value="Cơm">Cơm</option>
                    <option value="Món nước">Món nước</option>
                    <option value="Món khô">Món khô</option>
                    <option value="Món chay">Món chay</option>
                    <option value="Món thêm">Món thêm</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#5e6f66] mb-1">Emoji</label>
                  <input
                    type="text"
                    maxLength={4}
                    value={editingDish.emoji}
                    onChange={(e) => setEditingDish({ ...editingDish, emoji: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#ede4d4] outline-none focus:border-[#0e563f] text-center"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#5e6f66] mb-1">Nhãn tag</label>
                  <input
                    type="text"
                    value={editingDish.tag || ''}
                    onChange={(e) => setEditingDish({ ...editingDish, tag: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#ede4d4] outline-none focus:border-[#0e563f]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#5e6f66] mb-1">Mô tả món ăn</label>
                <textarea
                  rows={2}
                  value={editingDish.desc}
                  onChange={(e) => setEditingDish({ ...editingDish, desc: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#ede4d4] outline-none focus:border-[#0e563f]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#5e6f66] mb-1">Ảnh món ăn (URL)</label>
                <input
                  type="text"
                  value={editingDish.imageUrl || ''}
                  onChange={(e) => setEditingDish({ ...editingDish, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#ede4d4] outline-none focus:border-[#0e563f]"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2 border-t border-[#ede4d4]">
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-[#0e563f] hover:bg-[#12694d] text-white font-black text-xs cursor-pointer shadow-md"
              >
                Lưu thay đổi
              </button>
              <button
                type="button"
                onClick={() => setEditingDish(null)}
                className="px-4 py-2.5 rounded-xl border border-[#ede4d4] text-xs font-bold hover:bg-[#f5efe3] cursor-pointer"
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: EDIT MEAL PACKAGE (CHỈNH SỬA GÓI SUẤT ĂN HỆ THỐNG) */}
      {/* ========================================================================= */}
      {editingPackage && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSavePackageSubmit}
            className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto border border-[#ede4d4] shadow-2xl p-6 sm:p-7 space-y-5 animate-in fade-in zoom-in-95 duration-200"
          >
            {/* Modal header */}
            <div className="flex items-center justify-between border-b border-[#ede4d4] pb-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#0e563f] bg-[#eaf5ee] px-2.5 py-0.5 rounded-md border border-[#cbe3d4]">
                  QUẢN TRỊ GÓI SUẤT ĂN
                </span>
                <h3 className="text-xl font-black text-[#15221b] mt-1 flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-[#0e563f]" />
                  <span>Chỉnh sửa: {editingPackage.title}</span>
                </h3>
              </div>
              <button
                type="button"
                disabled={isSavingPackage}
                onClick={() => setEditingPackage(null)}
                className="p-2 rounded-full hover:bg-[#f5efe3] text-[#5e6f66] cursor-pointer transition-colors"
                title="Đóng (Không lưu thay đổi)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Validation Error Banner */}
            {packageValidationError && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 animate-shake">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span className="font-bold">{packageValidationError}</span>
              </div>
            )}

            {/* Form Fields */}
            <div className="space-y-4 text-xs">
              {/* Package Title */}
              <div>
                <label className="block font-bold text-[#15221b] mb-1.5">
                  Tên gói suất ăn <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editPackageTitle}
                  onChange={(e) => setEditPackageTitle(e.target.value)}
                  placeholder="Ví dụ: Gói 10 suất ăn văn phòng..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#ede4d4] font-bold text-[#15221b] text-sm outline-none focus:border-[#0e563f] focus:ring-2 focus:ring-[#0e563f]/10 bg-[#fbf8f1]"
                />
              </div>

              {/* Price & Original Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="font-bold text-[#15221b]">
                      Giá bán thực tế (VNĐ) <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-[11px] text-[#0e563f] font-extrabold">
                      {formatVND(Number(editPackagePrice) || 0)}
                    </span>
                  </div>
                  <input
                    type="number"
                    min="1000"
                    step="1000"
                    required
                    value={editPackagePrice}
                    onChange={(e) => setEditPackagePrice(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#ede4d4] font-black text-[#0e563f] text-sm outline-none focus:border-[#0e563f] focus:ring-2 focus:ring-[#0e563f]/10 bg-[#fbf8f1]"
                  />
                  <span className="text-[10px] text-[#78847d] mt-1 block">
                    Đơn giá: ~{formatVND(Math.round((Number(editPackagePrice) || 0) / (Number(editPackageCount) || 1)))}/suất
                  </span>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="font-bold text-[#5e6f66]">
                      Giá gốc niêm yết (VNĐ)
                    </label>
                    {editPackageOriginalPrice && (
                      <span className="text-[11px] text-[#78847d] line-through">
                        {formatVND(Number(editPackageOriginalPrice) || 0)}
                      </span>
                    )}
                  </div>
                  <input
                    type="number"
                    min="1000"
                    step="1000"
                    value={editPackageOriginalPrice}
                    onChange={(e) => setEditPackageOriginalPrice(e.target.value)}
                    placeholder="Không bắt buộc"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#ede4d4] font-bold text-[#5e6f66] text-sm outline-none focus:border-[#0e563f] focus:ring-2 focus:ring-[#0e563f]/10 bg-white"
                  />
                  <span className="text-[10px] text-[#78847d] mt-1 block">
                    Dùng để gạch giá và tạo điểm nhấn khuyến mãi
                  </span>
                </div>
              </div>

              {/* Count & Tag */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#15221b] mb-1.5">
                    Số lượng suất ăn <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    required
                    value={editPackageCount}
                    onChange={(e) => setEditPackageCount(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#ede4d4] font-bold text-[#15221b] outline-none focus:border-[#0e563f] bg-[#fbf8f1]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#15221b] mb-1.5">
                    Nhãn nổi bật (Badge)
                  </label>
                  <input
                    type="text"
                    value={editPackageTag}
                    onChange={(e) => setEditPackageTag(e.target.value.toUpperCase())}
                    placeholder="Ví dụ: BÁN CHẠY NHẤT, TIẾT KIỆM..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#ede4d4] font-black uppercase text-[#8c4e06] outline-none focus:border-[#0e563f] bg-white"
                  />
                </div>
              </div>

              {/* Status Radio / Segmented Control */}
              <div>
                <label className="block font-bold text-[#15221b] mb-1.5">
                  Trạng thái kinh doanh
                </label>
                <div className="grid grid-cols-2 gap-3 p-1.5 bg-[#fbf8f1] rounded-2xl border border-[#ede4d4]">
                  <button
                    type="button"
                    onClick={() => setEditPackageIsActive(true)}
                    className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all ${
                      editPackageIsActive
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-[#5e6f66] hover:bg-white'
                    }`}
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Đang mở bán</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditPackageIsActive(false)}
                    className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all ${
                      !editPackageIsActive
                        ? 'bg-gray-700 text-white shadow-xs'
                        : 'text-[#5e6f66] hover:bg-white'
                    }`}
                  >
                    <X className="w-4 h-4" />
                    <span>Tạm ngưng mở bán</span>
                  </button>
                </div>
                <span className="text-[10px] text-[#78847d] mt-1 block">
                  Khi tạm ngưng, gói vẫn hiển thị trong lịch sử nhưng khách hàng mới không thể đặt mua.
                </span>
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold text-[#15221b] mb-1.5">
                  Mô tả ngắn gọn
                </label>
                <textarea
                  rows={2}
                  value={editPackageDesc}
                  onChange={(e) => setEditPackageDesc(e.target.value)}
                  placeholder="Mô tả tóm tắt giá trị của gói ăn này..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#ede4d4] text-[#15221b] outline-none focus:border-[#0e563f] bg-[#fbf8f1] leading-relaxed"
                />
              </div>

              {/* Features / Benefits */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-bold text-[#15221b]">
                    Danh sách quyền lợi chi tiết
                  </label>
                  <span className="text-[10px] text-[#78847d]">Mỗi dòng là 1 quyền lợi</span>
                </div>
                <textarea
                  rows={4}
                  value={editPackageFeatures}
                  onChange={(e) => setEditPackageFeatures(e.target.value)}
                  placeholder="Giảm sâu 20% toàn bộ thực đơn&#10;Thời hạn sử dụng lên đến 45 ngày&#10;Ưu tiên xếp món vào ca giao nóng sớm&#10;Tặng kèm 01 phần canh thanh nhiệt"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#ede4d4] text-[#15221b] font-mono text-xs outline-none focus:border-[#0e563f] bg-[#fbf8f1] leading-relaxed"
                />
              </div>

              {/* Image Selection */}
              <div>
                <label className="block font-bold text-[#15221b] mb-1.5">
                  Hình ảnh minh họa
                </label>
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    value={editPackageImage}
                    onChange={(e) => setEditPackageImage(e.target.value)}
                    placeholder="URL ảnh hoặc chọn ảnh mẫu bên dưới..."
                    className="flex-1 px-3 py-2 rounded-xl border border-[#ede4d4] text-xs outline-none focus:border-[#0e563f]"
                  />
                  {editPackageImage && (
                    <img
                      src={editPackageImage}
                      alt="Xem trước"
                      className="w-9 h-9 object-cover rounded-lg border border-[#ede4d4]"
                    />
                  )}
                </div>

                {/* Quick Presets */}
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {[
                    { label: 'Cơm sườn nướng', url: '/assets/images/com_suon_nuong_1793112602742.jpg' },
                    { label: 'Cơm gà xé', url: '/assets/images/com_ga_xe_1793112670730.jpg' },
                    { label: 'Bò lúc lắc', url: '/assets/images/bo_luc_lac_1793112709293.jpg' },
                    { label: 'Cơm cá kho tộ', url: '/assets/images/ca_kho_to_1793112646720.jpg' },
                    { label: 'Cơm gà sốt tiêu', url: '/assets/images/com_ga_sot_tieu_1793112548727.jpg' },
                  ].map((preset) => (
                    <button
                      key={preset.url}
                      type="button"
                      onClick={() => setEditPackageImage(preset.url)}
                      className={`flex items-center gap-1.5 p-1 rounded-lg border transition-all text-[11px] shrink-0 cursor-pointer ${
                        editPackageImage === preset.url
                          ? 'border-[#0e563f] bg-[#eaf5ee] text-[#0e563f] font-bold ring-1 ring-[#0e563f]'
                          : 'border-[#ede4d4] bg-white text-[#5e6f66] hover:bg-gray-50'
                      }`}
                    >
                      <img src={preset.url} alt={preset.label} className="w-5 h-5 rounded object-cover" />
                      <span>{preset.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#ede4d4]">
              <button
                type="button"
                disabled={isSavingPackage}
                onClick={() => setEditingPackage(null)}
                className="px-5 py-2.5 rounded-xl border border-[#ede4d4] text-xs font-bold text-[#5e6f66] hover:bg-[#f5efe3] cursor-pointer transition-colors"
              >
                Hủy bỏ
              </button>

              <button
                type="submit"
                disabled={isSavingPackage}
                className="px-6 py-2.5 rounded-xl bg-[#0e563f] hover:bg-[#12694d] active:scale-95 text-white font-black text-xs transition-all shadow-md cursor-pointer flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSavingPackage ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#fed7aa]" />
                    <span>Đang lưu thay đổi...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 text-[#fed7aa]" />
                    <span>Lưu thay đổi gói</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
