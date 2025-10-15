import {
  Component,
  ElementRef,
  OnInit,
  TemplateRef,
  ViewChild,
  Input,
} from "@angular/core";
import { CampaignCenterService } from "../../services/campaigncenter.service";
import { ActivatedRoute, Router } from "@angular/router";
import { BsModalService, BsModalRef } from "ngx-bootstrap";
import { fadeIn } from "../../shared/animation";
@Component({
  selector: "app-winner-cookies",
  templateUrl: "./winner-cookies.component.html",
  styleUrls: ["./winner-cookies.component.scss"],
  animations: [fadeIn],
})
export class WinnerCookiesComponent implements OnInit {
  prizeInfo: string;
  prizeInfoName: string;
  prizeInfoRetailer: string;
  prizeTimeMessages: any = [];
  website: any;
  modalRef: BsModalRef;
  src: string;
  displayStyle: string;
  boxStyleBtn: string;
  clickStyle: string;
  status: boolean;
  srcGif: string;
  showImg: string;
  showGif: string;
  prizeInfoRetailerFrontend: string;

  @ViewChild("participat", { static: false }) template: TemplateRef<any>;
  @ViewChild("video", { static: false }) video: ElementRef;

  constructor(
    public campaignCenterService: CampaignCenterService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: BsModalService
  ) {}

  ngOnInit() {
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

    if (
      this.campaignCenterService.prizeInfo &&
      this.campaignCenterService.prizeInfoName
    ) {
      this.prizeInfo = this.campaignCenterService.prizeInfo;
      this.prizeInfoName = this.campaignCenterService.prizeInfoName;
      this.prizeInfoRetailer = this.campaignCenterService.prizeInfoRetailer;
      this.prizeTimeMessages = this.campaignCenterService.prizeTimeMessages;
      this.prizeInfoRetailerFrontend =
        this.campaignCenterService.prizeInfoRetailerFrontend;
      // console.log('On Winner page, prizeInfo = ' + this.prizeInfo);
      // console.log('On Winner page, prizeInfoName = ' + this.prizeInfoName);
      // console.log('On Winner page, prizeInfoRetailer = ' + this.prizeInfoRetailer);
    }
    setTimeout(() => {
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
      // this.showImage = "displaynone";
      // this.showVideo = "";
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
    this.campaignCenterService.prizeInfo = "";
    this.campaignCenterService.prizeInfoName = "";
    this.campaignCenterService.prizeInfoRetailer = "";
    this.router.navigate(["/home"], { relativeTo: this.route });
  }
}
