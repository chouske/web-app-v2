import React, { useState } from 'react';
import { Button } from 'src/modules/general/components/Button';
import { IconButton } from 'src/modules/general/components/iconButton';
import { Input } from 'src/modules/general/components/input/input';
import variables from 'src/styles/constants/_exports.module.scss';

import css from './sendMessage.module.scss';
import { useTransactionDetailes } from 'src/pages/wallet/transactionDetails/useTransactionDetails';
import { useTranslation } from 'react-i18next';

interface SendMessageProps {
  receipientId?: string;
  onSend?: (message: string) => void;
  handleCreateChat?: (receipientId: string, text: string) => void;
}
export const SendMessage: React.FC<SendMessageProps> = ({ onSend, handleCreateChat, receipientId }) => {
  const { t } = useTranslation('messaging');
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = async () => {
    if (onSend) await onSend(newMessage);
    else if (handleCreateChat && receipientId) await handleCreateChat(receipientId, newMessage);
    setNewMessage('');
  };

  const enterInput = (e: any) => {
    if (e.keyCode === 13) {
      handleSendMessage();
    }
  };
  return (
    <>
      <div className={`hidden md:flex ${css.sendBox}`}>
        <textarea
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          onKeyDown={e => enterInput(e)}
          className={css.inputMessage}
          placeholder={t('message.send')}
        />

        <Button
          variant="contained"
          color="primary"
          customStyle="absolute right-[14px] bottom-[14px]"
          onClick={handleSendMessage}
        >
          {t('button.send')}
        </Button>
      </div>
      <div className={`flex md:hidden py-6 gap-3`}>
        <div className="flex-1">
          <Input
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            placeholder="Send a message"
            onKeyDown={e => enterInput(e)}
          />
        </div>
        <IconButton
          size="medium"
          iconName="send-01"
          iconSize={20}
          iconColor={variables.color_white}
          handleClick={handleSendMessage}
          customStyle="!bg-Brand-600"
        />
      </div>
    </>
  );
};
