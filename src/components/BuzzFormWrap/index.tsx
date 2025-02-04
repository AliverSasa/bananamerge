/* eslint-disable @typescript-eslint/no-explicit-any */
// import { useMutation, useQueryClient } from '@tanstack/react-query';
// import { createBuzz } from '../api/buzz';
import BuzzForm, { AttachmentItem, BuzzData } from './BuzzForm';
// import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';
import LoadingOverlay from 'react-loading-overlay-ts';
// import dayjs from 'dayjs';
import { useAtomValue } from 'jotai';
import { isEmpty, isNil } from 'ramda';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { globalFeeRateAtom } from '../../store/user';
// import { sleep } from '../../utils/time';
import { SubmitHandler, useForm } from 'react-hook-form';
import { image2Attach, removeFileFromList } from '../../utils/file';
import useImagesPreview from '../../hooks/useImagesPreview';
import { CreateOptions, IBtcConnector, IBtcEntity,loadBtc } from '@metaid/metaid';
import { environment } from '../../utils/environments';
import { Pin } from '../../api/request';
import bananaSchema from "../../utils/banana.entity.js";

type Iprops = {
  btcConnector: IBtcConnector;
  quotePin?: Pin;
};

const BuzzFormWrap = ({ btcConnector, quotePin }: Iprops) => {
  const isQuoted = !isNil(quotePin);

  const [isAdding, setIsAdding] = useState(false);

  const globalFeerate = useAtomValue(globalFeeRateAtom);
  const queryClient = useQueryClient();
  const buzzFormHandle = useForm<BuzzData>();
  const files = buzzFormHandle.watch('images');

  const [filesPreview, setFilesPreview] = useImagesPreview(files);

  const onClearImageUploads = () => {
    setFilesPreview([]);
    buzzFormHandle.setValue('images', [] as any);
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
    // const buzzEntity: IBtcEntity = await btcConnector.use('buzz');


    const brContent = buzz.content + '<br>'+ '🍌🍌🍌'
    const options = { connector: btcConnector };
    // @ts-ignore
    const buzzEntity: IBtcEntity = await loadBtc(bananaSchema, options);

    // const buzzEntity: IBtcEntity = await btcConnector.use('buzz');
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const finalBody: any = {
        content: brContent,
        contentType: 'text/plain',
      };
      if (!isEmpty(buzz.images)) {
        const fileOptions: CreateOptions[] = [];

        const fileEntity = await btcConnector!.use('file');

        for (const image of buzz.images) {
          fileOptions.push({
            body: Buffer.from(image.data, 'hex').toString('base64'),
            contentType: `${image.fileType};binary`,
            encoding: 'base64',
            flag: environment.flag,
          });
        }
        const imageRes = await fileEntity.create({
          dataArray: fileOptions,
          options: {
            noBroadcast: 'no',
            feeRate: Number(globalFeerate),
            service: {
              address: environment.service_address,
              satoshis: environment.service_staoshi,
            },
          },
        });

        console.log('imageRes', imageRes);
        finalBody.attachments = imageRes.revealTxIds.map(
          (rid) => 'metafile://' + rid + 'i0'
        );
      }
      //   await sleep(5000);

      console.log('finalBody', finalBody);
      if (!isNil(quotePin)) {
        finalBody.quotePin = quotePin.id;
      }

      const createRes = await buzzEntity!.create({
        dataArray: [
          {
            body: JSON.stringify(finalBody),
            contentType: 'text/plain;utf-8',
            flag: environment.flag,
          },
        ],
        options: {
          noBroadcast: 'no',
          feeRate: Number(globalFeerate),
          service: {
            address: environment.service_address,
            satoshis: environment.service_staoshi,
          },
        },
      });
      console.log('create res for inscribe', createRes);
      if (!isNil(createRes?.revealTxIds[0])) {
        // await sleep(5000);
        queryClient.invalidateQueries({ queryKey: ['buzzes'] });
        toast.success(`${isQuoted ? 'repost' : 'create'} buzz successfully`);
        buzzFormHandle.reset();
        onClearImageUploads();

        const doc_modal = document.getElementById(
          isQuoted ? 'repost_buzz_modal_' + quotePin.id : 'new_buzz_modal'
        ) as HTMLDialogElement;
        doc_modal.close();
      }
    } catch (error) {
      console.log('error', error);
      const errorMessage = (error as any)?.message ?? error;
      const toastMessage = errorMessage?.includes(
        'Cannot read properties of undefined'
      )
        ? 'User Canceled'
        : errorMessage;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      toast.error(toastMessage, {
        className:
          '!text-[#DE613F] !bg-[black] border border-[#DE613f] !rounded-lg',
      });
      setIsAdding(false);
    }
    setIsAdding(false);
  };

  // console.log('select feerate', selectFeeRate);
  // console.log('feerate data', feeRateData);
  const handleRemoveImage = (index: number) => {
    setFilesPreview(filesPreview.filter((_, i) => i !== index));
    buzzFormHandle.setValue(
      'images',
      removeFileFromList(buzzFormHandle.watch('images'), index)
    );
    // remove item from  files object with index
  };

  return (
    <LoadingOverlay active={isAdding} spinner text='Creating Buzz...'>
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
