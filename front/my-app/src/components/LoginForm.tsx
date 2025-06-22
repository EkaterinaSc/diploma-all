import React, {useContext, useState} from 'react';
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import './LoginForm.css'

const LoginForm = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const {store} = useContext(Context);
    return (
        <div className={'inner'}>
            <input type="text"
                   placeholder="Email"
                   onChange={(e) => setEmail(e.target.value)}
                   value={email}
            />
            <input type="text"
                   placeholder="Пароль"
                   onChange={(e) => setPassword(e.target.value)}
                   value={password}
            />
            <button onClick={() => store.login(email, password)}>Авторизация</button>
            <button onClick={() => store.register(email, password)}>Регистрация</button>
        </div>
    );
};

export default observer(LoginForm);