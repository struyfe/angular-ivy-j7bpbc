export interface TrackRating {
  artist: string;
  title: string;
  album: string;
  rating: number;
  genre: string;
  jaar: number;
  source: string;
  created: string;
  updated: string;
  ratingID: number;
  trackID: number;
  artistID: number;
}

export const EmptyTrackRating: TrackRating = {
  artist: '',
  title: '',
  album: '',
  rating: -1,
  genre: '',
  jaar: 0,
  source: '',
  created: '',
  updated: '',
  ratingID: -1,
  trackID: -1,
  artistID: -1,
};