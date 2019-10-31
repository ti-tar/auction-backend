import { Bid } from '../entities/bid';

export const getWinnersBid = (bids: Bid[] | null): Bid | undefined => {
  if (!bids) {
    return undefined;
  }
  const arr: number[] = bids.map(b => b.proposedPrice);
  const maxPrice = Math.max(...arr);
  return bids.find(b => b.proposedPrice === maxPrice);
};
