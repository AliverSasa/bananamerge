/* eslint-disable @typescript-eslint/no-explicit-any */
// import { useMutation, useQueryClient } from '@tanstack/react-query';
// import { createBuzz } from '../api/buzz';
import BuzzForm, { AttachmentItem, BuzzData } from "./BuzzForm";
// import { v4 as uuidv4 } from 'uuid';
import { toast } from "react-toastify";
import LoadingOverlay from "react-loading-overlay-ts";
// import dayjs from 'dayjs';
import { useAtomValue } from "jotai";
import { isEmpty, isNil } from "ramda";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { globalFeeRateAtom, currentChainAtom } from "../../store/user";
// import { sleep } from '../../utils/time';
import { SubmitHandler, useForm } from "react-hook-form";
import { image2Attach, removeFileFromList } from "../../utils/file";
import useImagesPreview from "../../hooks/useImagesPreview";
import {
  CreateOptions,
  IBtcConnector,
  IMvcConnector,
  IBtcEntity,
  loadBtc,
  loadMvc,
} from "@metaid/metaid";
import { environment } from "../../utils/environments";
import { Pin } from "../../api/request";
import bananaSchema from "../../utils/banana.entity.js";
import { useAtom } from "jotai";

type Iprops = {
  btcConnector: IBtcConnector;
  mvcConnector: IMvcConnector;
  quotePin?: Pin;
};

