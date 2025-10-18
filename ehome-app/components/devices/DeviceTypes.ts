export interface IDevice {
  name: string;
  MAC: string;
  states: Array<IStateOnOff | IStateOnOffOptions | IStateValueOnly>;
  isOnline: boolean;
}

export type DeviceState = IStateOnOff | IStateOnOffOptions | IStateValueOnly;

export interface IState {
  name: string;
  MAC: string;
  type: number;
  value: string | boolean;
  options?: string[];
}

export interface IStateOnOff extends IState {
  value: boolean;
  options?: never;
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