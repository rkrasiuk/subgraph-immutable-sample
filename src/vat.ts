import { Urn } from "../generated/schema";
import { LogNote } from "../generated/Vat/Vat";
import { dsLogDataToTuple } from "./utils";

const VAT_FROB_FUNCTION_SIG = "0x76088703";
const VAT_FORK_FUNCTION_SIG = "0x870c616d";
const VAT_GRAB_FUNCTION_SIG = "0x7bab3f40";

function assertSignature(event: LogNote, expected: string): void {
  let sig = event.params.sig.toHexString();
  if (sig != expected) {
    throw new Error(`LogNote function signature does not match. Expected: ${expected}. Received: ${sig}.`);
  }
}

export function handleFrob(event: LogNote): void {
  assertSignature(event, VAT_FROB_FUNCTION_SIG);

  let tuple = dsLogDataToTuple(event.params.data, "(bytes32,address,address,address,int256,int256)");

  let u = tuple[1].toAddress();
  let dink = tuple[4].toBigInt();
  let dart = tuple[5].toBigInt();

  let urn = Urn.load(u);
  if (!urn) {
    // this urn does not have a corresponding cdp
    return;
  }

  urn.collateral = urn.collateral.plus(dink);
  urn.debt = urn.debt.plus(dart);
  urn.save();
}

export function handleFork(event: LogNote): void {
  assertSignature(event, VAT_FORK_FUNCTION_SIG);

  let tuple = dsLogDataToTuple(event.params.data, "(bytes32,address,address,int256,int256)");

  let src = tuple[1].toAddress();
  let dst = tuple[2].toAddress();
  let dink = tuple[3].toBigInt();
  let dart = tuple[4].toBigInt();

  let srcUrn = Urn.load(src);
  if (srcUrn) {
    srcUrn.collateral = srcUrn.collateral.minus(dink);
    srcUrn.debt = srcUrn.debt.minus(dart);
    srcUrn.save();
  }

  let dstUrn = Urn.load(dst);
  if (dstUrn) {
    dstUrn.collateral = dstUrn.collateral.plus(dink);
    dstUrn.debt = dstUrn.debt.plus(dart);
    dstUrn.save();
  }
}

export function handleGrab(event: LogNote): void {
  assertSignature(event, VAT_GRAB_FUNCTION_SIG);

  let tuple = dsLogDataToTuple(event.params.data, "(bytes32,address,address,address,int256,int256)");

  let u = tuple[1].toAddress();
  let dink = tuple[4].toBigInt();
  let dart = tuple[5].toBigInt();

  let urn = Urn.load(u);
  if (!urn) {
    // this urn does not have a corresponding cdp
    return;
  }

  urn.collateral = urn.collateral.plus(dink);
  urn.debt = urn.debt.plus(dart);
  urn.save();
}
