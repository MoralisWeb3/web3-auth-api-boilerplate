import create from 'zustand';
import { persist } from 'zustand/middleware';

type TUser = {
    username: string;
    address: string;
}

type TAuthStore = {
    /**
     * auth token
     */
    token?: string;

    /**
     * token setter
     */
    setToken: (token?: string) => void;

    /**
     * reset token
     */
    resetToken: () => void;

    /**
     * user
     */
    user?: TUser;


    /**
     * user setter
     */
    setUser: (user: TUser) => void;
}

export const useAuthStore = create(
    persist<TAuthStore>(
        (set) => ({
            token: undefined,
            setToken: (bearerToken) => set(() => ({ token: bearerToken })),
            resetToken: () => {
                set(() => ({
                    token: undefined,
                    user: undefined,
                }));
            },
            user: undefined,
            setUser: (user) => set(() => ({ user: user })),
        }),
        { name: 'authStore' },
    )
)
