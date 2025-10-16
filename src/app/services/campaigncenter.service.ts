import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { DatePipe } from "@angular/common";
import { AbstractControl, ValidatorFn } from "@angular/forms";
import { Observable } from "rxjs";

import { FormFields } from "../shared/form_fields";
import { DrawData } from "../shared/drawData";
import { Center } from "../shared/center";

@Injectable({
  providedIn: "root",
})
export class CampaignCenterService {
  // variables to use global
  centers: Center[];
  centerOne: object;
  centerFashionSpree: object;
  centerGroveHomeMaker: object;
  centerIdSelected: string;
  centerWebsiteSelected: string;
  showFooter: boolean;
  footerSecondary: boolean;
  campaignTitle: string;
  // memberAlready:boolean=false;
  pubid: string;
  email: string;
  phone: number;
  prizeInfo: string;
  prizeInfoName: string;
  prizeInfoRetailer: string;
  prizeInfoRetailerFrontend: string;
  prizeTimeMessages: any;
  companyId: string; // wm_niw_com
  logo: string;
  centreName: string;
  privacyLink: string;
  campaignId: number;
  campaignType: string;
  apiAuthKey: string;
  apiUrl: string;
  entryLocation: string;
  minimumspend: number;
  footfit: string;
  opendate: any;
  closedate: any;
  rec: any;
  weeklyEntry: number;
  prizesRemaining: number;
  fulfillmentHash: string;
  codeQR: string;
  opencampaign: boolean;
  birthdate: string;
  countryIso3: string;
  prizesJackdaniels: any;
  prizesJackdanielsWin: any;
  giftsExhausted: boolean;
  localClubs: string[] = [];

  constructor(private http: HttpClient, private datePipe: DatePipe) {
    this.showFooter = true;
    this.footerSecondary = false;
    this.companyId = "1497"; // wm_niw_com
    this.logo = "";
    this.centreName = "";
    this.privacyLink = "";
    this.campaignId = 5000602;
    this.giftsExhausted = false;
    this.apiAuthKey =
      "9629F16D6F46A3E22E6DD531758467WERRIBEC528AB8FA05000581MP15102025";
    this.apiUrl =
      "https://www.campaigncentre.com.au/_winme/web/app_dev.php/api/v1.02/ncb/web/";
    this.campaignType = "spentOnly"; // entryOnly || uniqueCode || spentOnly

    this.prizesJackdaniels = {
      speaker: "./../assets/img/jackdaniels/Speaker.jpg",
      tshirt: "./../assets/img/jackdaniels/Tshirt.jpg",
      cradle: "./../assets/img/jackdaniels/Cradle.jpg",
    };

    this.localClubs = [
      "Bayswater Junior FC",
      "Beaconsfield Junior FC",
      "Blackburn Junior FC",
      "Boronia Junior FC",
      "Chirnside Park Junior FC",
      "Coldstream Junior FC",
      "Croydon Junior FC",
      "Donvale Junior FC",
      "East Burwood Junior FC",
      "East Ringwood Junior FC",
      "Endeavour Hills Junior FC",
      "Fairpark Junior FC",
      "Ferntree Gully Junior FC",
      "Forest Hill Junior FC",
      "Glen Waverley Hawks",
      "Glen Waverley Rovers",
      "Heathmont Junior FC",
      "Kilsyth Junior FC",
      "Knox​ Junior FC",
      "Lilydale Junior FC",
      "Lysterfield",
      "Mitcham Junior FC",
      "Montrose Junior FC",
      "Mooroolbark Junior FC",
      "Noble Park Junior FC",
      "North Ringwood Junior FC",
      "Norwood Junior FC",
      "Park Orchards Junior FC",
      "Ringwood Junior FC",
      "Rowville Junior FC",
      "Rowville Knights",
      "Scoresby Junior FC",
      "South Belgrave Junior FC",
      "South Croydon Junior FC",
      "The Basin Junior FC",
      "Upper Ferntree Gully Junior FC",
      "Vermont Junior FC",
      "Wantirna South Junior FC",
      "Waverley Blues Junior FC",
      "Ashwood FNC",
      "Balwyn FNC",
      "Bayswater FNC",
      "Blackburn FNC",
      "Boronia FNC",
      "Bulleen Templestowe FC",
      "Chirnside Park FNC",
      "Coldstream FNC",
      "Croydon FNC",
      "Croydon North MLOC FNC",
      "Donvale FNC",
      "East Burwood FNC",
      "East Ringwood FNC",
      "Fairpark FNC",
      "Ferntree Gully FNC",
      "Glen Waverley FNC",
      "Heathmont FNC",
      "Kilsyth FNC",
      "Knox FNC",
      "Lilydale FNC",
      "Mitcham FNC",
      "Montrose FNC",
      "Mount Evelyn FNC",
      "Norwood FNC",
      "North Ringwood FC",
      "Nunawading FNC",
      "Park Orchards FNC ",
      "Ringwood FNC",
      "Rowville FNC",
      "Scoresby FNC",
      "Silvan FNC",
      "South Belgrave FNC",
      "South Croydon FNC",
      "Surrey Park FNC",
      "The Basin FNC",
      "Upper FTG FNC",
      "Vermont FNC",
      "Wantirna South FNC",
      "Warrandyte FNC",
      "Waverley Blues FNC",
      "Whitehorse Pioneers FNC",
    ];
    // this.minimumspend = 100;
  }

