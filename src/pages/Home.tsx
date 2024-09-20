import { ArrowBigUpDash } from "lucide-react";
import BuzzList from "../components/BuzzList";

// import RecommendUsers from "../components/RecommendUsers";
type Iprops = {
  onScrollToTop: () => void;
  mostHoders: any;
  latestLaunch: any;
  mostPopular: any;
  fastToTop: any;
};

// raw

const Home = ({
  onScrollToTop,
  mostHoders,
  latestLaunch,
  mostPopular,
  fastToTop,
}: Iprops) => {
  return (
    <>
      <main className="relative">
        {/* <RecommendUsers /> */}

        <BuzzList
          mostHoders={mostHoders}
          latestLaunch={latestLaunch}
          mostPopular={mostPopular}
          fastToTop={fastToTop}
        />
        <ArrowBigUpDash
          className="fixed bottom-2 right-[5px] lg:right-[20px] w-10 h-10 cursor-pointer hover:text-main"
          onClick={onScrollToTop}
        />
      </main>
    </>
  );

  // return (
  //   <main className='h-full place-content-center overflow-hidden'>
  //     <img
  //       src='/orbuzz_home_img.png'
  //       width={650}
  //       height={600}
  //       alt='Picture of the home'
  //       className='absolute top-[10rem]'
  //     />
  //     <div className='flex flex-col items-center mt-[12rem]'>
  //       <div className="text-main font-['impact'] text-[120px]">BIT DID</div>
  //       <div className='text-[white]'>Claim your DID on bitcoin</div>
  //       <div
  //         className='btn btn-primary rounded-full mt-[8rem] text-[20px] font-medium	w-[220px]'
  //         onClick={onWalletConnectStart}
  //       >
  //         Connect Wallet
  //       </div>
  //     </div>
  //   </main>
  // );
};

export default Home;
