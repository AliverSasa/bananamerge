import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { getPinDetailByPid } from '../api/buzz';
import BackButton from '../components/Buttons/BackButton';
import BuzzCard from '../components/Cards/BuzzCard';

import CommentCard from '../components/Cards/CommentCard';
import { useAtomValue } from 'jotai';
import { btcConnectorAtom } from '../store/user';
import { environment } from '../utils/environments';
import { isNil } from 'ramda';

const Buzz = () => {
  const { id: tempId } = useParams();
  const id = tempId ?? '';
  const btcConnector = useAtomValue(btcConnectorAtom);

  const { isLoading, data: buzzDetailData } = useQuery({
    queryKey: ['buzzDetail', id],
    queryFn: () => getPinDetailByPid({ pid: id! }),
  });

  const currentUserInfoData = useQuery({
    enabled: !isNil(buzzDetailData),
    queryKey: ['userInfo', buzzDetailData?.address, environment.network],
    queryFn: () =>
      btcConnector?.getUser({
        network: environment.network,
        currentAddress: buzzDetailData!.creator,
      }),
  });

  return (
    <>
      <div>
        <BackButton />
        <div className='mt-6'>
          {isLoading ? (
            <div className='grid place-items-center h-[200px]'>
              <span className='loading loading-ring loading-lg grid text-white'></span>
            </div>
          ) : (
            <BuzzCard buzzItem={buzzDetailData} />
          )}
        </div>
        <div className='hidden'>
          <div className='my-6'>{`Comment (2)`}</div>
          <div className='border border-white rounded-md p-4'>
            <CommentCard
              hasSubComment
              commentPin={buzzDetailData!}
              btcConnector={btcConnector!}
              commentUserInfo={currentUserInfoData?.data}
            />
            <div className='  border-gray/20 !border-t-[0.1px] my-4'></div>
            <CommentCard
              hasSubComment
              commentPin={buzzDetailData!}
              btcConnector={btcConnector!}
              commentUserInfo={currentUserInfoData?.data}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Buzz;
