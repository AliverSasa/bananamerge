import { Sparkle } from "lucide-react";
import { useState, useEffect } from "react";

import cls from "classnames";
import AllNewBuzzList from "./AllNewBuzzList";
import FollowingBuzzList from "./FollowingBuzzList";
import Decimal from "decimal.js-light";
// pin detail
type Iprops = {
  mostHoders: any;
  latestLaunch: any;
  mostPopular: any;
  fastToTop: any;
};
const BuzzList = ({
  mostHoders,
  latestLaunch,
  mostPopular,
  fastToTop,
}: Iprops) => {
  const [showNewBuzz, setShowNewBuzz] = useState<boolean>(true);
  const [mostHodersData, setMostHodersData] = useState([]);
  const [latestLaunchData, setLatestLaunchData] = useState([]);
  const [mostPopularData, setMostPopularData] = useState([]);
  const [fastToTopData, setFastToTopData] = useState([]);

  useEffect(() => {
    if (mostHoders && mostHoders.list) {
      setMostHodersData(mostHoders.list);
    }
  }, [mostHoders]);
  useEffect(() => {
    console.log(latestLaunch);
    if (latestLaunch && latestLaunch.list) {
      setLatestLaunchData(latestLaunch.list);
    }
  }, [latestLaunch]);
  useEffect(() => {
    console.log(mostPopular);
    if (mostPopular && mostPopular.list) {
      setMostPopularData(mostPopular.list);
    }
  }, [mostPopular]);
  useEffect(() => {
    console.log(fastToTop);
    if (fastToTop && fastToTop.list) {
      setFastToTopData(fastToTop.list);
    }
  }, [fastToTop]);
  //  @ts-ignore
  const getTimeDifference = (timestamp) => {
    const now = new Date().getTime();
    const timeDifference = now - timestamp; // 假设 timestamp 已经是毫秒

    const hours = Math.floor(timeDifference / (1000 * 60 * 60)); // 总小时数
    const days = Math.floor(hours / 24); // 计算天数

    if (days > 0) {
      return `${days} day(s) ago`;
    } else {
      return `${hours} hour(s) ago`;
    }
  };

  return (
    <>
      <div className="mx-auto grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 gap-4 mb-8 mt-4 sm:w-[100%] 2xl:w-[150%] 2xl:-ml-[25%]">
        <div className="flex-1 bg-main p-4 text-white">
          <div className="bg-[#000] text-sm h-8 leading-8 text-center">
            Top Holders of $BigBanana
          </div>
          <div className="mt-2">
            {mostHodersData && mostHodersData.length > 0 ? ( // 确保 listData 存在且长度大于 0
              mostHodersData.map((user, index) => (
                <div
                  key={index}
                  className="mb-2 flex items-center justify-between text-[#000]"
                >
                  <div className="font-bold flex items-center">
                    <img src="/banana_logo.png" width={25} height={35} />
                    {/* @ts-ignore */}
                    <div>
                      {/* @ts-ignore */}

                      {user.userInfo?.name
                        ? //  @ts-ignore

                          user.userInfo.name
                        : //  @ts-ignore

                          "User " + user.metaId.slice(0, 4)}
                    </div>
                  </div>
                  {/* @ts-ignore */}
                  <div>{user.percentage}%</div>
                </div>
              ))
            ) : (
              <div className="text-[#000]">Loading...</div> // 数据未加载时显示 Loading 状态
            )}
          </div>
        </div>
        <div className="flex-1 bg-main p-4 text-white">
          <div className="bg-[#000] text-sm h-8 leading-8 text-center">
            Newly Deployed Tickets
          </div>
          <div className="mt-2">
            {latestLaunchData && latestLaunchData.length > 0 ? (
              latestLaunchData.map((user, index) => {
                // 确保 user.cover 存在，并提取 `//` 后面的部分
                //  @ts-ignore

                const extractedPart = user.cover
                  ? // @ts-ignore
                    user.cover.split("//")[1]
                  : "";

                return (
                  <div
                    key={index}
                    className="mb-2 flex items-center justify-between text-[#000]"
                  >
                    <div className="font-bold flex items-center">
                      {/* 动态生成图片的 src */}
                      <img
                        src={`https://man.metaid.io/content/${extractedPart}`}
                        width={25}
                        height={25}
                        alt="User Avatar"
                        className="mr-2"
                      />
                      {/* @ts-ignore */}

                      <div>{user.tokenName}</div>
                    </div>
                    {/* @ts-ignore */}

                    <div>{getTimeDifference(user.timestamp)}</div>
                  </div>
                );
              })
            ) : (
              <div className="text-[#000]">Loading...</div>
            )}
          </div>
        </div>
        <div className="flex-1 bg-main p-4 text-white">
          <div className="bg-[#000] text-sm h-8 leading-8 text-center">
            Most Popular Tickets
          </div>
          <div className="mt-2">
            {mostPopularData && mostPopularData.length > 0 ? (
              mostPopularData.map((user, index) => {
                // 确保 user.cover 存在，并提取 `//` 后面的部分
                
                  /* @ts-ignore */
                
                const extractedPart = user.cover
                  ? // @ts-ignore

                    user.cover.split("//")[1]
                  : "";

                return (
                  <div
                    key={index}
                    className="mb-2 flex items-center justify-between text-[#000]"
                  >
                    <div className="font-bold flex items-center">
                      {/* 动态生成图片的 src */}
                      <img
                        src={`https://man.metaid.io/content/${extractedPart}`}
                        width={25}
                        height={25}
                        alt="User Avatar"
                        className="mr-2"
                      />
                      {/* @ts-ignore */}

                      <div>{user.tokenName}</div>
                    </div>
                    {/* @ts-ignore */}

                    <div>{user.percents}%</div>
                  </div>
                );
              })
            ) : (
              <div className="text-[#000]">Loading...</div>
            )}
          </div>
        </div>
        <div className="flex-1 bg-main p-4 text-white">
          <div className="bg-[#000] text-sm h-8 leading-8 text-center">
            Highest Marketcap Tickets
          </div>
          <div className="mt-2">
            {fastToTopData && fastToTopData.length > 0 ? (
              fastToTopData.map((user, index) => {
                // 确保 user.cover 存在，并提取 `//` 后面的部分
                // @ts-ignore
                const extractedPart = user.cover
                  ? // @ts-ignore

                    user.cover.split("//")[1]
                  : "";

                return (
                  <div
                    key={index}
                    className="mb-2 flex items-center justify-between text-[#000]"
                  >
                    <div className="font-bold flex items-center">
                      {/* 动态生成图片的 src */}
                      <img
                        src={`https://man.metaid.io/content/${extractedPart}`}
                        width={25}
                        height={25}
                        alt="User Avatar"
                        className="mr-2"
                      />
                      {/* @ts-ignore */}

                      <div>{user.tokenName}</div>
                    </div>
                    <div>
                      {/* @ts-ignore */}
                      {new Decimal(user.marketCap)
                        .div(10 ** 8)
                        .toNumber()
                        .toFixed(3)}
                      BTC
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-[#000]">Loading...</div>
            )}
          </div>
        </div>
      </div>
      <div className="flex gap-2 items-center place-content-center mt-0">
        <Sparkle className="text-main" />

        <div className="text-white text-[24px] lg:text-[36px] font-['Impact']">
          {"Today's new banana"}
        </div>

        <Sparkle className="text-main" />
      </div>

      <div className="text-white flex mx-auto border border-white w-fit rounded-full mt-8">
        <div
          className={cls(
            "btn w-[120px] h-[20px] md:w-[150px] md:h-[26px] cursor-pointer",
            {
              "btn-primary rounded-full": showNewBuzz,
              "btn-outline border-none": !showNewBuzz,
            }
          )}
          onClick={() => setShowNewBuzz(true)}
        >
          New
        </div>
        <div
          className={cls(
            "btn w-[120px] h-[20px] md:w-[150px] md:h-[26px] cursor-pointer",
            {
              "btn-primary rounded-full": !showNewBuzz,
              "btn-outline border-none": showNewBuzz,
            }
          )}
          onClick={() => setShowNewBuzz(false)}
        >
          Follow
        </div>
      </div>
      {showNewBuzz ? <AllNewBuzzList /> : <FollowingBuzzList />}

      {/* {isLoading ? (
        <div className='flex items-center gap-2 justify-center h-[200px]'>
          <div>Buzz Feed is Coming</div>
          <span className='loading loading-bars loading-md grid text-white'></span>
        </div>
      ) : (
        <div className='flex flex-col gap-3 my-4'>
          {buzzes}
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
      )} */}
    </>
  );
};

export default BuzzList;
