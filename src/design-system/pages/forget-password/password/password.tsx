
import { useNavigate } from '@tanstack/react-location';
import { Button } from '../../../atoms/button/button';
import { Input } from '../../../atoms/input/input';
import css from './password.module.scss';
import { PasswordQuality } from '../../../atoms/password-quality/password-quality';
import { useState } from 'react';
import { changePassword } from '../forget-password.service';

const validator = [
    {
        name: 'characters',
        amount: 7
    },
    {
        name: 'number',
        amount: 1
    },
]

export const Password = () => {
    const navigate = useNavigate();
    const [state, setState] = useState({
        password: '',
        newPassword: ''
    })

    const onChangePassword = () => {
        console.log('tate.password', state.password);

        changePassword(state.password).then(resp => {
            if (resp.message === 'success') {
                navigate({ to: `../../jobs` });
            }
        })
    }

    const backToPerviousPage = () => {
        navigate({ to: '../otp' });
    }

    const onChangePasswordHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setState({ ...state, password: e.target.value })
    }

    const onChangeNewPasswordHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setState({ ...state, newPassword: e.target.value })
    }

    return (
        <div className={css.container}>
            <div className={css.header}>
                <div onClick={backToPerviousPage}>
                    <img src="/icons/chevron-left.svg" />
                </div>
            </div>
            <div className={css.main}>
                <span className={css.title}>Reset your password </span>
                <div className={css.newPassword}>
                    <Input variant='outline' placeholder='New password' label='New password' onChange={onChangePasswordHandler} />
                    <Input variant='outline' placeholder='Confirm new password' label='Confirm new password' onChange={onChangeNewPasswordHandler} />
                    <PasswordQuality value={state.password} validators={validator} />
                </div>
            </div>
            <div className={css.footer}>
                <Button color='blue' onClick={onChangePassword}>
                    Change your password
                </Button>
            </div>
        </div>
    )
}