const BuzzFormWrap = ({ btcConnector, mvcConnector, quotePin }: Iprops) => {
  const isQuoted = !isNil(quotePin);

  const [isAdding, setIsAdding] = useState(false);

  const globalFeerate = useAtomValue(globalFeeRateAtom);
  const queryClient = useQueryClient();
  const buzzFormHandle = useForm<BuzzData>();
  const files = buzzFormHandle.watch("images");

  const [filesPreview, setFilesPreview] = useImagesPreview(files);

  const [currentChain] = useAtom(currentChainAtom);

  const onClearImageUploads = () => {
    setFilesPreview([]);
    buzzFormHandle.setValue("images", [] as any);
  };

  const onCreateSubmit: SubmitHandler<BuzzData> = async (data) => {
    // console.log('submit raw image', data.images);
    const images =
      data.images.length !== 0 ? await image2Attach(data.images) : [];
    // console.log('submit process image',  images);

    await handleAddBuzz({
      content: data.content,
      images,
    });
  };
  const handleAddBuzz = async (buzz: {
    content: string;
    images: AttachmentItem[];
  }) => {
    setIsAdding(true);
    const brContent = buzz.content + "<br>" + "🍌🍌🍌";
    if (currentChain == "BTC") {
      try {
        const btcOptions = { connector: btcConnector };
        const btcBuzzEntity: IBtcEntity = await loadBtc(
          bananaSchema,
        // @ts-ignore
          btcOptions
        );
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const finalBody: any = {
          content: brContent,
          contentType: "text/plain",
        };
        if (!isEmpty(buzz.images)) {
          const fileOptions: CreateOptions[] = [];

          const fileEntity = await btcConnector!.use("file");

          for (const image of buzz.images) {
            fileOptions.push({
              body: Buffer.from(image.data, "hex").toString("base64"),
              contentType: `${image.fileType};binary`,
              encoding: "base64",
              flag: environment.flag,
            });
          }
          const imageRes = await fileEntity.create({
            dataArray: fileOptions,
            options: {
              noBroadcast: "no",
              feeRate: Number(globalFeerate),
              service: {
                address: environment.service_address,
                satoshis: environment.service_staoshi,
              },
              // network: environment.network,
            },
          });

          console.log("imageRes", imageRes);
          finalBody.attachments = imageRes.revealTxIds.map(
            (rid) => "metafile://" + rid + "i0"
          );
        }
        //   await sleep(5000);

        console.log("finalBody", finalBody);
        if (!isNil(quotePin)) {
          finalBody.quotePin = quotePin.id;
        }

        const createRes = await btcBuzzEntity!.create({
          dataArray: [
            {
              body: JSON.stringify(finalBody),
              contentType: "text/plain;utf-8",
              flag: environment.flag,
            },
          ],
          options: {
            noBroadcast: "no",
            feeRate: Number(globalFeerate),
            service: {
              address: environment.service_address,
              satoshis: environment.service_staoshi,
            },
            // network: environment.network,
          },
        });
        console.log("create res for inscribe", createRes);
        if (!isNil(createRes?.revealTxIds[0])) {
          // await sleep(5000);
          queryClient.invalidateQueries({ queryKey: ["buzzes"] });
          toast.success(`${isQuoted ? "repost" : "create"} buzz successfully`);
          buzzFormHandle.reset();
          onClearImageUploads();
          const doc_modal = document.getElementById(
            isQuoted ? "repost_buzz_modal_" + quotePin.id : "new_buzz_modal"
          ) as HTMLDialogElement;
          doc_modal.close();
        }
      } catch (error) {
        console.log("error", error);
        const errorMessage = (error as any)?.message ?? error;
        const toastMessage = errorMessage?.includes(
          "Cannot read properties of undefined"
        )
          ? "User Canceled"
          : errorMessage;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        toast.error(toastMessage, {
          className:
            "!text-[#DE613F] !bg-[black] border border-[#DE613f] !rounded-lg",
        });
        setIsAdding(false);
      }
    } else {
      try {
        // @ts-ignore
        const mvcOptions = { connector: mvcConnector };
        // @ts-ignore
        const mvcBuzzEntity = await loadMvc(bananaSchema, mvcOptions);
        // const mvcBuzzEntity = await mvcConnector.use("buzz");
        const fileEntity = await mvcConnector.use("file");
        console.log(mvcBuzzEntity);
        let fileTransactions = [];
        let finalAttachMetafileUri = [];
        if (!isEmpty(buzz.images)) {
          for (const image of buzz.images) {
            const { transactions: txs } = await fileEntity.create({
              data: {
                // body: Buffer.from(a, 'base64'),
                body: image.data,
                contentType: `${image.fileType};binary`,
                encoding: "hex",
                flag: "metaid",
              },
              options: {
                network: environment.network,
                signMessage: "upload image file",
                serialAction: "combo",
                transactions: fileTransactions,
              },
            });
            finalAttachMetafileUri.push(
        // @ts-ignore
              "metafile://" + txs[txs.length - 1].txComposer.getTxId() + "i0"
            );
        // @ts-ignore
            fileTransactions = txs;
          }
        }
        const finalBody: any = {
          content: brContent,
          attachments: finalAttachMetafileUri,
        };
        if (!isNil(quotePin)) {
          finalBody.quotePin = quotePin.id;
        }

        const { txid } = await mvcBuzzEntity.create({
          data: { body: JSON.stringify(finalBody) },
          options: {
            network: environment.network,
            signMessage: "create buzz",
            serialAction: "finish",
            transactions: fileTransactions,
          },
        });
        console.log('success',txid)
        if (!isNil(txid)) {
          // await sleep(5000);
          queryClient.invalidateQueries({ queryKey: ["buzzes"] });
          toast.success(`${isQuoted ? "repost" : "create"} buzz successfully`);
          buzzFormHandle.reset();
          onClearImageUploads();

          const doc_modal = document.getElementById(
            isQuoted ? "repost_buzz_modal_" + quotePin.id : "new_buzz_modal"
          ) as HTMLDialogElement;
          doc_modal.close();
        }

        // if (!isNil(createRes?.revealTxIds[0])) {
        //   // await sleep(5000);
        //   queryClient.invalidateQueries({ queryKey: ["buzzes"] });
        //   toast.success(`${isQuoted ? "repost" : "create"} buzz successfully`);
        //   buzzFormHandle.reset();
        //   onClearImageUploads();

        //   const doc_modal = document.getElementById(
        //     isQuoted ? "repost_buzz_modal_" + quotePin.id : "new_buzz_modal"
        //   ) as HTMLDialogElement;
        //   doc_modal.close();
        // }
      } catch (error) {
        console.log("error", error);
        const errorMessage = (error as any)?.message ?? error;
        const toastMessage = errorMessage?.includes(
          "Cannot read properties of undefined"
        )
          ? "User Canceled"
          : errorMessage;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        toast.error(toastMessage, {
          className:
            "!text-[#DE613F] !bg-[black] border border-[#DE613f] !rounded-lg",
        });
        setIsAdding(false);
      }
    }
    setIsAdding(false);
  };

  // console.log('select feerate', selectFeeRate);
  // console.log('feerate data', feeRateData);
  const handleRemoveImage = (index: number) => {
    setFilesPreview(filesPreview.filter((_, i) => i !== index));
    buzzFormHandle.setValue(
      "images",
      removeFileFromList(buzzFormHandle.watch("images"), index)
    );
    // remove item from  files object with index
  };

  return (
    <LoadingOverlay active={isAdding} spinner text="Creating Buzz...">
      <BuzzForm
        onCreateSubmit={onCreateSubmit}
        handleRemoveImage={handleRemoveImage}
        buzzFormHandle={buzzFormHandle}
        onClearImageUploads={onClearImageUploads}
        filesPreview={filesPreview}
        quotePin={quotePin}
      />
    </LoadingOverlay>
  );
};

export default BuzzFormWrap;

// const AddBuzz = () => {
// 	const queryClient = useQueryClient();

// 	const createBuzzMutation = useMutation({
// 		mutationFn: createBuzz,
// 		onSuccess: async () => {
// 			await queryClient.invalidateQueries({ queryKey: ["buzzes"] });
// 			toast.success("create buzz success!");
// 			const doc_modal = document.getElementById("new_buzz_modal") as HTMLDialogElement;
// 			doc_modal.close();
// 		},
// 	});

// 	const handleAddBuzz = (buzz: BuzzNewForm) => {kl
// 		const id = uuidv4();
// 		createBuzzMutation.mutate({
// 			...buzz,
// 			id,
// 			createTime: dayjs().format("YYYY-MM-DD HH:mm:ss"),
// 			user: "vae",
// 			isFollowed: false,
// 			txid: id,
// 		});
// 	};

// 	return (
// 		<LoadingOverlay active={createBuzzMutation.isPending} spinner text="Buzz is Creating...">
// 			<BuzzForm onSubmit={handleAddBuzz} initialValue={{ content: "", createTime: "" }} />{" "}
// 		</LoadingOverlay>
// 	);
// };

// export default AddBuzz;
