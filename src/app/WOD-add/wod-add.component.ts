import { Component } from "@angular/core";
import { WOD } from "../wod.model";
import { WODService } from "../wod.service";

@Component({
  selector: "app-wod-add",
  templateUrl: "./wod-add.component.html",
  styleUrls: ["./wod-add.component.css"]
})
export class WODAddComponent{

  title;
  activities;
  user;

  constructor(private service: WODService){
    this.user = this.service.user;
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
      id: this.clean(this.title),
      author: this.user,
      date_created: Date()
    }
    this.service.postWOD(wod);
    this.title = "";
    this.activities = "";
    alert("Successfully added a new WOD");
  } else {
    alert("All fields are required");
  }
  }
}
