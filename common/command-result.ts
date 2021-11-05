export enum PassResult {
    Success,
    NotCurrentPlayer,
}

export enum PlaceResult {
    Success,
    NotCurrentPlayer,
    NotInEasel,
    NotValid,
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
