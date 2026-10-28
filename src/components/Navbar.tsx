import React from 'react';
import { BrandLogo } from './BrandLogo';
import { PageId, Language, Customer } from '../types';
import { I18N } from '../data/initialData';
import { ShoppingBag, Menu, X, User, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  cartCount: number;
  language: Language;
  activeCustomer: Customer | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  cartCount,
  language,
  activeCustomer,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const t = I18N[language];

  const navItems: { id: PageId; label: string }[] = [
    { id: 'home', label: t.home },
    { id: 'menu', label: t.menu },
    { id: 'orders', label: t.orders },
    { id: 'member', label: t.member },
    { id: 'account', label: t.account },
    { id: 'settings', label: t.settings },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#fbf8f1]/95 backdrop-blur-md border-b border-[#ede4d4] transition-all">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 h-[76px] flex items-center justify-between gap-4">
        {/* Brand */}
        <div
          onClick={() => onNavigate('home')}
          className="cursor-pointer"
        >
          <BrandLogo />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1.5">
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`px-3 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-[#eaf5ee] text-[#0e563f] ring-1 ring-[#cbe3d4]'
                    : 'text-[#5e6f66] hover:text-[#15221b] hover:bg-[#f5efe3]'
                }`}
              >
                {item.label}
              </button>
            );
          })}

          {/* Admin Portal Button */}
          <button
            onClick={() => onNavigate('admin')}
            className={`px-3 py-2 rounded-xl text-sm font-black flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              currentPage === 'admin'
                ? 'bg-[#0e563f] text-white shadow-xs'
                : 'text-[#0e563f] bg-[#eaf5ee] hover:bg-[#d8ecdf] ring-1 ring-[#cbe3d4]'
            }`}
            title="Khu vực Quản trị Bếp & Đơn hàng"
          >
            <ShieldCheck className="w-4 h-4 text-[#f59e0b]" />
            <span>Quản trị</span>
          </button>

          {/* Cart Button with warm golden accent */}
          <button
            onClick={() => onNavigate('checkout')}
            className={`ml-1.5 px-3.5 py-2 rounded-xl font-black text-sm flex items-center gap-2 transition-all shadow-sm cursor-pointer whitespace-nowrap shrink-0 ${
              currentPage === 'checkout'
                ? 'bg-[#093c2b] text-white ring-2 ring-[#f59e0b]'
                : 'bg-[#0e563f] hover:bg-[#12694d] text-white'
            }`}
          >
            <ShoppingBag className="w-4 h-4 text-[#fed7aa]" />
            <span>{t.checkout}</span>
            <span className="bg-[#f59e0b] text-[#2d1e06] font-black rounded-full px-2 py-0.5 text-xs min-w-[20px] text-center shadow-xs">
              {cartCount}
            </span>
          </button>
        </nav>

        {/* Mobile controls */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            onClick={() => onNavigate('admin')}
            className="p-2 rounded-xl bg-[#eaf5ee] border border-[#cbe3d4] text-[#0e563f] cursor-pointer"
            title="Quản trị"
          >
            <ShieldCheck className="w-4 h-4 text-[#f59e0b]" />
          </button>

          <button
            onClick={() => onNavigate('checkout')}
            className="px-3.5 py-2 rounded-xl bg-[#0e563f] hover:bg-[#12694d] text-white font-extrabold text-xs flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 text-[#fed7aa]" />
            <span className="bg-[#f59e0b] text-[#2d1e06] font-black px-1.5 py-0.2 rounded-full text-[11px]">
              {cartCount}
            </span>
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl border border-[#ede4d4] text-[#15221b] hover:bg-[#f5efe3] cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-[#0e563f]" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-[#ede4d4] bg-[#fffefc] px-4 py-3 space-y-1 shadow-lg">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-bold flex items-center justify-between cursor-pointer ${
                currentPage === item.id
                  ? 'bg-[#eaf5ee] text-[#0e563f] ring-1 ring-[#cbe3d4]'
                  : 'text-[#5e6f66] hover:bg-[#f5efe3] hover:text-[#15221b]'
              }`}
            >
              <span>{item.label}</span>
            </button>
          ))}

          {/* Mobile Admin Link */}
          <button
            onClick={() => {
              onNavigate('admin');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 cursor-pointer ${
              currentPage === 'admin'
                ? 'bg-[#0e563f] text-white ring-1 ring-[#0e563f]'
                : 'text-[#0e563f] bg-[#eaf5ee] hover:bg-[#d8ecdf]'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-[#f59e0b]" />
            <span>Khu vực Quản trị & Bếp</span>
          </button>

          {activeCustomer && (
            <div className="pt-2 mt-2 border-t border-[#ede4d4] text-xs text-[#5e6f66] px-3.5 flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-[#0e563f]" />
              <span>Đang đăng nhập: <b>{activeCustomer.name}</b> ({activeCustomer.memberCode})</span>
            </div>
          )}
        </div>
      )}
    </header>
  );
};


