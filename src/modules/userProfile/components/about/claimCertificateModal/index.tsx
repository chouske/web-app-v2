import { QRCodeSVG } from 'qrcode.react';
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'src/modules/general/components/Button';
import { FeaturedIcon } from 'src/modules/general/components/featuredIcon-new';
import { Modal } from 'src/modules/general/components/modal';
import { useTranslation } from 'react-i18next';

import css from './index.module.scss';

interface ClaimCertificateModalProps {
  open: boolean;
  link: string;
  handleClose: () => void;
  handleClaimVC: () => void;
}

export const ClaimCertificateModal: React.FC<ClaimCertificateModalProps> = ({
  open,
  link,
  handleClose,
  handleClaimVC,
}) => {
  const { t } = useTranslation('referral');
  const footerJsx = (
    <div className="w-full p-6 block md:hidden">
      <Button variant="contained" color="primary" fullWidth onClick={handleClaimVC}>
        Open Socious Wallet app
      </Button>
    </div>
  );
  return (
    <Modal
      open={open}
      handleClose={handleClose}
      icon={<FeaturedIcon type="modern" iconName="shield-tick" size="lg" theme="gray" />}
      title="Claim your certificate"
      inlineTitle={false}
      footer={footerJsx}
      mobileFullHeight
      customStyle="!w-[512px]"
      contentClassName="h-full"
    >
      <div className="px-4 py-5 md:p-6 flex flex-col gap-5">
        <div className="p-4 flex flex-col gap-1 rounded-xl border border-solid border-Gray-light-mode-300 bg-Gray-light-mode-25">
          <span className="text-sm leading-5 font-semibold text-Gray-light-mode-600">
            Socious uses blockchain technology to make credentials transparent and traceable.
          </span>
          <span className="text-sm leading-5 font-normal text-Gray-light-mode-600">{t('Ref_verify_explanation')}</span>
        </div>
        <span className="text-base leading-6 font-semibold text-Gray-light-mode-900">How to get your certificate</span>
        <div className="flex flex-col">
          <span className={css['text--light']}>1. Open your Socious Wallet</span>
          <span className={`${css['text--light']} hidden md:inline`}>2. Scan the QR code below</span>
          <span className={css['text--light']}>
            <span className="inline md:hidden">2.</span>
            <span className="hidden md:inline">3.</span> Accept the request to get your certificate
          </span>
        </div>
        <div className="bg-Gray-light-mode-50 rounded-default p-4 hidden md:flex items-center justify-center">
          <QRCodeSVG value={link} size={200} />
        </div>
        <div className="flex flex-col md:items-center gap-4">
          <span className={css['text--light']}>{t('Ref_download_wallet_app_text')}</span>
          <div className="flex items-center gap-4">
            <Link to="https://wallet.socious.io/ios" target="_blank">
              <img
                src="/images/download-appstore.svg"
                alt="app-store"
                height={40}
                width={135}
                className="cursor-pointer"
              />
            </Link>
            <Link to="https://wallet.socious.io/android" target="_blank">
              <img
                src="/images/download-googleplay.svg"
                alt="google-play"
                height={40}
                width={135}
                className="cursor-pointer"
              />
            </Link>
          </div>
        </div>
      </div>
    </Modal>
  );
};
