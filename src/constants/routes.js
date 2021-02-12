import { AiOutlineTransaction } from 'react-icons/ai';
import { RiDashboardLine, RiLogoutBoxLine } from 'react-icons/ri';
import { GiBoulderDash } from 'react-icons/gi';
import { sendLogOut } from 'src/utils/client';

export const ROUTES = [{
  name: 'Dashboard',
  path: '/',
  icon: RiDashboardLine
}, {
  key: 'student',
  name: 'นักศึกษา',
  icon: AiOutlineTransaction,
  subRoutes: [{
    name: 'เพิ่มนักศึกษา',
    path: '/students/create',
    icon: GiBoulderDash
  }, {
    name: 'รายชื่อนักศึกษา',
    path: '/students',
    icon: GiBoulderDash
  }]
}, {
  name: 'ออกจากระบบ',
  path: '#',
  icon: RiLogoutBoxLine,
  onClick: async (e) => {
    e.preventDefault();
    await sendLogOut();
  }
}];
