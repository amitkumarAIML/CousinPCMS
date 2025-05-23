import {useNavigate, useLocation} from 'react-router';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path: string) => location.pathname.startsWith(path);
  return (
    <div className="bg-white absolute shadow-cousins-box overflow-hidden w-full">
      <ul className="flex gap-x-5 text-primary-font justify-end items-center py-2 px-6">
        <li className={`cursor-pointer ${isActive('/home') ? 'text-primary-theme' : ''}`} onClick={() => navigate('/home')}>
          Home
        </li>
        <li className={`cursor-pointer ${isActive('/departments') ? 'text-primary-theme' : ''}`} onClick={() => navigate('/departments')}>
          Departments
        </li>
        <li className={`cursor-pointer ${isActive('/category') ? 'text-primary-theme' : ''}`} onClick={() => navigate('/category')}>
          Category
        </li>
        <li className={`cursor-pointer ${isActive('/products') ? 'text-primary-theme' : ''}`} onClick={() => navigate('/products')}>
          Products
        </li>
        <li className={`cursor-pointer ${isActive('/skus') ? 'text-primary-theme' : ''}`} onClick={() => navigate('/skus')}>
          SKUs
        </li>
        <li className={`cursor-pointer ${isActive('/attributes') ? 'text-primary-theme' : ''}`} onClick={() => navigate('/attributes')}>
          Attributes
        </li>
      </ul>
    </div>
  );
};

export default Header;
