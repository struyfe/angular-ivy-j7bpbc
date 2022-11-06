import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'topBar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent implements OnInit {

  @Input()  RefreshTime : Date = new Date( Date.now());
  @Output() ActionRequested = new EventEmitter<string>();
  lastActionRequested: string = "";
  
  constructor() { }

  ngOnInit() {
  }

  FormatTitleBarInfo() {
    var nsec : number = (this.RefreshTime.valueOf() - Date.now().valueOf())/1000;
    var	sInfo = "refresh in " + nsec.toFixed(0) + " sec";
		return sInfo;
	}

  RequestAction(value: string) {
    console.log( 'RequestAction - Start')
    this.lastActionRequested = value;
    //console.log( 'RequestAction - selectedItemIndex set to ' + value)
    this.ActionRequested.emit(value);
    console.log( 'RequestAction - itemIndexSelected amitted with ' + value)
    console.log( 'RequestAction - Einde')
  }

}