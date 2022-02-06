import { AiOutlineTransaction } from 'react-icons/ai';
// import { RiDashboardLine, RiLogoutBoxLine } from 'react-icons/ri';
import { RiLogoutBoxLine } from 'react-icons/ri';
import { GiBoulderDash } from 'react-icons/gi';
import { sendLogOut } from 'src/utils/client';

export const ROUTES = [{
//   name: 'Dashboard',
//   path: '/',
//   icon: RiDashboardLine
// }, {
  name: 'การสอบ (นักศึกษา)',
  path: '/examinations',
  icon: AiOutlineTransaction,
  permissions: ['student']
}, {
  name: 'การสอบ',
  path: '/exams',
  icon: AiOutlineTransaction,
  permissions: ['teacher', 'admin']
}, {
  key: 'question',
  name: 'คำถาม',
  icon: AiOutlineTransaction,
  permissions: ['teacher', 'admin'],
  subRoutes: [{
    name: 'คำถามแบบตัวเลือก',
    path: '/questions/choices',
    icon: GiBoulderDash,
    permissions: ['teacher', 'admin']
  }, {
    name: 'คำถามแบบข้อเขียน',
    path: '/questions/writings',
    icon: GiBoulderDash,
    permissions: ['teacher', 'admin']
  }]
}, {
  name: 'นักศึกษา',
  path: '/students',
  icon: AiOutlineTransaction,
  permissions: ['teacher', 'admin']
}, {
  name: 'บุคลากร',
  path: '/users',
  icon: AiOutlineTransaction,
  permissions: ['admin']
}, {
  name: 'ออกจากระบบ',
  path: '/auth/logout',
  icon: RiLogoutBoxLine,
  permissions: null,
  onClick: (e) => {
    e.preventDefault();
    sendLogOut();
  }
}];
