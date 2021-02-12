import { useEffect, useRef } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { APP_NAME } from 'src/constants';
import { ROUTES } from 'src/constants/routes';
import renderRoute from 'src/utils/route';

export default function Sidebar({ isShow, isShowMobile, setIsShowSidebarMobile }) {
  const nodeSidebar = useRef(null);

  const mouseDownEvent = e => {
    if (!nodeSidebar.current.contains(e.target)) setIsShowSidebarMobile(false);
  };

  useEffect(() => {
    document.addEventListener('mousedown', mouseDownEvent);
    return () => {
      document.removeEventListener('mousedown', mouseDownEvent);
    };
  }, []);

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
        {renderRoute(ROUTES)}
      </PerfectScrollbar>
    </div>
  );
};
