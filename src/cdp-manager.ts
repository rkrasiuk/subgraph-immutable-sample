import { BigInt } from "@graphprotocol/graph-ts";
import { CDPManager as CDPManagerContract, LogNote, NewCdp } from "../generated/CDPManager/CDPManager";
import { Cdp, Urn } from "../generated/schema";
import { bigIntToBytes, dsLogDataToTuple } from "./utils";

const CDP_MANAGER_GIVE_FUNCTION_SIG = "0xfcafcc68";

export function handleLogNote(event: LogNote): void {
  if (event.params.sig.toHexString() == CDP_MANAGER_GIVE_FUNCTION_SIG) {
    let tuple = dsLogDataToTuple(event.params.data, "(uint256,address)");

    let cdpId = tuple[0].toBigInt();
    let newOwner = tuple[1].toAddress();

    let cdp = Cdp.load(bigIntToBytes(cdpId))!;
    cdp.owner = newOwner;
    cdp.save();
  }
}

export function handleNewCdp(event: NewCdp): void {
  let manager = CDPManagerContract.bind(event.address);
  let u = manager.urns(event.params.cdp);

  let cdp = new Cdp(bigIntToBytes(event.params.cdp));
  cdp.num = event.params.cdp;
  cdp.creator = event.params.usr;
  cdp.owner = event.params.usr;
  cdp.save();

  let urn = new Urn(u);
  urn.collateral = BigInt.fromI32(0);
  urn.debt = BigInt.fromI32(0);
  urn.cdp = cdp.id;
  urn.save();
}
