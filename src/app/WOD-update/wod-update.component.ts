import { Component, OnInit, APP_INITIALIZER } from "@angular/core";
import { WODService } from "../wod.service";
import { WOD } from "../wod.model";
import { Router } from "@angular/router";


@Component({
  selector: "app-wod-update",
  templateUrl: "./wod-update.component.html",
  styleUrls: ["./wod-update.component.css"]
})
export class WODUpdateComponent implements OnInit{
  title;
  activities;
  activitiesarr;
  user = "George";
  wod: WOD;

  start (wod: WOD) {
    this.wod = wod;
    this.title = wod.title;
    this.activitiesarr = wod.activities;
    this.activities = this.activitiesarr.join("\n");
    this.user = wod.author;
    wod.date_created = Date();
  }

  constructor(private service: WODService, private router: Router){
  }

  ngOnInit() {
    this.service.update.subscribe((wod: WOD) => {
      this.start(wod);
    });
    this.service.getUpdate();
  }

  getactivitystring() {
    return this.activitiesarr.join("\n");
  }


  contains(string, char) {
    for (let i = 0; i < string.length; i++) {
      if (string.charAt(i) == char) {
        return i;
      }
    }
    return -1;
  }

  clean(string: String) {
    let out = "";
    const alpha = "abcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < string.length; i++){
      let char = string.charAt(i);
      if (this.contains(alpha, char.toLowerCase()) != -1) {
        out = out.concat(char);
      }
    }
    let wods = this.service.getWods();
    for (let i = 0; i < wods.length; i++) {
      let wod = wods[i];
      if (wod.id == out) {
        out = out.concat(alpha.charAt(Math.floor(Math.random() * alpha.length)));
        if (Math.floor(Math.random() * 2)) {
          out.charAt(out.length - 1).toUpperCase;
        }
      }
    }
    return out;
  }

  createwod() {
    if (this.title && this.activities) {

    let wod: WOD = {
      title: this.title,
      activities: this.activities.split('\n'),
      // id: this.clean(this.title),
      id: this.wod.id,
      author: this.user,
      date_created: Date()
    }

    this.service.updateWOD(this.wod.id, wod);
    this.title = "";
    this.activities = "";
    alert("Successfully updated the WOD");
    this.router.navigateByUrl('wods');
  } else {
    alert("All fields are required");
  }
  }
}
