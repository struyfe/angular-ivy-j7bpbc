export interface ilfmTrackArtist {
  "#text": string;
}
export interface ilfmTrackAlbum {
  "#text": string;
}
export interface ilfmTrack {
  artist: ilfmTrackArtist;
  name: string;
  album: ilfmTrackAlbum;
  date: string;
}
export interface ilfmRecentTracks {
  track: ilfmTrack[];
}
export interface ilfmRecentTracksResponse {
  recenttracks: ilfmRecentTracks;
}

