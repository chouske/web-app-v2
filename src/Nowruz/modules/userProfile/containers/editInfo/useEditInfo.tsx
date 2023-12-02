import { yupResolver } from '@hookform/resolvers/yup';
import { debounce } from 'lodash';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { MultiSelectItem } from 'src/Nowruz/modules/general/components/multiSelect/multiSelect.types';
import { SOCIAL_CAUSES } from 'src/constants/SOCIAL_CAUSES';
import { socialCausesToCategory } from 'src/core/adaptors';
import { Location, UpdateProfileReq, User, identities, preRegister, searchLocation, updateProfile } from 'src/core/api';
import { checkUsernameConditions } from 'src/core/utils';
import { RootState } from 'src/store';
import { setIdentityList } from 'src/store/reducers/identity.reducer';
import { setUser } from 'src/store/reducers/profile.reducer';
import * as yup from 'yup';

const schema = yup
  .object()
  .shape({
    username: yup.string().required('username is required'),
    firstName: yup.string().required('first name is required'),
    lastName: yup.string().required('last name is required'),
    summary: yup.string().required('summary is required'),
  })
  .required();

export const useEditInfo = (closeModal: () => void) => {
  const dispatch = useDispatch();

  const [isUsernameValid, setIsusernameValid] = useState(false);
  const [isUsernameAvailable, setIsusernameAvailable] = useState(false);

  const user = useSelector<RootState, User | undefined>((state) => {
    return state.profile.user;
  });
  const [cityVal, setCityVal] = useState(!user || !user.city ? null : { label: user.city });
  const [selectedCity, setSelectedCity] = useState(user?.city);
  const isFormValid = selectedCity;

  console.log('test log city ', selectedCity);

  const keyItems = Object.keys(SOCIAL_CAUSES);
  const socialCauseItems = keyItems.map((i) => {
    return { value: SOCIAL_CAUSES[i].value, label: SOCIAL_CAUSES[i].label };
  });

  const [SocialCauses, setSocialCauses] = useState<MultiSelectItem[]>(socialCausesToCategory(user?.social_causes));

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    getValues,
    setError,
    clearErrors,
    watch,
  } = useForm({
    mode: 'all',
    resolver: yupResolver(schema),
  });

  const username = watch('username');

  const checkUsernameAvailability = async (username: string) => {
    const checkUsername = await preRegister({ username });
    if (checkUsername.username === null) {
      setIsusernameAvailable(true);
    }
  };
  const debouncedCheckUsername = debounce(checkUsernameAvailability, 800);

  useEffect(() => {
    const usernameConditionErrors = checkUsernameConditions(username);
    clearErrors('username');
    setIsusernameValid(false);
    if (usernameConditionErrors) {
      setIsusernameValid(false);
      setError('username', {
        type: 'manual',
        message: usernameConditionErrors,
      });
    } else if (!usernameConditionErrors && username) {
      debouncedCheckUsername(username);
      if (isUsernameAvailable) {
        setIsusernameValid(true);
        clearErrors('username');
      } else {
        setIsusernameValid(false);
        setError('username', {
          type: 'manual',
          message: 'Username is not available',
        });
      }
    }
  }, [username, isUsernameAvailable]);

  const cityToOption = (cities: Location[]) => {
    return cities.map((city) => ({
      label: `${city.name}, ${city.region_name}`,
      countryCode: city.country_code,
    }));
  };

  const searchCities = async (searchText: string, cb) => {
    try {
      if (searchText) {
        const response = await searchLocation(searchText);
        cb(cityToOption(response.items));
      }
    } catch (error) {
      console.error('Error fetching city data:', error);
    }
  };
  const onSelectCity = (location) => {
    setSelectedCity(location.label);
    setCityVal({ label: location.label });
  };
  async function updateIdentityList() {
    return identities().then((resp) => dispatch(setIdentityList(resp)));
  }

  const saveUser = () => {
    const profileReq = {
      first_name: getValues().firstName.trim(),
      last_name: getValues().lastName.trim(),
      username: getValues().username,
      city: selectedCity,
      social_causes: SocialCauses.map((item) => item.value),
    };
    const updatedUser = { ...user, ...profileReq };
    updateProfile(profileReq as UpdateProfileReq).then(async (resp) => {
      await updateIdentityList();
      dispatch(setUser(updatedUser));
      closeModal();
    });
  };

  return {
    register,
    errors,
    user,
    isUsernameValid,
    searchCities,
    onSelectCity,
    cityVal,
    isFormValid,
    socialCauseItems,
    SocialCauses,
    setSocialCauses,
    handleSubmit,
    saveUser,
  };
};
