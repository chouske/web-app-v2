import { useMatch, useNavigate } from '@tanstack/react-location';
import { useSelector } from 'react-redux';
import { IdentityReq } from 'src/core/types';
import { RootState } from 'src/store/store';
import { hapticsImpactLight } from 'src/core/haptic/haptic';
import { ProfileReq } from './profile-user.types';
import { skillsToCategory, socialCausesToCategory } from 'src/core/adaptors';

export const useProfileUserShared = () => {
  const { user, badges } = useMatch().data as { user: ProfileReq; badges: { badges: unknown[] } };
  const socialCauses = socialCausesToCategory(user.social_causes);
  const navigate = useNavigate();
  const avatarImage = user.avatar?.url ? user.avatar?.url : user.image?.url;
  const skills = skillsToCategory(user.skills);

  const currentIdentity = useSelector<RootState, IdentityReq | undefined>((state) => {
    return state.identity.entities.find((identity) => identity.current);
  });

  const profileBelongToCurrentUser = currentIdentity?.id === user.id;

  function onClose() {
    hapticsImpactLight();
    navigate({ to: '/jobs' });
  }

  function gotToDesktopAchievement() {
    const connectId = user.proofspace_connect_id ? user.proofspace_connect_id : null;
    navigate({ to: `/achievements/d?proofspace_connect_id=${connectId}` });
  }

  function gotToMobileAchievement() {
    hapticsImpactLight();
    const connectId = user.proofspace_connect_id ? user.proofspace_connect_id : null;
    navigate({ to: `/achievements/m?proofspace_connect_id=${connectId}` });
  }

  function navigateToEdit() {
    navigate({ to: '../edit' });
  }

  return {
    user,
    badges,
    socialCauses,
    avatarImage,
    skills,
    currentIdentity,
    profileBelongToCurrentUser,
    onClose,
    gotToDesktopAchievement,
    gotToMobileAchievement,
    navigateToEdit,
  };
};