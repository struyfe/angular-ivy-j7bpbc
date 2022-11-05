import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'topBar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent implements OnInit {

  @Input()  RefreshTime : Date = new Date( Date.now());
  
  constructor() { }

  ngOnInit() {
  }

  FormatTitleBarInfo() {
    var nsec : number = (this.RefreshTime.valueOf() - Date.now().valueOf())/1000;
    var	sInfo = "refresh in " + nsec.toFixed(0) + " sec";
		return sInfo;
	}

}