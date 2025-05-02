import {useState, useEffect} from 'react';
import ProductDisplay from '../components/home/ProductDisplay';
import TreeView from '../components/home/TreeView';
import SkusDisplay from '../components/home/SkusDisplay';
import {getSessionItem} from '../services/DataService';

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedProductId, setSelectedProductId] = useState<number | undefined>(undefined);

  useEffect(() => {
    const storedCategoryId = getSessionItem('CategoryId');
    const storedProductId = getSessionItem('productId');
    if (storedCategoryId) setSelectedCategory(storedCategoryId);
    console.log('storedCategoryId', storedCategoryId);
    if (storedProductId && !isNaN(Number(storedProductId))) setSelectedProductId(Number(storedProductId));
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-x-2 m-2">
      <div className="lg:col-span-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-2">
          <div className="p-2 bg-white rounded-md shadow-cousins-box mb-0 min-h-[calc(100vh-80px)]">
            <TreeView onCategorySelected={(categoryId) => setSelectedCategory(categoryId?.toString() || '')} />
          </div>
          <div className="p-2 bg-white rounded-md shadow-cousins-box mb-0 min-h-[calc(100vh-80px)] ">
            <ProductDisplay selectedCategory={selectedCategory} onProductSelected={setSelectedProductId} />
          </div>
        </div>
      </div>
      <div className="lg:col-span-7 p-2 bg-white rounded-md shadow-cousins-box mb-0 min-h-[calc(100vh-80px)]">
        <SkusDisplay selectedProductId={selectedProductId} selectedCategory={selectedCategory} />
      </div>
    </div>
  );
};

export default Home;
