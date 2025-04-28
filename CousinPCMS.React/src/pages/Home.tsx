import {useState} from 'react';
import ProductDisplay from '../components/home/ProductDisplay';
import TreeView from '../components/home/TreeView';
import SkusDisplay from '../components/home/SkusDisplay';
// import SkusDisplay from "../components/home/SkusDisplay"

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedProductId, setSelectedProductId] = useState<number | undefined>(undefined);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-2 p-2">
      {/* Left Section */}
      <div className="lg:col-span-7">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {/* Category Tree */}
          <div className="p-2 bg-white rounded-md shadow-md tree-view-scroll">
            <TreeView onCategorySelected={(categoryId) => setSelectedCategory(categoryId?.toString() || '')} />
          </div>
          {/* Product Display */}
          <div className="p-2 bg-white rounded-md shadow-md card">
            <ProductDisplay selectedCategory={selectedCategory} onProductSelected={setSelectedProductId} />
          </div>
        </div>
      </div>
      {/* Right Section */}
      <div className="lg:col-span-5 p-2 bg-white rounded-md shadow-md card">
        <SkusDisplay selectedProductId={selectedProductId} selectedCategory={selectedCategory} />
      </div>
    </div>
  );
};

export default Home;
