
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { SPHttpClient } from '@microsoft/sp-http';

import { sp } from "@pnp/sp";
import "@pnp/sp/presets/all";


export default class IToDo {

    private webPartContext: WebPartContext;
    private currentWebAbsUrl: string;
    private currentRelUrl: string;
    constructor(webPartContext: WebPartContext) {
        this.webPartContext = webPartContext;
        this.currentRelUrl = this.webPartContext.pageContext.web.serverRelativeUrl;
        this.currentWebAbsUrl = this.webPartContext.pageContext.web.absoluteUrl;
    }


    public getListIdByRelUrl = async (ToDoUrl: string): Promise<string> => {
        let listId: string = '';
        const listResponse = await this.webPartContext.spHttpClient.get(
            this.currentWebAbsUrl + "/_api/web/getlist('" + this.currentRelUrl + "/" + ToDoUrl + "')?$select=Id",
            SPHttpClient.configurations.v1
        );
        const listResponseJSON = await listResponse.json();
        listId = listResponseJSON['Id'];
        console.log(listId);
        return listId;
    };


    updateTask = async (listUrls: string, data: any): Promise<any> => {

        await sp.web.getList(this.currentRelUrl + "/" + listUrls).items.getById(+data["Title"]).update(
            {
                Status: data["Status"]
            }
        );

    }
 


}
