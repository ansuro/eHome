import { Id } from "@feathersjs/feathers";

export interface IDevice {
  name: string;
  MAC: string;
  states?: Array<IStateOnOff | IStateOnOffOptions | IStateValueOnly>;
  online: boolean;
}

export type DeviceState = IStateOnOff | IStateOnOffOptions | IStateValueOnly;

interface IState {
  id: Id;
  name: string;
  type: number;
}

export interface IStateOnOff extends IState {
  value: boolean;
}

export interface IStateOnOffOptions extends IState {
  value: string;
  options: string[];
}

export interface IStateValueOnly extends IState {
  value: string;
}

export interface IOnOffOption {
  index: number;
  value: string;
}