  /*Check validation limit for number*/
  checkLimit(min: number, max: number): ValidatorFn {
    return (c: AbstractControl): { [key: string]: boolean } | null => {
      if (c.value && (isNaN(c.value) || c.value < min || c.value > max)) {
        return { range: true };
      }
      return null;
    };
  }

  /*Get Centers from API*/
  getCenters(): Observable<{ companies: Center[] }> {
    const headers: HttpHeaders = new HttpHeaders({
      "X-Authorization-NCB": this.apiAuthKey,
      "Content-Type": "application/json",
    });

    const url = this.apiUrl + this.campaignId + "/companies";

    const httpObservable = this.http.get<{ companies: Center[] }>(url, {
      headers,
    });

    return httpObservable;
  }
  /*Check url of the subdomain to identify the Kiosk.Check using that domain how many people are entering in that domain*/
  checkUrlCampaign(subdomain) {
    const headers: HttpHeaders = new HttpHeaders({
      "X-Authorization-NCB": this.apiAuthKey,
      "Content-Type": "application/json",
    });

    const url =
      this.apiUrl +
      this.campaignId +
      "/companybysubdomain?subdomain=" +
      subdomain;

    const httpObservable = this.http.get<{ keyword: any }>(url, {
      headers,
    });

    return httpObservable;
  }

  /*get basic setting from campaign center*/
  campaignSettings() {
    const headers: HttpHeaders = new HttpHeaders({
      "X-Authorization-NCB": this.apiAuthKey,
      "Content-Type": "application/json",
    });
    const url = this.apiUrl + this.campaignId + "/form_fields";

    const httpObservable = this.http.get<any>(url, { headers });

    return httpObservable;
  }

  /*get stores for auto complete list from API*/
  getStores(keyword) {
    const headers: HttpHeaders = new HttpHeaders({
      "X-Authorization-NCB": this.apiAuthKey,
      "Content-Type": "application/json",
    });

    const url =
      this.apiUrl +
      this.campaignId +
      "/retailers?company_id=" +
      this.companyId +
      "&keyword=" +
      keyword;

    const httpObservable = this.http.get<{ keyword: any }>(url, {
      headers,
    });

    return httpObservable;
  }

  /*Get suburb,state and postcode from API */
  getSuburbs(keyword) {
    const headers: HttpHeaders = new HttpHeaders({
      "X-Authorization-NCB": this.apiAuthKey,
      "Content-Type": "application/json",
    });

    const url = this.apiUrl + this.campaignId + "/suburbs?keyword=" + keyword;

    const httpObservable = this.http.get<{ keyword: any }>(url, {
      headers,
    });

    return httpObservable;
  }

  /*Check for Registered Members in API*/
  register(email: string) {
    const headers: HttpHeaders = new HttpHeaders({
      "X-Authorization-NCB": this.apiAuthKey,
      "Content-Type": "application/json",
    });

    const url = this.apiUrl + this.campaignId + "/members?email=" + email;
    /* const url = 'http://qc.campaigncentre.com.au/_winme/web/app_dev.php/api/v1.02/ncb/web/'
    +this.campaignId+'/members?email=' + email;//only for test
    */
    const httpObservable = this.http.get<{ pubid: any }>(url, {
      headers,
    });

    return httpObservable;
  }

