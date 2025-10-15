import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  AfterViewInit,
  ElementRef,
} from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { CampaignCenterService } from "../services/campaigncenter.service";
import { ErrorMsg } from "../shared/errorMsg";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit, AfterViewInit {
  @ViewChild("video", { static: false }) video: ElementRef;
  @ViewChild("terms", { static: false }) terms: TemplateRef<any>;
  @ViewChild("serverErrorCode", { static: false })
  serverErrorCode: TemplateRef<any>;
  @ViewChild("templateAlreadyEntered", { static: false })
  templateAlreadyEntered: TemplateRef<any>;
  title: string;
  emailStyle: string;
  loadingStyle: string;
  modalRef: BsModalRef;
  emailForm: FormGroup;
  errorMsg = new ErrorMsg();
  twistStyle: string;
  twistStyle1: string;
  twistStyle2: string;
  twistStyle3: string;
  repeatIt: number;
  // phone: number;
  buttonDisabled: boolean; // used to avoid the duplicate submissions
  acc: string; //check auto complete browser
  retailers: any;
  minispend: number;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private modalService: BsModalService,
    public campaignCenterService: CampaignCenterService
  ) {}

  ngOnInit() {
    console.log("Page Home");
    this.campaignCenterService.showFooter = false;
    this.checkAuto();
    this.repeatIt = 0;
    this.title = this.campaignCenterService.campaignTitle;

    this.buttonDisabled = false;
    this.loadingStyle = "displaynone";
    this.initForm();
    // this.phone = this.phone;
    // setInterval(this.recursive, 30000);
    // Apply scroll top on content confirm details
    const elm = document.getElementsByClassName("fit-device")[0];
    elm.scrollTop = 0;
  }

  getIntegerValue(value: number): number {
    return value ? Math.floor(value) : 0;
  }

  checkAuto() {
    if (navigator.userAgent.indexOf("Chrome") !== -1) {
      this.acc = "no";
    } else {
      this.acc = "off";
    }
  }
  public ngAfterViewInit() {
    // this.recursive();
  }

  openModal(template: TemplateRef<any>, size = "lg") {
    let modalCss = { class: "modal-dialog-centered modal-" + size };
    this.modalRef = this.modalService.show(template, modalCss);
    this.getRetailers();
  }

  private initForm() {
    this.emailForm = new FormGroup({
      email: new FormControl("", [
        Validators.required,
        Validators.pattern(
          "^[a-zA-Z0-9_\\-.!#$%&*+-/=?^_{|}~']+@[a-zA-Z0-9\\-]+\\.[a-zA-Z0-9\\-.]+$"
        ),
        Validators.maxLength(250),
      ]),
    });
  }
  recursive() {
    //   //  setTimeout(this.recursive,5000);
    //     this.twistStyle='twist';
    //     this.twistStyle1='twist1';
    //     this.twistStyle2='twist2';
    //     this.twistStyle3='twist3';
    //     // setTimeout(this.repeativeanimation,5000);
    console.log("recursive", this.repeatIt);
    //     this.repeativeanimation();
    //   setInterval(this.repeativeanimation, 50000);
    if (this.repeatIt === 0) {
      this.twistStyle = "txtAnimation twist";
      this.twistStyle1 = "txtAnimation1 twist1";
      this.twistStyle2 = "txtAnimation2 twist2";
      this.twistStyle3 = "txtAnimation3 twist3";
      console.log(this.twistStyle);
      this.repeatIt = 1;
    } else {
      this.twistStyle = "txtAnimation";
      this.twistStyle1 = "txtAnimation1";
      this.twistStyle2 = "txtAnimation2";
      this.twistStyle3 = "txtAnimation3";
      console.log(this.twistStyle);
      this.repeatIt = 0;
    }
    this.recursive();
    setTimeout(this.recursive, 3000);
  }
  //  repeativeanimation(){
  //   this.twistStyle='';
  //   this.twistStyle1='';
  //   this.twistStyle2='';
  //   this.twistStyle3='';
  //   // setTimeout(this.recursive,5000);
  //   // console.log('repeat');
  //   this.recursive();
  //   setInterval(this.recursive, 50000);
  //  }
  onSubmit(email: string) {
    // console.log('button clicked');
    this.errorMsg.message = "";
    this.loadingStyle = "displayinlineblock";
    this.buttonDisabled = true;
    if (this.emailForm.controls.email.status === "INVALID") {
      this.errorMsg.valid = false;
      this.errorMsg.message +=
        "\nUh-oh, looks like an invalid email address was entered.";
      this.errorMsg.type = "email";
      this.emailStyle = "error-msg";
      this.loadingStyle = "displaynone";
      this.buttonDisabled = false;
    } else {
      this.emailStyle = "success-msg";
      this.campaignCenterService.register(email).subscribe(
        (response) => {
          // console.log(response);
          this.campaignCenterService.showFooter = true;

          if (response.pubid) {
            console.log("Already a member");
            this.campaignCenterService.email = email;
            this.campaignCenterService.pubid = response.pubid;
            // this.campaignCenterService.memberAlready=true;
            // this.campaignCenterService.footerSecondary = true;

            this.loadingStyle = "displaynone";
            this.buttonDisabled = false;
            // entryOnly || uniqueCode || spentOnly
            if (
              this.campaignCenterService.campaignType === "uniqueCode" ||
              this.campaignCenterService.campaignType === "spentOnly"
            ) {
              this.router.navigate(["/entercode"], { relativeTo: this.route }); // use it when enter code or spend avaiable
            }
            if (this.campaignCenterService.campaignType === "entryOnly") {
              this.entryOnly(); // use it only enter and thank you page.
            }
          } else {
            console.log("Not a member yet");
            // window.location.href = '/register';
            this.campaignCenterService.email = email;
            // this.campaignCenterService. Secondary = true;
            // this.campaignCenterService.memberAlready=false;

            this.loadingStyle = "displaynone";
            this.buttonDisabled = false;
            this.router.navigate(["/register"], { relativeTo: this.route });
          }
        },
        (error) => {
          console.log(error);
          this.loadingStyle = "displaynone";
          this.buttonDisabled = false;
          this.openModal(this.serverErrorCode, "sm");
        },
        () => {
          console.log("completed");
        }
      );
    }
  }
  entryOnly() {
    this.campaignCenterService.entryOnly().subscribe(
      (response: any) => {
        console.log(response);

        this.loadingStyle = "displaynone";
        this.buttonDisabled = false;
        if (response.error) {
          if (
            response.error.code === "NCB-0013" ||
            response.error.code === "NCB-0026"
          ) {
            // invalid code
            this.openModal(this.templateAlreadyEntered, "sm");
          }
          // } else { // use when you have only thankyou page
          //   this.router.navigate(['/thankyou'], { relativeTo: this.route });
        } else {
          if (response.prize_info) {
            // console.log('enter code page, has prize:');
            // console.log(response1.prize_info);
            if (response.prize_info_name !== null) {
              console.log("winner");
              // localStorage.setItem('prize_info', response.prize_info);
              // localStorage.setItem('purchase_amount', response.prize_info_name);
              // localStorage.setItem(
              //   'prize_info_name',
              //   response.prize_info_name
              // );
              // localStorage.setItem('prize_info_retailer', response1.prize_info_retailer);
              // this.submitted = false;
              this.campaignCenterService.prizeInfo = response.prize_info;
              this.campaignCenterService.prizeInfoName =
                response.prize_info_name;
              this.loadingStyle = "displaynone";
              this.buttonDisabled = false;
              this.router.navigate(["/winner"], { relativeTo: this.route });
            } else {
              console.log("losser");
              this.loadingStyle = "displaynone";
              this.buttonDisabled = false;
              this.router.navigate(["/thankyou"], { relativeTo: this.route });
            }
          } else {
            this.loadingStyle = "displaynone";
            this.buttonDisabled = false;
            this.router.navigate(["/thankyou"], { relativeTo: this.route });
          }
        }
      },
      (error) => {
        // console.log(error);
        this.loadingStyle = "displaynone";
        this.buttonDisabled = false;
        this.openModal(this.serverErrorCode, "sm");
      },
      () => {}
    );
  }

  getText1() {
    if (this.campaignCenterService.companyId == "894") {
      return `Spend $50 at Caneland Central and upload your receipt(s) to go in the draw to win a $10,000 Shopping Spree or a $1,000 Caneland Central Gift Card.*`;
    } else if (this.campaignCenterService.companyId == "382") {
      return `Spend $50 at Erina Fair and upload your receipt(s) to go in the draw to win a $10,000 Shopping Spree or one of 2 x $500 Erina Fair Gift Cards.*`;
    } else if (this.campaignCenterService.companyId == "480") {
      return `Spend $50 at Smithfield Shopping Centre and upload your receipt(s) to go in the draw to win a $10,000 Shopping Spree or one of 2 x $500 Smithfield Shopping Centre Gift Cards.*`;
    }
  }

  getText2() {
    if (this.campaignCenterService.companyId == "894") {
      return `Plus, a chance to win a share in over $15,000 in instant prizes!*`;
    } else if (this.campaignCenterService.companyId == "382") {
      return `Plus, a chance to win a share in over $6,500 in instant prizes!*`;
    } else if (this.campaignCenterService.companyId == "480") {
      return `Plus, a chance to win a share in over $12,000 in instant prizes!*`;
    }
  }
  getRetailers() {
    const retailers = this.campaignCenterService.centers.find(
      (company) => this.campaignCenterService.companyId == company.id
    );
    this.retailers = retailers.retailers;
  }
}
