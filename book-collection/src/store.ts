import { Review, Rating, ReadingStatus, } from '@sharedTypes/DBTypes';
import { create } from "zustand";

type ReviewWithUsername = Partial<Review & {username: string}>;
type RatingWithUsername = Partial<Rating>;




type ReviewStore = {
  review: ReviewWithUsername[];
  setReview: (review: ReviewWithUsername[]) => void;
};

type RatingStore = {
  rating: RatingWithUsername[];
  setRating: (rating: RatingWithUsername[]) => void;
};

type StatusStore = {
  status: string;
  setStatus: (status: string) => void;
};

type StatusChangeStore = {
  allStatuses: ReadingStatus[];
  setAllStatuses: (status: ReadingStatus[]) => void;
};

export const useStatusChangeStore = create<StatusChangeStore>((set) => ({
  allStatuses: [],
  setAllStatuses: (status) =>
  set(() => ({
    allStatuses: status,
  })),
}));

export const useStatusStore = create<StatusStore>((set) => ({
  status: '',
  setStatus: (status) =>
  set(() => ({
    status: status,
  })),
}));

export const useRatingStore = create<RatingStore>((set) => ({
  rating: [],
  setRating: (rating) =>
  set(() => ({
    rating: rating,
  })),
}));


export const useReviewtStore = create<ReviewStore>((set) => ({
  review: [],
  setReview: (review) =>
  set(() => ({
    review: review,
  })),
}));
