import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Layout/Navbar";
import Buzz from "./pages/Buzz";
import Home from "./pages/Home";
import EditBuzz from "./pages/EditBuzz";
import { ToastContainer, toast } from "react-toastify";
import "./globals.css";
import "./react-toastify.css";
// import "react-toastify/dist/ReactToastify.css";
import {
  MetaletWalletForBtc,
  MetaletWalletForMvc,
  btcConnect,
  mvcConnect,
  loadBtc,
} from "@metaid/metaid";

import { useAtom, useSetAtom } from "jotai";
import {
  btcConnectorAtom,
  mvcConnectorAtom,
  connectedAtom,
  myFollowingListAtom,
  userInfoAtom,
  walletAtom,
  mvcWalletAtom,
  walletRestoreParamsAtom,
  mvcWalletRestoreParamsAtom,
  currentChainAtom,
} from "./store/user";
import { buzzEntityAtom } from "./store/buzz";
import { errors } from "./utils/errors";
import { isNil } from "ramda";
import { checkMetaletInstalled, confirmCurrentNetwork } from "./utils/wallet";
// import { conirmMetaletTestnet } from "./utils/wallet";
import CreateMetaIDModal from "./components/MetaIDFormWrap/CreateMetaIDModal";
import EditMetaIDModal from "./components/MetaIDFormWrap/EditMetaIDModal";
import { useCallback, useEffect, useRef } from "react";
import { BtcNetwork } from "./api/request";
import InsertMetaletAlertModal from "./components/Modals/InsertMetaletAlertModal";
import { environment } from "./utils/environments";
import { useMutation } from "@tanstack/react-query";
import { fetchFollowingList } from "./api/buzz";
import Profile from "./pages/Profile";
import FollowDetail from "./pages/followDetail";
import bananaSchema from "./utils/banana.entity.js";
// import { enc, AES, mode, pad, MD5, SHA256,CryptoJS  } from "crypto-js";
import CryptoJS from "crypto-js";
import { useState } from "react";

