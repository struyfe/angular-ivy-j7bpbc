import { Component, VERSION } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ilfmTrack } from './lastfm/lastfm';
import { ilfmRecentTracks } from './lastfm/lastfm';
import { ilfmRecentTracksResponse } from './lastfm/lastfm';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  lastfmresponse: ilfmRecentTracksResponse = {
    recenttracks: {
      track: [
        {
          artist: { '#text': '' },
          name: '1',
          album: { '#text': '' },
          date: '1',
        },
      ],
    },
  };
  tracks: TrackRating[];
  selectedTrack: TrackRating = EmptyTrackRating;

  constructor(private http: HttpClient) {
    this.Refresh();
  }

  Refresh() {
    console.log('Refresh - Start');
    const req = this.http.get<any>(
      'https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=absquedubio&limit=20&page=1&format=json&api_key=859abce6405ff2cc9900685142051add'
    );

    req.subscribe((response) => {
      console.log('subscribe op LFM.getrecenttracks triggered');
      this.lastfmresponse = response;
      this.ParseLFMGetRecentTracks();
    });
    console.log('Refresh - Einde');
  }

  ParseLFMGetRecentTracks() {
    console.log('ParseLFMGetRecentTracks - Start');
    var arrTracks: TrackRating[] = [];
    var objTrack: ilfmTrack;
    var i: number;

    //copieer info van response naar this.tracks
    //console.log( "lastfmresponse.recenttracks.track.length:" + this.lastfmresponse.recenttracks.track.length);
    for (objTrack of this.lastfmresponse.recenttracks.track) {
      var sCreated = '';
      if (typeof objTrack.date !== 'undefined')
        sCreated = objTrack.date['#text'];
      var aTrack: TrackRating = {
        artist: objTrack.artist['#text'],
        title: objTrack.name,
        album: objTrack.album['#text'],
        rating: -1,
        genre: '',
        jaar: 0,
        source: '',
        created: sCreated,
        updated: '',
        ratingID: -1,
        trackID: -1,
        artistID: -1,
      };
      //console.log(aTrack);
      arrTracks.push(aTrack);
      //console.log( "arrTracks.length:" + arrTracks.length);
    }
    this.tracks = arrTracks;

    console.log('this.tracks.length:' + this.tracks.length);
    if (this.tracks.length >= 1) {
      this.selectedTrack = this.tracks[0];
      console.log('selected track to lookup: ');
      console.log(this.selectedTrack);

      const strUrl =
        'https://absquedubio.org/whapl/LookupTrack.php?' +
        'artist=' +
        encodeURI(this.selectedTrack.artist) +
        '&title=' +
        encodeURI(this.selectedTrack.title) +
        '&key=0';
      const req2 = this.http.get<any>(strUrl);

      req2.subscribe((response) => {
        console.log('subscribe op WPL.LookupTrack triggered');
        console.log('response WPL.LookupTrack: ');
        console.log(response);
        this.ParseWPLLookupTrack(response);
      });
      this.selectedTrack = this.tracks[0];
    } else {
      this.selectedTrack = EmptyTrackRating;
    }
    console.log('ParseLFMGetRecentTracks - Einde');
  }

  ParseWPLLookupTrack(response: any) {
    console.log('ParseWPLLookupTrack - Start');

    const key = response.key; //truukje om index nog te kennen (async!)
    if (response.rating != '')
      this.tracks[key].rating = parseInt(response.rating);
    else this.tracks[key].rating = 0;
    if (response.album !== '') this.tracks[key].album = response.album;
    this.tracks[key].genre = response.genre;
    if (response.jaar != '') this.tracks[key].jaar = parseInt(response.jaar);
    else this.tracks[key].jaar = 0;
    this.tracks[key].ratingID = response.ratingid;
    this.tracks[key].trackID = response.trackid;
    this.tracks[key].artistID = response.artistid;

    this.selectedTrack = this.tracks[key];
    console.log('ParseWPLLookupTrack - Einde');
  }
}

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
