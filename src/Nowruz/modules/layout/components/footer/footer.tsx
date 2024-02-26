import { MenuList } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { CurrentIdentity } from 'src/core/api';
import { RootState } from 'src/store';

import { LinkItem } from '../linkItem/LinkItem';
import { LinksContainerProps } from '../linksContainer/linksContainer.types';

interface FooterProps extends LinksContainerProps {
  logout: () => void;
}
export const Footer: React.FC<FooterProps> = ({ open, logout, setOpen }) => {
  const navigate = useNavigate();
  const navigateFunction = (route: string) => {
    navigate(route);
    setOpen(false);
  };
  const currentIdentity = useSelector<RootState, CurrentIdentity | undefined>((state) => {
    return state.identity.entities.find((identity) => identity.current);
  });
  const userIsLoggedIn = !!currentIdentity;

  return (
    <MenuList className="flex flex-col  items-center w-full h-fit px-4 pb-6 gap-2 mb-0 mt-auto">
      {/* <LinkItem
            label="Help"
            navigateFunc={() => {
              navigate('/');
            }}
            iconName="help-circle"
            menuOpen={open}
          /> */}

      {userIsLoggedIn && (
        <LinkItem
          label="Settings"
          navigateFunc={() => {
            navigateFunction('/');
          }}
          iconName="settings-01"
          menuOpen={open}
        />
      )}
      {userIsLoggedIn && <LinkItem label="Logout" navigateFunc={logout} iconName="log-out-01" menuOpen={open} />}

      {!userIsLoggedIn && (
        <LinkItem
          label="Login"
          navigateFunc={() => {
            navigateFunction('/sign-in');
          }}
          iconName="log-in-01"
          menuOpen={open}
        />
      )}
    </MenuList>
  );
};
