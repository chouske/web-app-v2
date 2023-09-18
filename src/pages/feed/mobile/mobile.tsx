import { useDispatch, useSelector } from 'react-redux';
import { Dialog } from '@mui/material';
import { Avatar } from '../../../components/atoms/avatar/avatar';
import { Card } from '../../../components/atoms/card/card';
import { FeedList } from '../../../components/organisms/feed-list/feed-list';
import { DialogCreate } from '../dialog-create/dialog-create';
import { Search } from 'src/components/atoms/search/search';
import { IdentityReq } from 'src/core/types';
import { RootState } from 'src/store/store';
import { visibility } from 'src/store/reducers/menu.reducer';
import { useNavigate } from '@tanstack/react-location';
import { ActionSheet, ActionSheetButtonStyle } from '@capacitor/action-sheet';
import { Feed } from 'src/components/organisms/feed-list/feed-list.types';
import { useFeedShared } from '../feed.shared';
// import css from './mobile.module.scss';
import { useAuth } from 'src/hooks/use-auth';

export const Mobile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    feedList,
    setFeedList,
    handleClickOpen,
    openDialog,
    handleClose,
    onLike,
    onRemoveLike,
    onMorePage,
    onShowSeeMore,
    onMoreClick,
  } = useFeedShared();

  const { showIfLoggedIn } = useAuth();

  const identity = useSelector<RootState, IdentityReq | undefined>((state) => {
    return state.identity.entities.find((identity) => identity.current);
  });

  const avatarImg = identity?.meta?.avatar || identity?.meta?.image;

  const onSearchEnter = (value: string) => {
    navigate({ to: `/search?q=${value}` });
  };

  function openSidebar() {
    dispatch(visibility(true));
  }

  const navigateToChat = () => {
    // navigate({ to: './chats' });
  };

  const showActions = async (feed: Feed) => {
    const name = feed.identity_meta.name;
    const result = await ActionSheet.showActions({
      title: 'What do you want to do?',
      options: [
        { title: `Block ${name}` },
        { title: `Report ${name}` },
        { title: 'Cancel', style: ActionSheetButtonStyle.Cancel },
      ],
    });
    onMoreClick(result.index, feed);
  };

  const createPostJSX = (
    <div className="mt-6 mr-4 mb-2 ml-4">
      <Card>
        <div className="flex items-center gap-4">
          <Avatar size="3rem" type="users" img={avatarImg} />
          <div
            onClick={handleClickOpen}
            className="h-12 flex items-center w-full rounded-lg text-base bg-off-white-01 py-0 px-6 text-primary-01"
          >
            Create a post
          </div>
        </div>
      </Card>
    </div>
  );

  return (
    <div>
      <div
        // className={css.header}
        className="h-48 p-4 pt-16  relative bg-[30%] bg-cover bg-[url('/images/feed-page-header.png')] bg-gray-04 before:absolute before:top-0 before:right-0 before:bottom-0 before:left-0 before:bg-gradient-to-r before:from-transparent before:from-50% before:to-[rgba(black, 0.35)]"
      >
        <div
          // className={css.menu}
          className="relative mb-6 grid grid-cols-[2rem_1fr_2rem] grid-rows-[2.25rem] items-center gap-4"
        >
          <Avatar onClick={openSidebar} size="2.25rem" type={identity?.type} img={avatarImg} />
          <Search placeholder="Search" onEnter={onSearchEnter} />
          <div onClick={navigateToChat}>
            <img className="p-0 m-0 h-8" src="icons/chat-white.svg" />
          </div>
        </div>
        <div>
          <div
            // className={css.title}
            className="relative text-white font-semibold text-xl font-['Inter']"
          >
            Feed
          </div>
          <div
            // className={css.tagline}
            className="relative text-gray-400 text-base"
          >
            See What is happening in your network
          </div>
        </div>
      </div>
      {showIfLoggedIn(createPostJSX)}
      <FeedList
        data={feedList}
        onMoreClick={(feed) => showActions(feed)}
        onLike={onLike}
        onRemoveLike={onRemoveLike}
        onMorePageClick={onMorePage}
        showSeeMore={onShowSeeMore(feedList.length)}
      />
      <Dialog fullScreen open={openDialog}>
        <DialogCreate onClose={handleClose} setFeedList={setFeedList} />
      </Dialog>
    </div>
  );
};
