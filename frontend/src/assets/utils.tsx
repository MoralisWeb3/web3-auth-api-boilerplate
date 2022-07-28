import { NavigateFunction } from "react-router-dom";

export const handleError = (error: any, resetToken: Function, callback?: Function) => {
    const errorMessage = error?.response?.data  as IErrorMessage;
    switch (errorMessage.statusCode) {
        case 400:
            resetToken();
            callback && callback();
            break;
    }

    return errorMessage;
}

export interface IErrorMessage {
    name: string;
    message: string;
    statusCode: number;
}
