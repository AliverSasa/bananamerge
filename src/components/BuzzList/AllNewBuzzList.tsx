import { useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';
import { IBtcConnector } from '@metaid/metaid';
import { environment } from '../../utils/environments';
import { isNil } from 'ramda';
import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchBuzzs } from '../../api/buzz';
import { Pin } from '../../api/request';
import BuzzCard from '../Cards/BuzzCard';
import { btcConnectorAtom } from '../../store/user';

type Iprops = {
  address?: string;
  queryKey?: string[];
  showFollowButton?: boolean;
};

const AllNewBuzzList = ({
  address,
  showFollowButton = true,
  queryKey = ['buzzes', environment.network],
}: Iprops) => {
  const [total, setTotal] = useState<null | number>(null);
  const [buzzCards, setBuzzCards] = useState<JSX.Element[]>([]);
  const navigate = useNavigate();
  const { ref, inView } = useInView();

  const btcConnector = useAtomValue(btcConnectorAtom);
  const getTotal = async (btcConnector: IBtcConnector) => {
    setTotal(
      await btcConnector?.totalPin({
        network: environment.network,
        path: ['/protocols/simplebuzz', '/protocols/banana'],
      })
    );
  };

  useEffect(() => {
    if (!isNil(btcConnector)) {
      getTotal(btcConnector!);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [btcConnector]);

  const { data, isLoading, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: [...queryKey],
      enabled: !isNil(btcConnector),

      queryFn: ({ pageParam }) =>
        fetchBuzzs({
          page: pageParam,
          limit: 5,
          btcConnector: btcConnector!,
          network: environment.network,
          path: ['/protocols/simplebuzz', '/protocols/banana'],
          address,
        }),
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => {
        const nextPage = lastPage?.length ? allPages.length + 1 : undefined;
        if (allPages.length * 5 >= (total ?? 0)) {
          return;
        }
        return nextPage;
      },
    });


    useEffect(() => {
      const processBuzzes = async () => {
        if (data) {
          const processedBuzzes = await Promise.all(
            data.pages.flatMap((pins: Pin[] | null) =>
              (pins ?? []).map(async (pin) => {
                const url = `https://www.metalet.space/wallet-api/v3/mrc20/address/balance-info?net=livenet&address=${pin.address}&tickId=5896654ce91180f1993274d905020081ad7e6a5aa053659d5c50992482fd0f97i0`;
                try {
                  const response = await fetch(url);
                  const responseData = await response.json();
                  const updatedPin = {
                    ...pin,
                    hasWukong: responseData.data !== null,
                  };
                    return (
                    <BuzzCard
                      key={updatedPin.id}
                      buzzItem={updatedPin}
                      onBuzzDetail={(txid) => navigate(`/buzz/${txid}`)}
                      showFollowButton={showFollowButton}
                    />
                  );
                } catch (error) {
                  console.error('Error fetching data for address:', pin.address, error);
  
                  const updatedPin = {
                    ...pin,
                    hasWukong: false,
                  };
  
                  return (
                    <BuzzCard
                      key={updatedPin.id}
                      buzzItem={updatedPin}
                      onBuzzDetail={(txid) => navigate(`/buzz/${txid}`)}
                      showFollowButton={showFollowButton}
                    />
                  );
                }
              })
            ) || []
          );
  
          setBuzzCards(processedBuzzes);
        }
      };
  
      processBuzzes();
    }, [data, navigate, showFollowButton]);
  // const buzzes = data?.pages.map((pins: Pin[] | null) =>
  //   (pins ?? []).map((pin) => {
  //     return (
  //       <BuzzCard
  //         key={pin.id}
  //         buzzItem={pin}
  //         onBuzzDetail={(txid) => navigate(`/buzz/${txid}`)}
  //         showFollowButton={showFollowButton}
  //       />
  //     );
  //   })
  // );

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);
  return (
    <>
      {' '}
      {isLoading ? (
        <div className='flex items-center gap-2 justify-center h-[200px]'>
          <div>Buzz Feed is Coming</div>
          <span className='loading loading-bars loading-md grid text-white'></span>
        </div>
      ) : (
        <div className='flex flex-col gap-3 my-4'>
          {buzzCards}
          <button
            ref={ref}
            className='btn'
            onClick={() => fetchNextPage()}
            disabled={!hasNextPage || isFetchingNextPage}
          >
            {hasNextPage && isFetchingNextPage ? (
              <div className='flex items-center gap-1'>
                <div>Loading </div>
                <span className='loading loading-dots loading-md grid text-white'></span>
              </div>
            ) : (
              //:
              // hasNextPage ? (
              // 	<div className="bg-[black]  grid w-full place-items-center">
              // 		Load More
              // 	</div>
              // )
              <div className=' place-items-center'>No more results</div>
            )}
          </button>
        </div>
      )}
    </>
  );
};

export default AllNewBuzzList;
