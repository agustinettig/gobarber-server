import ISendMailDTO from '../dtos/ISendMailDTO';
import IMailProvider from '../models/IMailProvider';

export default class FakeEmailProvider implements IMailProvider {
    private mailsSent: ISendMailDTO[] = [];

    public async sendMail(data: ISendMailDTO): Promise<void> {
        this.mailsSent.push(data);
    }
}
