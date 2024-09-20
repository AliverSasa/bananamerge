import { useAtom, useAtomValue } from "jotai";
import { PencilLine } from "lucide-react";
import { Link } from "react-router-dom";

import {
  connectedAtom,
  globalFeeRateAtom,
  userInfoAtom,
  currentChainAtom,
} from "../../store/user";

import {
  checkMetaletConnected,
  checkMetaletInstalled,
  confirmCurrentNetwork,
} from "../../utils/wallet";
import { environment } from "../../utils/environments";
import RightCustomAvatar from "../Public/RightCustomAvatar";
import SelectChainModal from "../Modals/SelectChainModal";
// import { IBtcConnector, IMvcConnector } from "@metaid/metaid";
import AboutModal from "../Modals/AboutModal";
import PushTicketModal from "../Modals/PushTicketModal";
// import NavabarMobileMenu from './NavabarMobileMenu';
import NewBuzzModal from "../Modals/NewBuzzModal";
import MusicPlayer from "./MusicPlayer";
import { DownOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Dropdown, Space } from "antd";
import {
  IBtcConnector,
  IMvcConnector,
  MetaletWalletForBtc,
  MetaletWalletForMvc,
  btcConnect,
  mvcConnect,
  loadBtc,
} from "@metaid/metaid";
import { isNil } from "ramda";
import { toast } from "react-toastify";
import bananaSchema from "../../utils/banana.entity.js";

type IProps = {
  onWalletConnectStart: () => Promise<void>;
  onLogout: () => void;
  btcConnector: IBtcConnector;
  mvcConnector: IMvcConnector;
  connectBtcChain: () => Promise<void>;
  connectMvcChain: () => Promise<void>;
  // @ts-ignore
  setBtcConnector;
  // @ts-ignore
  setMvcConnector;
  // @ts-ignore
  setWallet;
  // @ts-ignore
  setMvcWallet;
  // @ts-ignore
  setWalletParams;
  // @ts-ignore
  setMvcWalletParams;
  // @ts-ignore
  setConnected;
  // @ts-ignore
  setMyFollowingList;
  // @ts-ignore
  mutateMyFollowing;
  // @ts-ignore
  setUserInfo;
  // @ts-ignore
  setBuzzEntity;
};