  /*Create New Members in API*/
  // 4.place to do the modification for the campaign based for registeration
  createMember(
    firstname,
    lastname,
    email,
    phone,
    // yob,
    gender,
    // street,
    suburb,
    state,
    age2,
    postcode,
    // hearabout,
    // isLiveOutsideAu,
    termsConditions,
    subscribe,
    tokenCaptcha
  ) {
    //
    // street,center,store,spend,dob,yob,gender,
    const headers: HttpHeaders = new HttpHeaders({
      "X-Authorization-NCB": this.apiAuthKey,
      "Content-Type": "application/x-www-form-urlencoded",
    });

    // const date=this.datePipe.transform(yob, 'yyyy-MM-dd');
    // const convertdate=new Date(yob+'-01-01');
    // console.log(convertdate);
    // const date=this.datePipe.transform(convertdate, 'yyyy-MM-dd');
    const url = this.apiUrl + this.campaignId + "/members";
    // const url = 'http://qc.campaigncentre.com.au/_winme/web/app_dev.php/api/v1.02/ncb/web/'+this.campaignId+'/members';//only for test

    // 5.place to do the modification for the campaign based for registeration
    const params = new HttpParams()
      .set("firstname", firstname)
      .set("lastname", lastname)
      .set("email", email)
      .set("phone", phone)
      // .set('dob', date)
      .set("gender", gender)
      // .set("street", street)
      .set("suburb", suburb)
      .set("state", state)
      .set("postcode", postcode)
      .set("age_group", age2)
      // .set('center', center)
      // .set('store_text', store)
      // .set('purchase_amount', spend)
      // .set('hear_about_us', hearabout)
      // .set("isLiveOutsideAu", isLiveOutsideAu)
      .set("termsConditions", termsConditions)
      .set("newsletter", subscribe)
      .set("tokenCaptcha", tokenCaptcha);

    const httpObservable = this.http.post<{ pubid: any }>(
      url,
      params.toString(),
      { headers }
    );

    // console.log(httpObservable);
    return httpObservable;
  }

  // use it when entry only campaign
  entryOnly() {
    const headers: HttpHeaders = new HttpHeaders({
      "X-Authorization-NCB": this.apiAuthKey,
      "Content-Type": "application/x-www-form-urlencoded",
    });
    // this.pubid='L7V9VP';
    const url =
      this.apiUrl + this.campaignId + "/members/" + this.pubid + "/enter";
    const params = new HttpParams()
      .set("company_id", this.companyId)
      .set("entry_location", this.entryLocation);
    const httpObservable = this.http.post<DrawData>(url, params.toString(), {
      headers,
    });

    return httpObservable;
  }
  /*use when no unique code*/
  noUniqueCode(
    lyOutletId,
    purDate,
    purchaseAmount,
    photobase64 = "",
    getOutletInfo = false
  ) {
    const centerIdSelected = JSON.parse(
      localStorage.getItem("centerIdSelected")
    );
    // console.log(code1);

    if (lyOutletId === undefined) {
      lyOutletId = "";
    }
    if (purchaseAmount === undefined) {
      purchaseAmount = "";
    }
    // console.log('On EnterCode page, lyOutletId = ' + lyOutletId);
    // console.log('On EnterCode page, purchaseAmount = ' + purchaseAmount);

    const headers: HttpHeaders = new HttpHeaders({
      "X-Authorization-NCB": this.apiAuthKey,
      "Content-Type": "application/x-www-form-urlencoded",
    });
    // this.pubid='L7V9VP';
    const url =
      this.apiUrl + this.campaignId + "/members/" + this.pubid + "/enter";
    const purchasedate = this.datePipe.transform(purDate, "yyyy-MM-dd");
    // console.log(purchasedate);
    const params = new HttpParams()
      .set("company_id", this.companyId)
      .set("ly_outlet_id", lyOutletId)
      .set("purchase_date", purchasedate)
      .set("purchase_amount", purchaseAmount) // spent_range
      .set("receipt_image", photobase64)
      .set("entry_location", this.entryLocation)
      .set("get_outlet_info", getOutletInfo ? "1" : "0");

    const httpObservable = this.http.post<DrawData>(url, params.toString(), {
      headers,
    });

    return httpObservable;
  }

