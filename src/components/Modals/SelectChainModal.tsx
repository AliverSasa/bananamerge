// import { BookCheck } from "lucide-react";
// about modal
import { Banana } from "lucide-react";
type IProps = {
  connectBtcChain: () => Promise<void>;
  connectMvcChain: () => Promise<void>;
};
const SelectChainModal = ({connectBtcChain,connectMvcChain }: IProps) => {
  const onCloseAlertModal = () => {
    const aboutModalEle = document.getElementById(
      "select_chain_modal"
    ) as HTMLDialogElement;
    aboutModalEle.close();
  };
  return (
    <dialog id="select_chain_modal" className="modal">
      <div className="modal-box bg-[#191C20] w-[80%] lg:w-[20%] pt-8 pb-12 relative">
        {/* if there is a button in form, it will close the modal */}
        <div
          className="border border-white text-white btn btn-xs btn-circle absolute right-5 top-5 z-10"
          onClick={onCloseAlertModal}
        >
          ✕
        </div>

        <div className="flex flex-col relative items-start">
          {/* <div className="w-full  flex items-center justify-center pt-4">
            <img src="/banana_logo.png" width={140} height={180} />
          </div> */}
          <div className="flex items-center text-white text-xl mb-8">
            <Banana
              className="text-main p-2 w-9 h-9 md:w-12 md:h-12"
              // size={45}
            />
            <div className="ml-2">Welcome to Banana3！</div>
          </div>

          <div
            className="w-full flex items-center box-border border border-main py-4 px-2 rounded-lg shadow-[0_0_20px_rgba(72,170,173,0.5)] hover:bg-main transition-transform transform hover:scale-105 cursor-pointer"
            onClick={connectBtcChain}
          >
            <img src="/select_logo_btc.png" alt="" className="w-8 h-8" />
            <div className="text-white ml-4">Bitcoin</div>
          </div>
          <div
            className="w-full flex items-center box-border border border-main py-4 px-2 mt-8 rounded-lg shadow-[0_0_20px_rgba(72,170,173,0.5)] hover:bg-main transition-transform transform hover:scale-105 cursor-pointer"
            onClick={connectMvcChain}
          >
            <img src="/select_logo_mvc.png" alt="" className="w-8 h-8" />
            <div className="text-white ml-4">MicrovisionChain</div>
          </div>
        </div>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};

export default SelectChainModal;
