import React, {useContext, useEffect, useState} from 'react';
import './App.css';
import LoginForm from "./components/LoginForm";
import {Context} from "./index";
import {observer} from "mobx-react-lite";
import {IUser} from "./models/IUser";
import UserService from "./services/userService";

function App() {
    const {store} = useContext(Context);
    const [users, setUsers] = useState<IUser[]>([]);
    useEffect(() => {
        if (localStorage.getItem('token')) {
            store.checkAuthenticated()
        }
    }, [])

    async function getUsers() {
        try {
            const response = await UserService.fetchUsers();
            setUsers(response.data);

        } catch (e) {
            console.log(e);
        }
    }

    if (store.isLoading) {
        return (
            <div>Loading.....</div>
        )
    }

    if (!store.isAuthenticated) {
        return (<>
                    <h1>{`Авторизуйтесь!`}</h1>
                    <LoginForm/>
                <div>
                    <button onClick={getUsers}>Получить список пользователей</button>
                </div>
                {users.map(user =>
                    <div key={user.email}>
                        {user.email}
                    </div>)}
                </>
        )
    }
    return (
        <div className="App">
           <h1>{`Пользователь с email ${store.user.email} авторизован`}</h1>
           <button onClick={() => store.logout()}>Logout</button>
           <div>
               <button onClick={getUsers}>Получить список пользователей</button>
           </div>
            {users.map(user =>
                <div key={user.email}>
                    {user.email}
                </div>)}
       </div>
    );
}

export default observer(App);
