import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TrackRating, EmptyTrackRating} from '../whapl/whapl';

@Component({
  selector: 'lfmMaster',
  templateUrl: './lfm-master.component.html',
  styleUrls: ['./lfm-master.component.css']
})
export class lfmMasterComponent implements OnInit {
  @Input() myTracks: TrackRating[];
  @Input() selectedItemIndex: number;
  @Output() itemIndexSelected = new EventEmitter<number>();

  constructor(private http: HttpClient) {
  }

  SetSelectedIndex(value: number) {
    //console.log( 'SetSelectedIndex - Start')
    this.selectedItemIndex = value;
    //console.log( 'SetSelectedIndex - selectedItemIndex set to ' + value)
    this.itemIndexSelected.emit(value);
    //console.log( 'SetSelectedIndex - itemIndexSelected amitted with ' + value)
    //console.log( 'SetSelectedIndex - Einde')
  }

  ngOnInit() {
  }

}