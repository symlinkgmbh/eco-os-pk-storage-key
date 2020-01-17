/**
 * Copyright 2018-2020 Symlink GmbH
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




import { MsKey } from "@symlinkde/eco-os-pk-models";

export class Key implements MsKey.IKey {
  public email: string;
  public pubKey: string;
  public deviceId: string;
  public _id?: string;
  public deviceType?: string;
  public createdAt?: Date;

  constructor(key: MsKey.IKey) {
    this.email = key.email;
    this.pubKey = key.pubKey;
    this.deviceId = key.deviceId;
    this._id = key._id;
    this.deviceType = key.deviceType;
    this.createdAt = key.createdAt;
  }

  public getEmail(): string {
    return this.email;
  }

  public setEmail(email: string): void {
    this.email = email;
    return;
  }

  public getPubKey(): string {
    return this.pubKey;
  }

  public setPubKey(pubKey: string): void {
    this.pubKey = pubKey;
  }

  public getDeviceId(): string {
    return this.deviceId;
  }

  public setDeviceId(deviceId: string): void {
    this.deviceId = deviceId;
  }

  public getId(): string {
    return this._id === undefined ? "" : this._id;
  }

  public setId(_id: string): void {
    this._id = _id;
  }
}
