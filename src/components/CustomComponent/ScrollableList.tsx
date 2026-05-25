import React, { FC, useEffect, useRef, useState } from 'react';
import InfiniteScroll from "react-infinite-scroller";
import { Spinner } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import NoDataComponent from '../CustomComponent/NoDataComponent';
import AbaciLoader from '../AbaciLoader/AbaciLoader';
import showNotification from '../extras/showNotification';
import Error from '../../helpers/Error';

interface ScrollableListProps {
    fetchApi: (params: { limit: number; offset: number; search?: string }) => Promise<any>;
    reduxSelector: (state: any) => any[];
    addItemsAction: (items: any[]) => any;
    setTotalCountAction: (count: number) => any;
    searchTerm: string;
    limit?: number;
    renderItem: (item: any) => React.ReactNode;
    noDataLottie?: any;
    noDataMessage?: string;
}

const ScrollableList: FC<ScrollableListProps> = ({
    fetchApi,
    reduxSelector,
    addItemsAction,
    setTotalCountAction,
    searchTerm,
    limit = 20,
    renderItem,
    noDataLottie,
    noDataMessage = "No Data Found"
}) => {
    const dispatch = useDispatch();
    const items = useSelector(reduxSelector);
    const [page, setPage] = useState(0);
    const [hasNextPage, setHasNextPage] = useState(false);
    const searchTermRef = useRef(searchTerm);

    useEffect(() => {
        const loadItems = async () => {
            try {
                const response = await fetchApi({ limit, offset: limit * page, search: searchTerm });
                dispatch(setTotalCountAction(response.count));
                setHasNextPage((items?.length ?? 0) + response.results.length < response.count);
                
                if (items === null || page === 0) {
                    dispatch(addItemsAction(response.results));
                } else {
                    dispatch(addItemsAction([...items, ...response.results]));
                }
            } catch (error) {
                dispatch(addItemsAction([]));
                showNotification("Error", Error(error), 'danger');
            }
        };

        if (searchTermRef.current !== searchTerm) {
            dispatch(addItemsAction([]));
            if (page !== 0) {
                setPage(0);
                searchTermRef.current = searchTerm;
                return;
            }
        }

        loadItems();
        searchTermRef.current = searchTerm;
    }, [page, searchTerm]);

    const loadMore = () => {
        if (hasNextPage) {
            setTimeout(() => setPage(page + 1), 1500);
        }
    };

    useEffect(() => {
        return () => {
            dispatch(addItemsAction([]));
        };
    }, []);

    if (items === null) return <AbaciLoader />;
    if (items.length === 0) return <NoDataComponent lottie={noDataLottie} description={noDataMessage} />;

    return (
        <InfiniteScroll pageStart={0} loadMore={loadMore} hasMore={hasNextPage}
            loader={<div style={{ display: "flex", justifyContent: "center" }} key={0}><Spinner /></div>}
        >
            <div className='row'>
                {items.map(item => (
                    <div key={item.id} className='col-xxl-3 col-xl-4 col-md-6'>
                        {renderItem(item)}
                    </div>
                ))}
            </div>
        </InfiniteScroll>
    );
};

export default ScrollableList;
