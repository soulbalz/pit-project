import { useEffect, useState } from 'react';

export default function renderRoutes(routes) {
  const [currentPath, setCurrentPath] = useState(null);
  const [expandMenu, setExpandMenu] = useState(null);

  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, []);

  const onClickExpandMenu = (e, menu) => {
    e.preventDefault();
    if (expandMenu === menu) {
      menu = '-';
    }
    setExpandMenu(menu);
  };

  return routes.map((route, index) => {
    if (route.subRoutes) {
      const subRoutes = renderRoutes(route.subRoutes);
      let showClass = '';
      const isCurrentPath = route.subRoutes.some(item => item.path === currentPath);
      if (route.key === expandMenu) {
        showClass = 'c-show';
      } else if (isCurrentPath && (!expandMenu || route.key === expandMenu)) {
        showClass = 'c-show';
      }
      return (
        <div key={index} className={`c-sidebar-nav-dropdown ${showClass}`}>
          <a href='#' className='c-sidebar-nav-dropdown-toggle' onClick={(e) => onClickExpandMenu(e, route.key)}>
            {route.icon && <route.icon className='c-sidebar-nav-icon' />}
            {route.name}
          </a>
          <ul className='c-sidebar-nav-dropdown-items'>
            {subRoutes}
          </ul>
        </div>
      );
    }

    const activeClass = route.path === currentPath ? 'c-active' : '';
    return (
      <div key={index} className='c-sidebar-nav-item'>
        <a href={route.path} className={`c-sidebar-nav-link ${activeClass}`} onClick={route.onClick}>
          {route.icon && <route.icon className='c-sidebar-nav-icon' />}
          {route.name}
        </a>
      </div>
    );
  });
};
