import axios from "axios";
const DASHBOARD_WHATSAPP_ACCESS_URL = "https://nh9dzfa8o7.execute-api.eu-central-1.amazonaws.com/prod/whatsapp-access-queue";

export const PullWhatappAccessData = async (requestData: Record<string, unknown>) => {
    return axios.post(DASHBOARD_WHATSAPP_ACCESS_URL, requestData);
};