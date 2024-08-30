// import { BookCheck } from "lucide-react";
// about modal
const PushTicketModal = () => {
  const onCloseAlertModal = () => {
    window.open('https://www.ticket.fans/club-tickets/BIGBANANA', "_blank", "noopener,noreferrer")
    const aboutModalEle = document.getElementById(
      "pushticket_modal"
    ) as HTMLDialogElement;
    aboutModalEle.close();
  };
  return (
    <dialog id="pushticket_modal" className="modal">
      <div className="modal-box bg-[#191C20] py-5 w-[90%] lg:w-[50%]">
        <div className="flex flex-col relative items-start">
          <div className="w-full  flex items-center justify-center pt-4">
            <img src="/banana_logo.png" width={140} height={180} />
          </div>
          <h3 className="text-white text-xl mt-8 mb-2">Friendly Reminder:</h3>

          <p className="text-gray">
            Banana3.social is merely the initiator of $BigBanana, not the
            project party directly responsible! $BigBanana represents fun and
            fairness, allowing everyone to have their own joyful Big Banana!
            Essentially, $BigBanana is a meme token co-built by the community.
            Meanwhile, Banana3.social is a hub voluntarily created by developers
            from the $BigBanana community, dedicated to providing a platform for
            $BigBanana holders and crypto enthusiasts to communicate. We hope
            that every $BigBanana holder can, just like what $BigBanana
            symbolizes, harvest more joy and happiness every day!
          </p>
          {/* <a
              href='https://github.com/senmonster/bitbuzz'
              className='text-lime-500 hover:underline'
            >
              View source code
            </a> */}


          <div className="flex flex-col items-center mt-12 gap-8 w-full">
            <button
              className="btn btn-md btn-primary rounded-full text-md font-medium	w-[180px]"
              onClick={onCloseAlertModal}
            >
              Go to Ticket trading
            </button>
          </div>
        </div>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};

export default PushTicketModal;
