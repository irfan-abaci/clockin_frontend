// components/common/ScrollWrapper.tsx
import React, { useEffect, useRef } from 'react';

interface ScrollWrapperProps {
  children: React.ReactNode;
  onBottomReach?: () => void;
  isLoading?: boolean;
  height?: string | number;
  className?: string;
}

const ScrollWrapper: React.FC<ScrollWrapperProps> = ({
  children,
  onBottomReach,
  isLoading = false,
  height = 300,
  className = '',
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (!wrapperRef.current || !onBottomReach) return;

    const { scrollTop, scrollHeight, clientHeight } = wrapperRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 20) {
      onBottomReach();
    }
  };

  useEffect(() => {
    const { scrollHeight, clientHeight } = wrapperRef.current ?? {};
    if (scrollHeight && clientHeight && scrollHeight <= clientHeight && onBottomReach) {
      onBottomReach();
    }
  }, [children]);

  return (
    <div
      ref={wrapperRef}
      style={{ height, overflowY: 'auto', overflowX: 'hidden' }}
      className={`hide-scrollbar ${className}`}
      onScroll={handleScroll}
    >
      {children}
      {isLoading && (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <span className="spinner-border spinner-border-sm" role="status" />
        </div>
      )}
    </div>
  );
};

export default ScrollWrapper;


// import ScrollWrapper from '../../components/common/ScrollWrapper';

// ...

// <CardBody>
//   {vehicleList.length === 0 ? (
//     <div style={{ position: 'relative', width: '100%', height: '300px' }}>
//       <p className='position_centered' style={{ marginTop: '-20px' }}>No vehicle found !</p>
//     </div>
//   ) : (
//     <ScrollWrapper
//       height={300}
//       onBottomReach={fetchVehicles}
//       isLoading={isFetching}
//     >
//       <VehicleListComponent VehicleList={vehicleList} />
//     </ScrollWrapper>
//   )}
// </CardBody>