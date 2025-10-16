import {
  Component,
  OnInit,
  ElementRef,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { Location, DatePipe } from "@angular/common";
import {
  FormControl,
  FormGroup,
  Validators,
  FormArray,
  FormBuilder,
} from "@angular/forms";
import { CampaignCenterService } from "../services/campaigncenter.service";
import { Center } from "../shared/center";
import { ActivatedRoute, Router } from "@angular/router";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { ErrorMsg } from "../shared/errorMsg";
import { Retailer } from "../shared/retailer";
import { ReCaptchaV3Service } from "ng-recaptcha";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"],
})
export class RegisterComponent implements OnInit {
  @ViewChild("terms", { static: false }) terms: TemplateRef<any>;
  @ViewChild("privacy", { static: false }) privacy: TemplateRef<any>;
  @ViewChild("ageLimit", { static: false }) ageLimit: TemplateRef<any>;
  // @ViewChild('participat', { static: false }) participat: TemplateRef<any>;
  @ViewChild("templateAlreadyEntered", { static: false })
  templateAlreadyEntered: TemplateRef<any>;
  @ViewChild("templateEmailEntered", { static: false })
  templateEmailEntered: TemplateRef<any>;
  @ViewChild("templatePhoneEntered", { static: false })
  templatePhoneEntered: TemplateRef<any>;
  @ViewChild("modalMsg0nlyStateQLD", { static: false })
  modalMsg0nlyStateQLD: TemplateRef<any>;
  @ViewChild("serverErrorCode", { static: false })
  serverErrorCode: TemplateRef<any>;
  @ViewChild("recaptchaFailed", { static: false })
  recaptchaFailed: TemplateRef<any>;
  title: string;
  centers: Center[];
  centerOne: any;
  centerFashionSpree: any;
  centerGroveHomeMaker: any;
  retailersOfSelectedCenter: Retailer[];
  isReadonly: boolean;
  errorMsg = new ErrorMsg();
  isActive: boolean;
  firstname: string;
  lastname: string;
  otherfield: string;
  email: string;
  dob: any;
  yob: any;
  gender: string;
  phone: number;
  street: string;
  suburb: string;
  state: string;
  postcode: number;
  center: string;
  hearabout: string;
  confirm18age: boolean;
  isLiveOutsideAu: number;
  termsConditions: boolean;
  subscribe: boolean;
  subscribe2: boolean;

  pubid: any;
  newsletter: any;
  newsletter2: string;
  dobVal: any;
  lensub: number;
  outletid: any;
  purchaseamt: any;
  errorcode: any;

  modalRef: BsModalRef;
  refSuburbs: any = [];
  refState: any = [];
  refpostcode: any = [];

  // minAge=0;
  ageCheck: any;
  dobString: any;
  today = new Date();
  year: number;
  yearList: any = [];

  gend: string;
  isMobile: boolean;
  showConfirmDetails: boolean;
  buttonDisabled: boolean;

  registerForm: FormGroup;
  formArray: FormArray;

  selectedInterest: any = [];
  interestlist: string;
  interest: any = [
    {
      name: "Shopping",
      value: "shopping",
      selected: false,
    },
    {
      name: "Offers",
      value: "offers",
      selected: false,
    },
    {
      name: "Events",
      value: "events",
      selected: false,
    },
  ];
  initField: any = [];
  initFieldString: string;
  validField: any = [];
  validFieldString: boolean;
  invalidField: any = [];
  invalidFieldString: boolean;
  printField: any = [];
  memberField: any = [];
  memList: any = [];
  // css style apply
  centreStyle: string;
  fnStyle: string;
  lnStyle: string;
  emailStyle: string;
  verifyEmailStyle: string;
  phoneStyle: string;
  dobStyle: string;
  yobStyle: string;
  genderStyle: string;
  streetStyle: string;
  suburbStyle: string;
  stateStyle: string;
  age2Style: string;
  postcodeStyle: string;
  hearStyle: string;
  termStyle: string;
  confirm18ageStyle: string;
  subscribeStyle: string;
  subscribe2Style: string;
  displayStyle: string;
  loadingStyle: string;

  // check whether this is present in this campaign apply
  isCentre: boolean;
  isFn: boolean;
  isLn: boolean;
  isEmail: boolean;
  isVerifyEmail: boolean;
  isPhone: boolean;
  isDob: boolean;
  isYob: boolean;
  isGender: boolean;
  isStreet: boolean;
  isSuburb: boolean;
  isState: boolean;
  isPostcode: boolean;
  isHear: boolean;
  isAge: boolean;
  isAge2: boolean;
  isInterest: boolean;
  isOther: boolean;
  isTerm: boolean;
  isConfirm18age: boolean;
  isSubscribe: boolean;
  isSubscribe2: boolean;
  acc: string; //check auto complete browser
  centreName: string;
  privacyLink: string;
  constructor(
    private router: Router,
    private location: Location,
    private route: ActivatedRoute,
    private modalService: BsModalService,
    private campaignCenterService: CampaignCenterService,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private recaptchaV3Service: ReCaptchaV3Service
  ) {
    this.year = new Date().getFullYear();
    for (let i = 0; i <= 120; i++) {
      this.yearList[i] = this.year - i;
    }
  }

