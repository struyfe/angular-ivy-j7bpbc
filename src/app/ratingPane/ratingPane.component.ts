import { Component, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TrackRating, EmptyTrackRating} from '../whapl/whapl';

@Component({
  selector: 'ratingPane',
  templateUrl: './ratingPane.component.html',
  styleUrls: ['./ratingPane.component.css']
})
export class RatingPaneComponent {
  @Input() myTrack: TrackRating;
  RatingRecentJaar : number = 0;
  RatingRecentGenre : string = "";

  constructor(private http: HttpClient) {
  }

  RateSelectedTrack(){
    console.log('RateSelectedTrack - Start');

		const sURI = "https://absquedubio.org/whapl/RateTrack.php";
		this.RatingRecentGenre=this.myTrack.genre;
		this.RatingRecentJaar=this.myTrack.jaar;
		console.log( "RateSelectedTrack, artist=>" + this.myTrack.artist + "<");
		console.log( "RateSelectedTrack, track=>" + this.myTrack.title + "<");
		console.log( "RateSelectedTrack, rating=" + this.myTrack.rating);
		console.log( "RateSelectedTrack, track=>" + this.myTrack.genre + "<");
		console.log( "RateSelectedTrack, rating=" + this.myTrack.jaar);

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
    const req = this.http.post<any>(
      sURI,
			{},
      { 
        headers: objHeaders ,
        params: objParams 
      }
      );

    req.subscribe((response) => {
      console.log('subscribe op WPL.RateTrack triggered');
      console.log('response WPL.RateTrack: ');
      console.log(response);
    });

    console.log('RateSelectedTrack - Einde');
  }

  GetCurrentYear = function( iDif: number = 0) {
		var d = new Date();
		var res = d.getFullYear() + iDif
		console.log( d);
		console.log( d.getFullYear());
		console.log( res);
		console.log( typeof res);
		return res;
	}

}