import { Component } from "@angular/core";
import { WODService } from "../wod.service";

@Component({
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"]
})
export class RegisterComponent {
  password: String;
  username: String;
  good = "abcdefghijklmnopqrstuvwxyz0123456789_";

  constructor(private service: WODService){}

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
    console.log("Submitting");
    if (this.valid(this.username) && this.valid(this.password)) {
      let goodUsername: boolean = this.service.register(this.username, this.password);
      if (!goodUsername) {
        alert("Invalid username");
      }
    }
    console.log("Submitted");
    this.password = '';
    this.username = '';
  }
}
