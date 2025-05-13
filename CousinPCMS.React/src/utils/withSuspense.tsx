import React, {Suspense, LazyExoticComponent, ComponentType} from 'react';

const withSuspense = <T extends object>(Component: LazyExoticComponent<ComponentType<T>>): React.FC<T> => {
  return (props: T) => (
    <Suspense fallback={<div className="p-4 text-gray-500">Loading...</div>}>
      <Component {...props} />
    </Suspense>
  );
};

export default withSuspense;
