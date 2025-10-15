import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  Input,
} from "@angular/core";
import { CampaignCenterService } from "../../services/campaigncenter.service";
import { ActivatedRoute, Router } from "@angular/router";
import {
  BsModalService,
  BsModalRef,
} from "../../../../node_modules/ngx-bootstrap";
import { fadeIn } from "../../shared/animation";

@Component({
  selector: "app-winner-simple",
  templateUrl: "./winner-simple.component.html",
  styleUrls: ["./winner-simple.component.scss"],
  animations: [fadeIn],
})
export class WinnerSimpleComponent implements OnInit {
  modalRef: BsModalRef;
  entry: string;
  weeklyEntries: number;
  giftsExhausted: boolean;
  prizeInfo: string;
  prizeInfoName: string;
  prizeInfoRetailer: string;
  prizeInfoRetailerFrontend: string;
  showContainerAnimation: boolean;
  showGift: boolean;

  constructor(
    private campaignCenterService: CampaignCenterService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: BsModalService
  ) {}

  ngOnInit() {
    this.showContainerAnimation = true;
    this.showGift = false;
    this.weeklyEntries = this.campaignCenterService.weeklyEntry;
    this.giftsExhausted = this.campaignCenterService.giftsExhausted;
    if (this.weeklyEntries === 1) {
      this.entry = "entry";
    } else {
      this.entry = "entries";
    }
    if (
      this.campaignCenterService.prizeInfo &&
      this.campaignCenterService.prizeInfoName
    ) {
      this.prizeInfo = this.campaignCenterService.prizeInfo;
      this.prizeInfoName = this.campaignCenterService.prizeInfoName;
      this.prizeInfoRetailer = this.campaignCenterService.prizeInfoRetailer;
      this.prizeInfoRetailerFrontend =
        this.campaignCenterService.prizeInfoRetailerFrontend;
    }
  }
  onClickHere() {
    this.showGift = true;
    setTimeout(() => {
      this.showContainerAnimation = false;
    }, 4000);
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
    this.campaignCenterService.pubid = "";
    this.campaignCenterService.prizeInfo = "";
    this.campaignCenterService.prizeInfoName = "";
    this.campaignCenterService.prizeInfoRetailer = "";
    this.router.navigate(["/home"], { relativeTo: this.route });
  }

  getText() {
    if (this.campaignCenterService.companyId == "894") {
      return `To collect your prize, please visit the Customer Service Desk near Big W.`;
    } else if (this.campaignCenterService.companyId == "382") {
      return `To collect your prize, please visit the Customer Service Desk located opposite Cotton On Kids.`;
    } else if (this.campaignCenterService.companyId == "480") {
      return `To collect your prize, please visit the Customer Service Desk near Surf Dive n Ski.`;
    }
  }

  getText2() {
    if (this.campaignCenterService.companyId == "894") {
      return `Plus, you’re in the draw to win a $10,000 Shopping Spree or a $1,000 Caneland Central Gift Card.*`;
    } else if (this.campaignCenterService.companyId == "382") {
      return `Plus, you’re in the draw to win a $10,000 Shopping Spree or one of 2 x $500 Erina Fair Gift Cards.*`;
    } else if (this.campaignCenterService.companyId == "480") {
      return `Plus, you’re in the draw to win a $10,000 Shopping Spree or one of 2 x $500 Smithfield Shopping Centre Gift Cards.*`;
    }
  }
}
