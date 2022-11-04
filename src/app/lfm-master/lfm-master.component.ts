import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TrackRating, EmptyTrackRating} from '../whapl/whapl';

@Component({
  selector: 'lfmMaster',
  templateUrl: './lfm-master.component.html',
  styleUrls: ['./lfm-master.component.css']
})
export class lfmMasterComponent implements OnInit {
  @Input() myTracks: TrackRating[];

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
  }

}