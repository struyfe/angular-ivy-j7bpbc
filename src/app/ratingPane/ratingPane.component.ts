import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TrackRating, EmptyTrackRating} from '../whapl/whapl';
import { myEncodeURI, ComparableString} from '../helpers/helpers';


@Component({
  selector: 'ratingPane',
  templateUrl: './ratingPane.component.html',
  styleUrls: ['./ratingPane.component.css']
})
export class RatingPaneComponent implements OnChanges {
  @Input() myTrack: TrackRating;
  RatingRecentJaar : number = 0;
  RatingRecentGenre : string = "";
  iTunesTrackYearReleased : number = 0;
  LastFMTrackYearReleased : number = 0;
  OnSmallScreen : boolean = false;
  colWidthFirst : string = "col-12";
  colWidthSecond : string = "col-12";

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    console.log ("document.body.offsetWidth:" + document.body.offsetWidth);
    if (document.body.offsetWidth <= 400) { // 768px portrait
      this.OnSmallScreen = true;
      this.colWidthFirst = "col-5";
      this.colWidthSecond = "col-7";
    }
    else
    {
      this.OnSmallScreen = true;
      this.colWidthFirst = "col-12";
      this.colWidthSecond = "col-12";
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    // changes.prop contains the old and the new value...
    //console.log( "RatingPaneComponent.ngOnChanges - start");

    const sURI = 
      'https://itunes.apple.com/search?term=' + 
      encodeURI( this.myTrack.artist) + '%20' + 
      encodeURI( this.myTrack.title) +  '&media=music';
    //console.log(this.constructor.name+'.ngOnChanges - iTunes.search: ' + sURI);
    const req = this.http.get<any>( sURI);

    req.subscribe((response) => {
      //console.log('RatingPaneComponent.ngOnChanges - subscribe op iTunes.search triggered');
      //console.log(response);
      if (response.resultCount > 0)
      {
        if (response.results[0].wrapperType = "Track")
        {
          this.iTunesTrackYearReleased = Number( response.results[0].releaseDate.substring(0, 4));
          //this.iTunesTrackTooltip = response.results[0].trackName + " (" + response.results[0].collectionName + ")";
        }
        else
        {
          this.iTunesTrackYearReleased = -1;
          //this.iTunesTrackTooltip = "Track not found";
        }
      }
      else
        {
          this.iTunesTrackYearReleased = -1;
          //this.iTunesTrackTooltip = "Track not found";
        }
    });

    this.LastFMTrackYearReleased=0;
    const sURI2 = 
      'https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=' + 
      myEncodeURI( this.myTrack.artist, 'lastfm') + 
      '&format=json&api_key=859abce6405ff2cc9900685142051add';
    const req2 = this.http.get<any>( sURI2);

    req2.subscribe((response2) => {
      //console.log('subscribe op audioscrobbler.artist.getInfo triggered');
      //console.log(response2);
      if (! ("error" in response2))
      if (typeof response2.artist !== 'undefined')
      if (typeof response2.artist.mbid !== 'undefined') {
        if (response2.artist.mbid !== "")
        {
          const sURI3 = 
          'https://musicbrainz.org/ws/2/release-group?artist='
           + response2.artist.mbid + '&limit=50&fmt=json&api_key=859abce6405ff2cc9900685142051add';
          const req3 = this.http.get<any>( sURI3);
    
          req3.subscribe((response3) => {
            //console.log('subscribe op musicbrainz.releas-groups triggered');
            //console.log(response3);
            response3['release-groups'].sort(function(a, b)
              {
                var aDate = new Date( a['first-release-date']);
                var bDate = new Date(b['first-release-date']);
                if (aDate instanceof Date && !isNaN(aDate.valueOf())) {} else {aDate = new Date( "1900-01-01")};
                if (bDate instanceof Date && !isNaN(bDate.valueOf())) {} else {bDate = new Date( "1900-01-01")};
                //console.log( aDate + " - " + bDate + "-->" + (bDate.getTime() - aDate.getTime()).toString());
                return bDate.getTime() - aDate.getTime();
                //return a['first-release-date']-b['first-release-date']
              });
              // Probeer Jaar te vinden van track
              //console.log("'release-group-count'=" + response['release-group-count']);
              //console.log("this.myTrack.album=" + this.myTrack.album);
              var i:number;
              for (i = 0; i < response3['release-group-count']; i++) {
                if (typeof response3['release-groups'][i] !== "undefined")
                {
                  if (ComparableString(response3['release-groups'][i]['title']).toLowerCase() == ComparableString(this.myTrack.album.toLowerCase()))
                  {
                    //console.log("Hit! Album gevonden " + response3['release-groups'][i]['first-release-date']);
                    this.LastFMTrackYearReleased = parseInt( response3['release-groups'][i]['first-release-date'].substring(0, 4));
                    //$scope.LastFMTrackTooltip = "Album: " + response['release-groups'][i]['title'];
                    if (this.myTrack.jaar==-1 ||this.myTrack.jaar==0 )
                    {
                      this.myTrack.jaar = parseInt( response3['release-groups'][i]['first-release-date'].substring(0, 4));
                    }
                  }
                }
              }
            });
        }
      }
      else
      {

      }
    });
    //console.log( "RatingPaneComponent.ngOnChanges - einde");
  }

