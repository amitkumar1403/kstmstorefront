import { Guid, GUIDType } from "@commerce/types";

export default class CustomerAddressModel {
    address1: string;
    address2: string;
    address3: string;
    city: string;
    companyName: string;
    country: string;
    countryCode: string;
    customerId: string | GUIDType; // Guid
    firstName: string;
    id: number;
    isDefault: boolean;
    isDefaultBilling: boolean;
    isDefaultDelivery: boolean;
    isDefaultForSubscription: boolean;
    lastName: string;
    mobileNo: string;
    phoneNo: string;
    postCode: string;
    state: string;
    title: string;
    userId: string | GUIDType; // Guid

    constructor() {
        this.address1 = "";
        this.address2 = "";
        this.address3 = "";
        this.city = "";
        this.companyName = "";
        this.country = "";
        this.countryCode = "";
        this.customerId = Guid.empty;
        this.firstName = "";
        this.id = 0;
        this.isDefault = false;
        this.isDefaultBilling = false;
        this.isDefaultDelivery = false;
        this.isDefaultForSubscription = false;
        this.lastName = "";
        this.mobileNo = "";
        this.phoneNo = "";
        this.postCode = "";
        this.state = "";
        this.title = "";
        this.userId = Guid.empty;
    }
}