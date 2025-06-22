import {IUser} from "../models/IUser";
import {makeAutoObservable} from "mobx";
import api, {API_URL} from "../http";
import axios from "axios";
import AuthService from "../services/authService";
import {AuthResponse} from "../models/response/authResponse";

export default class Store {
    user = {} as IUser;
    isAuthenticated: boolean = false;
    isLoading: boolean = false;

    constructor() {
        makeAutoObservable(this);
    }

    setAuthenticated(bool: boolean) {
        this.isAuthenticated = bool;
    }

    setUser(user: IUser) {
        this.user = user;
    }

    setLoading(bool: boolean) {
        this.isLoading = bool;
    }

    async login(email: string, password: string) {
        try {
            const response = await AuthService.login(email, password);
            console.log(response);
            localStorage.setItem("token", response.data.accessToken);
            this.setAuthenticated(true);
            this.setUser(response.data.user);
        } catch (e) {
            // @ts-ignore
            console.log(e.response?.data?.message);
        }
    }

    async register(email: string, password: string) {
        try {
            const response = await AuthService.register(email, password);
            console.log(response);
            localStorage.setItem("token", response.data.accessToken);
            this.setAuthenticated(true);
            this.setUser(response.data.user);
        } catch (e) {
            // @ts-ignore
            console.log(e.response?.data?.message);
        }
    }

    async logout() {
        try {
            console.log('начали логаут');
            const response = await AuthService.logout();
            console.log('response>>>>', response);
            localStorage.removeItem("token");
            this.setAuthenticated(false);
            this.setUser({} as IUser);
        } catch (e) {
            // @ts-ignore
            console.log(e.response?.data?.message);
        }
    }

    async checkAuthenticated() {
        this.setLoading(true);
        try {
           const response = await axios.get<AuthResponse>(`${API_URL}/refresh`,
               {withCredentials: true});
            console.log(response);
            localStorage.setItem("token", response.data.accessToken);
            this.setAuthenticated(true);
            this.setUser(response.data.user);
        } catch (e) {
            // @ts-ignore
            console.log(e.response?.data?.message);
        } finally {
            this.setLoading(false);
        }
    }
}