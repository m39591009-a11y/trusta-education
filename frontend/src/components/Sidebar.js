import React, { useState } from 'react';

const ownerMenu = [
  { key: 'dashboard', label: 'Панели асосӣ', icon: '🏠', href: '/dashboard' },
  { key: 'students', label: 'Хонандагон', icon: '👥', href: '/students' },
  { key: 'groups', label: 'Гурӯҳҳо', icon: '📚', href: '/groups' },
  { key: 'teachers', label: 'Муаллимон', icon: '👨‍🏫', href: '/teachers' },
  { key: 'attendance', label: 'Давомот', icon: '✅', href: '/attendance' },
  { key: 'payments', label: 'Пардохтҳо', icon: '💳', href: '/payments' },
  { key: 'debtors', label: 'Қарздорон', icon: '⚠️', href: '/debtors' },
  { key: 'finance', label: 'Молия', icon: '📊', href: '/finance' },
  { key: 'settings', label: 'Танзимот', icon: '⚙️', href: '/settings' },
];

const adminMenu = [
  { key: 'students', label: 'Хонандагон', icon: '👥' },
  { key: 'attendance', label: 'Давомот', icon: '✅' },
  { key: 'payments', label: 'Пардохтҳо', icon: '💳' },
  { key: 'debtors', label: 'Қарздорон', icon: '⚠️' },
  { key: 'groups', label: 'Гурӯҳҳо', icon: '📚' },
  { key: 'teachers', label: 'Муаллимон', icon: '👨‍🏫' },
];

const teacherMenu = [
  { key: 'attendance', label: 'Давомот', icon: '✅', href: '/teacher' },
  { key: 'groups', label: 'Гурӯҳҳои ман', icon: '📚', href: '/teacher/groups' },
  { key: 'schedule', label: 'Расписание', icon: '📅', href: '/teacher/schedule' },
];

function Sidebar({ active, role, userName, onTabChange }) {
  const [open, setOpen] = useState(false);

  const items = role === 'teacher' ? teacherMenu : role === 'admin' ? adminMenu : ownerMenu;

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  const handleClick = (item) => {
    setOpen(false);
    if (item.href) {
      window.location.href = item.href;
    } else if (onTabChange) {
      onTabChange(item.key);
    }
  };

  return (
    React.createElement(React.Fragment, null,
      // Mobile Header
      React.createElement('div', {
        className: 'lg:hidden fixed top-0 left-0 right-0 z-50 bg-slate-900 px-4 py-3 flex items-center justify-between shadow-lg'
      },
        React.createElement('div', { className: 'flex items-center gap-2' },
          React.createElement('div', {
            className: 'w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold text-sm'
          }, 'T'),
          React.createElement('div', null,
            React.createElement('div', { className: 'text-white font-bold text-sm' }, 'TRUSTA'),
            React.createElement('div', { className: 'text-slate-400 text-xs' }, 'Education')
          )
        ),
        React.createElement('button', {
          onClick: () => setOpen(!open),
          className: 'text-white text-2xl w-8 h-8 flex items-center justify-center'
        }, open ? '✕' : '☰')
      ),

      // Overlay
      open && React.createElement('div', {
        className: 'lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50',
        onClick: () => setOpen(false)
      }),

      // Sidebar
      React.createElement('div', {
        className: [
          'fixed lg:static inset-y-0 left-0 z-40',
          'w-56 bg-slate-900 flex flex-col flex-shrink-0',
          'transform transition-transform duration-300 ease-in-out',
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        ].join(' ')
      },
        // Logo desktop
        React.createElement('div', {
          className: 'hidden lg:flex p-4 border-b border-slate-700 items-center gap-2'
        },
          React.createElement('div', {
            className: 'w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold text-sm'
          }, 'T'),
          React.createElement('div', null,
            React.createElement('div', { className: 'text-white font-bold text-sm' }, 'TRUSTA'),
            React.createElement('div', { className: 'text-slate-400 text-xs' }, 'Education')
          )
        ),

        // Mobile spacer
        React.createElement('div', { className: 'lg:hidden h-14' }),

        // Nav
        React.createElement('nav', { className: 'flex-1 p-2 overflow-y-auto' },
          items.map(item =>
            React.createElement('div', {
              key: item.key,
              onClick: () => handleClick(item),
              className: [
                'flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm mb-0.5 transition-all cursor-pointer',
                active === item.key
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              ].join(' ')
            },
              React.createElement('span', { className: 'text-base' }, item.icon),
              React.createElement('span', null, item.label)
            )
          )
        ),

        // User
        React.createElement('div', { className: 'p-3 border-t border-slate-700' },
          React.createElement('div', { className: 'flex items-center gap-2 px-2 mb-2' },
            React.createElement('div', {
              className: [
                'w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold',
                role === 'owner' ? 'bg-yellow-500' : role === 'admin' ? 'bg-blue-600' : 'bg-green-600'
              ].join(' ')
            }, userName ? userName[0].toUpperCase() : 'U'),
            React.createElement('div', null,
              React.createElement('div', { className: 'text-white text-xs font-medium' }, userName || 'Корбар'),
              React.createElement('div', { className: 'text-slate-400 text-xs' },
                role === 'owner' ? '👑 Роҳбар' : role === 'admin' ? '👤 Админ' : '🎓 Муаллим'
              )
            )
          ),
          React.createElement('button', {
            onClick: handleLogout,
            className: 'w-full flex items-center gap-2 px-3 py-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white text-sm'
          },
            React.createElement('span', null, '🚪'),
            React.createElement('span', null, 'Баромад')
          )
        )
      )
    )
  );
}

export default Sidebar;
