import React, { useState, useEffect } from 'react';
import {
  CategoryType,
  Customer,
  FoodItem,
  CartItem,
  Order,
  OrderStatus,
  PackageCatalogItem,
  PageId,
  UserPackage,
  Language,
} from './types';
import {
  INITIAL_FOODS,
  DEFAULT_PACKAGES,
  getDayOptions,
  formatVND,
  generateInitialDemoOrders,
  INITIAL_CUSTOMERS,
  INITIAL_DEMO_PACKAGES,
} from './data/initialData';
import { Navbar } from './components/Navbar';
import { AuthGate } from './components/AuthGate';
import { HomeView } from './components/HomeView';
import { MenuView } from './components/MenuView';
import { CheckoutView } from './components/CheckoutView';
import { OrdersView } from './components/OrdersView';
import { MemberView } from './components/MemberView';
import { AccountView } from './components/AccountView';
import { SettingsView } from './components/SettingsView';
import { AdminView } from './components/AdminView';

export default function App() {
  const dayOptions = getDayOptions();

  // LocalStorage initialization
  const [customers, setCustomers] = useState<Customer[]>(() => {
    try {
      const saved = localStorage.getItem('tt_customers');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return INITIAL_CUSTOMERS;
    } catch {
      return INITIAL_CUSTOMERS;
    }
  });

  const [rememberLogin, setRememberLogin] = useState<boolean>(() => {
    return localStorage.getItem('tt_remember_login') === 'yes';
  });

  const [activeCustomer, setActiveCustomer] = useState<Customer | null>(() => {
    try {
      if (localStorage.getItem('tt_remember_login') === 'yes') {
        const saved = localStorage.getItem('tt_active_customer');
        return saved ? JSON.parse(saved) : null;
      }
      return null;
    } catch {
      return null;
    }
  });

  // Controls whether the full AuthGate split screen is shown
  const [isAuthMode, setIsAuthMode] = useState<boolean>(() => {
    if (localStorage.getItem('tt_remember_login') === 'yes' && localStorage.getItem('tt_active_customer')) {
      return false;
    }
    return true;
  });

  const [foods, setFoods] = useState<FoodItem[]>(() => {
    try {
      const saved = localStorage.getItem('tt_custom_menu');
      if (saved) {
        const parsed: FoodItem[] = JSON.parse(saved);
        // Sync any default items with fresh, authentic dish imagery
        return parsed.map((item) => {
          const fresh = INITIAL_FOODS.find((f) => f.id === item.id);
          return fresh ? { ...item, imageUrl: fresh.imageUrl, desc: fresh.desc } : item;
        });
      }
      return INITIAL_FOODS;
    } catch {
      return INITIAL_FOODS;
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('tt_orders');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return generateInitialDemoOrders();
    } catch {
      return generateInitialDemoOrders();
    }
  });

  const [packages, setPackages] = useState<UserPackage[]>(() => {
    try {
      const saved = localStorage.getItem('tt_packages');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return INITIAL_DEMO_PACKAGES;
    } catch {
      return INITIAL_DEMO_PACKAGES;
    }
  });

  const [packageCatalog, setPackageCatalog] = useState<PackageCatalogItem[]>(() => {
    try {
      const saved = localStorage.getItem('tt_package_catalog');
      if (saved) {
        const parsed: PackageCatalogItem[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((item) => {
            const fresh = DEFAULT_PACKAGES.find((p) => p.id === item.id);
            return {
              isActive: item.isActive !== false,
              features: item.features || fresh?.features || [
                'Giảm ngay 20% mỗi phần cơm',
                'Thời hạn sử dụng linh hoạt',
                'Tự động trừ số dư thẻ khi đặt cơm',
              ],
              popular: item.popular ?? fresh?.popular ?? false,
              originalPrice: item.originalPrice ?? fresh?.originalPrice,
              ...fresh,
              ...item,
              image: item.image || fresh?.image || '/assets/images/com_suon_nuong_1793112602742.jpg',
            };
          });
        }
      }
      return DEFAULT_PACKAGES;
    } catch {
      return DEFAULT_PACKAGES;
    }
  });

  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('tt_customer_language') as Language) || 'vi';
  });

  const [activePage, setActivePage] = useState<PageId>('home');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeDay, setActiveDay] = useState<string>(dayOptions[0].value);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Persistence helpers
  useEffect(() => {
    localStorage.setItem('tt_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('tt_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('tt_packages', JSON.stringify(packages));
  }, [packages]);

  useEffect(() => {
    localStorage.setItem('tt_custom_menu', JSON.stringify(foods));
  }, [foods]);

  useEffect(() => {
    localStorage.setItem('tt_package_catalog', JSON.stringify(packageCatalog));
  }, [packageCatalog]);

  useEffect(() => {
    localStorage.setItem('tt_customer_language', language);
    document.documentElement.lang = language;
  }, [language]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => {
      setToastMessage(null);
    }, 2800);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  // Auth actions
  const handleLoginSuccess = (customer: Customer, remember: boolean) => {
    setActiveCustomer(customer);
    setRememberLogin(remember);

    // Ensure customer is also in customer list
    setCustomers((prev) => {
      const idx = prev.findIndex((c) => c.id === customer.id || c.email === customer.email);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = customer;
        return copy;
      }
      return [...prev, customer];
    });

    if (remember) {
      localStorage.setItem('tt_active_customer', JSON.stringify(customer));
      localStorage.setItem('tt_remember_login', 'yes');
    } else {
      localStorage.removeItem('tt_active_customer');
      localStorage.removeItem('tt_remember_login');
    }

    setIsAuthMode(false);
    setActivePage('home');
  };

  const handleLogout = () => {
    setActiveCustomer(null);
    setRememberLogin(false);
    localStorage.removeItem('tt_active_customer');
    localStorage.removeItem('tt_remember_login');
    setIsAuthMode(true);
    showToast('Bạn đã đăng xuất tài khoản');
  };

  const handleSaveProfile = (updated: Partial<Customer>) => {
    if (!activeCustomer) return;
    const newCustomer = { ...activeCustomer, ...updated };
    setActiveCustomer(newCustomer);
    setCustomers((prev) => prev.map((c) => (c.id === newCustomer.id ? newCustomer : c)));

    if (rememberLogin) {
      localStorage.setItem('tt_active_customer', JSON.stringify(newCustomer));
    }
  };

  const handleUpdateAvatar = (avatarDataUrl: string) => {
    if (!activeCustomer) return;
    handleSaveProfile({ avatar: avatarDataUrl });
  };

  const handleChangePassword = (oldPass: string, newPass: string): boolean => {
    if (!activeCustomer || activeCustomer.password !== oldPass) return false;
    handleSaveProfile({ password: newPass });
    return true;
  };

  // Cart actions
  const handleAddToCart = (food: FoodItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === food.id);
      if (existing) {
        return prev.map((i) => (i.id === food.id ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { ...food, qty: 1 }];
    });
    showToast(`Đã thêm món "${food.name}" vào giỏ hàng`);
  };

  const handleUpdateCartQty = (id: number, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.id === id) {
            return { ...item, qty: item.qty + delta };
          }
          return item;
        })
        .filter((item) => item.qty > 0);
    });
  };

  const cartCountMap: Record<number, number> = {};
  cart.forEach((i) => {
    cartCountMap[i.id] = i.qty;
  });

  const totalCartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  // Orders & Packages
  const handlePlaceOrder = (newOrder: Order, updatedPackage?: UserPackage) => {
    setOrders((prev) => [newOrder, ...prev]);

    if (updatedPackage) {
      setPackages((prev) =>
        prev.map((p) => (p.id === updatedPackage.id ? updatedPackage : p))
      );
    }

    setCart([]);
  };

  const handleCancelOrder = (orderId: string) => {
    const o = orders.find((x) => x.id === orderId);
    if (!o) return;

    // Check cancellation window rule: same day after 07:00 AM
    const todayStr = new Date().toISOString().slice(0, 10);
    const orderDeadline = new Date(o.day + 'T07:00:00');
    if (o.day === todayStr && new Date() >= orderDeadline) {
      showToast('Đã quá 07:00 sáng ngày sử dụng. Vui lòng liên hệ hotline 1900 1234.');
      return;
    }

    const confirmed = window.confirm(
      `Bạn có chắc chắn muốn hủy đơn hàng #${orderId}? Hệ thống sẽ tự động hoàn tiền/suất ăn cho bạn.`
    );

    if (!confirmed) return;

    let refundText = 'Đã hủy đơn hàng thành công';

    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id !== orderId) return ord;

        let payStatus = ord.payStatus;

        if (!ord.refundProcessed) {
          if (ord.packageId) {
            // Refund to meal package
            setPackages((pkgList) =>
              pkgList.map((pkg) => {
                if (pkg.id === ord.packageId) {
                  return {
                    ...pkg,
                    balance: (Number(pkg.balance) || 0) + (Number(ord.packageCharge) || Number(ord.foodTotal) || 0),
                    used: Math.max(0, (Number(pkg.used) || 0) - (Number(ord.packageQty) || 0)),
                  };
                }
                return pkg;
              })
            );
            payStatus = 'Đã hoàn tiền vào thẻ ăn';
            refundText = 'Đơn đã hủy; tiền đã được hoàn lại đầy đủ vào thẻ ăn của bạn!';
          } else if (ord.payStatus.includes('Đã thanh toán')) {
            payStatus = 'Đã hoàn tiền (mô phỏng)';
            refundText = 'Đơn đã hủy; tiền thanh toán đã được ghi nhận hoàn lại!';
          }
        }

        return {
          ...ord,
          status: 'Đã hủy',
          payStatus,
          refundProcessed: true,
        };
      })
    );

    showToast(refundText);
  };

  const handleBuyPackage = (catalogItem: PackageCatalogItem) => {
    if (!activeCustomer) {
      showToast('Vui lòng đăng nhập hoặc đăng ký tài khoản trước khi mua gói suất ăn');
      setActivePage('account');
      return;
    }

    const confirmed = window.confirm(
      `Đăng ký ${catalogItem.title} với giá ${formatVND(
        catalogItem.price
      )} cho mã thành viên ${activeCustomer.memberCode}? (Thanh toán mô phỏng)`
    );

    if (!confirmed) return;

    const newPkg: UserPackage = {
      id: 'GOI' + Date.now().toString().slice(-5),
      customerId: activeCustomer.id,
      memberCode: activeCustomer.memberCode,
      title: catalogItem.title,
      count: catalogItem.count,
      used: 0,
      price: catalogItem.price,
      balance: catalogItem.price,
      tag: catalogItem.tag,
      datePurchased: new Date().toLocaleDateString('vi-VN'),
    };

    setPackages((prev) => [newPkg, ...prev]);
    showToast(`Đã kích hoạt ${catalogItem.title} cho mã ${activeCustomer.memberCode}! Giảm 20% khi đặt cơm.`);
    setActivePage('member');
  };

  // Admin handlers
  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        let payStatus = o.payStatus;
        if (newStatus === 'Đã giao' && o.payment.includes('COD')) {
          payStatus = 'Đã thanh toán (COD)';
        }
        return {
          ...o,
          status: newStatus,
          payStatus,
        };
      })
    );
    showToast(`Đã cập nhật trạng thái đơn #${orderId} sang "${newStatus}"`);
  };

  const handleAddFood = (newFoodData: Omit<FoodItem, 'id'>) => {
    const nextId = Math.max(0, ...foods.map((f) => f.id)) + 1;
    const newFood: FoodItem = {
      id: nextId,
      ...newFoodData,
    };
    setFoods((prev) => [...prev, newFood]);
  };

  const handleRemoveFood = (foodId: number) => {
    setFoods((prev) => prev.filter((f) => f.id !== foodId));
    showToast('Đã xóa món khỏi thực đơn');
  };

  const handleBulkUpdateOrderStatus = (orderIds: string[], newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (!orderIds.includes(o.id)) return o;
        let payStatus = o.payStatus;
        if (newStatus === 'Đã giao' && o.payment.includes('COD')) {
          payStatus = 'Đã thanh toán (COD)';
        }
        return {
          ...o,
          status: newStatus,
          payStatus,
        };
      })
    );
  };

  const handleManualAddOrder = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
  };

  const handleUpdateFood = (foodId: number, updated: Partial<FoodItem>) => {
    setFoods((prev) =>
      prev.map((f) => (f.id === foodId ? { ...f, ...updated } : f))
    );
  };

  const handleResetFoods = () => {
    setFoods(INITIAL_FOODS);
    localStorage.removeItem('tt_custom_menu');
  };

  const handleSeedDemoData = () => {
    const demoOrders = generateInitialDemoOrders();
    setOrders(demoOrders);
    setCustomers(INITIAL_CUSTOMERS);
    setPackages(INITIAL_DEMO_PACKAGES);
  };

  const handleClearOrders = () => {
    setOrders([]);
    localStorage.removeItem('tt_orders');
  };

  const handleNavigate = (page: PageId) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#fbf8f1] text-[#15221b] flex flex-col font-sans">
      {/* Auth Gate Screen (when not logged in / auth mode active) */}
      {isAuthMode ? (
        <AuthGate
          onLoginSuccess={handleLoginSuccess}
          onContinueAsGuest={() => {
            setIsAuthMode(false);
            setActivePage('home');
          }}
          existingCustomers={customers}
          onToast={showToast}
        />
      ) : (
        <>
          {/* Main App Bar */}
          <Navbar
            currentPage={activePage}
            onNavigate={handleNavigate}
            cartCount={totalCartCount}
            language={language}
            activeCustomer={activeCustomer}
          />

          {/* Main View Container */}
          <main className="max-w-[1240px] w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 flex-1">
            {activePage === 'home' && (
              <HomeView
                foods={foods}
                onAddToCart={handleAddToCart}
                onNavigate={handleNavigate}
                language={language}
                cartCountMap={cartCountMap}
              />
            )}

            {activePage === 'menu' && (
              <MenuView
                foods={foods}
                activeDay={activeDay}
                onSelectDay={setActiveDay}
                onAddToCart={handleAddToCart}
                cartCountMap={cartCountMap}
              />
            )}

            {activePage === 'checkout' && (
              <CheckoutView
                cart={cart}
                onUpdateQty={handleUpdateCartQty}
                onClearCart={() => setCart([])}
                activeCustomer={activeCustomer}
                packages={packages}
                orders={orders}
                onPlaceOrder={handlePlaceOrder}
                onNavigate={handleNavigate}
                onToast={showToast}
                activeDay={activeDay}
              />
            )}

            {activePage === 'orders' && (
              <OrdersView
                orders={orders}
                onCancelOrder={handleCancelOrder}
                onNavigate={handleNavigate}
              />
            )}

            {activePage === 'member' && (
              <MemberView
                catalog={packageCatalog}
                packages={packages}
                activeCustomer={activeCustomer}
                onBuyPackage={handleBuyPackage}
                onNavigate={handleNavigate}
              />
            )}

            {activePage === 'account' && (
              <AccountView
                activeCustomer={activeCustomer}
                orders={orders}
                packages={packages}
                onSaveProfile={handleSaveProfile}
                onLogout={handleLogout}
                onLogin={(cust, rem) => handleLoginSuccess(cust, rem)}
                existingCustomers={customers}
                onNavigate={handleNavigate}
                onToast={showToast}
              />
            )}

            {activePage === 'settings' && (
              <SettingsView
                activeCustomer={activeCustomer}
                onUpdateAvatar={handleUpdateAvatar}
                onChangePassword={handleChangePassword}
                language={language}
                onSetLanguage={setLanguage}
                onNavigate={handleNavigate}
                onToast={showToast}
              />
            )}

            {activePage === 'admin' && (
              <AdminView
                orders={orders}
                onUpdateOrderStatus={handleUpdateOrderStatus}
                onBulkUpdateOrderStatus={handleBulkUpdateOrderStatus}
                onAddOrder={handleManualAddOrder}
                foods={foods}
                onAddFood={handleAddFood}
                onUpdateFood={handleUpdateFood}
                onRemoveFood={handleRemoveFood}
                onResetFoods={handleResetFoods}
                packages={packages}
                onUpdatePackages={setPackages}
                packageCatalog={packageCatalog}
                onUpdatePackageCatalog={setPackageCatalog}
                customers={customers}
                onUpdateCustomers={setCustomers}
                onToast={showToast}
                onNavigateHome={() => handleNavigate('home')}
                onSeedDemoData={handleSeedDemoData}
                onClearOrders={handleClearOrders}
              />
            )}
          </main>

          {/* Footer */}
          <footer className="border-t border-[#ede4d4] bg-[#f7f2e5] py-8 px-4 text-center text-xs text-[#5e6f66] space-y-2">
            <div className="flex items-center justify-center gap-2">
              <img
                src="/assets/images/logo_toi_trua.png"
                alt="Logo Tới Trưa"
                className="w-7 h-7 object-contain rounded-lg bg-white p-0.5 border border-[#ede4d4]"
              />
              <span className="font-black text-[#0e563f] text-sm">
                TỚI TRƯA
              </span>
              <span className="text-[#f59e0b] font-black">·</span>
              <span className="font-semibold italic text-[#365f4e]">
                Trưa tới, ăn chưa?
              </span>
            </div>
            <div>
              Mô hình đặt cơm văn phòng thông minh: công bố thực đơn sớm 3 ngày, giao nóng hổi đúng hẹn từ 09:00 – 11:30.
            </div>
            <div className="text-[11px] text-[#86958d]">
              © 2026 Tới Trưa Vietnam · All rights reserved
            </div>
          </footer>
        </>
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#093c2b] text-white text-xs sm:text-sm font-bold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 toast-animate border border-[#cbe3d4]/30 ring-2 ring-[#f59e0b]/50">
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
