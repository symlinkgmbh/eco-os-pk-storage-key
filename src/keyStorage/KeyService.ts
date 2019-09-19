/**
 * Copyright 2018-2019 Symlink GmbH
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * 
 */



import { STORAGE_TYPES, storageContainer } from "@symlinkde/eco-os-pk-storage";
import { bootstrapperContainer } from "@symlinkde/eco-os-pk-core";
import Config from "config";
import { PkStorageKey, PkStorage } from "@symlinkde/eco-os-pk-models";
import { injectable } from "inversify";
import { Key } from "./Key";

@injectable()
export class KeyService implements PkStorageKey.IKeyService {
  private keyRepro: PkStorage.IMongoRepository<Key>;

  public constructor() {
    storageContainer.bind(STORAGE_TYPES.Collection).toConstantValue(Config.get("mongo.collection"));
    storageContainer.bind(STORAGE_TYPES.Database).toConstantValue(Config.get("mongo.db"));
    storageContainer.bind(STORAGE_TYPES.StorageTarget).toConstantValue("SECONDLOCK_MONGO_KEY_DATA");
    storageContainer
      .bind(STORAGE_TYPES.SECONDLOCK_REGISTRY_URI)
      .toConstantValue(bootstrapperContainer.get("SECONDLOCK_REGISTRY_URI"));
    this.keyRepro = storageContainer.getTagged<PkStorage.IMongoRepository<Key>>(
      STORAGE_TYPES.IMongoRepository,
      STORAGE_TYPES.STATE_LESS,
      false,
    );
  }

  public async getPubKeys(email: string): Promise<Array<Key> | null> {
    const result = await this.keyRepro.find({ email: email.trim().toLocaleLowerCase() });

    if (result === null) {
      return result;
    }

    return result.map((key) => new Key(key));
  }

  public async revokePubKeyByDeviceId(deviceId: string): Promise<boolean> {
    return await this.keyRepro.deleteMany({
      deviceId: {
        $eq: deviceId,
      },
    });
  }

  public async revokePubKeyByKey(pubKey: string): Promise<boolean> {
    return await this.keyRepro.deleteMany({
      pubKey: {
        $eq: pubKey,
      },
    });
  }

  public async revokePubKeys(email: string): Promise<boolean> {
    return await this.keyRepro.deleteMany({
      email: {
        $eq: email.trim().toLocaleLowerCase(),
      },
    });
  }

  public async revokeAllPubKeys(): Promise<boolean> {
    return await this.keyRepro.deleteMany({});
  }

  public async addPubKey(email: string, pubKey: string, deviceId: string): Promise<Key | null> {
    const key: Key = new Key({
      email: email.trim().toLocaleLowerCase(),
      pubKey,
      deviceId,
    });

    const result = await this.keyRepro.create(key);
    if (!result) {
      return null;
    }

    return result;
  }

  public async checkForKeyAndDeviceId(pubKey: string, deviceId: string): Promise<boolean> {
    const result = await this.keyRepro.find({ pubKey, deviceId });
    if (result !== null && result.length > 0) {
      return true;
    }
    return false;
  }

  public async revokeDevice(deviceId: string): Promise<boolean> {
    return await this.keyRepro.deleteMany({
      deviceId: {
        $eq: deviceId,
      },
    });
  }
}
