import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'topBar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent implements OnInit {

  @Input()  RefreshTime : Date = new Date( Date.now());
  @Input()  AutoRefreshEnabled : boolean = false;
  @Output() ActionRequested = new EventEmitter<string>();
  @Output() AutoRefreshToggled = new EventEmitter<boolean>();
  lastActionRequested: string = "";
  
  constructor() { }

  ngOnInit() {
  }

  FormatTitleBarInfo() {
    var	sInfo = "";
    if (this.AutoRefreshEnabled)
    {
      var nsec : number = (this.RefreshTime.valueOf() - Date.now().valueOf())/1000;
      sInfo = "refresh in " + nsec.toFixed(0) + " sec";
    }
    else
      sInfo = "Autorefresh disabled";
		return sInfo;
	}

  RequestAction(value: string) {
    //console.log( this.constructor.name+'.RequestAction - Start')
    this.lastActionRequested = value;
    //console.log( 'RequestAction - lastActionRequested set to ' + value)
    this.ActionRequested.emit(value);
    console.log( this.constructor.name+'.RequestAction - ActionRequested emitted with ' + value)
    //console.log( this.constructor.name+'.RequestAction - Einde')
  }

  ToggleAutoRefresh( value: boolean){
    //console.log( this.constructor.name+'.ToggleAutoRefresh - Start')
    this.AutoRefreshToggled.emit(value);
    console.log( this.constructor.name+'.ToggleAutoRefresh - AutoRefreshToggled emitted with ' + value)
    //console.log( this.constructor.name+'.ToggleAutoRefresh - Einde')
  }

}