  /*use when the unique code is available*/
  uniqueCode(
    code1,
    outletId = null,
    purchaseAmount = null,
    photobase64 = "",
    getOutletInfo = false
  ) {
    const centerIdSelected = JSON.parse(
      localStorage.getItem("centerIdSelected")
    );
    // console.log(code1);

    outletId = outletId ? outletId : "";
    purchaseAmount = purchaseAmount ? purchaseAmount : "";

    // console.log('On EnterCode page, lyOutletId = ' + lyOutletId);
    // console.log('On EnterCode page, purchaseAmount = ' + purchaseAmount);
    if (code1.toUpperCase() === "FORESTWAY") {
      // getOutletInfo = false;
    }

    const headers: HttpHeaders = new HttpHeaders({
      "X-Authorization-NCB": this.apiAuthKey,
      "Content-Type": "application/x-www-form-urlencoded",
    });

    const url =
      this.apiUrl + this.campaignId + "/members/" + this.pubid + "/enter";

    const params = new HttpParams()
      .set("company_id", this.companyId)
      .set("crack_code", code1)
      .set("ly_outlet_id", outletId)
      .set("purchase_amount", purchaseAmount) // spent_range
      .set("receipt_image", photobase64)
      .set("entry_location", this.entryLocation)
      .set("get_outlet_info", getOutletInfo ? "1" : "0"); // getOutletInfo ? '1' :

    const httpObservable = this.http.post<DrawData>(url, params.toString(), {
      headers,
    });

    return httpObservable;
  }

  /* Use after generate a entry */
  enterReceipts(entryId, receipts, tokenCaptcha) {
    console.log("entryId: ", entryId);
    let params: HttpParams = new HttpParams();

    const headers: HttpHeaders = new HttpHeaders({
      "X-Authorization-NCB": this.apiAuthKey,
      "Content-Type": "application/x-www-form-urlencoded",
    });

    const url =
      this.apiUrl +
      this.campaignId +
      "/members/" +
      this.pubid +
      "/enterreceipts";
    params = params.append("company_id", this.companyId);
    params = params.append("entryId", entryId);
    params = params.append("entry_location", this.entryLocation);
    params = params.append("tokenCaptcha", tokenCaptcha);

    let ind = 0;
    receipts.forEach((element) => {
      params = params.append("receipts[" + ind + "][storeName]", element.store);
      params = params.append(
        "receipts[" + ind + "][storeDate]",
        element.purchaseDate
      );
      params = params.append(
        "receipts[" + ind + "][amountSpent]",
        element.amountSpent
      );
      params = params.append(
        "receipts[" + ind + "][receiptPhoto]",
        element.photo
      );
      // params = params.append(
      //   "receipts[" + ind + "][interest1]",
      //   element.localClub
      // );
      ind++;
    });

    // const params = new HttpParams()
    //   .set('company_id', this.companyId)
    //   .set('entryId', entryId)
    //   // .set('receipts', this.rec)
    //   .set('entry_location', this.entryLocation);

    const httpObservable = this.http.post<DrawData>(url, params.toString(), {
      headers,
    });

    return httpObservable;
  }
  checkgiftAvaiablity() {
    const headers: HttpHeaders = new HttpHeaders({
      "X-Authorization-NCB": this.apiAuthKey,
      "Content-Type": "application/json",
    });

    const url = this.apiUrl + this.campaignId + "/dailylimit";

    const httpObservable = this.http.get<any>(url, {
      headers,
    });

    return httpObservable;
  }
  checkIfGiftsHaveBeenExhausted() {
    const headers: HttpHeaders = new HttpHeaders({
      "X-Authorization-NCB": this.apiAuthKey,
      // "Content-Type": "application/json",
    });

    const url = this.apiUrl + this.campaignId + "/pzcounters";

    const httpObservable = this.http.get<any>(url);

    return httpObservable;
  }
  fulfillmentProvide(hash, accName, accBsb, accNumber) {
    const headers: HttpHeaders = new HttpHeaders({
      "X-Authorization-NCB": this.apiAuthKey,
      "Content-Type": "application/x-www-form-urlencoded",
    });

    const url = this.apiUrl + this.campaignId + "/ffprovide/" + hash;
    const params = new HttpParams()
      .set("acc_name", accName)
      .set("acc_bsb", accBsb)
      .set("acc_number", accNumber);

    const httpObservable = this.http.post<DrawData>(url, params.toString(), {
      headers,
    });

    return httpObservable;
  }

  verifyAge(birthDate, country, category) {
    const headers: HttpHeaders = new HttpHeaders({
      "cache-control": "no-cache",
      "content-type": "application/json",
    });

    const url = "https://api.b-fonline.com/api/validate_lda";

    const params = new HttpParams()
      .set("birth_date", birthDate) // (YYYY-MM-DD)
      .set("country", country) // (2 or 3 letter ISO code)
      .set("category", category); // ('spirits' or 'wine')

    const httpObservable = this.http.post<DrawData>(url, params);

    return httpObservable;
  }
}
