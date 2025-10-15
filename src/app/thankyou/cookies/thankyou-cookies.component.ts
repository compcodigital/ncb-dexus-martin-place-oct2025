import {
  Component,
  ElementRef,
  OnInit,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { CampaignCenterService } from "../../services/campaigncenter.service";
import { ActivatedRoute, Router } from "@angular/router";
import { BsModalService, BsModalRef } from "ngx-bootstrap";
import { fadeIn } from "../../shared/animation";

@Component({
  selector: "app-thankyou-cookies",
  templateUrl: "./thankyou-cookies.component.html",
  styleUrls: ["./thankyou-cookies.component.scss"],
  animations: [fadeIn],
})
export class ThankyouCookiesComponent implements OnInit {
  website: any;
  modalRef: BsModalRef;
  weeklyEntries: number;
  entry: string;
  src: string;
  srcWidth: string;
  displayStyle: string;
  boxStyleBtn: string;
  clickStyle: string;
  status: boolean;
  srcGif: string;
  showImg: string;
  showGif: string;
  giftsExhausted: boolean;
  @ViewChild("participat", { static: false }) template: TemplateRef<any>;
  @ViewChild("video", { static: false }) video: ElementRef;

  constructor(
    public campaignCenterService: CampaignCenterService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: BsModalService
  ) {}

  ngOnInit() {
    this.weeklyEntries = this.campaignCenterService.weeklyEntry;

    if (window.innerWidth < 1024) {
      this.src = "./assets/img/animation.png";
      this.srcGif = "./assets/img/animation.gif";
      this.showGif = "displaynone";
    } else {
      this.src = "./assets/img/animation.png";
      this.srcGif = "./assets/img/animation.gif";
      this.showGif = "displaynone";
    }
    this.status = false;
    this.displayStyle = "displaynone";
    setTimeout(() => {
      this.giftsExhausted = this.campaignCenterService.giftsExhausted;
      console.log(
        "this.campaignCenterService.giftsExhausted = ",
        this.campaignCenterService.giftsExhausted
      );
      this.opengift();
    }, 1500);
  }
  openModal(template: TemplateRef<any>, size = "lg") {
    let modalCss = { class: "modal-dialog-centered modal-" + size };
    this.modalRef = this.modalService.show(template, modalCss);
  }

  opengift() {
    console.log("openfunction");
    if (this.status === false) {
      console.log("open cookies");
      this.showGif = "";
      this.boxStyleBtn = "displaynone";

      // this.video.nativeElement.play();
      // this.video.nativeElement.src= `./assets/img/cookies/Fridge.mp4`;

      if (window.innerWidth < 1024) {
        this.showGif = "";
        this.showImg = "displaynone";
        // this.src = "../../../assets/img/cookies/Fridge-v3.gif";
      } else {
        this.showGif = "";
        this.showImg = "displaynone";
        // this.src = "../../../assets/img/cookies/Fridge-v3.gif";
      }
      this.status = true;
      setTimeout(() => {
        if (this.status === true) {
          // this.src = '../../../assets/img/cookies/Cookiebreak2.png';
          this.clickStyle = "displaynone";
          this.displayStyle = "displayblock animated fadeIn";
        }
      }, 3500);
    }
  }
  anotherCode() {
    if (this.campaignCenterService.pubid) {
      this.router.navigate(["/entercode"], { relativeTo: this.route });
    }
  }
  onDone() {
    // clear up
    localStorage.removeItem("prize_info");
    localStorage.removeItem("prize_info_name");
    localStorage.removeItem("prize_info_retailer");
    this.campaignCenterService.pubid = "";
    this.router.navigate(["/home"], { relativeTo: this.route });
  }
}
