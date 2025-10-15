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
  selector: "app-thankyou-simple",
  templateUrl: "./thankyou-simple.component.html",
  styleUrls: ["./thankyou-simple.component.scss"],
  animations: [fadeIn],
})
export class ThankyouSimpleComponent implements OnInit {
  modalRef: BsModalRef;
  entry: string;
  weeklyEntries: number;
  giftsExhausted: boolean;
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
  }
  onClickHere() {
    this.showGift = true;
    setTimeout(() => {
      this.showContainerAnimation = false;
    }, 5000);
  }
  openModal(template: TemplateRef<any>, size = "lg") {
    let modalCss = { class: "modal-dialog-centered modal-" + size };
    this.modalRef = this.modalService.show(template, modalCss);
  }
  anotherCode() {
    const url = this.campaignCenterService.pubid ? "/entercode" : "/home";
    this.router.navigate([url], { relativeTo: this.route });
  }
  onDone() {
    // clear up
    this.campaignCenterService.pubid = "";
    this.router.navigate(["/home"], { relativeTo: this.route });
  }

  getText() {
    if (this.campaignCenterService.companyId == "894") {
      return `You didn’t win instantly today, but you’re in the draw to win a $10,000 Shopping Spree, plus a chance to win a $1,000 Caneland Central Gift Card.*`;
    } else if (this.campaignCenterService.companyId == "382") {
      return `You’re in the draw to win a $10,000 Shopping Spree or one of 2 x $500 Erina Fair Gift Cards.*`;
    } else if (this.campaignCenterService.companyId == "480") {
      return `You’re in the draw to win a $10,000 Shopping Spree or one of 2 x $500 Smithfield Shopping Centre Gift Cards.*`;
    }
  }
}
