import { Guid, GUIDType } from "@commerce/types";

export default class UserModel {
    userId: string | GUIDType;
    email: string;

    constructor() {
        this.userId = Guid.empty;
        this.email = "";
    }
}