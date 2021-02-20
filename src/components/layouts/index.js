import { useSession } from 'next-auth/client';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { RiLockPasswordLine, RiLogoutBoxLine } from 'react-icons/ri';
import { MdMenu } from 'react-icons/md';
import BreadCrumb from 'src/components/layouts/breadcrumb';
import Sidebar from 'src/components/layouts/sidebar';
import { APP_NAME } from 'src/constants';
import { sendLogOut } from 'src/utils/client';

export default function Layout({ children, breadcrumb }) {
  const router = useRouter();
  const [session, loading] = useSession();

  if (!session && !loading) router.push('/auth');

  const nodeProfileMenu = useRef(null);

  const [isShowSidebar, setIsShowSidebar] = useState(true);
  const [isShowSidebarMobile, setIsShowSidebarMobile] = useState(false);
  const [isShowProfileMenu, setIsShowProfileMenu] = useState(false);
  const [, setIsChangePasswordModalOpen] = useState(false);
  // const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);

  const mouseDownEvent = e => {
    if (!nodeProfileMenu.current.contains(e.target)) setIsShowProfileMenu(false);
  };

  useEffect(() => {
    document.addEventListener('mousedown', mouseDownEvent);
    return () => {
      document.removeEventListener('mousedown', mouseDownEvent);
    };
  }, []);

  const onClickShowProfileMenu = (e) => {
    e.preventDefault();
    setIsShowProfileMenu(!isShowProfileMenu);
  };

  const onClickChangePassword = (e) => {
    e.preventDefault();
    setIsChangePasswordModalOpen(true);
  };

  const handleLogOut = (e) => {
    e.preventDefault();
    sendLogOut();
  };

  return (
    <>
      <Sidebar isShow={isShowSidebar} isShowMobile={isShowSidebarMobile} setIsShowSidebarMobile={setIsShowSidebarMobile} />
      <div className='c-wrapper'>
        <header className='c-header c-header-light c-header-fixed'>
          <button className='c-header-toggler c-class-toggler d-lg-none mfe-auto' onClick={() => setIsShowSidebarMobile(!isShowSidebarMobile)}>
            <MdMenu className='c-icon c-icon-lg' />
          </button>
          <a className='c-header-brand d-lg-none c-header-brand-sm-up-center' href='/'>{APP_NAME}</a>
          <button className='c-header-toggler c-class-toggler mfs-3 d-md-down-none' onClick={() => setIsShowSidebar(!isShowSidebar)}>
            <MdMenu className='c-icon c-icon-lg' />
          </button>
          <ul className='c-header-nav mfs-auto mfe-3'>
            <li className='c-header-nav-item dropdown' ref={nodeProfileMenu}>
              <a className='c-header-nav-link' href='#' onClick={onClickShowProfileMenu}>
                <div className='c-avatar'>
                  <img className='c-avatar-img' src='/gravatar.jpg' alt='gravatar' />
                </div>
              </a>
              <div className={`dropdown-menu dropdown-menu-right pt-0 ${isShowProfileMenu ? 'show' : ''}`}>
                <Link href='/'>
                  <a className='dropdown-item' onClick={onClickChangePassword}>
                    <RiLockPasswordLine className='c-icon mfe-2' /> เปลี่ยนรหัสผ่าน
                  </a>
                </Link>
                <a className='dropdown-item' href='/auth/logout' onClick={handleLogOut}>
                  <RiLogoutBoxLine className='c-icon mfe-2' /> ออกจากระบบ
                </a>
              </div>
            </li>
          </ul>
          <BreadCrumb>{breadcrumb}</BreadCrumb>
        </header>
        <div className='c-body'>
          <main className='c-main'>
            <div className='container-fluid'>
              <div className='fade-in'>
                <div className='card'>
                  <div className='card-body'>
                    {children}
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};
