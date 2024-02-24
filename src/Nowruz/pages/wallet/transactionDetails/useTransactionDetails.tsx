import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { CurrentIdentity, Mission, StripeProfileRes } from 'src/core/api';
import { toRelativeTime } from 'src/core/relative-time';
import { RootState } from 'src/store';

export const useTransactionDetailes = () => {
  const { mission, stripeProfileRes, jpStripeProfileRes } = useLoaderData() as {
    mission: Mission;
    stripeProfileRes: StripeProfileRes;
    jpStripeProfileRes: StripeProfileRes;
  };

  const accounts = [];
  if (stripeProfileRes?.external_accounts?.data.length > 0) accounts.push(...stripeProfileRes?.external_accounts.data);
  if (jpStripeProfileRes?.external_accounts?.data.length > 0)
    accounts.push(...jpStripeProfileRes?.external_accounts.data);

  console.log('test log mission', mission);
  const navigate = useNavigate();
  const currentIdentity = useSelector<RootState, CurrentIdentity | undefined>((state) => {
    return state.identity.entities.find((identity) => identity.current);
  });
  const isUser = currentIdentity?.type === 'users';

  const [openWithdraw, setOpenWithdraw] = useState(false);

  const handleBack = () => {
    navigate('/nowruz/wallet');
  };

  const detail = {
    name: isUser ? mission.assigner.meta.name : mission.assignee.meta.name,
    avatar: isUser ? mission.assigner.meta.image : mission.assignee.meta.avatar,
    email: isUser ? mission.assigner.meta.email : mission.assignee.meta.email,
    avatarType: isUser ? 'organizations' : 'users',
    date: toRelativeTime(mission.payment.created_at.toString()),
    amount: mission.payment.amount,
    transactionId: mission.escrow.id,
    symbol : mission.offer.currency === 'JPY' ? '¥' : mission.offer.currency === 'USD' ? '$' : '';
  };

  function isDisablePayout() {
    const currentDate = Number(new Date());
    const createdDate = Number(mission.escrow?.created_at);
    const diffTime = Math.abs(currentDate - createdDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return !accounts?.length || mission.escrow?.release_id != null || diffDays < 5;
  }

  return { handleBack, detail, isUser, isDisablePayout, openWithdraw, setOpenWithdraw };
};
