import { DEFAULT_DICTIONARY_FILE_NAME, DICTIONARY_DIRECTORY } from '@app/constants';
import { DictionaryInfo, DictionaryTemplate } from '@common/dictionaryTemplate';
import { FileTemplate } from '@common/fileTemplate';
import * as fs from 'fs';
import 'reflect-metadata';
import { Service } from 'typedi';
@Service()
export class DictionaryService {
    addDictionary(fileTemplate: FileTemplate): boolean {
        const dictionaryNames: string[] = this.getDictionaryNames();
        for (const name of dictionaryNames) {
            if (name === fileTemplate.file.title) {
                return false;
            }
        }
        const file: string = JSON.stringify(fileTemplate.file);
        fs.writeFileSync(`${DICTIONARY_DIRECTORY}${fileTemplate.fileName}`, file);
        return true;
    }

    getFileNames(): string[] {
        return fs.readdirSync(`${DICTIONARY_DIRECTORY}`);
    }

    getDictionaryNames(): string[] {
        const dictionaryNames: string[] = [];
        const dictionaryDirectories = this.getFileNames();
        for (const dir of dictionaryDirectories) {
            const data = fs.readFileSync(`${DICTIONARY_DIRECTORY}${dir}`).toString();
            const dictionary: DictionaryTemplate = JSON.parse(data);
            dictionaryNames.push(dictionary.title);
        }
        return dictionaryNames;
    }

    reset() {
        const dictionaryDirectories = this.getFileNames();
        for (const dir of dictionaryDirectories) {
            if (dir !== DEFAULT_DICTIONARY_FILE_NAME) {
                fs.unlinkSync(`${DICTIONARY_DIRECTORY}${dir}`);
            }
        }
    }

    deleteDictionary(dictionary: DictionaryInfo): boolean {
        const path = this.getFilePathFromName(dictionary.title);
        if (path === '') return false;
        fs.unlinkSync(`${DICTIONARY_DIRECTORY}${path}`);
        return true;
    }

    modifyDictionary(dictionaryToModify: string, newDictionaryInfo: DictionaryInfo): boolean {
        const names: string[] = this.getDictionaryNames();
        for (const name of names) {
            if (name === newDictionaryInfo.title && name !== dictionaryToModify) return false;
        }
        const path = this.getFilePathFromName(dictionaryToModify);
        if (path === '') return false;

        const data = fs.readFileSync(`${DICTIONARY_DIRECTORY}${path}`).toString();
        const dictionary: DictionaryTemplate = JSON.parse(data);
        fs.unlinkSync(`${DICTIONARY_DIRECTORY}${path}`);
        dictionary.title = newDictionaryInfo.title;
        dictionary.description = newDictionaryInfo.description;
        fs.writeFileSync(`${DICTIONARY_DIRECTORY}${path}`, JSON.stringify(dictionary));
        return true;
    }

    getFilePathFromName(dictionaryName: string): string {
        const paths: string[] = this.getFileNames();
        for (const path of paths) {
            const data = fs.readFileSync(`${DICTIONARY_DIRECTORY}${path}`).toString();
            const dictionary: DictionaryTemplate = JSON.parse(data);
            if (dictionary.title === dictionaryName) {
                return path;
            }
        }
        return '';
    }

    getDictionaryInfo(): DictionaryInfo[] {
        const dictionaryNames: DictionaryInfo[] = [];
        const dictionaryDirectories = this.getFileNames();
        for (const dir of dictionaryDirectories) {
            const data = fs.readFileSync(`${DICTIONARY_DIRECTORY}${dir}`).toString();
            const dictionary: DictionaryTemplate = JSON.parse(data);
            dictionaryNames.push({ title: dictionary.title, description: dictionary.description });
        }
        return dictionaryNames;
    }
}
