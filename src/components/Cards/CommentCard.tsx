import { LucideLink } from 'lucide-react';
import CustomAvatar from '../Public/CustomAvatar';
import SubCommentCard from './SubCommentCard';
import dayjs from '../../utils/dayjsConfig';
import {
  checkMetaletConnected,
  checkMetaletInstalled,
} from '../../utils/wallet';
import { connectedAtom, UserInfo } from '../../store/user';
import { useAtomValue } from 'jotai';
import { Pin } from '../../api/request';
import { IBtcConnector } from '@metaid/metaid';
import ReplyModal from '../Modals/ReplyModal';

type Iprops = {
  hasSubComment: boolean;
  commentPin: Pin;
  btcConnector: IBtcConnector;
  commentUserInfo: UserInfo | undefined;
};

const CommentCard = ({
  hasSubComment,
  commentPin,
  btcConnector,
  commentUserInfo,
}: Iprops) => {
  const connected = useAtomValue(connectedAtom);

  const mock = {
    name: 'Yiomik',
    comment:
      'Each castle will belong to its own story traces, as long as you are careful enough, you can always find the traces.',
    pinId: '123',
    timeStamp: '2021 10:23',
  };

  return (
    <>
      <div className='flex gap-2.5'>
        <CustomAvatar size='36px' />
        <div className='flex flex-col gap-2 mt-2 w-full'>
          <div>{commentUserInfo?.name ?? 'MetaID-User'}</div>
          <div>{mock.comment}</div>
          <div className='flex justify-between text-gray text-xs mt-2'>
            <div className=' flex gap-2'>
              <div className='flex gap-1 items-center hover:text-slate-300 cursor-pointer'>
                <LucideLink size={12} />
                <div>{mock.pinId.slice(0, 8) + '...'}</div>
              </div>
              <div>
                {dayjs
                  .unix(dayjs().unix())
                  .tz(dayjs.tz.guess())
                  .format('YYYY-MM-DD HH:mm:ss')}
              </div>
            </div>
            <div
              className='hover:text-slate-300 cursor-pointer'
              onClick={async () => {
                await checkMetaletInstalled();
                await checkMetaletConnected(connected);
                (document.getElementById(
                  'reply_buzz_modal_' + commentPin.id
                ) as HTMLDialogElement)!.showModal();
              }}
            >
              Reply
            </div>
          </div>
          {hasSubComment && (
            <SubCommentCard
              commentPin={commentPin}
              btcConnector={btcConnector!}
              commentUserInfo={commentUserInfo}
            />
          )}
        </div>
      </div>
      <ReplyModal
        commentPin={commentPin}
        btcConnector={btcConnector!}
        commentToUser={commentUserInfo}
      />
    </>
  );
};

export default CommentCard;
