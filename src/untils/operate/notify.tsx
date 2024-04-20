import { notification } from "antd";
type NotificationType = 'success' | 'info' | 'warning' | 'error';
export const openNotificationWithIcon = (notifyType: NotificationType, message: string, description: string) => {
    notification[notifyType]({
        message,
        description,
        duration: 5
    });
};