/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type { HealthCheck, HealthCheckInterface } from "../HealthCheck";

const _abi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "profit",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "loss",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "debtPayment",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "debtOutstanding",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "totalDebt",
        type: "uint256",
      },
    ],
    name: "check",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

export class HealthCheck__factory {
  static readonly abi = _abi;
  static createInterface(): HealthCheckInterface {
    return new utils.Interface(_abi) as HealthCheckInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): HealthCheck {
    return new Contract(address, _abi, signerOrProvider) as HealthCheck;
  }
}
