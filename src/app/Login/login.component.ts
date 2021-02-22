import { Component } from "@angular/core";
import { WODService } from "../wod.service";
import { HttpClient } from "@angular/common/http";


@Component({
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent {
  password: String;
  username: String;
  good = "abcdefghijklmnopqrstuvwxyz0123456789_";

  constructor(private service: WODService, private http: HttpClient){}

  valid (arg: String) {
    for (let i = 0; i < arg.length; i++) {
      let char = arg.charAt(i);
      if (!this.good.includes(char.toLowerCase())) {
        return false;
      }
    }
    return true;
  }

  submit() {
    if (this.valid(this.username) && this.valid(this.password)) {
      this.service.login(this.username, this.password);
    }
    this.password = '';
    this.username = '';
  }
}
