import {
  Component,
  OnInit,
  TemplateRef,
  HostListener,
  AfterViewInit,
  ViewChild,
  ElementRef
} from "@angular/core";
import { CampaignCenterService } from "../../services/campaigncenter.service";
import { ActivatedRoute, Router } from "@angular/router";
import {
  BsModalService,
  BsModalRef
} from "../../../../node_modules/ngx-bootstrap";
import { fadeIn } from "../../shared/animation";
import { interval } from "rxjs";
var indexPositionElement = 0;
@Component({
  selector: "app-winner-bowling",
  templateUrl: "./winner-bowling.component.html",
  styleUrls: ["./winner-bowling.component.scss"],
  animations: [fadeIn]
})
export class WinnerBowlingComponent implements OnInit, AfterViewInit {
  @ViewChild("whisky", { static: true }) whisky: ElementRef;
  @ViewChild("initCtnwhisky", { static: true }) initCtnwhisky: ElementRef;

  whiskyInitPosition: number;
  whiskyInitLateralPosition: number;
  whiskyInitContentPosition: number;
  whiskyInitContentLateralPosition: number;
  lateralPositionElement: string;
  modalRef: BsModalRef;
  weeklyEntries: number;
  entry: string;
  spinStyle: string;
  bowlingStyle: string;
  wiskyStyle: string;
  playbtnStyle: string;
  contentBoxStyle: string;
  oneTimeonly: number;
  animationPlay;
  powers;
  isPlayed: boolean;
  bowlingctnStyle: string;
  howtoplayStyle: string;
  winnerctnStyle: string;

  prizesJackdanielsWin: string;

  constructor(
    private campaignCenterService: CampaignCenterService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: BsModalService
  ) {}

  ngOnInit() {
    this.winnerctnStyle = "displaynone";
    this.oneTimeonly = 0;
    // this.campaignCenterService.footerSecondary = false;
    this.bowlingStyle = "drag-boundary";
    this.powers = ["powerSlow", "powerRegular", "powerAdvance"];

    this.prizesJackdanielsWin = this.campaignCenterService.prizesJackdanielsWin;

    this.isPlayed = false;
  }
  public ngAfterViewInit() {}
  @HostListener("window:resize", [])
  onWindowResize() {
    window.scroll(0, 0);
  }
  openModal(template: TemplateRef<any>, size = "lg") {
    let modalCss = { class: "modal-dialog-centered modal-" + size };
    this.modalRef = this.modalService.show(template, modalCss);
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
  onPlay(index) {
    this.bowlingStyle = "notdrag-boundary ";
    this.wiskyStyle = this.powers[index - 1] + this.lateralPositionElement;

    setTimeout(() => {
      this.bowlingctnStyle = "displaynone";
      this.winnerctnStyle = "displayblock animated fadeIn";
      // this.campaignCenterService.footerSecondary = true;
    }, 2500);
  }
  gotit() {
    this.howtoplayStyle = "displaynone";
  }

  onDragStarted(e) {
    if (!this.whiskyInitPosition && !this.whiskyInitLateralPosition) {
      this.whiskyInitPosition = this.whisky.nativeElement.getBoundingClientRect().y;
      this.whiskyInitLateralPosition = this.whisky.nativeElement.getBoundingClientRect().x;

      this.whiskyInitContentPosition = this.initCtnwhisky.nativeElement.getBoundingClientRect().y;
      this.whiskyInitContentLateralPosition = this.initCtnwhisky.nativeElement.getBoundingClientRect().x;
    }
  }

  onDragEnded(e) {
    let element = e.source.getRootElement();
    let boundingClientRect = element.getBoundingClientRect();

    if (!this.isPlayed) {
      this.typePower(boundingClientRect.y);
      this.getPositionLateral(boundingClientRect.x);
      if (indexPositionElement > 0) {
        this.isPlayed = true;
        // this.bowlingStyle = "notdrag-boundary";
        this.onPlay(indexPositionElement);
      }
    }
  }

  typePower(yPosition) {
    console.log("======================== TYPE POWER");
    let partOfThePosition =
      (this.whiskyInitPosition - this.whiskyInitContentPosition) / 3;
    // console.log("yPosition = ", yPosition);
    // console.log("this.whiskyInitPosition = ", this.whiskyInitPosition);
    // console.log('this.whiskyInitPosition - this.whiskyInitContentPosition  = ', this.whiskyInitPosition - this.whiskyInitContentPosition );
    // console.log('partOfThePosition = ', partOfThePosition);

    if (
      yPosition < this.whiskyInitPosition &&
      yPosition > this.whiskyInitPosition - partOfThePosition * 1
    ) {
      indexPositionElement = 1;
    } else if (
      yPosition < this.whiskyInitPosition &&
      yPosition > this.whiskyInitPosition - partOfThePosition * 2
    ) {
      indexPositionElement = 2;
    } else if (
      yPosition < this.whiskyInitPosition &&
      yPosition > this.whiskyInitPosition - partOfThePosition * 3 - 50
    ) {
      indexPositionElement = 3;
    } else {
      indexPositionElement = 0;
    }
    console.log("indexPositionElement = ", indexPositionElement);

    console.log("========================");
  }

  getPositionLateral(xPosition) {
    let partOfThePosition =
      (this.whiskyInitLateralPosition - this.whiskyInitContentLateralPosition) /
      3;
    let numberPosition = "";
    console.log("xPosition = ", xPosition);
    console.log(
      "this.whiskyInitLateralPosition = ",
      this.whiskyInitLateralPosition
    );

    console.log("partOfThePosition = ", partOfThePosition);

    // console.log(this.whiskyInitLateralPosition + (partOfThePosition * 3) - 50)
    // console.log(this.whiskyInitLateralPosition + (partOfThePosition * 2))
    // console.log(this.whiskyInitLateralPosition + (partOfThePosition * 1))

    if (
      xPosition < this.whiskyInitLateralPosition &&
      xPosition > this.whiskyInitLateralPosition - partOfThePosition * 1
    ) {
      numberPosition = "1";
    } else if (
      xPosition < this.whiskyInitLateralPosition &&
      xPosition > this.whiskyInitLateralPosition - partOfThePosition * 2
    ) {
      numberPosition = "2";
    } else if (
      xPosition <= this.whiskyInitLateralPosition &&
      xPosition >= this.whiskyInitLateralPosition - partOfThePosition * 3 - 70
    ) {
      numberPosition = "3";
    } else if (
      xPosition > this.whiskyInitLateralPosition &&
      xPosition < this.whiskyInitLateralPosition + partOfThePosition * 1
    ) {
      numberPosition = "1";
    } else if (
      xPosition > this.whiskyInitLateralPosition &&
      xPosition < this.whiskyInitLateralPosition + partOfThePosition * 2
    ) {
      numberPosition = "2";
    } else if (
      xPosition >= this.whiskyInitLateralPosition &&
      xPosition <= this.whiskyInitLateralPosition + partOfThePosition * 3 + 70
    ) {
      numberPosition = "3";
    }

    console.log(
      "xPosition >= this.whiskyInitLateralPosition  = ",
      xPosition >= this.whiskyInitLateralPosition
    );

    this.lateralPositionElement =
      xPosition == this.whiskyInitLateralPosition
        ? ""
        : xPosition > this.whiskyInitLateralPosition
        ? "Right"
        : "Left";
    this.lateralPositionElement = this.lateralPositionElement + numberPosition;
    console.log("numberPosition = ", numberPosition);
    console.log("this.lateralPositionElement = ", this.lateralPositionElement);
  }
}
