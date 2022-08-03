import { BigInt, Bytes, ethereum } from "@graphprotocol/graph-ts";

export function bigIntToBytes(val: BigInt): Bytes {
  return changetype<Bytes>(Bytes.fromBigInt(val));
}

export function dsLogDataToTuple(data: Bytes, signature: String): ethereum.Tuple {
  return ethereum.decode(signature, uint8ArrayToBytes(data.slice(4)))!.toTuple();
}
export function uint8ArrayToBytes(array: Uint8Array): Bytes {
  return changetype<Bytes>(array);
}
