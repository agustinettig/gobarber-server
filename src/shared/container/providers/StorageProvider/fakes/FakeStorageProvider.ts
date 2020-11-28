import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';

export default class FakeStorageProvider implements IStorageProvider {
    private files: string[] = [];

    public async saveFile(file: string): Promise<string> {
        this.files.push(file);

        return file;
    }

    public async deleteFile(file: string): Promise<void> {
        this.files = this.files.filter(fileName => fileName !== file);
    }
}
