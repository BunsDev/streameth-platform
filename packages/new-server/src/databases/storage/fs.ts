import fs from 'fs';
import { promisify } from 'util';
import * as path from 'path';
import { IStorageController } from '@interfaces/storage.interface';
import crypto from 'crypto';
import { BASE_PATH } from '@utils/util';

export default class FS<T> implements IStorageController<T> {
  constructor() {
    this.readFileAsync = promisify(fs.readFile);
    this.writeFileAsync = promisify(fs.writeFile);
    // @ts-ignore
    this.mkdirAsync = promisify(fs.mkdir);
    this.accessAsync = promisify(fs.access);
    this.readdirAsync = promisify(fs.readdir);
    this.deleteFileAsync = promisify(fs.unlink);
  }

  async findOne(query: { name: string }, path: string): Promise<any> {
    try {
      const filePath = await this.getFilePath(path, query.name);
      return await this.readFileAsync(filePath, { encoding: 'utf8' });
    } catch (e) {
      return false;
    }
  }

  async update(query: string, data: T, path: string): Promise<T> {
    await this.delete(query, path);
    return await this.create(query, data, path);
  }

  async create(query: string, data: T, path: string): Promise<T> {
    let existingData: T | null = null;

    // read the existing data
    const existingDataString = await this.read(path);

    if (existingDataString) {
      existingData = JSON.parse(existingDataString);
    }
    // If no existing data is found, create new data
    if (!existingData) {
      existingData = { _id: crypto.randomUUID() } as T; // Create an empty object if no existing data is found
    }
    const updatedData = this.mergeObjects(existingData, data);
    const filePath = await this.getFilePath(
      path,
      updatedData.name.toLowerCase(),
    );
    await this.write(filePath, JSON.stringify(updatedData, null, 2));
    return updatedData;
  }

  async findById(query: string, path: string): Promise<T> {
    const filePath = await this.getFilePath(path, query);
    try {
      if (fs.lstatSync(filePath).isDirectory()) {
        console.error(`${filePath} is a directory, not a file.`);
        process.exit(1);
      }
      return new Promise((resolve, reject) => {
        this.read(filePath)
          .then((data) => {
            try {
              const parsedData = JSON.parse(data);
              resolve(parsedData);
            } catch (error) {
              reject(`Error parsing JSON data: ${error}`);
            }
          })
          .catch((error) => {
            reject(`Error reading file: ${error}`);
          });
      });
    } catch (e) {
      console.log('error');
    }
  }

  async findAll(path: string): Promise<Array<T>> {
    try {
      const filePath = await this.getFilePath(path);
      const files = await this.readdirAsync(filePath);
      if (files == undefined) {
        return [];
      }
      const dataPromises = files.map(async (file) => {
        const data = await this.read(`${filePath}/${file}`);
        try {
          return JSON.parse(data);
        } catch (e) {
          console.error(`Error parsing JSON from ${filePath}/${file}`);
          throw e;
        }
      });
      return Promise.all(dataPromises);
    } catch (e) {
      return [];
    }
  }

  async delete(id: string, path: string) {
    try {
      const filePath = await this.getFilePath(path, id);
      await this.deleteFileAsync(filePath);
    } catch (e) {
      console.error(`Failed to delete file at ${path}:`, e);
    }
  }

  private async read(path: string): Promise<string> {
    try {
      return await this.readFileAsync(path, { encoding: 'utf8' });
    } catch (e) {
      return '';
    }
  }

  private async write(filePath: string, data: string): Promise<void> {
    const directory = path.dirname(filePath);
    await this.mkdirAsync(directory, { recursive: true });
    return this.writeFileAsync(filePath, data, { encoding: 'utf8' });
  }

  private async getFilePath(directory: string, id?: string): Promise<string> {
    if (!id) return path.join(BASE_PATH, directory);
    return path.join(BASE_PATH, directory, `${id}.json`);
  }

  private mergeObjects(target: any, source: any): any {
    Object.keys(source).forEach((key) => {
      const sourceKey = key as keyof T;
      if (source[sourceKey] !== undefined) {
        // Only overwrite if the value is not undefined
        target[sourceKey] = source[sourceKey];
      }
    });
    return target; // Return the modified target object
  }
  private readFileAsync: (
    path: string,
    options: { encoding: BufferEncoding },
  ) => Promise<string>;
  private writeFileAsync: (
    filePath: string,
    data: string,
    options: { encoding: BufferEncoding },
  ) => Promise<void>;
  private deleteFileAsync: (path: string) => Promise<void>;
  private mkdirAsync: (
    path: string,
    options?: fs.MakeDirectoryOptions,
  ) => Promise<void>;
  private accessAsync: (path: string, mode: number) => Promise<void>;
  private readdirAsync: (path: string) => Promise<Array<string>>;
}