  GetStar( nScore: number, nTreshold: number) : string {
    if(nScore>=nTreshold) 
      //return "&#9733;" 
      return "\u2605"     // dit is unicode hexadecimaal
    else 
      //return "&#9734;"  // dit is decimaal
      return "\u2606"     // dit is unicode hexadecimaal
  }

  GetResponsiveWidth() : string {
    const sSmall = "col-12";
    const sLarge = "col-6";
    if (document.body.offsetWidth <= 400)  // 768px portrait
      return sSmall;
    else
      return sLarge;
  }

  RateSelectedTrack(){
    //console.log(this.constructor.name+'.RateSelectedTrack - Start');

		const sURI = "https://absquedubio.org/whapl/RateTrack.php";
		this.RatingRecentGenre=this.myTrack.genre;
		this.RatingRecentJaar=this.myTrack.jaar;
		//console.log( "RateSelectedTrack, artist=>" + this.myTrack.artist + "<");
		//console.log( "RateSelectedTrack, track=>" + this.myTrack.title + "<");
		//console.log( "RateSelectedTrack, rating=" + this.myTrack.rating);
		//console.log( "RateSelectedTrack, track=>" + this.myTrack.genre + "<");
		//console.log( "RateSelectedTrack, rating=" + this.myTrack.jaar);

    const objHeaders = { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' };
    const objParams = {
      'artist': encodeURI( this.myTrack.artist),
      'title': encodeURI( this.myTrack.title),
      'album': encodeURI( this.myTrack.album),
      'genre': encodeURI( this.myTrack.genre),
      'jaar': this.myTrack.jaar,
      'rating': this.myTrack.rating,
      'source': "WhatsPlayim"
    };
    console.log(this.constructor.name+'.RateSelectedTrack - About to rate '+this.myTrack.artist+'-'+this.myTrack.title+' ('+this.myTrack.rating+')');
    const req = this.http.post<any>(
      sURI,
			{},
      { 
        headers: objHeaders ,
        params: objParams 
      }
      );

    req.subscribe((response) => {
      //console.log(this.constructor.name+'.RateSelectedTrack - subscribe op WPL.RateTrack triggered');
      console.log(this.constructor.name+'.RateSelectedTrack - response WPL.RateTrack: ');
      console.log(response);
    });

    //console.log(this.constructor.name+'.RateSelectedTrack - Einde');
  }

  GetCurrentYear = function( iDif: number = 0) {
		var d = new Date();
		var res = d.getFullYear() + iDif
		//console.log( d);
		//console.log( d.getFullYear());
		//console.log( res);
		//console.log( typeof res);
		return res;
	}

}