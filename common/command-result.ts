export enum PassResult {
    Success,
    NotCurrentPlayer,
}

export enum ExchangeResult {
    Success,
    NotCurrentPlayer,
    NotInEasel,
    NotEnoughInReserve,
}

export enum ReserveResult {
    Success,
    NotCurrentPlayer,
    NotInDebugMode,
}
