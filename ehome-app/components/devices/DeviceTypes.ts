
// export type TDevice = IStateOnOff | IStateOnOffOptions | IStateValueOnly;

export interface IDevice {
  name: string;
  MAC: string;
  states?: Array<IStateOnOff | IStateOnOffOptions | IStateValueOnly>;
  online: boolean;
}

interface IState {
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