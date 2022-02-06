import { useEffect, useRef, useState } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { APP_NAME } from 'src/constants';
import { ROUTES } from 'src/constants/routes';
import { useSession } from 'next-auth/client';
import { hasPerm } from 'src/utils';

export default function Sidebar({ isShow, isShowMobile, setIsShowSidebarMobile }) {
  const [session] = useSession();
  const nodeSidebar = useRef(null);

  const [user, setUser] = useState(null);
  const [expandMenu, setExpandMenu] = useState(null);
  const [currentPath, setCurrentPath] = useState(null);

  const mouseDownEvent = e => {
    if (!nodeSidebar.current.contains(e.target)) setIsShowSidebarMobile(false);
  };

  const onClickExpandMenu = (e, menu) => {
    e.preventDefault();
    if (expandMenu === menu) {
      menu = '-';
    }
    setExpandMenu(menu);
  };

  const getMenuItems = (items) => {
    return items.map((route, index) => {
      if (!hasPerm(route.permissions, user)) return null;

      if (route.subRoutes) {
        const subRoutes = getMenuItems(route.subRoutes);

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

  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', mouseDownEvent);
    return () => {
      document.removeEventListener('mousedown', mouseDownEvent);
    };
  }, []);

  useEffect(() => {
    if (session) {
      setUser(session.user);
    }
  }, [session]);

  let sideBarClass = 'c-sidebar c-sidebar-dark c-sidebar-fixed';
  if (isShow) {
    sideBarClass = `${sideBarClass} c-sidebar-lg-show`;
  }

  if (isShowMobile) {
    sideBarClass = `${sideBarClass} c-sidebar-show`;
  }

  return (
    <div ref={nodeSidebar} className={sideBarClass}>
      <div className='c-sidebar-brand d-md-down-none'>
        <div className='c-sidebar-brand-full'>{APP_NAME}</div>
      </div>
      <PerfectScrollbar className='c-sidebar-nav'>
        {getMenuItems(ROUTES)}
      </PerfectScrollbar>
    </div>
  );
};
