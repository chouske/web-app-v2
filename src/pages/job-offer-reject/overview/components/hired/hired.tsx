import { useState } from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { Accordion } from 'src/components/atoms/accordion/accordion';
import { ApplicantListPay } from 'src/components/molecules/applicant-list-pay/applicant-list-pay';
import { offerByApplicant } from 'src/core/api';
import Dapp from 'src/dapp';
import { useAlert } from 'src/hooks/use-alert';
import { Loader } from 'src/pages/job-offer-reject/job-offer-reject.types';
import store from 'src/store';
import { hideSpinner, showSpinner } from 'src/store/reducers/spinner.reducer';

import css from './hired.module.scss';
import { HiredProps } from './hired.types';
import { dialog } from '../../../../../core/dialog/dialog';
import { endpoint } from '../../../../../core/endpoints';
import { missionToApplicantListPayAdaptor } from '../../../job-offer-reject.services';
import { FeedbackModal } from '../feedback-modal';
import { Rate } from '../feedback-modal/feedback-modal.types';

export const Hired = (props: HiredProps): JSX.Element => {
  const navigate = useNavigate();
  const { hiredList, endHiredList: endHiredListDefault, onDone } = props;
  const [endHiredList, setEndHiredList] = useState(endHiredListDefault);
  const { web3 } = Dapp.useWeb3();
  const [process, setProcess] = useState(false);
  const resolver = useLoaderData() as Loader;
  const { offerOverview, jobOverview } = resolver || {};
  const isPaidCrypto = jobOverview?.payment_type === 'PAID' && offerOverview?.payment_mode === 'CRYPTO';
  const [selectedIdFeedback, setSelectedIdFeedback] = useState<{ id: string; status: 'CONFIRMED' | string }>({
    id: '',
    status: '',
  });
  const [feedbackText, setFeedbackText] = useState('');
  const [satisfactory, setSatisfactory] = useState<Rate>('satisfactory');
  const alert = useAlert();
  const selectedFeedbackName = endHiredList.items?.find((list) => list.id === selectedIdFeedback.id)?.assignee?.meta;

  async function onUserConfirm(id: string, escrowId?: string) {
    store.dispatch(showSpinner());
    setProcess(true);

    if (!web3 && escrowId) {
      dialog.confirm({
        title: 'Connect your wallet',
        message: `Please connect your wallet before confirm the job`,
        okButtonTitle: 'OK',
      });
      store.dispatch(hideSpinner());
      setProcess(false);
      return;
    }

    if (web3 && escrowId) {
      try {
        await Dapp.withdrawnEscrow(web3, escrowId);
        endpoint.post.missions['{mission_id}/confirm'](id).then(onDone);
      } catch (err: any) {
        dialog.confirm({
          title: 'Unhandled Error',
          message: `Please call support team seems like withdrawn escrow got error : ${err.message}`,
          okButtonTitle: 'OK',
        });
      }
    } else {
      endpoint.post.missions['{mission_id}/confirm'](id).then(onDone);
    }

    store.dispatch(hideSpinner());
    setProcess(false);
  }

  function openConfirmDialog(id: string, escrowId?: string) {
    if (process) return;
    const name = resolver.hiredList.items.find((user) => user.id === id)?.assignee?.meta?.name;
    const message = `By confirming its completion, the job will end, and ${name} will receive their payment.`;
    const options = { title: 'Confirm completion', message, okButtonTitle: 'Confirm' };
    alert.confirm(options, () => onUserConfirm(id, escrowId));
  }

  function onMessageClick(id: string) {
    navigate(`/chats/new/${id}`);
  }

  function onSubmitFeedback() {
    const updatedEndHiredList = { ...endHiredList };
    const itemIndex = endHiredList.items.findIndex((item) => item.id === selectedIdFeedback.id);

    setSelectedIdFeedback(false);
    if (satisfactory === 'satisfactory') {
      endpoint.post.missions['{mission_id}/feedback'](selectedIdFeedback.id, { content: feedbackText }).then(() => {
        {
          updatedEndHiredList.items[itemIndex].org_feedback = { content: feedbackText };
          setEndHiredList({ ...updatedEndHiredList });
          setSelectedIdFeedback(false);
        }
      });
    } else {
      endpoint.post.missions['{mission_id}/contest'](selectedIdFeedback.id, { content: feedbackText }).then(() => {
        {
          updatedEndHiredList.items[itemIndex].org_feedback = { content: feedbackText };
          setEndHiredList({ ...updatedEndHiredList });
          setSelectedIdFeedback(false);
        }
      });
    }
  }
  function onRehireClick(projectId: string) {
    const selected = props.endHiredList.items.find((item) => item.id === projectId);
    if (selected) {
      offerByApplicant(selected.applicant.id, {
        offer_message: selected.offer.offer_message,
        assignment_total: selected.offer.total_hours,
        payment_mode: selected.offer.payment_mode,
        crypto_currency_address: selected.offer.crypto_currency_address,
      });
    }
    dialog.alert({ title: 'Confirmed', message: 'You successfully sent an offer' });
    navigate(`/jobs`);
  }
  return (
    <div className={css.container}>
      <Accordion id="hired" title={`Hired (${hiredList.total_count})`}>
        <ApplicantListPay
          confirmable={offerOverview?.status === 'CLOSED'}
          onConfirm={openConfirmDialog}
          list={missionToApplicantListPayAdaptor(hiredList.items)}
          isPaidCrypto={isPaidCrypto}
          onMessageClick={onMessageClick}
        />
      </Accordion>
      <Accordion id="end-hired" title={`End-Hired (${endHiredList.total_count})`}>
        <ApplicantListPay
          list={missionToApplicantListPayAdaptor(endHiredList.items)}
          onMessageClick={onMessageClick}
          onFeedback={(id, status) => setSelectedIdFeedback({ id, status })}
          onRehire={onRehireClick}
        />
      </Accordion>
      <FeedbackModal
        open={!!selectedIdFeedback.id}
        onClose={() => setSelectedIdFeedback({ ...selectedIdFeedback, id: '' })}
        buttons={[{ children: 'Submit', disabled: !feedbackText, onClick: onSubmitFeedback }]}
        talent_name={(selectedFeedbackName?.name || selectedFeedbackName?.username) as string}
        onChangeTextHandler={setFeedbackText}
        onRate={(value) => setSatisfactory(value as Rate)}
        selectedRate={satisfactory}
      />
    </div>
  );
};
