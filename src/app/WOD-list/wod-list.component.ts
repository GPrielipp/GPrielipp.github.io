import { Component, OnDestroy, OnInit } from "@angular/core";
import { WOD } from "../wod.model";
import { WODService } from "../wod.service";
import { Router } from "@angular/router";
import { getJSDocProtectedTag } from "typescript";


@Component({
  templateUrl: './wod-list.component.html',
  selector: 'app-wod-list',
  styleUrls: ['./wod-list.component.css']
})
export class WODListComponent implements OnInit{
  wods: WOD[] = [];

  constructor(private service: WODService, private router: Router){}

  ngOnInit() {
    this.service.emitter.subscribe((wod) => {
      this.wods.push(wod);
      this.wods.sort((a: WOD, b: WOD) => {
        return new Date(a.date_created).getTime() - new Date(b.date_created).getTime();
      })
    });
    this.service.deleter.subscribe((wods: WOD[]) => {
      this.wods = wods;
    });
    this.service.getWodsOnStart().then((wods) => {
      this.wods = wods;
    });
  }

  editWOD(wod: WOD) {
    // console.log("Routing")
    this.service.toUpdate(wod);
    this.router.navigateByUrl("update");
  }

  deleteWOD(wod: WOD) {
    // alert("Are you sure you want to do this?");
    if (confirm("Proceed with removing '" + wod.title + "'?")) {
      this.service.deleteWOD(wod);
      alert("Successfully deleted '" + wod.title + "'");
    }
  }

  copyStringToClipboard (str) {
    // Create new element
    var el = document.createElement('textarea');
    // Set value (string to be copied)
    el.value = str;
    // Set non-editable to avoid focus and move outside of view
    el.setAttribute('readonly', '');
    // el.style = {position: 'absolute', left: '-9999px'}; // Compiler complains that style is a read-only value
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    // Select text inside element
    el.select();
    // Copy text to clipboard
    document.execCommand('copy');
    // Remove temporary element
    document.body.removeChild(el);
 }


  copy(activites, wodId) {
    let str2cpy = activites.join("\n");
    this.copyStringToClipboard(str2cpy);
    this.toggle(wodId);

    let tooltip = document.body.querySelector("#"+wodId+" .tooltiptext#myTooltip");
    tooltip.textContent = "Copied text!";
    window.setTimeout(()=> {
      tooltip.textContent = "Copy to clipboard";
    }, 500);
  }

  toggle = function (wodId) {
    let curWodToggleable = document.body.querySelector("#"+wodId+" .toggleable"); // get the toggleable wod
    curWodToggleable.classList.toggle("hidden");

    let openWods = document.body.querySelectorAll(".toggleable");
    openWods.forEach((el) => {
      if (el.className == "toggleable" && el != curWodToggleable) {
        if (el.classList.contains("hidden"))
          return;
        else {
          el.classList.add("hidden");
          el.parentElement.classList.remove("default-open-wod");
        }
      }
    });



    let color = "palegreen";

    let curWod = document.body.querySelector("#"+wodId);
    curWod.classList.toggle("default-open-wod");

  }
}
