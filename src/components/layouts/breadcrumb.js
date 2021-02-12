import { FiHome } from 'react-icons/fi';

export default function Breadcrumb({ children }) {
  return (
    <div className='c-subheader justify-content-between px-3'>
      <ol className='breadcrumb border-0 m-0 px-0 px-md-3'>
        <li className='breadcrumb-item'>
          <a href='/'>
            <FiHome />
          </a>
        </li>
        {children}
      </ol>
    </div>
  );
};
