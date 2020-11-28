import IMailProvider from '../models/IMailProvider';

interface IMessage {
    to: string;
    message: string;
}
export default class FakeEmailProvider implements IMailProvider {
    private mailsSent: IMessage[] = [];

    public async sendMail(to: string, body: string): Promise<void> {
        this.mailsSent.push({ to, message: body });
    }
}