const Navbar = ({
  onWalletConnectStart,
  onLogout,
  btcConnector,
  mvcConnector,
  connectBtcChain,
  connectMvcChain,
  setBtcConnector,
  setMvcConnector,
  setWallet,
  setMvcWallet,
  setWalletParams,
  setMvcWalletParams,
  setConnected,
  setMyFollowingList,
  mutateMyFollowing,
  setUserInfo,
  setBuzzEntity,
}: IProps) => {
  const [globalFeeRate, setGlobalFeeRate] = useAtom(globalFeeRateAtom);
  const [selectedItem, setSelectedItem] = useAtom(currentChainAtom);
  const connected = useAtomValue(connectedAtom);
  const userInfo = useAtomValue(userInfoAtom);
  const [currentChain] = useAtom(currentChainAtom);
  console.log(mvcConnector);

  const onBuzzStart = async () => {
    await checkMetaletInstalled();
    await checkMetaletConnected(connected);
    // await checkUserNameExisted(userInfo?.name ?? '');

    const doc_modal = document.getElementById(
      "new_buzz_modal"
    ) as HTMLDialogElement;
    doc_modal.showModal();
  };

  const onEditProfileStart = async () => {
    const doc_modal = document.getElementById(
      "edit_metaid_modal"
    ) as HTMLDialogElement;
    doc_modal.showModal();
  };

  const items: MenuProps["items"] = [
    {
      key: "BTC",
      label: (
        <div className="flex items-center">
          <img src="./select_logo_btc.png" alt="" className="w-6 h-6 mr-2" />
          <div className="font-bold">BTC</div>
        </div>
      ),
    },
    {
      key: "MVC",
      label: (
        <div className="flex items-center">
          <img src="./select_logo_mvc.png" alt="" className="w-6 h-6 mr-2" />
          <div className="font-bold">MVC</div>
        </div>
      ),
    },
  ];
  const handleMenuClick = async (e: any) => {
    const clickedItem = items.find((item) => item?.key === e.key);
    // @ts-ignore
    setSelectedItem(clickedItem.key);
    // @ts-ignore
    if (selectedItem == clickedItem.key) {
      return;
    } else {
      // @ts-ignore
      if (clickedItem.key == "BTC") {
        setMyFollowingList([]);
        setConnected(false);
        // setMvcConnector(null);
        setMvcWalletParams(undefined);
        const _wallet = await MetaletWalletForBtc.create();
        await confirmCurrentNetwork();
        setWallet(_wallet);
        setWalletParams({
          address: _wallet.address,
          pub: _wallet.pub,
        });
        if (isNil(_wallet?.address)) {
          // @ts-ignore
          toast.error(errors.NO_METALET_LOGIN, {
            className:
              "!text-[#DE613F] !bg-[black] border border-[#DE613f] !rounded-lg",
          });
          // @ts-ignore
          throw new Error(errors.NO_METALET_LOGIN);
        }

        const _btcConnector = await btcConnect({
          network: environment.network,
          wallet: _wallet,
        });

        setBtcConnector(_btcConnector);

        const myFollowingListData = await mutateMyFollowing.mutateAsync(
          _btcConnector?.metaid ?? ""
        );
        setMyFollowingList(myFollowingListData?.list ?? []);

        const resUser = await _btcConnector.getUser({
          network: environment.network,
        });
        console.log("user now", resUser);
        setUserInfo(resUser);
        const options = { connector: _btcConnector };
        const _buzzEntity = await loadBtc(bananaSchema, options);
        setBuzzEntity(_buzzEntity);
        setConnected(true);
      } else {
        setMyFollowingList([]);
        // setBtcConnector(null);
        setWalletParams(undefined);
        const _wallet = await MetaletWalletForMvc.create();
        console.log(_wallet);
        await confirmCurrentNetwork();
        setMvcWallet(_wallet);
        setMvcWalletParams({
          address: _wallet.address,
          xpub: _wallet.xpub,
        });
        if (isNil(_wallet?.address)) {
          // @ts-ignore
          toast.error(errors.NO_METALET_LOGIN, {
            className:
              "!text-[#DE613F] !bg-[black] border border-[#DE613f] !rounded-lg",
          });
          // @ts-ignore
          throw new Error(errors.NO_METALET_LOGIN);
        }

        //////////////////////////

        const _mvcConnector = await mvcConnect({
          network: environment.network,
          wallet: _wallet,
        });

        console.log(_mvcConnector);
        setMvcConnector(_mvcConnector);

        const myFollowingListData = await mutateMyFollowing.mutateAsync(
          _mvcConnector?.metaid ?? ""
        );
        setMyFollowingList(myFollowingListData?.list ?? []);
        // const doc_modal = document.getElementById(
        //   'create_metaid_modal'
        // ) as HTMLDialogElement;
        // doc_modal.showModal();
        // console.log("getUser", await _btcConnector.getUser());

        const resUser = await _mvcConnector.getUser({
          network: environment.network,
        });
        console.log("user now", resUser);

        setUserInfo(resUser);
        setConnected(true);
      }
    }

    // if (clickedItem) {
    //   setSelectedItem(clickedItem.key);
    // }
  };

  return (
    <>
      <AboutModal />
      <PushTicketModal />

      <div className="z-[100] navbar py-3 px-0 bg-main fixed top-0">
        <div className="container flex justify-between relative">
          <div
            className="absolute -right-[180px] top-[48%] -translate-y-1/2 flex items-center cursor-pointer"
            onClick={() => {
              const doc_modal = document.getElementById(
                "pushticket_modal"
              ) as HTMLDialogElement;
              doc_modal.showModal();
            }}
          >
            <img src="/ticket.png" className="w-12 h-12 rounded-[50%]" />
            <div className="ml-2 text-lime-900 font-bold hover:underline hover:text-lime-700 hidden md:block">
              Trade $BigBanana
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* <Link to={"/"} className="md:block hidden"> */}
            <Link to={"/"}>
              {/* <img src='/logo_navbar.png' className='w-[100px] h-[26px]' /> */}
              <div className="flex items-center">
                <img src="/banana_logo.png" width={50} height={70} />
                <span className="title-font">Banana3</span>
              </div>
            </Link>
            <div>
              <MusicPlayer />
            </div>
          </div>
          {/* <NavabarMobileMenu /> */}
          <div className="flex items-center gap-2 cursor-pointer">
            {selectedItem && (
              <>
                <Dropdown menu={{ items, onClick: handleMenuClick }}>
                  {/* <a onClick={(e) => e.preventDefault()}> */}
                  <Space>
                    {selectedItem === "BTC" && (
                      <>
                        <img
                          src="./select_logo_btc.png"
                          alt=""
                          className="w-6 h-6 "
                        />
                        BTC
                      </>
                    )}
                    {selectedItem === "MVC" && (
                      <>
                        <img
                          src="./select_logo_mvc.png"
                          alt=""
                          className="w-6 h-6"
                        />
                        MVC
                      </>
                    )}
                    {selectedItem !== "BTC" &&
                      selectedItem !== "MVC" &&
                      selectedItem}
                    <DownOutlined />
                  </Space>
                </Dropdown>
              </>
            )}
            <div className="gap-4 hidden md:flex">
              <a
                href="https://docs.metaid.io/"
                className="text-lime-900 font-bold hover:underline hover:text-lime-700"
                target="_blank"
              >
                Docs
              </a>
              <button
                className="text-lime-900 font-bold hover:underline hover:text-lime-700"
                onClick={() => {
                  const doc_modal = document.getElementById(
                    "about_modal"
                  ) as HTMLDialogElement;
                  doc_modal.showModal();
                }}
              >
                About
              </button>
              <div className="border-r border border-[#1D2F2F]/50 mr-2"></div>
            </div>

            {currentChain === "BTC" && (
              <img
                src="/charging-pile.png"
                className="w-[30px] h-[35px] hidden md:block"
              />
            )}

            {currentChain === "BTC" && (
              <input
                inputMode="numeric"
                type="number"
                min={0}
                max={"100000"}
                style={{
                  appearance: "textfield",
                }}
                aria-hidden
                className="w-[65px] h-[32px] input input-xs  bg-[black]  shadow-inner !pr-0 border-none focus:border-main text-main focus:outline-none  hidden md:block"
                step={1}
                value={globalFeeRate}
                onChange={(e) => {
                  const v = e.currentTarget.value;
                  setGlobalFeeRate(v);
                }}
              />
            )}
            {currentChain === "BTC" && (
              <div className="text-[#1D2F2F] hidden md:block">sat/vB</div>
            )}

            <PencilLine
              className="border rounded-full text-main bg-[black] p-2 cursor-pointer ml-2 w-9 h-9 md:w-12 md:h-12"
              // size={45}
              onClick={onBuzzStart}
            />

            {connected ? (
              <div className="dropdown dropdown-hover">
                <div
                  tabIndex={0}
                  role="button"
                  className="cursor-pointer md:hidden block"
                >
                  <RightCustomAvatar userInfo={userInfo!} size="36px" />
                </div>
                <div
                  tabIndex={0}
                  role="button"
                  className="cursor-pointer md:block hidden"
                >
                  <RightCustomAvatar
                    userInfo={userInfo!}
                    borderRadius={"50%"}
                  />
                </div>
                <ul
                  tabIndex={0}
                  className="dropdown-content z-[1] menu px-4 py-4 gap-3 shadow bg-main rounded-box w-[170px] border border-[#131519] right-0"
                  style={{
                    borderRadius: "12px",
                    boxShadow: "0px 4px 10px 0px rgba(169, 211, 18, 0.5)",
                  }}
                >
                  <li
                    className="hover:bg-[rgba(219, 243, 136, 0.5)] rounded-box relative"
                    onClick={onEditProfileStart}
                  >
                    <img
                      src="/profile-icon.png"
                      width={55}
                      height={55}
                      className="absolute left-0 top-0"
                    />
                    <a
                      className="text-[#1D2F2F] text-[14px]"
                      style={{ textIndent: "2.2em" }}
                    >{`Edit Profile`}</a>
                  </li>
                  <div className="border border-[#1D2F2F]/50 w-[80%] mx-auto"></div>
                  <li
                    className="hover:bg-[rgba(219, 243, 136, 0.5)] rounded-box relative"
                    onClick={onLogout}
                  >
                    <img
                      src="/logout-icon.png"
                      width={55}
                      height={55}
                      className="absolute left-0 top-0"
                    />
                    <a
                      className="text-[#1D2F2F] text-[14px]"
                      style={{ textIndent: "2.5em" }}
                    >
                      Disconnect
                    </a>
                  </li>
                </ul>
              </div>
            ) : (
              <div
                className="btn-sm w-[120px] text-[12px] md:text-[14px] md:btn-md md:w-[180px] btn btn-outline hover:bg-[black] hover:text-main rounded-full font-medium"
                onClick={onWalletConnectStart}
              >
                Connect Wallet
              </div>
            )}
          </div>
        </div>
      </div>
      <NewBuzzModal btcConnector={btcConnector} mvcConnector={mvcConnector} />
      <SelectChainModal
        connectBtcChain={connectBtcChain}
        connectMvcChain={connectMvcChain}
      />
    </>
  );
};

export default Navbar;