function App() {
  const ref = useRef<null | HTMLDivElement>(null);

  const [connected, setConnected] = useAtom(connectedAtom);
  const setWallet = useSetAtom(walletAtom);

  const setMvcWallet = useSetAtom(mvcWalletAtom);

  const [btcConnector, setBtcConnector] = useAtom(btcConnectorAtom);

  const [mvcConnector, setMvcConnector] = useAtom(mvcConnectorAtom);

  const setUserInfo = useSetAtom(userInfoAtom);

  const [walletParams, setWalletParams] = useAtom(walletRestoreParamsAtom);

  const [mvcWalletParams, setMvcWalletParams] = useAtom(
    mvcWalletRestoreParamsAtom
  );

  const [currentChain, setCurrentChain] = useAtom(currentChainAtom);

  const [mostHoders, setMostHoders] = useState(null);
  const [latestLaunch, setLatestLaunch] = useState(null);
  const [mostPopular, setMostPopular] = useState(null);
  const [fastToTop, setFastToTop] = useState(null);
  // const [walletParams, setWalletParams] = useAtom(walletRestoreParamsAtom);
  // const [walletParams, setWalletParams] = useAtom(walletRestoreParamsAtom);
  // const [walletParams, setWalletParams] = useAtom(walletRestoreParamsAtom);

  const setMyFollowingList = useSetAtom(myFollowingListAtom);
  const setBuzzEntity = useSetAtom(buzzEntityAtom);

  const mutateMyFollowing = useMutation({
    mutationKey: [
      "myFollowing",
      currentChain == "BTC" ? btcConnector?.metaid : mvcConnector?.metaid,
    ],
    mutationFn: (metaid: string) =>
      fetchFollowingList({
        metaid: metaid,
        params: { cursor: "0", size: "100", followDetail: false },
      }),
  });

  const onLogout = () => {
    setConnected(false);
    setBtcConnector(null);
    setMvcConnector(null);
    setBuzzEntity(null);
    setUserInfo(null);
    setWalletParams(undefined);
    setMvcWalletParams(undefined);
    // @ts-ignore
    setCurrentChain(null);
    setMyFollowingList([]);
    window.metaidwallet.removeListener("accountsChanged");
    window.metaidwallet.removeListener("networkChanged");
  };

  // const onWalletConnectStart = async () => {
  //   await checkMetaletInstalled();
  //   const _wallet = await MetaletWalletForBtc.create();
  //   await confirmCurrentNetwork();
  //   setWallet(_wallet);
  //   setWalletParams({
  //     address: _wallet.address,
  //     pub: _wallet.pub,
  //   });
  //   if (isNil(_wallet?.address)) {
  //     toast.error(errors.NO_METALET_LOGIN, {
  //       className:
  //         "!text-[#DE613F] !bg-[black] border border-[#DE613f] !rounded-lg",
  //     });
  //     throw new Error(errors.NO_METALET_LOGIN);
  //   }

  //   //////////////////////////

  //   const _btcConnector = await btcConnect({
  //     network: environment.network,
  //     wallet: _wallet,
  //   });

  //   setBtcConnector(_btcConnector);

  //   const myFollowingListData = await mutateMyFollowing.mutateAsync(
  //     _btcConnector?.metaid ?? ""
  //   );
  //   setMyFollowingList(myFollowingListData?.list ?? []);
  //   // const doc_modal = document.getElementById(
  //   //   'create_metaid_modal'
  //   // ) as HTMLDialogElement;
  //   // doc_modal.showModal();
  //   // console.log("getUser", await _btcConnector.getUser());

  //   const resUser = await _btcConnector.getUser({
  //     network: environment.network,
  //   });
  //   console.log("user now", resUser);
  //   const isWokongHolder = await holdersApi(_wallet.address);
  //   let updateObj = {};
  //   if (isWokongHolder) {
  //     updateObj = {
  //       ...resUser,
  //       isHasWuKong: true,
  //     };
  //   } else {
  //     updateObj = {
  //       ...resUser,
  //       isHasWuKong: false,
  //     };
  //   }
  //   // @ts-ignore
  //   setUserInfo(updateObj);
  //   setConnected(true);
  //   // setBuzzEntity(await _btcConnector.use('buzz'));
  //   const options = { connector: _btcConnector };
  //   const _buzzEntity = await loadBtc(bananaSchema, options);
  //   setBuzzEntity(_buzzEntity);
  //   console.log("your btc address: ", _btcConnector.address);
  // };
  const onWalletConnectStart = async () => {
    const doc_modal = document.getElementById(
      "select_chain_modal"
    ) as HTMLDialogElement;
    doc_modal.showModal();
  };
  // useEffect(() => {
  //   console.log(currentChain);  // 这里会在 currentChain 变化时打印出正确的值
  // }, [currentChain]);
  // @ts-ignore
  function getSortOrder(ws, wordSortListMap) {
    // 检查 ws 是否在 wordSortListMap 中
    if (wordSortListMap.hasOwnProperty(ws)) {
      // 返回对应的排序数组
      return wordSortListMap[ws];
    } else {
      // 如果没有匹配到，抛出异常或返回空数组
      throw new Error(`排序数组未找到: ${ws}`);
    }
  }
  // @ts-ignore
  function sortWordList(wordList, sortOrder) {
    //  @ts-ignore

    return sortOrder.map((index) => wordList[index]);
  }

  function decrypt(
    cryptoText: string,
    passphrase: string,
    _key?: string
  ): string {
    const key = _key
      ? CryptoJS.enc.Hex.parse(_key)
      : generateKeyFromPassphrase(passphrase);
    // 解码Base64
    const encryptedData = CryptoJS.enc.Base64.parse(cryptoText);
    // 提取IV
    const iv = key.clone();
    const decrypted = CryptoJS.AES.decrypt(
      { ciphertext: encryptedData } as any,
      key,
      {
        iv: iv,
        mode: CryptoJS.mode.CFB,
        padding: CryptoJS.pad.NoPadding,
      }
    );
    return decrypted.toString(CryptoJS.enc.Utf8);
  }

  useEffect(() => {
    const fetchData1 = async () => {
      const wordAPiData =
        "VZr/h9pR0TEjPvWW6Daqm/EHCWVgORC3vmrZmn8NCv4vbcm6wkLMKBaQElcD0poJzpVadADT98C7/aDR8DEYpY9YDO8aVQpt5FhqGW07xMgsZ0k8p4qh6FJAtMHGK4QPLzbuNRNCKdnakKm23bncatSjkfMRQ/DoVHRuiMc2ERqE3BFJdoE//Qz1Gj43zi/N4FtMrGsX1x83sCjnoedY80fo1yu4owRuK0rgGNqslWJkiQLIxTf8QxVSObn9NaxzYc11r4sP1nLv6bYwGIl0d7lGmsHvXj3Pd2lDS2Hr51QhaDsAQSmsChj+5nSJzYuQoIP1";
      const wordKey =
        "9e09058386b738d694d8a2dee061cb57905351a6916e1df41e0ffc9e34540771";
      const cipherText = CryptoJS.enc.Base64.parse(wordAPiData);

      const parsedKey = CryptoJS.enc.Hex.parse(wordKey);

      // const arr = AES.decrypt(wordAPiData, wordKey);
      const iv = CryptoJS.lib.WordArray.create(parsedKey.words.slice(0, 4), 16);

      const decrypted = CryptoJS.AES.decrypt(
        // @ts-ignore
        { ciphertext: cipherText },
        parsedKey, // 传入解析后的密钥
        {
          mode: CryptoJS.mode.CFB, // 使用 CFB 模式解密
          padding: CryptoJS.pad.NoPadding, // 没有填充
          iv: iv, // 前 16 字节作为 IV
        }
      );

      const result = decrypted.toString(CryptoJS.enc.Utf8);

      const jsonObject = JSON.parse(result);

      console.log(jsonObject);

      const wordListMap = jsonObject.wordListMap;
      console.log(wordListMap);
      const wordSortListMap = jsonObject.wordSortListMap;
      console.log(wordSortListMap);

      //前5持有
      const requestUrl1 =
        "https://api.ticket.fans/ticket-api/api/v1/ticket/club/member/real-time/all-list?ticketId=cf6a83ce5a63d0acb4ab58736ce4221f0a0ea01669a152b0b5181936210520d6i0&cursor=0&size=5";
      try {
        const response = await fetch(requestUrl1);
        const responseData = await response.json();
        if (responseData) {
          const ws = responseData.ws;

          const resultWs = getSortOrder(ws, wordSortListMap);

          const wordList = wordListMap[responseData.e];

          const sortedWordList = sortWordList(wordList, resultWs);

          const key = sortedWordList.join(" ");

          // const mainKey = generateKeyFromPassphrase(key);
          // console.log(mainKey);

          const decryptedText = decrypt(responseData.data, key);

          const decryptedTextObject = JSON.parse(decryptedText);

          setMostHoders(decryptedTextObject);
        }
      } catch (error) {
        return false;
      }
    };
    const fetchData2 = async () => {
      const wordAPiData =
        "VZr/h9pR0TEjPvWW6Daqm/EHCWVgORC3vmrZmn8NCv4vbcm6wkLMKBaQElcD0poJzpVadADT98C7/aDR8DEYpY9YDO8aVQpt5FhqGW07xMgsZ0k8p4qh6FJAtMHGK4QPLzbuNRNCKdnakKm23bncatSjkfMRQ/DoVHRuiMc2ERqE3BFJdoE//Qz1Gj43zi/N4FtMrGsX1x83sCjnoedY80fo1yu4owRuK0rgGNqslWJkiQLIxTf8QxVSObn9NaxzYc11r4sP1nLv6bYwGIl0d7lGmsHvXj3Pd2lDS2Hr51QhaDsAQSmsChj+5nSJzYuQoIP1";
      const wordKey =
        "9e09058386b738d694d8a2dee061cb57905351a6916e1df41e0ffc9e34540771";
      const cipherText = CryptoJS.enc.Base64.parse(wordAPiData);

      const parsedKey = CryptoJS.enc.Hex.parse(wordKey);

      // const arr = AES.decrypt(wordAPiData, wordKey);
      const iv = CryptoJS.lib.WordArray.create(parsedKey.words.slice(0, 4), 16);
      const decrypted = CryptoJS.AES.decrypt(
        // @ts-ignore
        { ciphertext: cipherText },
        parsedKey, // 传入解析后的密钥
        {
          mode: CryptoJS.mode.CFB, // 使用 CFB 模式解密
          padding: CryptoJS.pad.NoPadding, // 没有填充
          iv: iv, // 前 16 字节作为 IV
        }
      );

      const result = decrypted.toString(CryptoJS.enc.Utf8);

      const jsonObject = JSON.parse(result);

      const wordListMap = jsonObject.wordListMap;
      const wordSortListMap = jsonObject.wordSortListMap;

      //最新部署
      const requestUrl2 =
        "https://api.ticket.fans/ticket-api/api/v1/ticket/club/active/list?cursor=0&size=5&tradeState=&confirmationState=2&searchTicket=&orderBy=launchedTime&sortType=desc";

      try {
        const response = await fetch(requestUrl2);
        const responseData = await response.json();
        if (responseData) {
          const ws = responseData.ws;

          const resultWs = getSortOrder(ws, wordSortListMap);

          const wordList = wordListMap[responseData.e];

          const sortedWordList = sortWordList(wordList, resultWs);

          const key = sortedWordList.join(" ");

          // const mainKey = generateKeyFromPassphrase(key);
          // console.log(mainKey);

          const decryptedText = decrypt(responseData.data, key);

          const decryptedTextObject = JSON.parse(decryptedText);

          setLatestLaunch(decryptedTextObject);
        }
      } catch (error) {
        return false;
      }
    };
    const fetchData3 = async () => {
      const wordAPiData =
        "VZr/h9pR0TEjPvWW6Daqm/EHCWVgORC3vmrZmn8NCv4vbcm6wkLMKBaQElcD0poJzpVadADT98C7/aDR8DEYpY9YDO8aVQpt5FhqGW07xMgsZ0k8p4qh6FJAtMHGK4QPLzbuNRNCKdnakKm23bncatSjkfMRQ/DoVHRuiMc2ERqE3BFJdoE//Qz1Gj43zi/N4FtMrGsX1x83sCjnoedY80fo1yu4owRuK0rgGNqslWJkiQLIxTf8QxVSObn9NaxzYc11r4sP1nLv6bYwGIl0d7lGmsHvXj3Pd2lDS2Hr51QhaDsAQSmsChj+5nSJzYuQoIP1";
      const wordKey =
        "9e09058386b738d694d8a2dee061cb57905351a6916e1df41e0ffc9e34540771";
      const cipherText = CryptoJS.enc.Base64.parse(wordAPiData);

      const parsedKey = CryptoJS.enc.Hex.parse(wordKey);

      // const arr = AES.decrypt(wordAPiData, wordKey);
      const iv = CryptoJS.lib.WordArray.create(parsedKey.words.slice(0, 4), 16);

      const decrypted = CryptoJS.AES.decrypt(
        // @ts-ignore

        { ciphertext: cipherText },
        parsedKey, // 传入解析后的密钥
        {
          mode: CryptoJS.mode.CFB, // 使用 CFB 模式解密
          padding: CryptoJS.pad.NoPadding, // 没有填充
          iv: iv, // 前 16 字节作为 IV
        }
      );

      const result = decrypted.toString(CryptoJS.enc.Utf8);

      const jsonObject = JSON.parse(result);

      const wordListMap = jsonObject.wordListMap;
      const wordSortListMap = jsonObject.wordSortListMap;

      //Most Popular Tickets
      const requestUrl3 =
        "https://api.ticket.fans/ticket-api/api/v1/ticket/club/active/list?cursor=0&size=5&tradeState=&confirmationState=2&searchTicket=&orderBy=tradeTime&sortType=desc";

      try {
        const response = await fetch(requestUrl3);
        const responseData = await response.json();
        if (responseData) {
          const ws = responseData.ws;

          const resultWs = getSortOrder(ws, wordSortListMap);

          const wordList = wordListMap[responseData.e];

          const sortedWordList = sortWordList(wordList, resultWs);

          const key = sortedWordList.join(" ");

          const decryptedText = decrypt(responseData.data, key);

          const decryptedTextObject = JSON.parse(decryptedText);

          setMostPopular(decryptedTextObject);
        }
      } catch (error) {
        return false;
      }
    };
    const fetchData4 = async () => {
      const wordAPiData =
        "VZr/h9pR0TEjPvWW6Daqm/EHCWVgORC3vmrZmn8NCv4vbcm6wkLMKBaQElcD0poJzpVadADT98C7/aDR8DEYpY9YDO8aVQpt5FhqGW07xMgsZ0k8p4qh6FJAtMHGK4QPLzbuNRNCKdnakKm23bncatSjkfMRQ/DoVHRuiMc2ERqE3BFJdoE//Qz1Gj43zi/N4FtMrGsX1x83sCjnoedY80fo1yu4owRuK0rgGNqslWJkiQLIxTf8QxVSObn9NaxzYc11r4sP1nLv6bYwGIl0d7lGmsHvXj3Pd2lDS2Hr51QhaDsAQSmsChj+5nSJzYuQoIP1";
      const wordKey =
        "9e09058386b738d694d8a2dee061cb57905351a6916e1df41e0ffc9e34540771";
      const cipherText = CryptoJS.enc.Base64.parse(wordAPiData);

      const parsedKey = CryptoJS.enc.Hex.parse(wordKey);

      // const arr = AES.decrypt(wordAPiData, wordKey);
      const iv = CryptoJS.lib.WordArray.create(parsedKey.words.slice(0, 4), 16);

      const decrypted = CryptoJS.AES.decrypt(
        // @ts-ignore

        { ciphertext: cipherText },
        parsedKey, // 传入解析后的密钥
        {
          mode: CryptoJS.mode.CFB, // 使用 CFB 模式解密
          padding: CryptoJS.pad.NoPadding, // 没有填充
          iv: iv, // 前 16 字节作为 IV
        }
      );

      const result = decrypted.toString(CryptoJS.enc.Utf8);

      const jsonObject = JSON.parse(result);

      const wordListMap = jsonObject.wordListMap;
      const wordSortListMap = jsonObject.wordSortListMap;
      //涨幅最快
      const requestUrl4 =
        "https://api.ticket.fans/ticket-api/api/v1/ticket/club/active/list?orderBy=marketCap&sortType=desc&cursor=0&size=5&confirmationState=2";
      try {
        const response = await fetch(requestUrl4);
        const responseData = await response.json();
        if (responseData) {
          const ws = responseData.ws;

          const resultWs = getSortOrder(ws, wordSortListMap);

          const wordList = wordListMap[responseData.e];

          const sortedWordList = sortWordList(wordList, resultWs);

          const key = sortedWordList.join(" ");

          // const mainKey = generateKeyFromPassphrase(key);
          // console.log(mainKey);

          const decryptedText = decrypt(responseData.data, key);

          const decryptedTextObject = JSON.parse(decryptedText);

          setFastToTop(decryptedTextObject);
        }
      } catch (error) {
        return false;
      }
    };
    fetchData1();
    fetchData2();
    fetchData3();
    fetchData4();
  }, []);
  //  @ts-ignore
  function generateKeyFromPassphrase(passphrase) {
    // 生成 SHA-256 哈希
    const hash = CryptoJS.SHA256(passphrase);
    // 截取前16字节，生成AES 128-bit 密钥
    const key = CryptoJS.lib.WordArray.create(hash.words.slice(0, 4));
    return key;
  }
  const connectBtcChain = async () => {
    await checkMetaletInstalled();
    const _wallet = await MetaletWalletForBtc.create();
    await confirmCurrentNetwork();
    setWallet(_wallet);
    // @ts-ignore
    setCurrentChain("BTC");

    setWalletParams({
      address: _wallet.address,
      pub: _wallet.pub,
    });
    console.log(walletParams);
    if (isNil(_wallet?.address)) {
      toast.error(errors.NO_METALET_LOGIN, {
        className:
          "!text-[#DE613F] !bg-[black] border border-[#DE613f] !rounded-lg",
      });
      throw new Error(errors.NO_METALET_LOGIN);
    }

    //////////////////////////

    const _btcConnector = await btcConnect({
      network: environment.network,
      wallet: _wallet,
    });

    setBtcConnector(_btcConnector);

    const myFollowingListData = await mutateMyFollowing.mutateAsync(
      _btcConnector?.metaid ?? ""
    );
    console.log("btc followList", myFollowingListData);
    setMyFollowingList(myFollowingListData?.list ?? []);
    // const doc_modal = document.getElementById(
    //   'create_metaid_modal'
    // ) as HTMLDialogElement;
    // doc_modal.showModal();
    // console.log("getUser", await _btcConnector.getUser());

    const resUser = await _btcConnector.getUser({
      network: environment.network,
    });
    console.log("user now", resUser);

    setUserInfo(resUser);
    setConnected(true);
    // setBuzzEntity(await _btcConnector.use('buzz'));

    const options = { connector: _btcConnector };
    const _buzzEntity = await loadBtc(bananaSchema, options);
    setBuzzEntity(_buzzEntity);

    console.log("your btc address: ", _btcConnector.address);
    const doc_modal = document.getElementById(
      "select_chain_modal"
    ) as HTMLDialogElement;
    doc_modal.close();
  };

  useEffect(() => {
    console.log(setMyFollowingList); // 这里会在 currentChain 变化时打印出正确的值
  }, [setMyFollowingList]);

  const connectMvcChain = async () => {
    await checkMetaletInstalled();
    const _wallet = await MetaletWalletForMvc.create();
    console.log(_wallet);
    await confirmCurrentNetwork();
    // @ts-ignore
    setMvcWallet(_wallet);
    setCurrentChain("MVC");
    setMvcWalletParams({
      address: _wallet.address,
      xpub: _wallet.xpub,
    });
    if (isNil(_wallet?.address)) {
      toast.error(errors.NO_METALET_LOGIN, {
        className:
          "!text-[#DE613F] !bg-[black] border border-[#DE613f] !rounded-lg",
      });
      throw new Error(errors.NO_METALET_LOGIN);
    }

    //////////////////////////

    const _mvcConnector = await mvcConnect({
      network: environment.network,
      wallet: _wallet,
    });

    console.log(_mvcConnector);
    // @ts-ignore
    setMvcConnector(_mvcConnector);

    const myFollowingListData = await mutateMyFollowing.mutateAsync(
      _mvcConnector?.metaid ?? ""
    );
    console.log("mvc followList", myFollowingListData);

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

    // setBuzzEntity(await _mvcConnector.use('buzz'));
    // setBuzzEntity(await _btcConnector.use('buzz'));
    // const options = { connector: _mvcConnector };

    // const _buzzEntity = await loadBtc(bananaSchema, options);

    // setBuzzEntity(_buzzEntity);

    console.log("your btc address: ", _mvcConnector.address);
    const doc_modal = document.getElementById(
      "select_chain_modal"
    ) as HTMLDialogElement;

    doc_modal.close();
  };
  const holdersApi = async (address: string) => {
    const url = `https://www.metalet.space/wallet-api/v3/mrc20/address/balance-info?net=livenet&address=${address}&tickId=5896654ce91180f1993274d905020081ad7e6a5aa053659d5c50992482fd0f97i0`;
    try {
      const response = await fetch(url);
      const responseData = await response.json();
      if (responseData.data !== null) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  };

  const getBuzzEntity = async () => {
    // await conirmMetaletMainnet();
    const _btcConnector = await btcConnect({ network: environment.network });
    setBtcConnector(_btcConnector);
    // const _buzzEntity = await _btcConnector.use("buzz");
    const options = { connector: _btcConnector };
    const _buzzEntity = await loadBtc(bananaSchema, options);
    setBuzzEntity(_buzzEntity);
  };

  useEffect(() => {
    getBuzzEntity();
  }, []);
  const handleBeforeUnload = async () => {
    console.log(currentChain);
    console.log(walletParams);
    if (currentChain == "BTC") {
      if (!isNil(walletParams)) {
        const _wallet = MetaletWalletForBtc.restore({
          ...walletParams,
          internal: window.metaidwallet,
        });

        setWallet(_wallet);
        const _btcConnector = await btcConnect({
          wallet: _wallet,
          network: environment.network,
        });
        setBtcConnector(_btcConnector);
        const currentUser = _btcConnector.user;
        let updatedUser = {};
        const isWukongHolder = await holdersApi(_wallet.address);
        if (isWukongHolder) {
          updatedUser = {
            ...currentUser,
            isHasWuKong: true,
          };
        } else {
          updatedUser = {
            ...currentUser,
            isHasWuKong: false,
          };
        }
        // setUserInfo(_btcConnector.user);
        // @ts-ignore
        setUserInfo(updatedUser);

        const options = { connector: _btcConnector };
        const _buzzEntity = await loadBtc(bananaSchema, options);
        setBuzzEntity(_buzzEntity);
        // setConnected(true);
        // console.log('refetch user', _btcConnector.user);
      }
    } else if (currentChain == "MVC") {
      if (!isNil(mvcWalletParams)) {
        const _wallet = MetaletWalletForMvc.restore({
          ...mvcWalletParams,
          // @ts-ignore

          internal: window.metaidwallet,
        });
        // @ts-ignore

        setMvcWallet(_wallet);
        const _mvcConnector = await mvcConnect({
          wallet: _wallet,
          network: environment.network,
        });
        // @ts-ignore

        setMvcConnector(_mvcConnector);
        const currentUser = _mvcConnector.user;

        console.log(currentUser);
        let updatedUser = {};
        const isWukongHolder = await holdersApi(_wallet.address);
        if (isWukongHolder) {
          updatedUser = {
            ...currentUser,
            isHasWuKong: true,
          };
        } else {
          updatedUser = {
            ...currentUser,
            isHasWuKong: false,
          };
        }
        // setUserInfo(_btcConnector.user);
        // @ts-ignore
        setUserInfo(updatedUser);
        // setConnected(true);
        // console.log('refetch user', _btcConnector.user);
      }
    } else {
      console.log("null");
    }
  };

  const wrapHandleBeforeUnload = useCallback(handleBeforeUnload, [
    walletParams,
    mvcWalletParams,
    setUserInfo,
  ]);

  useEffect(() => {
    setTimeout(() => {
      wrapHandleBeforeUnload();
    }, 1000);
  }, [wrapHandleBeforeUnload]);

  const handleAcccountsChanged = () => {
    onLogout();
    toast.error("Wallet Account Changed ----Please login again...");
  };

  const handleNetworkChanged = async (network: BtcNetwork) => {
    if (connected) {
      onLogout();
    }
    toast.error("Wallet Network Changed  ");
    if (network !== environment.network) {
      toast.error(errors.SWITCH_NETWORK_ALERT, {
        className:
          "!text-[#DE613F] !bg-[black] border border-[#DE613f] !rounded-lg",
      });
      await window.metaidwallet.switchNetwork({ network: environment.network });

      throw new Error(errors.SWITCH_NETWORK_ALERT);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      if (!isNil(window?.metaidwallet)) {
        if (connected) {
          window.metaidwallet.on("accountsChanged", handleAcccountsChanged);
        }

        window.metaidwallet.on("networkChanged", handleNetworkChanged);
      }
    }, 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connected, window?.metaidwallet]);

  const onScrollToTop = () => {
    ref.current!.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative overflow-auto">
      <div ref={ref}>
        <Navbar
          onWalletConnectStart={onWalletConnectStart}
          onLogout={onLogout}
          btcConnector={btcConnector!}
          mvcConnector={mvcConnector!}
          connectBtcChain={connectBtcChain}
          connectMvcChain={connectMvcChain}
          setBtcConnector={setBtcConnector}
          setMvcConnector={setMvcConnector}
          setWallet={setWallet}
          setMvcWallet={setMvcWallet}
          setWalletParams={setWalletParams}
          setMvcWalletParams={setMvcWalletParams}
          setConnected={setConnected}
          setMyFollowingList={setMyFollowingList}
          mutateMyFollowing={mutateMyFollowing}
          setUserInfo={setUserInfo}
          setBuzzEntity={setBuzzEntity}
        />
      </div>
      <div className="container pt-[100px] bg-[black] text-white h-screen">
        <Routes>
          <Route
            path="/"
            element={
              <Home
                onScrollToTop={onScrollToTop}
                mostHoders={mostHoders}
                latestLaunch={latestLaunch}
                mostPopular={mostPopular}
                fastToTop={fastToTop}
              />
            }
          />
          <Route path="/buzz/:id" element={<Buzz />} />
          <Route path="/buzz/:id/edit" element={<EditBuzz />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/follow-detail/:id" element={<FollowDetail />} />
        </Routes>
      </div>
      <ToastContainer
        position="top-left"
        toastStyle={{
          position: "absolute",
          top: "0px",
          left: "120px",
          width: "380px",
          zIndex: 9999,
        }}
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        closeButton={false}
      />

      <CreateMetaIDModal
        btcConnector={btcConnector!}
        onWalletConnectStart={onWalletConnectStart}
      />
      <EditMetaIDModal
        btcConnector={btcConnector!}
        mvcConnector={mvcConnector!}
      />
      <InsertMetaletAlertModal />
    </div>
  );
}

export default App;
