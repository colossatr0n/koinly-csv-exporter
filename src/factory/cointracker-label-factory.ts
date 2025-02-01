import { CoinTrackerTag } from "../enum/coin-tracker-tag.enum"
import { KoinlyLabel } from "../enum/koinly-label.enum"

export class CoinTrackerLabelFactory {
    constructor(){}

    get(label: KoinlyLabel): CoinTrackerTag | undefined {
        switch (label) {
            case KoinlyLabel.GIFT:
                return CoinTrackerTag.GIFT
            case KoinlyLabel.LOST:
                return CoinTrackerTag.LOST
            case KoinlyLabel.FORK:
                return CoinTrackerTag.FORK
            case KoinlyLabel.AIRDROP:
                return CoinTrackerTag.AIRDROP
            case KoinlyLabel.MINING:
                return CoinTrackerTag.MINED
            case KoinlyLabel.STAKING:
                return CoinTrackerTag.STAKED
            default:
                undefined;
        }
    }
}