  ngOnInit() {
    console.log("Page Register");
    this.checkAuto();
    this.title = this.campaignCenterService.campaignTitle;
    this.centreName = this.campaignCenterService.centreName;
    this.privacyLink = this.campaignCenterService.privacyLink;
    this.buttonDisabled = false;
    this.loadingStyle = "displaynone";
    this.isMobile = false;
    this.showConfirmDetails = false;
    this.isActive = false;
    this.initForm();
    this.formArray = this.registerForm.get("hearabout") as FormArray;
    // this.getStore();
    // this.retailerList();
    // this.displayStyle='displaynone';
    this.registerForm.patchValue({
      email: this.campaignCenterService.email,
    }); // getting value from homepage

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      this.isMobile = true;
    }

    // Disable paste in your input: verify email
    window.onload = () => {
      // this.disabledOnpasteVemail();
    };
  }
  ngAfterViewInit() {
    // Disable paste in your input: verify email
    // this.disabledOnpasteVemail();
  }
  // disabledOnpasteVemail() {
  // const verifyEmail = document.getElementById("verify-email");
  // verifyEmail.onpaste = (e) => e.preventDefault();
  // }
  checkAuto() {
    //to make change to autofill function should not be enable used only chrome for now.
    // need to find the solution for other major browsers
    if (navigator.userAgent.indexOf("Chrome") !== -1) {
      this.acc = "no";
    } else {
      this.acc = "off";
    }
  }
  private initForm() {
    //1. place to do the modification for the campaign based
    // Always set this section according to the campaign
    this.isCentre = false;
    this.isFn = true;
    this.isLn = true;
    this.isEmail = true;
    this.isVerifyEmail = false;
    this.isPhone = true;
    this.isDob = false;
    this.isYob = false;
    this.isGender = false; //false
    this.isStreet = false;
    this.isSuburb = true;
    this.isState = false;
    this.isPostcode = true;
    this.isHear = false;
    this.isAge = false;
    this.isAge2 = false;
    this.isInterest = false;
    this.isOther = false;
    this.isTerm = true;
    this.isConfirm18age = false;
    this.isSubscribe = true;
    this.isSubscribe2 = false;

    //2. place to do the modification for the campaign based
    //reactive form will vary the declaration based on the
    // requirement of the campaign need to be adjusted.
    this.registerForm = this.fb.group({
      firstname: new FormControl("", [
        Validators.required,
        Validators.pattern("^[a-zA-Z.-\\s']*[a-zA-Z]$"),
        Validators.maxLength(250),
      ]),
      lastname: new FormControl("", [
        Validators.required,
        Validators.pattern("^[a-zA-Z.-\\s']*[a-zA-Z]$"),
        Validators.maxLength(250),
      ]),
      email: new FormControl("", [
        Validators.required,
        Validators.pattern(
          "^[a-zA-Z0-9_\\-.!#$%&*+-/=?^_{|}~']+@[a-zA-Z0-9\\-]+\\.[a-zA-Z0-9\\-.]+$"
        ),
        Validators.maxLength(250),
        // Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
        // Validators.pattern('^[a-zA-Z0-9-_.!#$%&*+-/=?^_{|}~]{1,}+@[a-zA-Z0-9]{1,}+\.[a-zA-Z.]{2,}$')
        //  /^\d+$/
      ]),
      verify_email: new FormControl("", [
        Validators.required,
        Validators.pattern(
          "^[a-zA-Z0-9_\\-.!#$%&*+-/=?^_{|}~']+@[a-zA-Z0-9\\-]+\\.[a-zA-Z0-9\\-.]+$"
        ),
        Validators.maxLength(250),
        // Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
        // Validators.pattern('^[a-zA-Z0-9-_.!#$%&*+-/=?^_{|}~]{1,}+@[a-zA-Z0-9]{1,}+\.[a-zA-Z.]{2,}$')
        //  /^\d+$/
      ]),
      phone: new FormControl("", [
        // Validators.required,
        Validators.pattern("([0][2,3,4,7,8].{8})"), //  /^\d+$/
        // this.campaignCenterService.checkLimit(10000000, 999999999999)
      ]),
      dob: new FormControl("", [Validators.required]),
      yob: new FormControl("", [Validators.required]),
      gender: new FormControl("", [Validators.required]),
      // street: new FormControl("", [Validators.required]),
      suburb: new FormControl("", [
        Validators.required,
        Validators.pattern("^[a-zA-Z.-\\s'/]*$"),
        Validators.maxLength(95),
      ]),
      state: new FormControl("", Validators.required),
      age2: new FormControl("", Validators.required),
      postcode: new FormControl("", [
        Validators.required,
        Validators.pattern(/^\d+$/),
        this.campaignCenterService.checkLimit(800, 9999),
        Validators.maxLength(4),
      ]),
      // center: new FormControl('', Validators.required),
      // hearabout: new FormControl('', [
      //   Validators.required,
      //   Validators.pattern(/^\d+$/),
      //   this.campaignCenterService.checkLimit(1, 150),
      //   Validators.minLength(1),
      //   Validators.maxLength(3)
      // ]),
      // hearabout: new FormArray(
      //   this.interest.map(d => new FormControl()),
      //   Validators.required
      // ),
      confirm18age: new FormControl("", [Validators.required]),
      // isLiveOutsideAu: new FormControl(""),
      termsConditions: new FormControl("", [Validators.required]),
      // subscribe: new FormControl("", [Validators.required]), //, [Validators.required] (when subscrib is not mandatory)
      subscribe: new FormControl(""), // (when subscrib is not mandatory)
      subscribe2: new FormControl(""),
      otherfield: new FormControl(""),
    });
  }
  onCheckChange(event) {
    /* Selected */
    if (event.target.checked) {
      // Add a new control in the arrayForm
      this.formArray.push(new FormControl(event.target.value));
      this.selectedInterest.push(event.target.value);
    } else {
      /* unselected */
      // find the unselected element
      let i: number;
      i = 0;
      this.formArray.controls.forEach((ctrl: FormControl) => {
        if (ctrl.value === event.target.value) {
          // Remove the unselected element from the arrayForm
          this.formArray.removeAt(i);
          const index = this.selectedInterest.indexOf(event.target.value);
          console.log(index);
          if (index > -1) {
            this.selectedInterest.splice(index, 1);
          }
          return;
        }
        i++;
      });
    }

    this.fixArray();
    // console.log(this.formArray.value);
    // console.log(this.selectedInterest);
    this.interestlist = this.selectedInterest.join(",");
    // console.log(this.registerForm.value.hearabout);
  }
  fixArray() {
    //   let j: number = 0;
    //   // console.log(this.formArray.value);
    //   let item=this.formArray.length;
    //   // console.log(item);

    //   this.formArray.controls.forEach((ctrl: FormControl) => {

    //     if(ctrl.value == true) {
    //       this.formArray.removeAt(j);
    //       return;
    //     }
    //     if(ctrl.value == false) {
    //       this.formArray.removeAt(j);
    //       return;
    //     }
    //     if(ctrl.value == null) {
    //       this.formArray.removeAt(j);
    //       return;
    //     }
    //     j++;
    //   });
    //   // if(this.formArray.controls[0].value===null){
    //   //   this.formArray.removeAt(0);
    //   // }
    //   console.log(this.formArray.value);
    //   // console.log(item);
    //   // console.log(j);
    if (this.selectedInterest.length === 0) {
      // this.registerForm.controls.hearabout.status='INVALID';
    }
  }
  onDateChange(newDate: Date) {
    console.log(newDate);
  }

  openModal(template: TemplateRef<any>, size = "lg") {
    let modalCss = { class: "modal-dialog-centered modal-" + size };
    this.modalRef = this.modalService.show(template, modalCss);
  }

  displayblock() {
    this.displayStyle = "displayblock";
    // console.log('block');
  }

  displaynone() {
    this.displayStyle = "displaynone";
    // console.log('none');
  }

  onCenterChange(event): void {
    // used for multi center selection
    const newVal = event.target.value;
    console.log(newVal);
    this.centers = JSON.parse(localStorage.getItem("centers"));
    this.campaignCenterService.centerOne = this.centers.filter((center) => {
      return center.id === newVal;
    });
    console.log(this.campaignCenterService.centerOne);
    this.campaignCenterService.centerOne =
      this.campaignCenterService.centerOne[0];
    console.log(this.campaignCenterService.centerOne);
    this.centerOne = this.campaignCenterService.centerOne;
    localStorage.setItem(
      "centerOne",
      JSON.stringify(this.campaignCenterService.centerOne)
    );
    console.log(this.centerOne.retailers);
    this.retailersOfSelectedCenter = this.centerOne.retailers;
    console.log(this.centerOne);
    this.campaignCenterService.centerIdSelected = this.centerOne.id;
    localStorage.setItem("centerIdSelected", JSON.stringify(this.centerOne.id));
    this.campaignCenterService.centerWebsiteSelected = this.centerOne.website;
    // localStorage.setItem('centerWebsiteSelected', JSON.stringify(this.centerOne.website));
  }

  backHome() {
    this.router.navigate(["/home"], { relativeTo: this.route });
  }
  ageDOB() {
    // date of birth from jquery datepicker formatting
    this.dobString = this.registerForm.controls.dob.value;
    if (this.dobString) {
      console.log("dobString : " + this.dobString);
      if (
        this.datePipe.transform(this.dobString, "yyyy-MM-dd") !== this.dobString
      ) {
        this.registerForm.patchValue({
          dob: this.datePipe.transform(this.dobString, "yyyy-MM-dd"),
        });
        console.log(
          "different format : " + this.registerForm.controls.dob.value
        );
      }
      // this.ageCheck = this.getAge(this.registerForm.value.dob);
      // console.log('ageCheck : '+this.ageCheck);
    }
  }
  validCheck() {
    this.validField = [];
    this.invalidField = [];
    this.printField = [];
    if (this.isCentre) {
      this.validField.push(
        this.registerForm.controls.center.status === "VALID"
      );
      this.invalidField.push(
        this.registerForm.controls.center.status === "INVALID"
      );
      this.printField.push("center");
      this.printField.push(this.registerForm.controls.center.status);
      this.memberField.push(this.registerForm.value.center);
    }
    if (this.isFn) {
      this.validField.push(
        this.registerForm.controls.firstname.status === "VALID"
      );
      this.invalidField.push(
        this.registerForm.controls.firstname.status === "INVALID"
      );
      this.printField.push("firstname");
      this.printField.push(this.registerForm.controls.firstname.status);
      this.memberField.push(this.registerForm.value.firstname);
    }
    if (this.isLn) {
      this.validField.push(
        this.registerForm.controls.lastname.status === "VALID"
      );
      this.invalidField.push(
        this.registerForm.controls.lastname.status === "INVALID"
      );
      this.printField.push("lastname");
      this.printField.push(this.registerForm.controls.lastname.status);
      this.memberField.push(this.registerForm.value.lastname);
    }
    if (this.isEmail) {
      this.validField.push(this.registerForm.controls.email.status === "VALID");
      this.invalidField.push(
        this.registerForm.controls.email.status === "INVALID"
      );
      this.printField.push("email");
      this.printField.push(this.registerForm.controls.email.status);
      this.memberField.push(this.registerForm.value.email);
    }
    if (this.isVerifyEmail) {
      this.validField.push(
        this.registerForm.controls.verify_email.status === "VALID"
      );
      this.invalidField.push(
        this.registerForm.controls.verify_email.status === "INVALID"
      );
      this.printField.push("verify_email");
      this.printField.push(this.registerForm.controls.verify_email.status);
      this.memberField.push(this.registerForm.value.verify_email);
    }
    if (this.isPhone) {
      this.validField.push(this.registerForm.controls.phone.status === "VALID");
      this.invalidField.push(
        this.registerForm.controls.phone.status === "INVALID"
      );
      this.printField.push("phone");
      this.printField.push(this.registerForm.controls.phone.status);
      this.memberField.push(this.registerForm.value.phone);
    }
    if (this.isDob) {
      this.validField.push(this.registerForm.controls.dob.status === "VALID"); // && this.ageCheck >= this.minAge
      this.invalidField.push(
        this.registerForm.controls.dob.status === "INVALID"
      ); // this.ageCheck < this.minAge
      this.printField.push("birth");
      this.printField.push(this.registerForm.controls.dob.status);
      this.memberField.push(this.registerForm.value.dob);
    }
    if (this.isYob) {
      this.validField.push(this.registerForm.controls.yob.status === "VALID");
      this.invalidField.push(
        this.registerForm.controls.yob.status === "INVALID"
      );
      this.printField.push("year of birth");
      this.printField.push(this.registerForm.controls.yob.status);
      this.memberField.push(this.registerForm.value.yob);
    }
    if (this.isGender) {
      this.validField.push(
        this.registerForm.controls.gender.status === "VALID"
      );
      this.invalidField.push(
        this.registerForm.controls.gender.status === "INVALID"
      );
      this.printField.push("gender");
      this.printField.push(this.registerForm.controls.gender.status);
      this.memberField.push(this.registerForm.value.gender);
    }
    // if (this.isStreet) {
    //   this.validField.push(
    //     this.registerForm.controls.street.status === "VALID"
    //   );
    //   this.invalidField.push(
    //     this.registerForm.controls.street.status === "INVALID"
    //   );
    //   this.printField.push("street");
    //   this.printField.push(this.registerForm.controls.street.status);
    //   this.memberField.push(this.registerForm.value.street);
    // }
    if (this.isSuburb) {
      this.validField.push(
        this.registerForm.controls.suburb.status === "VALID"
      );
      this.invalidField.push(
        this.registerForm.controls.suburb.status === "INVALID"
      );
      this.printField.push("suburb");
      this.printField.push(this.registerForm.controls.suburb.status);
      this.memberField.push(this.registerForm.value.suburb);
    }
    if (this.isState) {
      this.validField.push(this.registerForm.controls.state.status === "VALID");
      this.invalidField.push(
        this.registerForm.controls.state.status === "INVALID"
      );
      this.printField.push("state");
      this.printField.push(this.registerForm.controls.state.status);
      this.memberField.push(this.registerForm.value.state);
    }
    if (this.isPostcode) {
      this.validField.push(
        this.registerForm.controls.postcode.status === "VALID"
      );
      this.invalidField.push(
        this.registerForm.controls.postcode.status === "INVALID"
      );
      this.printField.push("postcode");
      this.printField.push(this.registerForm.controls.postcode.status);
      this.memberField.push(this.registerForm.value.postcode);
    }
    if (this.isAge2) {
      this.validField.push(this.registerForm.controls.age2.status === "VALID");
      this.invalidField.push(
        this.registerForm.controls.age2.status === "INVALID"
      );
      this.printField.push("age2");
      this.printField.push(this.registerForm.controls.age2.status);
      this.memberField.push(this.registerForm.value.age2);
    }
    if (this.isHear) {
      this.validField.push(
        this.registerForm.controls.hearabout.status === "VALID"
      ); // &&this.selectedInterest.length>=0
      this.invalidField.push(
        this.registerForm.controls.hearabout.status === "INVALID"
      ); // || this.selectedInterest.length<=0
      this.printField.push("hearabout");
      this.printField.push(this.registerForm.controls.hearabout.status);
      this.memberField.push(this.registerForm.value.hearabout);
    }
    if (this.isConfirm18age) {
      this.validField.push(
        this.registerForm.controls.confirm18age.status === "VALID" &&
          this.registerForm.controls.confirm18age.value === true
      );
      this.invalidField.push(
        this.registerForm.controls.confirm18age.status === "INVALID" ||
          this.registerForm.controls.confirm18age.value === undefined ||
          this.registerForm.controls.confirm18age.value === false
      );
      this.printField.push("confirm18age");
      this.printField.push(this.registerForm.controls.confirm18age.status);
      this.printField.push(this.registerForm.controls.confirm18age.value);
      this.memberField.push(this.registerForm.value.confirm18age);
    }
    if (this.isTerm) {
      this.validField.push(
        this.registerForm.controls.termsConditions.status === "VALID" &&
          this.registerForm.controls.termsConditions.value === true
      );
      this.invalidField.push(
        this.registerForm.controls.termsConditions.status === "INVALID" ||
          this.registerForm.controls.termsConditions.value === undefined ||
          this.registerForm.controls.termsConditions.value === false
      );
      this.printField.push("tc");
      this.printField.push(this.registerForm.controls.termsConditions.status);
      this.printField.push(this.registerForm.controls.termsConditions.value);
      this.memberField.push(this.registerForm.value.termsConditions);
    }
    if (this.isSubscribe) {
      // this.validField.push(
      //   this.registerForm.controls.subscribe.status === "VALID" &&
      //     this.registerForm.controls.subscribe.value === true
      // );
      // // && this.registerForm.controls.subscribe.value === true);
      // this.invalidField.push(
      //   this.registerForm.controls.subscribe.status === "INVALID" ||
      //     this.registerForm.controls.subscribe.value === undefined ||
      //     this.registerForm.controls.subscribe.value === false
      // );
      // this.printField.push("subscribe");
      // this.printField.push(this.registerForm.controls.subscribe.status);
      // this.printField.push(this.registerForm.controls.subscribe.value);
    }

    // console.log(this.validField);
    // // console.log(this.invalidField);
    // console.log(this.validFieldString);
    // console.log(this.invalidFieldString);
    // console.log(this.printField);
  }
  trimming_fn(x) {
    return x ? x.replace(/^\s+|\s+$/gm, "") : "";
  }
  onSubmit() {
    // email: string // validation must before passing to next step
    this.loadingStyle = "displayinlineblock";
    let qld: boolean;
    this.registerForm.patchValue({
      firstname: this.trimming_fn(this.registerForm.controls.firstname.value),
      lastname: this.trimming_fn(this.registerForm.controls.lastname.value),
    });
    // console.log(this.registerForm.controls.firstname.value);
    this.validCheck();
    // below section custom validation start
    // this.fixArray();
    // if (this.isDob) {
    //   this.ageDOB();
    // }
    // if (this.registerForm.value.state !== 'QLD') {
    // // this conidtion is used to test the state restriction QLD to validation
    //   this.registerForm.controls['state'].setErrors({ incorrect: true });
    //   this.invalidField.push(
    //     this.registerForm.controls.postcode.status === 'INVALID'
    //   );
    // }
    // if (
    //   !(
    //     (this.registerForm.value.postcode >= 4000 &&
    //       this.registerForm.value.postcode <= 4999) ||
    //     (this.registerForm.value.postcode >= 9000 &&
    //       this.registerForm.value.postcode <= 9999)
    //   )
    // ) {
    //  // this condition is used to check the postcode restriction to validate
    //   this.registerForm.controls['postcode'].setErrors({ incorrect: true });
    //   this.invalidField.push(
    //     this.registerForm.controls.postcode.status === 'INVALID'
    //   );
    // }
    // if (
    //   this.selectedInterest.length === 0 ||
    //   this.selectedInterest.length <= 0
    // ) {
    //   // this condition use to check the Interest required field validation
    //   this.registerForm.controls['hearabout'].setErrors({ incorrect: true });
    //   this.invalidField.push(
    //     this.registerForm.controls.hearabout.status === 'INVALID'
    //   );
    // }

    // below section custom validation end

    this.validFieldString = this.validField.every((currentValue) => {
      return currentValue === true;
    });
    this.invalidFieldString = this.invalidField.every((currentValue) => {
      return currentValue === false;
    });

    if (this.invalidFieldString === false) {
      console.log("validating");
      this.errorMsg.valid = false;
      this.errorMsg.message = "";
      this.loadingStyle = "displaynone";
      this.errorMsg.message +=
        "\nPlease complete all required fields marked with an asterisk (*).";

      if (this.isCentre) {
        if (this.registerForm.controls.center.status === "INVALID") {
          this.errorMsg.valid = false;
          this.errorMsg.message += "\nWe need your centre name.";
          this.errorMsg.type = "center";
          this.centreStyle = "error-msg";
        } else {
          this.centreStyle = "success-msg";
        }
      }
      if (this.isFn) {
        if (this.registerForm.controls.firstname.status === "INVALID") {
          this.errorMsg.valid = false;
          this.errorMsg.message += "\nFirst name is required.";
          this.errorMsg.type = "firstname";
          this.fnStyle = "error-msg";
        } else {
          this.fnStyle = "success-msg";
        }
      }
      if (this.isLn) {
        if (this.registerForm.controls.lastname.status === "INVALID") {
          this.errorMsg.valid = false;
          this.errorMsg.message += "\nLast name is required.";
          this.errorMsg.type = "lastname";
          this.lnStyle = "error-msg";
        } else {
          this.lnStyle = "success-msg";
        }
      }
      if (this.isEmail) {
        if (this.registerForm.controls.email.status === "INVALID") {
          this.errorMsg.valid = false;
          this.errorMsg.message +=
            "\nUh-oh, looks like an invalid email address was entered.";
          this.errorMsg.type = "email";
          this.emailStyle = "error-msg";
        } else {
          this.emailStyle = "success-msg";
        }
      }
      if (this.isVerifyEmail) {
        if (this.registerForm.controls.verify_email.status === "INVALID") {
          this.errorMsg.valid = false;
          this.errorMsg.message +=
            "\nE-mail addresses do not match. Please check that you have entered the correct e-mail.";
          this.errorMsg.type = "email";
          this.verifyEmailStyle = "error-msg";
        } else {
          if (
            this.registerForm.value.verify_email ===
            this.registerForm.value.email
          ) {
            this.verifyEmailStyle = "success-msg";
          } else {
            this.errorMsg.valid = false;
            this.errorMsg.message +=
              "\nE-mail addresses do not match. Please check that you have entered the correct e-mail.";
            this.errorMsg.type = "email";
            this.verifyEmailStyle = "error-msg";
          }
        }
      }
      if (this.isPhone) {
        if (this.registerForm.controls.phone.status === "INVALID") {
          this.errorMsg.valid = false;
          this.errorMsg.message +=
            "\nPlease enter a valid phone number (numbers only and no spaces).";
          this.errorMsg.type = "phone";
          this.phoneStyle = "error-msg";
        } else {
          this.phoneStyle = "success-msg";
        }
      }
      if (this.isDob) {
        if (this.registerForm.controls.dob.status === "INVALID") {
          this.errorMsg.valid = false;
          this.errorMsg.message += "\nWe need your Date of Birth.";
          this.errorMsg.type = "dob";
          this.dobStyle = "error-msg";
          // console.log(this.registerForm.controls.dob.value);
        } else {
          // if( this.ageCheck< this.minAge) {
          //   console.log('You have less 15');
          //   this.errorMsg.valid = false;
          //   this.errorMsg.message += '\nYour age must be  15 and above only.';
          //   this.errorMsg.type = 'dob';
          //   this.dobStyle = 'error-msg';
          //   this.openModal(this.ageLimit);
          // }
          // else{
          this.dobStyle = "success-msg";
          // }
        }
      }
      if (this.isYob) {
        if (this.registerForm.controls.yob.status === "INVALID") {
          this.errorMsg.valid = false;
          this.errorMsg.message += "\nWe need your Year of Birth.";
          this.errorMsg.type = "yob";
          this.yobStyle = "error-msg";
        } else {
          this.yobStyle = "success-msg";
        }
      }
      if (this.isGender) {
        if (this.registerForm.controls.gender.status === "INVALID") {
          this.errorMsg.valid = false;
          this.errorMsg.message += "\nWe need your gender.";
          this.errorMsg.type = "dob";
          this.genderStyle = "error-msg";
        } else {
          this.genderStyle = "success-msg";
        }
      }
      // if (this.isStreet) {
      //   if (this.registerForm.controls.street.status === "INVALID") {
      //     this.errorMsg.valid = false;
      //     this.errorMsg.message += "\nWe need your Delivery Address.";
      //     this.errorMsg.type = "street";
      //     this.streetStyle = "error-msg";
      //   } else {
      //     this.streetStyle = "success-msg";
      //   }
      // }
      if (this.isSuburb) {
        if (this.registerForm.controls.suburb.status === "INVALID") {
          this.errorMsg.valid = false;
          this.errorMsg.message += "\nSuburb is required.";
          this.errorMsg.type = "suburb";
          this.suburbStyle = "error-msg";
        } else {
          this.suburbStyle = "success-msg";
        }
      }
      if (this.isState) {
        if (this.registerForm.controls.state.status === "INVALID") {
          this.errorMsg.valid = false;
          this.errorMsg.message += "\nPlease select the State from Dropdown.";
          this.errorMsg.type = "state";
          this.stateStyle = "error-msg";
          qld = true;
        } else {
          this.stateStyle = "success-msg";
        }
      }
      if (this.isPostcode) {
        if (this.registerForm.controls.postcode.status === "INVALID") {
          // this.errorMsg.valid = false;
          this.errorMsg.message += "\nEnter a valid postcode.";
          // this.errorMsg.type = 'postcode';
          // this.postcodeStyle = 'error-msg';

          this.errorMsg.valid = false;
          // this.errorMsg.message += '\nOnly open to QLD residents.';
          this.errorMsg.type = "postcode";
          this.postcodeStyle = "error-msg";
          console.log(this.registerForm.controls.postcode.status);
          qld = true;
        } else {
          //   this.postcodeStyle = 'success-msg';
          // }
          // if (
          //   (this.registerForm.value.postcode >= 4000 &&
          //     this.registerForm.value.postcode <= 4999) ||
          //   (this.registerForm.value.postcode >= 9000 &&
          //     this.registerForm.value.postcode <= 9999)
          // ) {
          this.postcodeStyle = "success-msg";
          console.log("postcode success");
          // } else {
          //   this.registerForm.controls['postcode'].setErrors({
          //     incorrect: true
          //   });
          //   this.errorMsg.valid = false;
          //   this.errorMsg.message += '\nOnly open to QLD residents.';
          //   this.errorMsg.type = 'postcode';
          //   this.postcodeStyle = 'error-msg';
          //   console.log(this.registerForm.controls.postcode.status);
          //   qld = true;
          // }
        }
      }
      if (this.isAge2) {
        if (this.registerForm.controls.age2.status === "INVALID") {
          this.errorMsg.valid = false;
          this.errorMsg.message += "\nPlease select the age from Dropdown.";
          this.errorMsg.type = "age2";
          this.age2Style = "error-msg";
        } else {
          this.age2Style = "success-msg";
        }
      }
      if (this.isHear) {
        // if(this.selectedInterest.length<=0 || this.selectedInterest.length===0){
        if (this.registerForm.controls.hearabout.status === "INVALID") {
          this.errorMsg.valid = false;
          this.errorMsg.message += "\nPlease tell us your Interest.";
          // Age.
          this.errorMsg.type = "hearabout";
          this.hearStyle = "error-msg";
        } else {
          this.hearStyle = "success-msg";
        }
      }
      if (this.isConfirm18age) {
        if (
          this.registerForm.controls.confirm18age.status === "INVALID" ||
          this.registerForm.controls.confirm18age.value === undefined ||
          this.registerForm.controls.confirm18age.value === false
        ) {
          this.errorMsg.valid = false;
          this.errorMsg.message +=
            "\nYou must confirm that you are over 18 years old.";
          this.errorMsg.type = "confirm18age";
          this.confirm18ageStyle = "error-msg";
        } else {
          this.confirm18ageStyle = "success-msg";
        }
      }
      if (this.isTerm) {
        if (
          this.registerForm.controls.termsConditions.status === "INVALID" ||
          this.registerForm.controls.termsConditions.value === undefined ||
          this.registerForm.controls.termsConditions.value === false
        ) {
          this.errorMsg.valid = false;
          this.errorMsg.message +=
            "\nYou must accept the Terms & Conditions to continue.";
          this.errorMsg.type = "termsConditions";
          this.termStyle = "error-msg";
        } else {
          this.termStyle = "success-msg";
        }
      }
      if (this.isSubscribe) {
        // if (
        //   this.registerForm.controls.subscribe.status === "INVALID" ||
        //   this.registerForm.controls.subscribe.value === undefined ||
        //   this.registerForm.controls.subscribe.value === false
        // ) {
        //   this.errorMsg.valid = false;
        //   this.errorMsg.message += "\nYou must agree with the offers to enter.";
        //   // "\nTo enter this promotion you must agree to retain your receipts to claim your prize.";
        //   // sign up to our E-Newsletter.';
        //   this.errorMsg.type = "subscribe";
        //   this.subscribeStyle = "error-msg";
        // } else {
        //   this.subscribeStyle = "success-msg";
        // }
      }
    }
    // if (qld) {
    //   this.openModal(this.modalMsg0nlyStateQLD);
    // } else {
    if (this.validFieldString) {
      // Set original dob format
      console.log("valid", this.printField);
      if (this.isDob) {
        // Date of birth checking and formatting
        if (this.dobString && !this.isMobile) {
          // let dobStringTmp = this.datePipe.transform(this.registerForm.controls.dob.value, 'dd/MM/yyyy');
          // let dobStringOld = new Date(dobStringTmp);
          // this.registerForm.patchValue({ dob: dobStringOld });
          this.dobVal = this.datePipe.transform(
            this.registerForm.controls.dob.value,
            "dd/MM/yyyy"
          );
          console.log(
            "different format : " + this.registerForm.controls.dob.status
          );
        }
      }
      this.successClass();
      this.loadingStyle = "displaynone";
      this.showConfirmDetails = true;

      // Apply scroll top on content confirm details
      const elm = document.getElementsByClassName("fit-device")[0];
      elm.scrollTop = 0;
    } else {
      if (this.isDob) {
        // Set original dob format
        if (this.dobString && !this.isMobile) {
          // let dobStringTmp = this.datePipe.transform(this.registerForm.controls.dob.value, 'dd/MM/yyyy');
          // let dobStringOld = new Date(dobStringTmp);
          // this.registerForm.patchValue({ dob: dobStringOld });
          this.dobVal = this.datePipe.transform(
            this.registerForm.controls.dob.value,
            "dd/MM/yyyy"
          );
          console.log(
            "different format : " + this.registerForm.controls.dob.status
          );
        }
      }

      console.log("Not Valid", this.printField);
      this.loadingStyle = "displaynone";
      return;
    }
    // }
  }

  getAge(birthDateString) {
    // get calculation DOB age
    const today = new Date();
    const birthDate = new Date(birthDateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    // console.log(age);
    return age;
  }

  successClass() {
    this.fnStyle = "success-msg";
    this.lnStyle = "success-msg";
    this.emailStyle = "success-msg";
    this.verifyEmailStyle = "success-msg";
    this.phoneStyle = "success-msg";
    this.dobStyle = "success-msg";
    this.yobStyle = "success-msg";
    this.genderStyle = "success-msg";
    this.suburbStyle = "success-msg";
    this.stateStyle = "success-msg";
    this.age2Style = "success-msg";
    this.postcodeStyle = "success-msg";
    this.hearStyle = "success-msg";
    this.termStyle = "success-msg";
    this.confirm18ageStyle = "success-msg";
    this.subscribeStyle = "success-msg";
    this.subscribe2Style = "success-msg";
    this.errorMsg.valid = true;
    this.errorMsg.message = "";
    this.errorMsg.type = "";
  }

  confirmDetails() {
    // Confirming the details to submit to the database before proceed to next section for entercode.
    this.buttonDisabled = true;
    this.loadingStyle = "displayinlineblock";

    this.campaignCenterService
      .register(this.registerForm.value.email)
      .subscribe(
        (response) => {
          if (response.pubid) {
            console.log("Already a member");
            this.campaignCenterService.email = this.registerForm.value.email;
            // this.campaignCenterService.phone = this.registerForm.value.phone;
            this.campaignCenterService.pubid = response.pubid;
            this.loadingStyle = "displaynone";
            this.buttonDisabled = false;
            if (
              this.campaignCenterService.campaignType === "uniqueCode" ||
              this.campaignCenterService.campaignType === "spentOnly"
            ) {
              this.router.navigate(["/entercode"], {
                relativeTo: this.route,
              }); // use it when enter code or spend avaiable
            }
            if (this.campaignCenterService.campaignType === "entryOnly") {
              this.entryOnly(); // use it only enter and thank you page.
            }
          } else {
            console.log("Not a member yet");
            // if (this.registerForm.value.termsConditions) {
            if (this.registerForm.value.subscribe) {
              this.newsletter = 1;
            } else {
              this.newsletter = 0;
            }

            if (this.registerForm.value.subscribe2) {
              this.newsletter2 = "Y";
            } else {
              this.newsletter2 = "N";
            }

            this.memberField.push(this.newsletter);
            this.memList = this.memberField.join(",");

            const _gender =
              this.registerForm.value.gender == "output"
                ? this.registerForm.value.otherfield
                : this.registerForm.value.gender;

            // if (this.registerForm.value.isLiveOutsideAu) {
            //   this.isLiveOutsideAu = 1;
            // } else {
            //   this.isLiveOutsideAu = 0;
            // }

            this.recaptchaV3Service.execute("importantAction").subscribe(
              (token: string) => {
                // console.log(`Token [${token}] generated`);

                this.campaignCenterService
                  .createMember(
                    // this.memList
                    this.registerForm.value.firstname,
                    this.registerForm.value.lastname,
                    this.registerForm.value.email,
                    this.registerForm.value.phone,
                    // this.registerForm.value.dob,
                    // this.registerForm.value.yob,
                    _gender,
                    // this.registerForm.value.street,
                    this.registerForm.value.suburb,
                    this.registerForm.value.state,
                    this.registerForm.value.age2,
                    this.registerForm.value.postcode,
                    // this.interestlist,
                    // this.registerForm.value.hearabout,
                    // this.isLiveOutsideAu,
                    this.registerForm.value.termsConditions,
                    this.newsletter,
                    token
                  )
                  .subscribe(
                    (response: any) => {
                      if (response.error) {
                        console.log("response error:", response.error.code);
                        this.buttonDisabled = false;
                        this.loadingStyle = "displaynone";
                        if (response.error.code === "NCB-0006") {
                          this.openModal(this.templateEmailEntered, "sm");
                        } else if (response.error.code === "NCB-0026") {
                          this.openModal(this.templatePhoneEntered, "sm");
                        }
                      } else {
                        console.log("A new member has been created!");

                        this.campaignCenterService.pubid = this.pubid =
                          response.pubid;
                        //   console.log("pubid is:" + this.campaignCenterService.pubid);
                        this.campaignCenterService.email =
                          this.registerForm.value.email;
                        // this.campaignCenterService.phone = this.registerForm.value.phone;
                        // this.campaignCenterService.showFooter = false;
                        // this.campaignCenterService.footerSecondary = false;

                        this.loadingStyle = "displaynone";
                        this.buttonDisabled = false;

                        if (
                          this.campaignCenterService.campaignType ===
                            "uniqueCode" ||
                          this.campaignCenterService.campaignType ===
                            "spentOnly"
                        ) {
                          this.router.navigate(["/entercode"], {
                            relativeTo: this.route,
                          }); // use it when enter code or spend avaiable
                        }
                        if (
                          this.campaignCenterService.campaignType ===
                          "entryOnly"
                        ) {
                          this.entryOnly(); // use it only enter and thank you page.
                        }
                      }
                    },
                    (error) => {
                      console.log(error);
                      this.loadingStyle = "displaynone";
                      this.buttonDisabled = false;
                      this.openModal(this.serverErrorCode, "sm");
                    }
                  );
              },
              (err) => {
                console.log("reCAPTCHA failed: ", err);
                this.buttonDisabled = false;
                this.loadingStyle = "displaynone";
                this.openModal(this.recaptchaFailed, "sm");
              }
            );
          }
        },
        (error) => {
          console.log(error);
          this.loadingStyle = "displaynone";
          this.buttonDisabled = false;
          this.openModal(this.serverErrorCode, "sm");
          // this.openModal(this.templateAlreadyEntered);
        },
        () => {
          // this.entryOnly();
          console.log("completed");
        }
      );
  }

  entryOnly() {
    this.campaignCenterService.entryOnly().subscribe(
      (response: any) => {
        console.log("response", +response);
        this.loadingStyle = "displaynone";
        this.buttonDisabled = false;
        if (response.error) {
          console.log("response error:", response.error.code);
          if (response.error.code === "NCB-0026") {
            console.log("response error:" + response.error.code);
            this.openModal(this.templatePhoneEntered, "sm");
          } else if (response.error.code === "NCB-0013") {
            // invalid code
            // console.log("response error:" + response.error.code);
            this.openModal(this.templateAlreadyEntered, "sm");
          }
          // } else {
          //   this.router.navigate(['/thankyou'], { relativeTo: this.route });
        } else {
          if (response.prize_info) {
            // console.log('enter code page, has prize:');
            // console.log(response1.prize_info);
            if (response.prize_info_name !== null) {
              // console.log('winner');
              // localStorage.setItem('prize_info', response.prize_info);
              // // localStorage.setItem('purchase_amount', response.prize_info_name);
              // localStorage.setItem(
              //   'prize_info_name',
              //   response.prize_info_name
              // );
              this.campaignCenterService.prizeInfo = response.prize_info;
              this.campaignCenterService.prizeInfoName =
                response.prize_info_name;
              // localStorage.setItem('prize_info_retailer', response1.prize_info_retailer);
              // this.submitted = false;
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
  getSuburbs(event) {
    // get the value from API using keyword typing for suburb will retrieve the state and postcode .
    const keyword = event.target.value.trim();
    if (keyword.length) {
      this.campaignCenterService
        .getSuburbs(keyword)
        .subscribe((response: any) => {
          this.refSuburbs = response.output;
          // console.log(this.refSuburbs);
        });
    } else {
      this.refSuburbs = [];
    }
    this.displayblock();
    setTimeout(() => {
      this.displaynone();
    }, 15000);
  }

  fillsub(suburb, state, postcode) {
    //
    // console.log(suburb);
    if (this.isSuburb) {
      this.registerForm.patchValue({ suburb });
    }
    if (this.isState) {
      this.registerForm.patchValue({ state });
    }
    if (this.isPostcode) {
      this.registerForm.patchValue({ postcode });
    }
    this.displaynone();
  }

  onOutputGender(event) {
    this.isReadonly = false;
    if (event.target.value != "output") {
      this.registerForm.get("otherfield").setValue("");
      this.isReadonly = true;
    }
  }
}
