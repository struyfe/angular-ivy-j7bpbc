import { Component, VERSION } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ilfmTrack } from './lastfm/lastfm';
import { ilfmRecentTracks } from './lastfm/lastfm';
import { ilfmRecentTracksResponse } from './lastfm/lastfm';
import { TrackRating, EmptyTrackRating} from './whapl/whapl';

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
  selectedIndex: number = 0;
  AutoRefreshEnabled : boolean = false;
  //countdown seconden tot refresh
  myInterval : any;
  tsRefreshTime : Date = new Date( Date.now());
  tsNow : Date = new Date( Date.now());
  //Autopause
  AutoRefreshPauseCheck : string = "";                      // bevat concat van artisi & title
  AutoRefreshPaused : boolean = false;
  AutoRefreshDT : Date = new Date( Date.now());             // wordt geïnitialiseerd in constructor

  constructor(private http: HttpClient) {
    //console.log(this.constructor.name+'.constructor - Start');
    this.SetAutoRefresh( this.AutoRefreshEnabled);
    this.Refresh();
    //console.log(this.constructor.name+'.constructor - Einde');
  }

  SetAutoRefresh( bValueToSet){
    //console.log(this.constructor.name+'.SetAutoRefresh - Start');
    console.log(this.constructor.name+'.SetAutoRefresh. bValueToSet:' + bValueToSet);
    if (bValueToSet)
    { //timer moet opgezet worden.  Is er al timer gezet?  Zo ja, disable
      if (this.myInterval == null) clearInterval(this.myInterval);
      this.tsRefreshTime = new Date( Date.now());
      this.tsRefreshTime.setSeconds( this.tsRefreshTime.getSeconds() + 30);
      this.myInterval = setInterval( () => this.CountdownFunc(), 1000);
      console.log(this.constructor.name+'.SetAutoRefresh. Refresh in 30 seconds at '+this.tsRefreshTime.toLocaleString('nl-BE', { hour:'numeric', minute:'numeric', second:'numeric' }));
    }
    else
    { //timer moet afgezet worden.  Is er al timer gezet?
      if (this.myInterval == null)  //intentionally used == tocheck for both null and undefined
      { //er is nog geen timer --> gewoon laten zoals het is
      }
      else
      { //er is al timer --> af zetten
        clearInterval(this.myInterval);
        console.log(this.constructor.name+'.SetAutoRefresh. Refresh disbaled');
      }
    }
    this.AutoRefreshEnabled = bValueToSet;
    //console.log(this.constructor.name+'.SetAutoRefresh - Einde');
  }
  CountdownFunc(){
    //console.log('CountdownFunc - Start');
    this.tsNow = new Date( Date.now());
    //console.log( this);
    //console.log( this.tsRefreshTime);
    //console.log( 'CountdownFunc - ' + this.tsNow);
    if ( !this.AutoRefreshPaused && (this.tsNow >= this.tsRefreshTime)) {
      //Time to refresh
      //console.log('CountdownFunc - Time to refresh');
      this.tsRefreshTime.setSeconds( this.tsRefreshTime.getSeconds() + 30);
      this.Refresh();
    }
    //console.log('CountdownFunc - Einde');
  }

  SelectTrack( nIndex: number){
    //console.log(this.constructor.name+'.SelectTrack - Start');
    //console.log(this.constructor.name+'.SelectTrack - nIndex='+nIndex);
    this.selectedIndex = nIndex;
    console.log(this.constructor.name+'.SelectTrack - about to set selectedTrack='+nIndex+':'+this.tracks[nIndex].title);
    this.selectedTrack = this.tracks[nIndex];
    //console.log(this.constructor.name+'.SelectTrack - Einde');
  }
  Refresh() {
    //console.log(this.constructor.name+'.'+'Refresh - Start');

    //console.log(this.constructor.name+'.'+'Refresh - lfm.GetRecenTracks');
    const req = this.http.get<any>(
      'https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=absquedubio&limit=20&page=1&format=json&api_key=859abce6405ff2cc9900685142051add'
    );

    req.subscribe((response) => {
      //console.log('subscribe op LFM.getrecenttracks triggered');
      this.lastfmresponse = response;
      this.ParseLFMGetRecentTracks();
    });
    //console.log('Refresh - Einde');
  }

  ParseLFMGetRecentTracks() {
    //console.log(this.constructor.name+'.ParseLFMGetRecentTracks - Start');
    var arrTracks: TrackRating[] = [];
    var objTrack: ilfmTrack;
    var i: number = 0;

    //copieer info van response naar this.tracks
    console.log( this.constructor.name+'.ParseLFMGetRecentTracks (<<< Refresh). #tracks:' + this.lastfmresponse.recenttracks.track.length);
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

      const strUrl =
        'https://absquedubio.org/whapl/LookupTrack.php?' +
        'artist=' + encodeURI(aTrack.artist) +
        '&title=' + encodeURI(aTrack.title) +
        '&key='+i;
      const req2 = this.http.get<any>(strUrl);

      req2.subscribe((response) => {
        //console.log('subscribe op WPL.LookupTrack triggered');
        //console.log('response WPL.LookupTrack: ');
        //console.log(response);
        this.ParseWPLLookupTrack(response);
      });

      i +=1;

    }
    this.tracks = arrTracks;

    //console.log('this.tracks.length:' + this.tracks.length);
    if (this.tracks.length >= 1) {
      this.SelectTrack(0);
    } else {
      this.selectedTrack = EmptyTrackRating;
    }

    if (this.AutoRefreshEnabled)
      if (this.AutoRefreshPauseCheck == (this.selectedTrack.title + this.selectedTrack.artist))
      {
        //zelfde track als vorige keer --> check of tijd voor autopause
        var dtNow = new Date( Date.now());
        this.AutoRefreshPaused = (dtNow >= this.AutoRefreshDT);
        var nMinuten : number = Math.floor((this.AutoRefreshDT.valueOf() - dtNow.valueOf())/1000/60);
        var nSeconden : number = (this.AutoRefreshDT.valueOf() - dtNow.valueOf())/1000 - 60*nMinuten;
        console.log('ParseLFMGetRecentTracks - autopause op ' + this.AutoRefreshDT.toLocaleString('nl-BE', { hour:'numeric', minute:'numeric', second:'numeric' }) + ' over ' + nMinuten.toLocaleString( undefined, { maximumFractionDigits: 0 }) + ':' + nSeconden.toLocaleString( undefined, { minimumIntegerDigits: 2, maximumFractionDigits: 0 }) + ' minuten' + ' ('+ dtNow.toLocaleString('nl-BE', { hour:'numeric', minute:'numeric', second:'numeric' }) + ').  AutoRefreshPaused=' + this.AutoRefreshPaused);
      }
      else
      {
        //ander nummer --> schuif tijd voor autopause op
        this.AutoRefreshPaused = false;
        var dtNow = new Date( Date.now());
        this.AutoRefreshDT = dtNow;
        this.AutoRefreshDT.setMinutes( dtNow.getMinutes() + 15);
        this.AutoRefreshPauseCheck = this.selectedTrack.title + this.selectedTrack.artist;
        console.log('ParseLFMGetRecentTracks - autopause verschoven naar ' + this.AutoRefreshDT.toLocaleString('nl-BE', { hour:'numeric', minute:'numeric', second:'numeric' }));
      }

    //console.log(this.constructor.name+'.ParseLFMGetRecentTracks - Einde');
  }

  ParseWPLLookupTrack(response: any) {
    //console.log(this.constructor.name+'.ParseWPLLookupTrack - Start');
    console.log(this.constructor.name+'.ParseWPLLookupTrack '+response.key+': '+response.artist+'-'+response.title);

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
    this.tracks[key].source = response.source;
    this.tracks[key].created = response.created;
    this.tracks[key].updated = response.updated;

    //console.log(this.constructor.name+'.ParseWPLLookupTrack - Einde');
  }

  ExecuteAction( sAction: string)
  {
    //console.log(this.constructor.name+'.ExecuteAction - Start');
    console.log(this.constructor.name+'.ExecuteAction. Action:' + sAction);
    switch(sAction) {
      case "refresh":
        this.Refresh();
        break;
      default:
        //nothing
    } 
    //console.log(this.constructor.name+'.ExecuteAction - Einde');
  }
}


